import React, { useState } from 'react';
import { X, History, Trash2, ArrowRight, Search, Calendar, Scale, Layers } from 'lucide-react';
import { DecisionAnalysis } from '../types';

interface SavedDecisionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: DecisionAnalysis[];
  onSelectDecision: (decision: DecisionAnalysis) => void;
  onDeleteDecision: (id: string) => void;
  onClearAll: () => void;
}

export const SavedDecisionsModal: React.FC<SavedDecisionsModalProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = savedDecisions.filter(d => 
    d.decisionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.verdict?.headlineVerdict?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">
              Decision History & Saved Records ({savedDecisions.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Bulk Delete */}
        <div className="py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search past decisions..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
            />
          </div>

          {savedDecisions.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium px-3 py-2 rounded-lg hover:bg-rose-950/30 transition shrink-0"
            >
              Clear All
            </button>
          )}
        </div>

        {/* List */}
        <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
          {savedDecisions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No saved decisions yet. Every decision you analyze is automatically remembered here.
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No decisions match "{searchTerm}".
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="group p-4 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex items-start justify-between gap-4"
              >
                <div
                  onClick={() => {
                    onSelectDecision(item);
                    onClose();
                  }}
                  className="space-y-1.5 flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      {item.category || 'General'}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                    {item.decisionTitle}
                  </h4>

                  <div className="text-xs text-slate-400 line-clamp-1">
                    <span className="text-emerald-400 font-semibold">Verdict: </span>
                    {item.verdict?.headlineVerdict}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span>{item.options.length} options</span>
                    <span>•</span>
                    <span>{item.criteria.length} criteria</span>
                    <span>•</span>
                    <span className="text-amber-400">{item.verdict?.confidenceScore}% confidence</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onSelectDecision(item);
                      onClose();
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Open decision"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteDecision(item.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
