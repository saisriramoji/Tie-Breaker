import React from 'react';
import { Scale, Sparkles, History, BookmarkPlus, PlusCircle, Share2, Download, Printer } from 'lucide-react';
import { DecisionAnalysis } from '../types';

interface HeaderProps {
  currentDecision: DecisionAnalysis | null;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenPresets: () => void;
  onNewDecision: () => void;
  onExportMarkdown: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDecision,
  savedCount,
  onOpenSaved,
  onOpenPresets,
  onNewDecision,
  onExportMarkdown,
  onPrint,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={onNewDecision}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Scale className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                The Tiebreaker
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                AI Decision Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Objective Pros & Cons, SWOT Analysis, Comparison & Verdicts
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition"
            title="Explore decision templates"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Examples</span>
          </button>

          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition"
            title="Saved decisions history"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>History</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {savedCount}
              </span>
            )}
          </button>

          {currentDecision && (
            <div className="flex items-center gap-1.5 border-l border-slate-800 pl-2 sm:pl-3">
              <button
                onClick={onExportMarkdown}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
                title="Export report as Markdown"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Export</span>
              </button>

              <button
                onClick={onPrint}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
                title="Print decision document"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Print</span>
              </button>
            </div>
          )}

          <button
            onClick={onNewDecision}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-950" />
            <span className="font-semibold">New Dilemma</span>
          </button>
        </div>
      </div>
    </header>
  );
};
