import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Sparkles, 
  Filter, 
  Trash2, 
  Layers, 
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { DecisionAnalysis, DecisionOption, ProConItem } from '../types';

interface ProsConsViewProps {
  analysis: DecisionAnalysis;
  onAddUserItem: (optionId: string, type: 'pro' | 'con', item: ProConItem) => void;
  onDeleteItem: (optionId: string, type: 'pro' | 'con', itemId: string) => void;
  onDeepDive: (optionTitle: string, itemText: string, itemType: string) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  analysis,
  onAddUserItem,
  onDeleteItem,
  onDeepDive,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(analysis.options[0]?.id || '');
  const [impactFilter, setImpactFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [newProText, setNewProText] = useState('');
  const [newConText, setNewConText] = useState('');
  const [newImpact, setNewImpact] = useState<'low' | 'medium' | 'high' | 'critical'>('high');

  const currentOption = analysis.options.find(o => o.id === selectedOptionId) || analysis.options[0];

  if (!currentOption) return null;

  const filterItems = (items: ProConItem[]) => {
    if (impactFilter === 'all') return items;
    return items.filter(i => i.impact === impactFilter);
  };

  const handleAddPro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProText.trim()) return;
    const newItem: ProConItem = {
      id: `user-pro-${Date.now()}`,
      text: newProText.trim(),
      impact: newImpact,
      category: 'User Added',
      userAdded: true,
    };
    onAddUserItem(currentOption.id, 'pro', newItem);
    setNewProText('');
  };

  const handleAddCon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConText.trim()) return;
    const newItem: ProConItem = {
      id: `user-con-${Date.now()}`,
      text: newConText.trim(),
      impact: newImpact,
      category: 'User Added',
      userAdded: true,
    };
    onAddUserItem(currentOption.id, 'con', newItem);
    setNewConText('');
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-1 ring-rose-500/30';
      case 'high':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'medium':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const filteredPros = filterItems(currentOption.pros);
  const filteredCons = filterItems(currentOption.cons);

  return (
    <div className="space-y-6">
      {/* Option Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {analysis.options.map((opt, idx) => {
            const isSelected = opt.id === currentOption.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>Option {String.fromCharCode(65 + idx)}:</span>
                <span className="truncate max-w-[160px] sm:max-w-[220px]">{opt.title}</span>
              </button>
            );
          })}
        </div>

        {/* Impact Filter */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 mr-1">Filter:</span>
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map(f => (
            <button
              key={f}
              onClick={() => setImpactFilter(f)}
              className={`px-2 py-1 text-[11px] rounded-md font-medium uppercase tracking-wide transition ${
                impactFilter === f
                  ? 'bg-slate-800 text-white font-bold ring-1 ring-slate-600'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Option Summary Card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>{currentOption.title}</span>
            {currentOption.id === analysis.verdict.recommendedOptionId && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-extrabold tracking-wider">
                Tiebreaker Pick
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{currentOption.description}</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
          <div className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>{currentOption.pros.length} Pros</span>
          </div>
          <div className="text-rose-400 flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            <span>{currentOption.cons.length} Cons</span>
          </div>
        </div>
      </div>

      {/* Side-by-side Pros and Cons Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PROS COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-base text-emerald-300">
                Pros & Advantages ({filteredPros.length})
              </h4>
            </div>
          </div>

          {/* List of Pros */}
          <div className="space-y-2.5">
            {filteredPros.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center text-xs text-slate-500">
                No pros found matching filter "{impactFilter}".
              </div>
            ) : (
              filteredPros.map((pro) => (
                <div
                  key={pro.id}
                  className="group p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-emerald-500/20 hover:border-emerald-500/40 transition shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getImpactBadge(pro.impact)}`}>
                          {pro.impact} impact
                        </span>
                        {pro.category && (
                          <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                            {pro.category}
                          </span>
                        )}
                        {pro.userAdded && (
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-100 leading-snug">
                        {pro.text}
                      </p>
                      {pro.notes && (
                        <p className="text-xs text-slate-400 mt-1">
                          {pro.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => onDeepDive(currentOption.title, pro.text, 'pro')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
                        title="AI Deep Dive on this pro"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                      {pro.userAdded && (
                        <button
                          onClick={() => onDeleteItem(currentOption.id, 'pro', pro.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Delete pro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Custom Pro Form */}
          <form onSubmit={handleAddPro} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Plus className="w-3 h-3 text-emerald-400" />
              <span>Add your own custom Pro</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newProText}
                onChange={(e) => setNewProText(e.target.value)}
                placeholder="e.g. Shorter commute lets me coach my kid's soccer team"
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 outline-none"
              />
              <select
                value={newImpact}
                onChange={(e) => setNewImpact(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <button
                type="submit"
                disabled={!newProText.trim()}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </form>
        </div>

        {/* CONS COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-base text-rose-300">
                Cons & Drawbacks ({filteredCons.length})
              </h4>
            </div>
          </div>

          {/* List of Cons */}
          <div className="space-y-2.5">
            {filteredCons.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center text-xs text-slate-500">
                No cons found matching filter "{impactFilter}".
              </div>
            ) : (
              filteredCons.map((con) => (
                <div
                  key={con.id}
                  className="group p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-rose-500/20 hover:border-rose-500/40 transition shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getImpactBadge(con.impact)}`}>
                          {con.impact} impact
                        </span>
                        {con.category && (
                          <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                            {con.category}
                          </span>
                        )}
                        {con.userAdded && (
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-100 leading-snug">
                        {con.text}
                      </p>
                      {con.notes && (
                        <p className="text-xs text-slate-400 mt-1">
                          {con.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => onDeepDive(currentOption.title, con.text, 'con')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
                        title="AI Deep Dive / Mitigation on this con"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                      {con.userAdded && (
                        <button
                          onClick={() => onDeleteItem(currentOption.id, 'con', con.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Delete con"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Custom Con Form */}
          <form onSubmit={handleAddCon} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Plus className="w-3 h-3 text-rose-400" />
              <span>Add your own custom Con</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newConText}
                onChange={(e) => setNewConText(e.target.value)}
                placeholder="e.g. Higher state taxes eats into net disposable income"
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 outline-none"
              />
              <select
                value={newImpact}
                onChange={(e) => setNewImpact(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <button
                type="submit"
                disabled={!newConText.trim()}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
