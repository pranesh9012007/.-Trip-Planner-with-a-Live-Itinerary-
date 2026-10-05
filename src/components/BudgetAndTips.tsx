import React from 'react';
import { PracticalTip } from '../types/trip';
import { DollarSign, ShieldAlert, CreditCard, Bus, Info, HeartHandshake } from 'lucide-react';

interface BudgetAndTipsProps {
  budgetBreakdown: {
    totalEstimated: string;
    accommodation: string;
    foodAndDrinks: string;
    activities: string;
    transport: string;
  };
  tips: PracticalTip[];
  currency: string;
}

export const BudgetAndTips: React.FC<BudgetAndTipsProps> = ({
  budgetBreakdown,
  tips,
  currency,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Budget Breakdown Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100">Budget Breakdown</h3>
              <p className="text-xs text-slate-400">Currency standard: {currency}</p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Est. Range</span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-emerald-200">
              {budgetBreakdown.totalEstimated}
            </span>
          </div>

          <div className="space-y-3 mt-4 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <div className="text-slate-400 font-medium mb-0.5">🏨 Accommodation</div>
              <div className="font-semibold text-slate-200">{budgetBreakdown.accommodation}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <div className="text-slate-400 font-medium mb-0.5">🍜 Food & Dining</div>
              <div className="font-semibold text-slate-200">{budgetBreakdown.foodAndDrinks}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <div className="text-slate-400 font-medium mb-0.5">🎟️ Sightseeing & Tours</div>
              <div className="font-semibold text-slate-200">{budgetBreakdown.activities}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <div className="text-slate-400 font-medium mb-0.5">🚇 Local Transportation</div>
              <div className="font-semibold text-slate-200">{budgetBreakdown.transport}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Practical Local Tips */}
      <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100">Local Practicalities & Customs</h3>
            <p className="text-xs text-slate-400">Essential navigation, etiquette, and tipping rules</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 inline-block mb-1.5">
                  {tip.category}
                </span>
                <h4 className="text-sm font-bold text-slate-100 mb-1">{tip.title}</h4>
                <p className="text-xs text-slate-300/90 leading-relaxed">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
