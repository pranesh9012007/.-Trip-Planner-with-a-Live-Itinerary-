import React from 'react';
import { DayPlan, Place } from '../types/trip';
import { Sparkles, MapPin, Clock, DollarSign, CloudSun, Compass, Utensils, Landmark, Trees, GlassWater, Mountain } from 'lucide-react';

interface DayCardProps {
  day: DayPlan;
  colorScheme: { bg: string; border: string; text: string };
  isSelectedDay: boolean;
  selectedPlaceId: string | null;
  onSelectPlace: (place: Place, dayNumber: number) => void;
  onOpenRegenerateModal: (day: DayPlan) => void;
  isRegeneratingThisDay: boolean;
}

const CATEGORY_ICONS: Record<string, { label: string; icon: React.ReactNode; badgeClass: string }> = {
  sightseeing: {
    label: 'Sightseeing',
    icon: <Landmark className="w-3.5 h-3.5" />,
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  food: {
    label: 'Food & Dining',
    icon: <Utensils className="w-3.5 h-3.5" />,
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  culture: {
    label: 'Heritage & Culture',
    icon: <Compass className="w-3.5 h-3.5" />,
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  nature: {
    label: 'Nature & Parks',
    icon: <Trees className="w-3.5 h-3.5" />,
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  nightlife: {
    label: 'Evening & Nightlife',
    icon: <GlassWater className="w-3.5 h-3.5" />,
    badgeClass: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  },
  activity: {
    label: 'Adventure & Sport',
    icon: <Mountain className="w-3.5 h-3.5" />,
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
};

export const DayCard: React.FC<DayCardProps> = ({
  day,
  colorScheme,
  isSelectedDay,
  selectedPlaceId,
  onSelectPlace,
  onOpenRegenerateModal,
  isRegeneratingThisDay,
}) => {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        isSelectedDay
          ? 'bg-slate-900/90 border-slate-700 shadow-xl'
          : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80'
      } overflow-hidden`}
    >
      {/* Day Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-md shrink-0"
            style={{ backgroundColor: colorScheme.bg, color: colorScheme.text }}
          >
            D{day.dayNumber}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-slate-100">
                {day.title}
              </h3>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {day.theme}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-emerald-400">
                <DollarSign className="w-3.5 h-3.5" />
                Est. {day.estimatedDailyCost}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                {day.weatherTip}
              </span>
            </div>
          </div>
        </div>

        {/* Regenerate This Day Button */}
        <button
          onClick={() => onOpenRegenerateModal(day)}
          disabled={isRegeneratingThisDay}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm group shrink-0"
          title="Show off iterative prompting: customize and regenerate this day"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>Regenerate this Day</span>
        </button>
      </div>

      {/* Places Timeline */}
      <div className="p-4 sm:p-5 space-y-4">
        {day.places.map((place, index) => {
          const isSelected = place.id === selectedPlaceId;
          const categoryInfo = CATEGORY_ICONS[place.category.toLowerCase()] || CATEGORY_ICONS.sightseeing;

          return (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place, day.dayNumber)}
              className={`group p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-500/60 shadow-lg ring-1 ring-amber-500/40'
                  : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Stop Number Pin */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm"
                    style={{
                      backgroundColor: colorScheme.bg,
                      color: colorScheme.text,
                    }}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-semibold text-slate-400 font-mono">
                        {place.timeSlot}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                        {place.timeOfDay}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${categoryInfo.badgeClass}`}
                      >
                        {categoryInfo.icon}
                        <span>{categoryInfo.label}</span>
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                      {place.name}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-300/90 mt-1 leading-relaxed">
                      {place.description}
                    </p>

                    {/* Pro Tip Box */}
                    {place.insiderTip && (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2">
                        <span className="text-amber-400 text-xs">💡</span>
                        <div>
                          <strong className="text-amber-300 font-semibold">Insider Tip: </strong>
                          {place.insiderTip}
                        </div>
                      </div>
                    )}

                    {/* Footer Details */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-2.5 pt-2 border-t border-slate-800/60">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-slate-500" />
                        {place.costEstimate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {place.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pin Action */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlace(place, day.dayNumber);
                  }}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Locate on map"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Map</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
