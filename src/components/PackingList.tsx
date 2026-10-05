import React, { useState } from 'react';
import { PackingCategory, PackingItem } from '../types/trip';
import { CheckSquare, Square, Plus, CheckCircle2, RotateCcw, Luggage } from 'lucide-react';

interface PackingListProps {
  categories: PackingCategory[];
  onToggleItem: (categoryIndex: number, itemId: string) => void;
  onAddItem: (categoryIndex: number, itemName: string, reason?: string) => void;
}

export const PackingList: React.FC<PackingListProps> = ({
  categories,
  onToggleItem,
  onAddItem,
}) => {
  const [addingToCategoryIdx, setAddingToCategoryIdx] = useState<number | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemReason, setNewItemReason] = useState('');

  // Calculate overall packed progress
  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const packedItems = categories.reduce(
    (sum, cat) => sum + cat.items.filter((item) => item.packed).length,
    0
  );
  const percentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  const handleCreateItem = (catIdx: number) => {
    if (!newItemName.trim()) return;
    onAddItem(catIdx, newItemName.trim(), newItemReason.trim());
    setNewItemName('');
    setNewItemReason('');
    setAddingToCategoryIdx(null);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
      {/* Header & Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Luggage className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Smart Packing Checklist</h3>
              <p className="text-xs text-slate-400">
                Tailored for destination climate, power standards, and cultural requirements.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm font-bold text-slate-200">
              {packedItems} of {totalItems} Packed
            </span>
            <span className="text-xs text-emerald-400 font-mono ml-2">({percentage}%)</span>
          </div>
          <div className="w-24 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        {categories.map((category, catIdx) => (
          <div
            key={category.category}
            className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  {category.category}
                </h4>
                <span className="text-[11px] text-slate-500 font-mono">
                  {category.items.filter((i) => i.packed).length}/{category.items.length}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {category.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onToggleItem(catIdx, item.id)}
                    className={`flex items-start gap-2.5 p-2 rounded-xl transition-all cursor-pointer ${
                      item.packed
                        ? 'bg-emerald-950/20 text-slate-400 border border-emerald-900/30'
                        : 'bg-slate-900/40 hover:bg-slate-850 text-slate-200 border border-slate-800/60'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {item.packed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-xs font-medium leading-snug ${
                          item.packed ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {item.name}
                      </div>
                      {item.reason && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          💡 {item.reason}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Custom Item */}
            <div className="mt-3 pt-3 border-t border-slate-800/60">
              {addingToCategoryIdx === catIdx ? (
                <div className="space-y-2 animate-fade-in">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Item name (e.g. Noise cancelling earbuds)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={newItemReason}
                    onChange={(e) => setNewItemReason(e.target.value)}
                    placeholder="Optional note / reminder"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAddingToCategoryIdx(null)}
                      className="text-[11px] text-slate-400 hover:text-white px-2 py-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCreateItem(catIdx)}
                      className="text-[11px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1 rounded-md"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAddingToCategoryIdx(catIdx);
                    setNewItemName('');
                    setNewItemReason('');
                  }}
                  className="w-full py-1 text-center text-xs text-slate-400 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add item to {category.category}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
