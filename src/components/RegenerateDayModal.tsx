import React, { useState } from 'react';
import { DayPlan } from '../types/trip';
import { Sparkles, RefreshCw, X, Lightbulb, Compass, MessageSquareQuote } from 'lucide-react';

interface RegenerateDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: DayPlan;
  destination: string;
  onRegenerate: (dayNumber: number, directive: string) => Promise<void>;
  isRegenerating: boolean;
}

const ITERATIVE_PRESETS = [
  {
    label: '🍜 Foodie & Street Eats',
    prompt: 'Focus intensely on culinary culture: food markets, artisan bakeries, hidden ramen/tapas joints, and casual local dining.',
    color: 'hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-200'
  },
  {
    label: '🧘 Relaxed & Low-Walking',
    prompt: 'Create a slow-paced, deeply relaxing day with minimal walking, peaceful gardens, scenic sit-down cafes, and sunset lounging.',
    color: 'hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-200'
  },
  {
    label: '☔ Rainy Day / Indoors',
    prompt: 'Curate an all-weather / indoor itinerary featuring covered markets, premier art museums, historic libraries, and craft workshops.',
    color: 'hover:border-blue-500/50 hover:bg-blue-500/10 text-blue-200'
  },
  {
    label: '🗝️ Secret & Hidden Gems',
    prompt: 'Avoid the mainstream tourist checklist. Prioritize quirky local neighborhoods, quiet backstreets, vintage shops, and secret viewpoints.',
    color: 'hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-200'
  },
  {
    label: '💸 Ultra Budget / Free Spots',
    prompt: 'Focus strictly on free admission public parks, historic walking streets, architectural marvels viewed from outside, and affordable street food under $10.',
    color: 'hover:border-teal-500/50 hover:bg-teal-500/10 text-teal-200'
  },
  {
    label: '🎨 Arts & Architecture',
    prompt: 'Highlight avant-garde architecture, independent galleries, sculpture gardens, and historic artisan quarters.',
    color: 'hover:border-pink-500/50 hover:bg-pink-500/10 text-pink-200'
  }
];

export const RegenerateDayModal: React.FC<RegenerateDayModalProps> = ({
  isOpen,
  onClose,
  day,
  destination,
  onRegenerate,
  isRegenerating,
}) => {
  const [userDirective, setUserDirective] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRegenerate(day.dayNumber, userDirective.trim());
  };

  const selectPreset = (promptText: string) => {
    setUserDirective(promptText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  Regenerate Day {day.dayNumber}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Iterative Prompting
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Currently: <span className="text-slate-300 italic">"{day.title}"</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isRegenerating}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Explanation Banner */}
          <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200/90 leading-relaxed flex items-start gap-2.5">
            <Compass className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-100 font-semibold">How Iterative Prompting Works:</strong> Gemini will analyze your entire itinerary for <span className="text-white font-medium">{destination}</span> and redesign this day to fulfill your directive while avoiding duplicate attractions from other days.
            </div>
          </div>

          {/* Quick Preset Directives */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Quick Direction Presets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ITERATIVE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectPreset(preset.prompt)}
                  className={`text-left p-2.5 rounded-xl border border-slate-800 bg-slate-800/40 text-xs text-slate-300 transition-all ${preset.color}`}
                >
                  <div className="font-semibold mb-0.5">{preset.label}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{preset.prompt}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="directiveInput" 
                className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5"
              >
                <MessageSquareQuote className="w-3.5 h-3.5 text-slate-400" />
                Custom Travel Directive (Optional)
              </label>
              <textarea
                id="directiveInput"
                rows={3}
                value={userDirective}
                onChange={(e) => setUserDirective(e.target.value)}
                placeholder="e.g. Replace afternoon temples with a quiet matcha cafe & a scenic canal bike ride. Make sure there's vegetarian dinner..."
                className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isRegenerating}
                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isRegenerating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isRegenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Iterating Day {day.dayNumber}...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Regenerate Day {day.dayNumber}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
