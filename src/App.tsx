import React, { useState, useEffect, useRef } from 'react';
import { TripPlan, DayPlan, Place, GenerateTripParams } from './types/trip';
import { KYOTO_SAMPLE_TRIP } from './data/sampleTrips';
import { Header } from './components/Header';
import { TripForm } from './components/TripForm';
import { InteractiveMap } from './components/InteractiveMap';
import { DayCard } from './components/DayCard';
import { PackingList } from './components/PackingList';
import { LocalPhrases } from './components/LocalPhrases';
import { BudgetAndTips } from './components/BudgetAndTips';
import { RegenerateDayModal } from './components/RegenerateDayModal';
import { ExportModal } from './components/ExportModal';
import {
  MapPin,
  Calendar,
  DollarSign,
  Compass,
  Luggage,
  Languages,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const DAY_COLORS = [
  { bg: '#3b82f6', border: '#1d4ed8', text: '#ffffff' }, // Day 1 - Blue
  { bg: '#10b981', border: '#047857', text: '#ffffff' }, // Day 2 - Emerald
  { bg: '#f59e0b', border: '#b45309', text: '#ffffff' }, // Day 3 - Amber
  { bg: '#ec4899', border: '#be185d', text: '#ffffff' }, // Day 4 - Pink
  { bg: '#8b5cf6', border: '#6d28d9', text: '#ffffff' }, // Day 5 - Violet
  { bg: '#06b6d4', border: '#0e7490', text: '#ffffff' }, // Day 6 - Cyan
  { bg: '#f97316', border: '#c2410c', text: '#ffffff' }, // Day 7 - Orange
];

export default function App() {
  const [trip, setTrip] = useState<TripPlan>(() => {
    try {
      const saved = localStorage.getItem('voyagecraft_active_trip');
      return saved ? JSON.parse(saved) : KYOTO_SAMPLE_TRIP;
    } catch {
      return KYOTO_SAMPLE_TRIP;
    }
  });

  const [activeTab, setActiveTab] = useState<'itinerary' | 'packing' | 'phrases' | 'budget'>('itinerary');
  const [activeDayIndex, setActiveDayIndex] = useState<number>(-1); // -1 means all days
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  
  // Modal states
  const [dayToRegenerate, setDayToRegenerate] = useState<DayPlan | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const formSectionRef = useRef<HTMLDivElement>(null);
  const itinerarySectionRef = useRef<HTMLDivElement>(null);

  // Save trip to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('voyagecraft_active_trip', JSON.stringify(trip));
    } catch (e) {
      console.warn('Could not save trip to localStorage:', e);
    }
  }, [trip]);

  // Toast timer
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToItinerary = () => {
    itinerarySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate Full Trip
  const handleGenerateTrip = async (params: GenerateTripParams) => {
    setIsGenerating(true);
    showToast(`Crafting tailored ${params.durationDays}-day itinerary for ${params.destination}...`, 'info');

    try {
      const res = await fetch('/api/trip/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${res.status}`);
      }

      const newTrip: TripPlan = await res.json();
      setTrip(newTrip);
      setActiveDayIndex(-1);
      setSelectedPlaceId(null);
      setActiveTab('itinerary');
      showToast(`Itinerary ready! Generated ${newTrip.days.length} days with live map route for ${newTrip.destination}.`, 'success');
      
      setTimeout(scrollToItinerary, 200);
    } catch (err: any) {
      console.error('Failed to generate trip:', err);
      showToast(err.message || 'Generation failed. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Iterative Prompting: Regenerate Single Day
  const handleRegenerateDay = async (dayNumber: number, directive: string) => {
    if (!dayToRegenerate) return;
    setIsRegenerating(true);

    try {
      const otherDaysTitles = trip.days
        .filter((d) => d.dayNumber !== dayNumber)
        .flatMap((d) => d.places.map((p) => p.name));

      const res = await fetch('/api/trip/regenerate-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: trip.destination,
          budget: trip.budgetLevel,
          vibe: trip.vibe,
          dayNumber,
          currentDay: dayToRegenerate,
          otherDaysTitles,
          userDirective: directive,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${res.status}`);
      }

      const updatedDay: DayPlan = await res.json();

      setTrip((prev) => ({
        ...prev,
        days: prev.days.map((d) => (d.dayNumber === dayNumber ? updatedDay : d)),
      }));

      // Focus on the regenerated day
      const newDayIndex = trip.days.findIndex((d) => d.dayNumber === dayNumber);
      if (newDayIndex !== -1) {
        setActiveDayIndex(newDayIndex);
      }

      setDayToRegenerate(null);
      showToast(`✨ Day ${dayNumber} successfully regenerated with your directive: "${directive || 'Fresh alternatives'}"`, 'success');
    } catch (err: any) {
      console.error('Failed to regenerate day:', err);
      showToast(err.message || 'Failed to regenerate this day. Please try again.', 'error');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Place selection from map or list
  const handleSelectPlace = (place: Place, dayNumber: number) => {
    setSelectedPlaceId(place.id);
    const dayIdx = trip.days.findIndex((d) => d.dayNumber === dayNumber);
    if (dayIdx !== -1 && activeDayIndex !== -1 && activeDayIndex !== dayIdx) {
      setActiveDayIndex(dayIdx);
    }
  };

  // Packing list management
  const handleTogglePackingItem = (categoryIndex: number, itemId: string) => {
    setTrip((prev) => {
      const updatedCategories = prev.packingList.map((cat, idx) => {
        if (idx !== categoryIndex) return cat;
        return {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, packed: !item.packed } : item
          ),
        };
      });
      return { ...prev, packingList: updatedCategories };
    });
  };

  const handleAddPackingItem = (categoryIndex: number, itemName: string, reason?: string) => {
    setTrip((prev) => {
      const updatedCategories = prev.packingList.map((cat, idx) => {
        if (idx !== categoryIndex) return cat;
        return {
          ...cat,
          items: [
            ...cat.items,
            {
              id: `user-p-${Date.now()}`,
              name: itemName,
              packed: false,
              reason: reason || undefined,
            },
          ],
        };
      });
      return { ...prev, packingList: updatedCategories };
    });
    showToast(`Added "${itemName}" to packing checklist!`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-fade-in max-w-md pointer-events-auto">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-xl ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : 'bg-blue-950/90 border-blue-500/50 text-blue-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs sm:text-sm font-medium leading-snug">
              {toast.message}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        onOpenExport={() => setIsExportOpen(true)}
        onScrollToForm={scrollToForm}
        destination={trip.destination}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Top Hero / Form Section */}
        <section ref={formSectionRef} className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Travel Architect with Iterative Prompting
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              Plan Your Dream Itinerary in Seconds
            </h1>
            <p className="text-sm sm:text-base text-slate-400">
              Input any destination, budget, and travel vibe to generate a live map route, customized packing list, local phrases, and day-by-day itineraries you can iteratively regenerate.
            </p>
          </div>

          <TripForm onGenerate={handleGenerateTrip} isLoading={isGenerating} />
        </section>

        {/* Active Itinerary Section */}
        <section ref={itinerarySectionRef} className="space-y-6 pt-4">
          {/* Destination Banner Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {trip.country}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {trip.vibe}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {trip.budgetLevel}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {trip.destination}
                </h2>
                <p className="text-sm sm:text-base text-amber-300/90 font-medium mt-1">
                  {trip.tagline}
                </p>
                <p className="text-xs sm:text-sm text-slate-300/80 mt-3 max-w-3xl leading-relaxed">
                  {trip.overview}
                </p>
              </div>

              {/* Quick Trip Stats Card */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0 text-left bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Duration</div>
                  <div className="text-sm sm:text-base font-bold text-slate-200">
                    {trip.days.length} Days
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Currency</div>
                  <div className="text-sm sm:text-base font-bold text-slate-200">
                    {trip.currency}
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Best Season</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-300 line-clamp-1">
                    {trip.bestSeason.split('(')[0]}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'itinerary'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Itinerary & Live Map ({trip.days.length} Days)</span>
            </button>

            <button
              onClick={() => setActiveTab('packing')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'packing'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Luggage className="w-4 h-4" />
              <span>Packing Checklist</span>
            </button>

            <button
              onClick={() => setActiveTab('phrases')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'phrases'
                  ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Languages className="w-4 h-4" />
              <span>Local Phrases & Audio ({trip.localPhrases.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('budget')}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'budget'
                  ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Budget & Local Tips</span>
            </button>
          </div>

          {/* TAB 1: ITINERARY & LIVE MAP */}
          {activeTab === 'itinerary' && (
            <div className="space-y-6 animate-fade-in">
              {/* Day filter pills */}
              <div className="flex items-center justify-between gap-4 flex-wrap bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  <span className="text-xs font-semibold text-slate-400 mr-2 shrink-0">
                    Filter Day:
                  </span>
                  <button
                    onClick={() => setActiveDayIndex(-1)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      activeDayIndex === -1
                        ? 'bg-slate-100 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    All Days ({trip.days.length})
                  </button>
                  {trip.days.map((day, idx) => {
                    const color = DAY_COLORS[(day.dayNumber - 1) % DAY_COLORS.length];
                    const isSelected = activeDayIndex === idx;
                    return (
                      <button
                        key={day.dayNumber}
                        onClick={() => setActiveDayIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                          isSelected
                            ? 'text-white shadow-md'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                        style={{
                          backgroundColor: isSelected ? color.bg : undefined,
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: isSelected ? '#ffffff' : color.bg }}
                        />
                        <span>Day {day.dayNumber}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Click "Regenerate this Day" on any day card to test iterative prompting!</span>
                </div>
              </div>

              {/* Main Split Layout: Map on Left/Sticky, Day Cards on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Map Column (5 cols on large screens) */}
                <div className="lg:col-span-5 lg:sticky lg:top-20 z-10 h-[480px] lg:h-[720px]">
                  <InteractiveMap
                    days={trip.days}
                    activeDayIndex={activeDayIndex}
                    selectedPlaceId={selectedPlaceId}
                    onSelectPlace={handleSelectPlace}
                    destinationName={trip.destination}
                  />
                </div>

                {/* Day Cards Column (7 cols on large screens) */}
                <div className="lg:col-span-7 space-y-6">
                  {trip.days.map((day, idx) => {
                    const color = DAY_COLORS[(day.dayNumber - 1) % DAY_COLORS.length];
                    const isVisible = activeDayIndex === -1 || activeDayIndex === idx;

                    if (!isVisible) return null;

                    return (
                      <DayCard
                        key={day.dayNumber}
                        day={day}
                        colorScheme={color}
                        isSelectedDay={activeDayIndex === idx}
                        selectedPlaceId={selectedPlaceId}
                        onSelectPlace={handleSelectPlace}
                        onOpenRegenerateModal={(d) => setDayToRegenerate(d)}
                        isRegeneratingThisDay={isRegenerating && dayToRegenerate?.dayNumber === day.dayNumber}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PACKING LIST */}
          {activeTab === 'packing' && (
            <div className="animate-fade-in">
              <PackingList
                categories={trip.packingList}
                onToggleItem={handleTogglePackingItem}
                onAddItem={handleAddPackingItem}
              />
            </div>
          )}

          {/* TAB 3: LOCAL PHRASES */}
          {activeTab === 'phrases' && (
            <div className="animate-fade-in">
              <LocalPhrases phrases={trip.localPhrases} country={trip.country} />
            </div>
          )}

          {/* TAB 4: BUDGET & PRACTICAL TIPS */}
          {activeTab === 'budget' && (
            <div className="animate-fade-in">
              <BudgetAndTips
                budgetBreakdown={trip.budgetBreakdown}
                tips={trip.practicalTips}
                currency={trip.currency}
              />
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-slate-400">VoyageCraft</span>
            <span>— AI Travel Planner & Live Itinerary</span>
          </div>
          <div className="text-slate-500">
            Powered by Google Gemini 3.8 Flash · Interactive Leaflet Cartography
          </div>
        </div>
      </footer>

      {/* Regenerate Day Modal (Iterative Prompting) */}
      {dayToRegenerate && (
        <RegenerateDayModal
          isOpen={true}
          onClose={() => setDayToRegenerate(null)}
          day={dayToRegenerate}
          destination={trip.destination}
          onRegenerate={handleRegenerateDay}
          isRegenerating={isRegenerating}
        />
      )}

      {/* Export / Share Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        trip={trip}
      />
    </div>
  );
}
