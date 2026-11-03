import React, { useState } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Calendar, 
  Compass, 
  HeartHandshake, 
  ArrowRight,
  PartyPopper
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DecisionAnalysis } from '../types';

interface VerdictViewProps {
  analysis: DecisionAnalysis;
  onSelectTab: (tab: any) => void;
}

export const VerdictView: React.FC<VerdictViewProps> = ({ analysis, onSelectTab }) => {
  const { verdict, options } = analysis;
  const winningOption = options.find(o => o.id === verdict.recommendedOptionId) || options[0];
  const [hasCommitted, setHasCommitted] = useState(false);

  const handleCommit = () => {
    setHasCommitted(true);
    // Fire festive confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24', '#f43f5e']
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Primary Verdict Showcase */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto relative z-10 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>The Tiebreaker Verdict</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {verdict.headlineVerdict}
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {verdict.executiveSummary}
          </p>

          <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm">
            <span className="text-slate-400">Algorithmic Confidence:</span>
            <span className="text-amber-400 font-extrabold text-lg">{verdict.confidenceScore}%</span>
          </div>
        </div>

        {/* Why this choice wins (Rationales) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Decisive Factors & Regret Minimization Logic</span>
          </h4>
          <ul className="space-y-2.5">
            {verdict.rationale?.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* The 10-10-10 Rule (Suzy Welch Decision Framework) */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              The 10-10-10 Perspective Framework
            </h4>
          </div>
          <p className="text-xs text-slate-400">
            How this decision echoes across short, medium, and long-term horizons:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <div className="text-xs font-extrabold text-cyan-400 mb-1">
                In 10 Minutes
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-2">
                Immediate Reaction
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {verdict.tenTenTen?.tenMinutes || 'Relief from paralysis once the call is made.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <div className="text-xs font-extrabold text-amber-400 mb-1">
                In 10 Months
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-2">
                Operational Horizon
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {verdict.tenTenTen?.tenMonths || 'New routines established, compounding early gains.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <div className="text-xs font-extrabold text-emerald-400 mb-1">
                In 10 Years
              </div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-2">
                Life & Legacy Horizon
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {verdict.tenTenTen?.tenYears || 'Zero regret of "what if" because you acted intentionally.'}
              </p>
            </div>
          </div>
        </div>

        {/* Subconscious Gut Check & Next 24h Action */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30">
            <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Subconscious Gut Check</span>
            </div>
            <p className="text-xs sm:text-sm text-purple-100 italic leading-relaxed">
              "{verdict.gutCheckPrompt}"
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Next 24-Hour Immediate Action</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              {verdict.nextImmediateAction}
            </p>
          </div>
        </div>

        {/* Commit Button */}
        <div className="text-center pt-2">
          {hasCommitted ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm">
              <PartyPopper className="w-4 h-4 text-emerald-400" />
              <span>Decision Sealed! Focus all mental energy on flawless execution.</span>
            </div>
          ) : (
            <button
              onClick={handleCommit}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm sm:text-base tracking-wide shadow-xl shadow-amber-500/25 active:scale-95 transition cursor-pointer flex items-center gap-2 mx-auto"
            >
              <HeartHandshake className="w-5 h-5 text-slate-950" />
              <span>Commit to "{winningOption.title}"</span>
            </button>
          )}

          <div className="mt-3">
            <button
              onClick={() => onSelectTab('minigame')}
              className="text-xs text-slate-400 hover:text-amber-400 underline transition cursor-pointer"
            >
              Still stuck in analysis paralysis? Try the interactive Coin Flip or Decision Wheel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
