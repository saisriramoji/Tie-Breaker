import React, { useState } from 'react';
import { 
  Grid, 
  ShieldCheck, 
  AlertCircle, 
  Zap, 
  ShieldAlert, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DecisionAnalysis } from '../types';

interface SwotViewProps {
  analysis: DecisionAnalysis;
  onDeepDive: (optionTitle: string, itemText: string, itemType: string) => void;
}

export const SwotView: React.FC<SwotViewProps> = ({ analysis, onDeepDive }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(analysis.options[0]?.id || '');

  const currentOption = analysis.options.find(o => o.id === selectedOptionId) || analysis.options[0];

  if (!currentOption) return null;
  const { swot } = currentOption;

  return (
    <div className="space-y-6">
      {/* Option Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-purple-400" />
            <span>SWOT Strategic Framework</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Internal Strengths & Weaknesses vs. External Opportunities & Threats.
          </p>
        </div>

        {/* Option Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {analysis.options.map((opt, idx) => {
            const isSelected = opt.id === currentOption.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{String.fromCharCode(65 + idx)}:</span>
                <span className="truncate max-w-[150px]">{opt.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Option Context */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">
            Analyzing Strategic Position For
          </span>
          <h4 className="text-base font-extrabold text-white">
            {currentOption.title}
          </h4>
        </div>
        <div className="text-xs text-slate-400">
          Click the <Sparkles className="w-3 h-3 text-amber-400 inline mx-0.5" /> icon on any item for an AI deep dive.
        </div>
      </div>

      {/* 2x2 SWOT Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* STRENGTHS */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-950/40 to-slate-900/90 border border-emerald-500/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-emerald-300">
                  Strengths (Internal)
                </h4>
                <span className="text-[10px] text-emerald-400/80 uppercase font-semibold">
                  Built-in advantages & capabilities
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              {swot.strengths?.length || 0}
            </span>
          </div>

          <ul className="space-y-2.5">
            {swot.strengths?.map((item, i) => (
              <li
                key={i}
                className="group p-3 rounded-xl bg-slate-950/60 border border-emerald-500/15 hover:border-emerald-500/35 transition flex items-start justify-between gap-2 text-xs sm:text-sm text-slate-200"
              >
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <span>{item}</span>
                </div>
                <button
                  onClick={() => onDeepDive(currentOption.title, item, 'strength')}
                  className="opacity-70 group-hover:opacity-100 p-1 text-slate-400 hover:text-amber-400 transition shrink-0"
                  title="Deep Dive"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* WEAKNESSES */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-rose-950/40 to-slate-900/90 border border-rose-500/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-rose-300">
                  Weaknesses (Internal)
                </h4>
                <span className="text-[10px] text-rose-400/80 uppercase font-semibold">
                  Inherent limitations & vulnerabilities
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-400 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
              {swot.weaknesses?.length || 0}
            </span>
          </div>

          <ul className="space-y-2.5">
            {swot.weaknesses?.map((item, i) => (
              <li
                key={i}
                className="group p-3 rounded-xl bg-slate-950/60 border border-rose-500/15 hover:border-rose-500/35 transition flex items-start justify-between gap-2 text-xs sm:text-sm text-slate-200"
              >
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                  <span>{item}</span>
                </div>
                <button
                  onClick={() => onDeepDive(currentOption.title, item, 'weakness')}
                  className="opacity-70 group-hover:opacity-100 p-1 text-slate-400 hover:text-amber-400 transition shrink-0"
                  title="Deep Dive / Mitigate"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* OPPORTUNITIES */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-sky-950/40 to-slate-900/90 border border-sky-500/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-sky-300">
                  Opportunities (External)
                </h4>
                <span className="text-[10px] text-sky-400/80 uppercase font-semibold">
                  Market upsides & favorable conditions
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-400 px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">
              {swot.opportunities?.length || 0}
            </span>
          </div>

          <ul className="space-y-2.5">
            {swot.opportunities?.map((item, i) => (
              <li
                key={i}
                className="group p-3 rounded-xl bg-slate-950/60 border border-sky-500/15 hover:border-sky-500/35 transition flex items-start justify-between gap-2 text-xs sm:text-sm text-slate-200"
              >
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                  <span>{item}</span>
                </div>
                <button
                  onClick={() => onDeepDive(currentOption.title, item, 'opportunity')}
                  className="opacity-70 group-hover:opacity-100 p-1 text-slate-400 hover:text-amber-400 transition shrink-0"
                  title="Deep Dive"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* THREATS */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-amber-950/40 to-slate-900/90 border border-amber-500/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-amber-300">
                  Threats (External)
                </h4>
                <span className="text-[10px] text-amber-400/80 uppercase font-semibold">
                  External headwinds & downside risks
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              {swot.threats?.length || 0}
            </span>
          </div>

          <ul className="space-y-2.5">
            {swot.threats?.map((item, i) => (
              <li
                key={i}
                className="group p-3 rounded-xl bg-slate-950/60 border border-amber-500/15 hover:border-amber-500/35 transition flex items-start justify-between gap-2 text-xs sm:text-sm text-slate-200"
              >
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <span>{item}</span>
                </div>
                <button
                  onClick={() => onDeepDive(currentOption.title, item, 'threat')}
                  className="opacity-70 group-hover:opacity-100 p-1 text-slate-400 hover:text-amber-400 transition shrink-0"
                  title="Deep Dive / Mitigate"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
