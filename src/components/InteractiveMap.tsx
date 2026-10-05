import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Place, DayPlan } from '../types/trip';
import { MapPin, Navigation, Layers, Maximize2, Compass } from 'lucide-react';

interface InteractiveMapProps {
  days: DayPlan[];
  activeDayIndex: number;
  selectedPlaceId: string | null;
  onSelectPlace: (place: Place, dayNumber: number) => void;
  destinationName: string;
}

const DAY_COLORS = [
  { bg: '#3b82f6', border: '#1d4ed8', text: '#ffffff' }, // Day 1 - Blue
  { bg: '#10b981', border: '#047857', text: '#ffffff' }, // Day 2 - Emerald
  { bg: '#f59e0b', border: '#b45309', text: '#ffffff' }, // Day 3 - Amber
  { bg: '#ec4899', border: '#be185d', text: '#ffffff' }, // Day 4 - Pink
  { bg: '#8b5cf6', border: '#6d28d9', text: '#ffffff' }, // Day 5 - Violet
  { bg: '#06b6d4', border: '#0e7490', text: '#ffffff' }, // Day 6 - Cyan
  { bg: '#f97316', border: '#c2410c', text: '#ffffff' }, // Day 7 - Orange
];

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  days,
  activeDayIndex,
  selectedPlaceId,
  onSelectPlace,
  destinationName,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Use fallback coordinates or first place coordinates
    const initialLat = days[0]?.places[0]?.lat || 35.0116;
    const initialLng = days[0]?.places[0]?.lng || 135.7681;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: false,
    });

    // Add CartoDB Positron / Dark Voyager tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Markers and Polylines when days or activeDayIndex change
  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();
    markersRef.current = {};

    const allBounds: L.LatLngExpression[] = [];

    // Filter which days to show: active day or all days if activeDayIndex is -1
    const daysToShow = activeDayIndex === -1 ? days : [days[activeDayIndex]].filter(Boolean);

    daysToShow.forEach((day) => {
      const dayColor = DAY_COLORS[(day.dayNumber - 1) % DAY_COLORS.length];
      const routePoints: [number, number][] = [];

      day.places.forEach((place, index) => {
        if (!place.lat || !place.lng) return;

        const coords: [number, number] = [place.lat, place.lng];
        routePoints.push(coords);
        allBounds.push(coords);

        const isSelected = place.id === selectedPlaceId;

        // Custom HTML pin marker
        const pinHtml = `
          <div style="
            position: relative;
            width: ${isSelected ? '36px' : '30px'};
            height: ${isSelected ? '36px' : '30px'};
            background-color: ${dayColor.bg};
            border: 2px solid ${isSelected ? '#ffffff' : dayColor.border};
            box-shadow: 0 4px 12px rgba(0,0,0,0.35)${isSelected ? ', 0 0 0 4px ' + dayColor.bg + '66' : ''};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            cursor: pointer;
          ">
            <span style="
              transform: rotate(45deg);
              color: ${dayColor.text};
              font-family: ui-sans-serif, system-ui, sans-serif;
              font-weight: 700;
              font-size: ${isSelected ? '13px' : '11px'};
              line-height: 1;
            ">${index + 1}</span>
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-map-pin',
          html: pinHtml,
          iconSize: [isSelected ? 36 : 30, isSelected ? 36 : 30],
          iconAnchor: [isSelected ? 18 : 15, isSelected ? 36 : 30],
          popupAnchor: [0, isSelected ? -38 : -32],
        });

        const marker = L.marker(coords, { icon });

        // Popup content with rich info
        const popupContent = `
          <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 220px; max-width: 260px; padding: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="background: ${dayColor.bg}1a; color: ${dayColor.bg}; font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 9999px; border: 1px solid ${dayColor.bg}33;">
                Day ${day.dayNumber} · Stop ${index + 1}
              </span>
              <span style="font-size: 11px; font-weight: 600; color: #64748b;">${place.timeSlot}</span>
            </div>
            <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #0f172a; line-height: 1.3;">${place.name}</h4>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #475569; line-height: 1.4;">${place.description}</p>
            <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 6px; padding: 6px 8px; margin-bottom: 8px;">
              <div style="font-size: 11px; font-weight: 700; color: #92400e; margin-bottom: 2px;">💡 Insider Tip</div>
              <div style="font-size: 11px; color: #78350f; line-height: 1.3;">${place.insiderTip}</div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 600; color: #334155; border-top: 1px solid #e2e8f0; padding-top: 6px;">
              <span>🎟️ ${place.costEstimate}</span>
              <span>⏱️ ${place.duration}</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          closeButton: false,
          className: 'travel-map-popup',
        });

        marker.on('click', () => {
          onSelectPlace(place, day.dayNumber);
        });

        marker.addTo(layerGroup);
        markersRef.current[place.id] = marker;
      });

      // Draw dashed connecting route between stops
      if (routePoints.length > 1) {
        const polyline = L.polyline(routePoints, {
          color: dayColor.bg,
          weight: 3.5,
          opacity: 0.85,
          dashArray: '6, 8',
          lineCap: 'round',
        });
        polyline.addTo(layerGroup);
      }
    });

    // Fit map bounds to show all markers
    if (allBounds.length > 0) {
      map.fitBounds(L.latLngBounds(allBounds as L.LatLngTuple[]), {
        padding: [40, 40],
        maxZoom: 15,
      });
    }
  }, [days, activeDayIndex, selectedPlaceId]);

  // When selected place changes, open popup and center
  useEffect(() => {
    if (!selectedPlaceId || !mapRef.current) return;
    const marker = markersRef.current[selectedPlaceId];
    if (marker) {
      marker.openPopup();
      mapRef.current.panTo(marker.getLatLng(), { animate: true, duration: 0.6 });
    }
  }, [selectedPlaceId]);

  const handleRecenter = () => {
    if (!mapRef.current) return;
    const markers = Object.values(markersRef.current);
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => m.getLatLng()));
      mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl flex flex-col">
      {/* Top Map Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/60 shadow-lg flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span className="text-xs font-semibold text-slate-200 tracking-wide">
            {destinationName}
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">
            {activeDayIndex === -1 ? 'All Days' : `Day ${days[activeDayIndex]?.dayNumber || 1}`}
          </span>
        </div>

        <button
          onClick={handleRecenter}
          className="pointer-events-auto bg-slate-950/85 hover:bg-slate-900 backdrop-blur-md text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-slate-700/60 shadow-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          title="Fit view to route"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-400" />
          <span>Reset View</span>
        </button>
      </div>

      {/* Actual Map Container */}
      <div ref={mapContainerRef} className="w-full flex-1 z-0" />

      {/* Bottom Route Legend */}
      <div className="bg-slate-950/95 border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 overflow-x-auto gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-300">Route Flow:</span>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto py-0.5">
          {days.map((day, idx) => {
            const color = DAY_COLORS[(day.dayNumber - 1) % DAY_COLORS.length];
            const isActive = activeDayIndex === -1 || activeDayIndex === idx;
            return (
              <div
                key={day.dayNumber}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-opacity ${
                  isActive ? 'opacity-100 font-semibold text-slate-200' : 'opacity-40'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: color.bg }}
                />
                <span>Day {day.dayNumber}</span>
              </div>
            );
          })}
        </div>
        <div className="text-[11px] text-slate-500 shrink-0">
          Click any stop for tips & directions
        </div>
      </div>
    </div>
  );
};
