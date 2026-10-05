import React, { useState } from 'react';
import { LocalPhrase } from '../types/trip';
import { Volume2, Copy, Check, Languages, Sparkles } from 'lucide-react';
import { speakPhrase } from '../utils/speech';

interface LocalPhrasesProps {
  phrases: LocalPhrase[];
  country: string;
}

export const LocalPhrases: React.FC<LocalPhrasesProps> = ({ phrases, country }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  const handleCopy = (phrase: LocalPhrase) => {
    navigator.clipboard.writeText(`${phrase.phrase} (${phrase.pronunciation}) - ${phrase.english}`);
    setCopiedId(phrase.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (phrase: LocalPhrase) => {
    setActiveSpeakingId(phrase.id);
    speakPhrase(phrase.phrase, country);
    setTimeout(() => setActiveSpeakingId(null), 1500);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Essential Local Phrases</h3>
            <p className="text-xs text-slate-400">
              Pronunciation guides and etiquette tips for polite interactions in {country || 'your destination'}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-purple-400" />
            Audio Pronunciation Ready
          </span>
        </div>
      </div>

      {/* Phrases Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
        {phrases.map((phrase) => {
          const isSpeaking = activeSpeakingId === phrase.id;
          const isCopied = copiedId === phrase.id;

          return (
            <div
              key={phrase.id}
              className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Phrase & Pronunciation */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h4 className="text-base font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                      {phrase.phrase}
                    </h4>
                    <span className="text-xs font-mono text-purple-300/90 font-medium">
                      /{phrase.pronunciation}/
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleSpeak(phrase)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isSpeaking
                          ? 'bg-purple-500 text-white border-purple-400 scale-110 shadow-lg shadow-purple-500/30'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-purple-300 hover:border-purple-500/40'
                      }`}
                      title="Listen to native pronunciation"
                    >
                      <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(phrase)}
                      className="p-1.5 rounded-lg border bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
                      title="Copy phrase"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* English Translation */}
                <div className="text-sm font-semibold text-slate-200 mt-2">
                  "{phrase.english}"
                </div>

                {/* Context Tip */}
                <div className="text-xs text-slate-400/90 mt-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 leading-relaxed">
                  <span className="text-[10px] uppercase font-bold text-purple-400 block mb-0.5">
                    When to use:
                  </span>
                  {phrase.context}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
