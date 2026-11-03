import React, { useState } from 'react';
import { Sliders, Trophy, RotateCcw, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';
import { DecisionAnalysis, ComparisonCriterion } from '../types';

interface WeightedMatrixViewProps {
  analysis: DecisionAnalysis;
  onUpdateWeights: (updatedCriteria: ComparisonCriterion[]) => void;
}

export const WeightedMatrixView: React.FC<WeightedMatrixViewProps> = ({
  analysis,
  onUpdateWeights,
}) => {
  const { options, criteria } = analysis;

  // Local weights state
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    criteria.forEach(c => {
      init[c.id] = c.weight || 7;
    });
    return init;
  });

  const handleSliderChange = (critId: string, val: number) => {
    const updated = { ...weights, [critId]: val };
    setWeights(updated);

    const updatedCriteria = criteria.map(c => ({
      ...c,
      weight: updated[c.id] ?? c.weight,
    }));
    onUpdateWeights(updatedCriteria);
  };

  const handleReset = () => {
    const resetWeights: Record<string, number> = {};
    const updatedCriteria = criteria.map(c => {
      resetWeights[c.id] = 7;
      return { ...c, weight: 7 };
    });
    setWeights(resetWeights);
    onUpdateWeights(updatedCriteria);
  };

  // Compute live scores
  const optionScores: Record<string, { raw: number; maxPossible: number; percentage: number }> = {};
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  options.forEach(opt => {
    let earned = 0;
    let maxPossible = 0;

    criteria.forEach(crit => {
      const w = weights[crit.id] ?? crit.weight ?? 5;
      const score = crit.scores[opt.id] ?? 5;
      earned += score * w;
      maxPossible += 10 * w;
    });

    const percentage = maxPossible > 0 ? Math.round((earned / maxPossible) * 100) : 0;
    optionScores[opt.id] = { raw: earned, maxPossible, percentage };
  });

  // Determine current mathematical winner
  const sortedOptions = [...options].sort((a, b) => {
    return (optionScores[b.id]?.percentage || 0) - (optionScores[a.id]?.percentage || 0);
  });
  const currentWinner = sortedOptions[0];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <span>Interactive Weighted Decision Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Slide the weights to match your personal values. The mathematical winner recalculates live.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Weights</span>
        </button>
      </div>

      {/* Live Winner Leaderboard Card */}
      <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Live Mathematical Leaderboard
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Total Weight Pool: <strong className="text-white">{totalWeight}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sortedOptions.map((opt, rank) => {
            const scoreData = optionScores[opt.id];
            const isFirst = rank === 0;

            return (
              <div
                key={opt.id}
                className={`p-4 rounded-xl border transition-all ${
                  isFirst
                    ? 'bg-amber-500/10 border-amber-400/50 shadow-md ring-1 ring-amber-400/20'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isFirst ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{rank + 1}
                    </span>
                    <span className="font-bold text-sm text-slate-100 truncate max-w-[140px]">
                      {opt.title}
                    </span>
                  </div>
                  <span className={`text-xl font-extrabold ${isFirst ? 'text-amber-400' : 'text-slate-300'}`}>
                    {scoreData?.percentage}%
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFirst
                        ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                        : 'bg-slate-600'
                    }`}
                    style={{ width: `${scoreData?.percentage || 0}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{scoreData?.raw} / {scoreData?.maxPossible} weighted pts</span>
                  {isFirst && <span className="font-bold text-amber-400">Winner</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Criteria Weight Sliders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wider flex items-center gap-1.5">
            <span>Customize Criteria Weights (1 = Low Priority, 10 = Essential)</span>
          </h4>
        </div>

        <div className="space-y-3">
          {criteria.map((crit) => {
            const currentWeight = weights[crit.id] ?? crit.weight ?? 5;

            return (
              <div
                key={crit.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{crit.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                        Weight: {currentWeight}/10
                      </span>
                    </div>
                    {crit.description && (
                      <p className="text-xs text-slate-400 mt-0.5">{crit.description}</p>
                    )}
                  </div>

                  {/* Option Scores Preview for this criterion */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 text-xs">
                    {options.map((opt, i) => (
                      <span
                        key={opt.id}
                        className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300"
                      >
                        <strong className="text-amber-400">{String.fromCharCode(65 + i)}:</strong> {crit.scores[opt.id] ?? 5}/10
                      </span>
                    ))}
                  </div>
                </div>

                {/* Range Slider */}
                <div className="flex items-center gap-4 pt-1">
                  <span className="text-[11px] text-slate-500 w-8">Low</span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={currentWeight}
                    onChange={(e) => handleSliderChange(crit.id, parseInt(e.target.value))}
                    className="flex-1 accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                  />
                  <span className="text-[11px] text-amber-400 font-bold w-12 text-right">Essential</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
