import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Sliders, 
  HelpCircle, 
  Layers, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Target,
  BrainCircuit,
  Compass
} from 'lucide-react';
import { DECISION_PRESETS, DecisionPreset } from '../data/presets';

interface DecisionFormProps {
  onSubmit: (data: {
    decision: string;
    options: string[];
    context: string;
    priorities: string[];
  }) => void;
  isLoading: boolean;
}

const COMMON_PRIORITIES = [
  'Financial Growth & Upside',
  'Work-Life Balance & Health',
  'Downside Risk Protection',
  'Long-Term Fulfillment',
  'Autonomy & Flexibility',
  'Career Advancement',
  'Family & Relationships',
  'Speed of Execution'
];

export const DecisionForm: React.FC<DecisionFormProps> = ({ onSubmit, isLoading }) => {
  const [decision, setDecision] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [context, setContext] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const togglePriority = (p: string) => {
    if (selectedPriorities.includes(p)) {
      setSelectedPriorities(selectedPriorities.filter(item => item !== p));
    } else {
      setSelectedPriorities([...selectedPriorities, p]);
    }
  };

  const handleLoadPreset = (preset: DecisionPreset) => {
    setDecision(preset.question);
    setOptions(preset.options);
    setContext(preset.context);
    setSelectedPriorities(preset.priorities);
    setShowAdvanced(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim()) return;

    const filteredOptions = options.map(o => o.trim()).filter(Boolean);
    onSubmit({
      decision: decision.trim(),
      options: filteredOptions,
      context: context.trim(),
      priorities: selectedPriorities,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Intro */}
      <div className="text-center py-6 sm:py-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Multi-Perspective Decision Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Break the tie. <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">Decide with conviction.</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Torn between choices? The Tiebreaker conducts a rigorous 360° breakdown: weighted pros & cons, side-by-side comparison tables, SWOT matrices, and a psychological tiebreaker verdict.
        </p>
      </div>

      {/* Main Input Form Card */}
      <form 
        onSubmit={handleSubmit}
        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl shadow-black/60 relative overflow-hidden backdrop-blur-xl"
      >
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {/* Primary Decision Query */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center justify-between">
              <span>What decision are you trying to make? *</span>
              <span className="text-xs text-slate-400 font-normal">e.g., career moves, big purchases, strategic crossroads</span>
            </label>
            <div className="relative">
              <textarea
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                placeholder="e.g. Should I accept the VP offer at a high-growth startup, stay in my stable enterprise tech role, or negotiate for internal promotion?"
                rows={3}
                required
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm sm:text-base transition resize-none outline-none"
              />
            </div>
          </div>

          {/* Core Priorities Selectors */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>What matters most to you in this decision? (Click to select)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_PRIORITIES.map((priority) => {
                const isSelected = selectedPriorities.includes(priority);
                return (
                  <button
                    type="button"
                    key={priority}
                    onClick={() => togglePriority(priority)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400/60 text-amber-200 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {priority}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggle Advanced Options / Constraints */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide Options & Personal Constraints' : 'Specify Custom Options & Constraints (Optional)'}</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Advanced Section */}
          {showAdvanced && (
            <div className="space-y-5 pt-3 border-t border-slate-800/80 animate-in fade-in duration-300">
              {/* Custom Options inputs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Specific Options (Leave blank for AI to auto-formulate optimal paths)</span>
                  </label>
                  {options.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Option
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {options.map((opt, idx) => (
                    <div key={idx} className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-slate-500">
                        {String.fromCharCode(65 + idx)}:
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + idx)} (e.g. ${idx === 0 ? 'Accept the offer' : idx === 1 ? 'Stay at current job' : 'Negotiate hybrid model'})`}
                        className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-500 rounded-lg pl-8 pr-8 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-600 outline-none transition"
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          className="absolute right-2 text-slate-500 hover:text-rose-400 p-1"
                          title="Remove option"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Context & Constraints */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Context, Key Deadlines & Personal Constraints
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. Budget ceiling is $15,000; I have a 3-week deadline to decide; I have two young kids so heavy travel is a red flag; partner works in healthcare..."
                  rows={2}
                  className="w-full bg-slate-950/90 border border-slate-800 focus:border-amber-400 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-600 outline-none transition resize-none"
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Generates Pros & Cons, Comparison Table, SWOT & The Tiebreaker Verdict</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !decision.trim()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:brightness-110 active:scale-98 transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Decision Intelligence...</span>
                </>
              ) : (
                <>
                  <span>Analyze & Break The Tie</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Quick Example Presets bar */}
      <div className="mt-8 pt-6 border-t border-slate-800/60">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Or try one of these real-world dilemmas:
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DECISION_PRESETS.slice(0, 3).map((p) => (
            <button
              key={p.id}
              onClick={() => handleLoadPreset(p)}
              className="text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-amber-500/40 transition group"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">
                {p.category}
              </div>
              <div className="text-xs font-semibold text-slate-200 group-hover:text-white line-clamp-1 mb-1">
                {p.title}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-2">
                {p.question}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
