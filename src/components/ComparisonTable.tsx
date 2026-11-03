import React from 'react';
import { Table, Award, CheckCircle, Info, Sparkles } from 'lucide-react';
import { DecisionAnalysis } from '../types';

interface ComparisonTableProps {
  analysis: DecisionAnalysis;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ analysis }) => {
  const { options, criteria } = analysis;

  // Calculate column totals
  const optionTotals: Record<string, number> = {};
  options.forEach(opt => {
    let sum = 0;
    criteria.forEach(crit => {
      const score = crit.scores[opt.id] ?? 5;
      sum += score * (crit.weight || 5);
    });
    optionTotals[opt.id] = sum;
  });

  // Find overall highest total
  let maxTotal = -1;
  let topOptionId = '';
  Object.entries(optionTotals).forEach(([id, total]) => {
    if (total > maxTotal) {
      maxTotal = total;
      topOptionId = id;
    }
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-cyan-400" />
            <span>Multi-Criteria Comparison Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-by-side dimensional scoring across {criteria.length} core factors.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
          <span>Scores rated 1 to 10 with importance weights</span>
        </div>
      </div>

      {/* Comparison Table Box */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80">
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/3">
                Evaluation Criterion
              </th>
              {options.map((opt, idx) => {
                const isLeading = opt.id === topOptionId;
                return (
                  <th
                    key={opt.id}
                    className={`py-4 px-4 text-xs font-bold uppercase tracking-wider ${
                      isLeading ? 'text-amber-400 bg-amber-500/5' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{String.fromCharCode(65 + idx)}: {opt.title}</span>
                      {isLeading && (
                        <Award className="w-4 h-4 text-amber-400 inline shrink-0" />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {criteria.map((crit) => {
              // find best score for this criterion
              let bestScore = -1;
              options.forEach(opt => {
                const s = crit.scores[opt.id] ?? 0;
                if (s > bestScore) bestScore = s;
              });

              return (
                <tr key={crit.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-4 px-4 align-top">
                    <div className="font-bold text-slate-100 text-sm mb-1">
                      {crit.name}
                    </div>
                    {crit.description && (
                      <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                        {crit.description}
                      </p>
                    )}
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
                      <span>Weight:</span>
                      <span className="font-bold text-cyan-300">{crit.weight}/10</span>
                    </div>
                  </td>

                  {options.map((opt) => {
                    const score = crit.scores[opt.id] ?? 5;
                    const explanation = crit.analysis[opt.id];
                    const isWinnerForCrit = score === bestScore;

                    return (
                      <td
                        key={opt.id}
                        className={`py-4 px-4 align-top ${
                          isWinnerForCrit ? 'bg-cyan-500/5' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-extrabold text-sm ${
                              score >= 8
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : score >= 5
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {score}
                          </span>
                          <span className="text-xs text-slate-500">/ 10</span>
                          {isWinnerForCrit && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                              Best
                            </span>
                          )}
                        </div>

                        {explanation && (
                          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                            {explanation}
                          </p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-700 bg-slate-950/90">
              <td className="py-4 px-4 font-bold text-sm text-slate-300">
                Weighted Total Score
              </td>
              {options.map((opt) => {
                const total = optionTotals[opt.id];
                const isLeading = opt.id === topOptionId;
                return (
                  <td key={opt.id} className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-extrabold ${isLeading ? 'text-amber-400' : 'text-slate-200'}`}>
                        {total}
                      </span>
                      <span className="text-xs text-slate-400">pts</span>
                      {isLeading && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Highest Match
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
