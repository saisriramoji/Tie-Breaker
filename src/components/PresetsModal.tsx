import React from 'react';
import { X, Sparkles, ArrowRight, Target, Compass } from 'lucide-react';
import { DECISION_PRESETS, DecisionPreset } from '../data/presets';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: DecisionPreset) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">
              Decision Blueprints & Classic Dilemmas
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 my-3">
          Select any template below to populate the decision question, realistic candidate options, and personal priorities.
        </p>

        {/* Presets List */}
        <div className="overflow-y-auto space-y-3 flex-1 pr-1">
          {DECISION_PRESETS.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                onSelectPreset(p);
                onClose();
              }}
              className="group p-4 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {p.category}
                </span>
                <span className="text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition flex items-center gap-1">
                  <span>Load Dilemma</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mb-1.5">
                {p.title}
              </h4>

              <p className="text-xs text-slate-300 mb-3">
                "{p.question}"
              </p>

              <div className="flex flex-wrap gap-1.5">
                {p.options.map((opt, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
