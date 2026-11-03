import React from 'react';
import { Flame, ShieldAlert, AlertTriangle, Lightbulb, HelpCircle, ShieldCheck } from 'lucide-react';
import { DecisionAnalysis } from '../types';

interface DevilsAdvocateViewProps {
  analysis: DecisionAnalysis;
  onDeepDive: (optionTitle: string, itemText: string, itemType: string) => void;
}

export const DevilsAdvocateView: React.FC<DevilsAdvocateViewProps> = ({
  analysis,
  onDeepDive,
}) => {
  const { options, devilsAdvocate } = analysis;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <Flame className="w-5 h-5 text-rose-500" />
          <h3 className="text-xl font-bold text-white">
            Devil's Advocate & Blind Spot Stress Test
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Challenging cognitive biases, uncovering implicit assumptions, and preparing contingency safeguards.
        </p>
      </div>

      {/* Grid of Devil's Advocate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {devilsAdvocate.map((item, idx) => {
          const opt = options.find(o => o.id === item.optionId) || options[idx] || options[0];

          return (
            <div
              key={idx}
              className="rounded-2xl p-6 bg-slate-900/80 border border-rose-500/30 shadow-xl space-y-4 relative overflow-hidden"
            >
              {/* Option Title Tag */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                  {opt.title}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Stress Test #{idx + 1}
                </span>
              </div>

              {/* Hidden Assumption */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>The Hidden Assumption You Are Making</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  "{item.hiddenAssumption}"
                </p>
              </div>

              {/* Worst Case Scenario */}
              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/20 space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-wider text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>The Plausible Worst-Case Scenario</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {item.worstCaseScenario}
                </p>
              </div>

              {/* Preemptive Mitigation */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Preemptive Protective Shield (Mitigation)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.mitigationTip}
                </p>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => onDeepDive(opt.title, item.hiddenAssumption, 'assumption')}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition cursor-pointer"
                >
                  Analyze Risk Dynamics &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
