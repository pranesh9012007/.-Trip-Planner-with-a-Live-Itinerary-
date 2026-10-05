import React, { useState } from 'react';
import { BudgetTier, GenerateTripParams } from '../types/trip';
import { QUICK_DESTINATIONS } from '../data/sampleTrips';
import { Sparkles, MapPin, Calendar, DollarSign, Compass, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

interface TripFormProps {
  onGenerate: (params: GenerateTripParams) => Promise<void>;
  isLoading: boolean;
  onSelectSamplePreset?: (presetIndex: number) => void;
}

const BUDGET_OPTIONS: { id: BudgetTier; label: string; icon: string; desc: string }[] = [
  { id: 'budget', label: 'Budget', icon: '$', desc: 'Hostels, local transit & vibrant street eats' },
  { id: 'moderate', label: 'Moderate', icon: '$$', desc: 'Boutique stays, curated cafes & landmark passes' },
  { id: 'luxury', label: 'Luxury', icon: '$$$', desc: 'Top-tier hotels, fine dining & private transfers' },
];

const VIBE_OPTIONS = [
  { id: 'Cultural & Historic', emoji: '🏛️', label: 'Culture & History' },
  { id: 'Foodie & Culinary', emoji: '🍜', label: 'Foodie & Culinary' },
  { id: 'Adventure & Nature', emoji: '🏔️', label: 'Nature & Adventure' },
  { id: 'Relaxed & Wellness', emoji: '🧘', label: 'Relaxed & Wellness' },
  { id: 'Nightlife & Social', emoji: '🍸', label: 'Nightlife & Social' },
  { id: 'Hidden Gems & Quirky', emoji: '🗝️', label: 'Hidden Gems' },
  { id: 'Romantic & Scenic', emoji: '🌅', label: 'Romantic & Scenic' },
];

export const TripForm: React.FC<TripFormProps> = ({ onGenerate, isLoading }) => {
  const [destination, setDestination] = useState('');
  const [durationDays, setDurationDays] = useState(4);
  const [budget, setBudget] = useState<BudgetTier>('moderate');
  const [vibe, setVibe] = useState('Cultural & Historic');
  const [preferences, setPreferences] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    onGenerate({
      destination: destination.trim(),
      durationDays,
      budget,
      vibe,
      preferences: preferences.trim(),
    });
  };

  const handleQuickPreset = (preset: typeof QUICK_DESTINATIONS[0]) => {
    setDestination(preset.name);
    setVibe(preset.vibe);
    setBudget(preset.budget as BudgetTier);
    setDurationDays(preset.duration);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        {/* Top Destination & Duration Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Destination Input */}
          <div className="lg:col-span-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Where do you want to explore?
            </label>
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kyoto, Japan or Amalfi Coast, Italy..."
                required
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl py-3 px-4 pl-11 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-inner"
              />
              <MapPin className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Quick Destination Chips */}
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] text-slate-500 font-medium shrink-0">Popular:</span>
              {QUICK_DESTINATIONS.slice(0, 4).map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleQuickPreset(p)}
                  className="px-2.5 py-1 rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-white transition-all shrink-0 flex items-center gap-1"
                >
                  <span>{p.emoji}</span>
                  <span>{p.name.split(',')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Duration
            </label>
            <div className="flex items-center bg-slate-950/80 border border-slate-700/80 rounded-2xl p-1.5 h-[48px] justify-between">
              <button
                type="button"
                onClick={() => setDurationDays((d) => Math.max(1, d - 1))}
                className="w-10 h-9 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-center transition-colors disabled:opacity-40"
                disabled={durationDays <= 1}
              >
                -
              </button>
              <div className="text-center font-bold text-sm text-slate-100">
                {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
              </div>
              <button
                type="button"
                onClick={() => setDurationDays((d) => Math.min(7, d + 1))}
                className="w-10 h-9 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold flex items-center justify-center transition-colors disabled:opacity-40"
                disabled={durationDays >= 7}
              >
                +
              </button>
            </div>
            <div className="text-[11px] text-slate-500 text-center mt-1">
              Optimized for 1 to 7 day deep dives
            </div>
          </div>
        </div>

        {/* Budget Selector */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Select Your Budget Tier
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {BUDGET_OPTIONS.map((opt) => {
              const isSelected = budget === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBudget(opt.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700/80 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-100">{opt.label}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400">
                      {opt.icon}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vibe Selector */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            Travel Vibe & Focus
          </label>
          <div className="flex flex-wrap gap-2">
            {VIBE_OPTIONS.map((v) => {
              const isSelected = vibe === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVibe(v.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-purple-500/20 text-purple-200 border-purple-500/50 shadow-md ring-1 ring-purple-500/40'
                      : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span>{v.emoji}</span>
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced / Specific Preferences Toggle */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 font-medium transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide specific preferences' : 'Add custom preferences (dietary, solo, kids, etc.)'}</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 animate-fade-in">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Special Requests & Notes
              </label>
              <input
                type="text"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="e.g. Vegetarian cuisine, traveling with a toddler, focus on film photography, avoid steep hikes..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !destination.trim()}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Crafting Live Map Itinerary with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Generate Live Itinerary & Map Route</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
