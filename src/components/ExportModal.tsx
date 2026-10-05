import React, { useState } from 'react';
import { TripPlan } from '../types/trip';
import { X, Copy, Check, Printer, Share2, Compass, CheckCircle } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripPlan;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, trip }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# ${trip.destination} - ${trip.tagline}\n`;
    md += `*Vibe: ${trip.vibe} | Budget: ${trip.budgetLevel} | Best Season: ${trip.bestSeason}*\n\n`;
    md += `## Overview\n${trip.overview}\n\n`;
    md += `## Estimated Budget Breakdown\n`;
    md += `- Total: ${trip.budgetBreakdown.totalEstimated}\n`;
    md += `- Lodging: ${trip.budgetBreakdown.accommodation}\n`;
    md += `- Meals: ${trip.budgetBreakdown.foodAndDrinks}\n`;
    md += `- Activities: ${trip.budgetBreakdown.activities}\n`;
    md += `- Transport: ${trip.budgetBreakdown.transport}\n\n`;

    trip.days.forEach((day) => {
      md += `### Day ${day.dayNumber}: ${day.title} (${day.theme})\n`;
      md += `*Daily Est: ${day.estimatedDailyCost} | Weather Tip: ${day.weatherTip}*\n\n`;
      day.places.forEach((p, idx) => {
        md += `${idx + 1}. **${p.name}** [${p.timeOfDay} - ${p.timeSlot}]\n`;
        md += `   - ${p.description}\n`;
        md += `   - Tip: ${p.insiderTip}\n`;
        md += `   - Cost: ${p.costEstimate} | Duration: ${p.duration}\n\n`;
      });
    });

    md += `## Key Local Phrases\n`;
    trip.localPhrases.forEach((phrase) => {
      md += `- **${phrase.phrase}** (pronounce: *${phrase.pronunciation}*): "${phrase.english}" - *${phrase.context}*\n`;
    });

    return md;
  };

  const handleCopyMarkdown = () => {
    const text = generateMarkdown();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in print:static print:bg-transparent print:p-0">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:border-none print:shadow-none print:bg-white print:text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50 print:hidden">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">Export & Share Itinerary</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[360px] overflow-y-auto print:max-h-none print:bg-white print:text-black print:border-none">
            {generateMarkdown()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/50 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Print / Save as PDF</span>
          </button>

          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-slate-950 font-bold" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Markdown Summary</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
