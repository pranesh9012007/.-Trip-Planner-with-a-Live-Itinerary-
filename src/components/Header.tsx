import React from 'react';
import { Compass, Share2, Printer, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenExport: () => void;
  onScrollToForm: () => void;
  onOpenDeployPage: () => void;
  isDeployPageActive: boolean;
  destination?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExport,
  onScrollToForm,
  onOpenDeployPage,
  isDeployPageActive,
  destination,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-['Space_Grotesk']">
                VoyageCraft
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 hidden sm:inline-flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Live AI Itinerary
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none hidden sm:block">
              Intelligent itineraries with live map routing & iterative day refinement
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenDeployPage}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isDeployPageActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="View deploy.yml and CI/CD configurations"
          >
            <span className="text-[11px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">.yml</span>
            <span className="hidden sm:inline">Deploy Config</span>
            <span className="sm:hidden">Deploy</span>
          </button>

          <button
            type="button"
            onClick={onScrollToForm}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Plan New Trip</span>
            <span className="sm:hidden">Plan</span>
          </button>

          <button
            type="button"
            onClick={onOpenExport}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all"
            title="Export, Print or Share Itinerary"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Export & Share</span>
          </button>
        </div>
      </div>
    </header>
  );
};
