import React from 'react';
import { 
  Trophy, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Sliders, 
  Flame, 
  Sparkles,
  Layers,
  Table,
  Grid,
  Scale
} from 'lucide-react';
import { DecisionAnalysis, ViewTab } from '../types';

interface SuiteOverviewProps {
  analysis: DecisionAnalysis;
  onSelectTab: (tab: ViewTab) => void;
  onSelectOptionForSwot?: (optionId: string) => void;
}

export const SuiteOverview: React.FC<SuiteOverviewProps> = ({ analysis, onSelectTab }) => {
  const { verdict, options, criteria, devilsAdvocate } = analysis;
  const winningOption = options.find(o => o.id === verdict.recommendedOptionId) || options[0];

  return (
    <div className="space-y-8">
      {/* Tiebreaker Verdict Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/30 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>Recommended Path Forward</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {verdict.headlineVerdict}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {verdict.executiveSummary}
            </p>

            {/* Subconscious Gut Check Callout */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/20 text-xs sm:text-sm text-amber-200/90 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">The Subconscious Gut Check: </span>
                <span className="italic">{verdict.gutCheckPrompt}</span>
              </div>
            </div>
          </div>

          {/* Confidence Score & Action */}
          <div className="flex md:flex-col items-center justify-between md:justify-center p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[180px] shrink-0">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              AI Confidence
            </div>
            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              {verdict.confidenceScore}%
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${verdict.confidenceScore}%` }}
              />
            </div>
            <button
              onClick={() => onSelectTab('verdict')}
              className="mt-4 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Verdict & 10-10-10</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Options Breakdown Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Options Side-by-Side</span>
          </h3>
          <span className="text-xs text-slate-400">
            {options.length} options evaluated
          </span>
        </div>

        <div className={`grid grid-cols-1 ${options.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4`}>
          {options.map((opt, idx) => {
            const isWinner = opt.id === verdict.recommendedOptionId;
            return (
              <div
                key={opt.id}
                className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 ${
                  isWinner
                    ? 'bg-slate-900/90 border-amber-500/50 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <h4 className="font-bold text-slate-100 text-base leading-snug">
                        {opt.title}
                      </h4>
                    </div>
                    {isWinner && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                        Winner
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                    {opt.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 mb-4">
                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Core Upside
                      </div>
                      <div className="text-slate-200 line-clamp-2">
                        {opt.keyBenefit}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/20 text-xs">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1 mb-0.5">
                        <AlertTriangle className="w-3 h-3" /> Primary Risk
                      </div>
                      <div className="text-slate-200 line-clamp-2">
                        {opt.keyRisk}
                      </div>
                    </div>
                  </div>

                  {/* Quick counts */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs py-2 border-y border-slate-800/80 mb-4">
                    <div>
                      <span className="text-emerald-400 font-bold">{opt.pros.length}</span>
                      <span className="text-slate-400 text-[11px] ml-1">Pros</span>
                    </div>
                    <div>
                      <span className="text-rose-400 font-bold">{opt.cons.length}</span>
                      <span className="text-slate-400 text-[11px] ml-1">Cons</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Calculated Score: <span className="font-bold text-white">{opt.overallScore || 75}/100</span>
                  </div>
                  <button
                    onClick={() => onSelectTab('proscons')}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation Cards into Deep Analysis Modes */}
      <div>
        <h3 className="text-base font-bold text-white mb-3">
          Explore Analysis Perspectives
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onSelectTab('proscons')}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 text-left transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-110 transition">
              <Scale className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-white mb-1">Pros & Cons List</div>
            <div className="text-xs text-slate-400">
              Categorized lists with low, medium, high, and critical impact ratings.
            </div>
          </button>

          <button
            onClick={() => onSelectTab('comparison')}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-left transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-110 transition">
              <Table className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-white mb-1">Comparison Table</div>
            <div className="text-xs text-slate-400">
              Criteria-by-criteria side-by-side matrix with scores out of 10.
            </div>
          </button>

          <button
            onClick={() => onSelectTab('swot')}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 text-left transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-110 transition">
              <Grid className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-white mb-1">SWOT Analysis</div>
            <div className="text-xs text-slate-400">
              2x2 strategic framework: Strengths, Weaknesses, Opportunities, and Threats.
            </div>
          </button>

          <button
            onClick={() => onSelectTab('matrix')}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 text-left transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition">
              <Sliders className="w-4 h-4" />
            </div>
            <div className="text-sm font-bold text-white mb-1">Weighted Matrix</div>
            <div className="text-xs text-slate-400">
              Adjust importance weights live and watch scores recalculate instantly.
            </div>
          </button>
        </div>
      </div>

      {/* Devil's Advocate Blind Spots Alert */}
      {devilsAdvocate && devilsAdvocate.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-rose-400" />
            <h4 className="font-bold text-rose-300 text-sm sm:text-base">
              Devil's Advocate: Blind Spots & Hidden Traps
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {devilsAdvocate.slice(0, 2).map((item, i) => {
              const opt = options.find(o => o.id === item.optionId);
              return (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-rose-900/50 text-xs">
                  <div className="font-bold text-rose-300 mb-1">
                    {opt?.title || `Option ${i + 1}`}: Hidden Assumption
                  </div>
                  <p className="text-slate-300 mb-2">
                    "{item.hiddenAssumption}"
                  </p>
                  <div className="text-slate-400">
                    <span className="text-rose-400 font-semibold">Worst Case:</span> {item.worstCaseScenario}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
