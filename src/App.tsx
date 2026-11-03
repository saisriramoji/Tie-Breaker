import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Layers, 
  Table, 
  Grid, 
  Sliders, 
  Trophy, 
  Dices, 
  AlertCircle,
  Share2,
  Sparkles,
  ArrowLeft,
  Flame
} from 'lucide-react';
import { DecisionAnalysis, ViewTab, ProConItem, ComparisonCriterion } from './types';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { SuiteOverview } from './components/SuiteOverview';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonTable } from './components/ComparisonTable';
import { SwotView } from './components/SwotView';
import { WeightedMatrixView } from './components/WeightedMatrixView';
import { DevilsAdvocateView } from './components/DevilsAdvocateView';
import { VerdictView } from './components/VerdictView';
import { TiebreakerGames } from './components/TiebreakerGames';
import { DeepDiveModal } from './components/DeepDiveModal';
import { SavedDecisionsModal } from './components/SavedDecisionsModal';
import { PresetsModal } from './components/PresetsModal';
import { DecisionPreset, DECISION_PRESETS } from './data/presets';

const STORAGE_KEY = 'the_tiebreaker_saved_decisions_v1';

export default function App() {
  const [currentDecision, setCurrentDecision] = useState<DecisionAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>('suite');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Saved decisions in localStorage
  const [savedDecisions, setSavedDecisions] = useState<DecisionAnalysis[]>(() => {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [deepDiveTarget, setDeepDiveTarget] = useState<{
    optionTitle: string;
    itemText: string;
    itemType: string;
  } | null>(null);

  // Sync savedDecisions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDecisions));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [savedDecisions]);

  const handleAnalyze = async (data: {
    decision: string;
    options: string[];
    context: string;
    priorities: string[];
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with ${res.status}`);
      }

      const result: DecisionAnalysis = await res.json();
      setCurrentDecision(result);
      setActiveTab('suite');

      // Save to history (prepend)
      setSavedDecisions(prev => [result, ...prev.filter(d => d.id !== result.id)]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze decision. Please check server logs.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUserItem = (optionId: string, type: 'pro' | 'con', newItem: ProConItem) => {
    if (!currentDecision) return;

    const updatedOptions = currentDecision.options.map(opt => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        pros: type === 'pro' ? [...opt.pros, newItem] : opt.pros,
        cons: type === 'con' ? [...opt.cons, newItem] : opt.cons,
      };
    });

    const updatedDecision = { ...currentDecision, options: updatedOptions };
    setCurrentDecision(updatedDecision);
    setSavedDecisions(prev => prev.map(d => (d.id === updatedDecision.id ? updatedDecision : d)));
  };

  const handleDeleteItem = (optionId: string, type: 'pro' | 'con', itemId: string) => {
    if (!currentDecision) return;

    const updatedOptions = currentDecision.options.map(opt => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        pros: type === 'pro' ? opt.pros.filter(p => p.id !== itemId) : opt.pros,
        cons: type === 'con' ? opt.cons.filter(c => c.id !== itemId) : opt.cons,
      };
    });

    const updatedDecision = { ...currentDecision, options: updatedOptions };
    setCurrentDecision(updatedDecision);
    setSavedDecisions(prev => prev.map(d => (d.id === updatedDecision.id ? updatedDecision : d)));
  };

  const handleUpdateWeights = (updatedCriteria: ComparisonCriterion[]) => {
    if (!currentDecision) return;
    const updatedDecision = { ...currentDecision, criteria: updatedCriteria };
    setCurrentDecision(updatedDecision);
    setSavedDecisions(prev => prev.map(d => (d.id === updatedDecision.id ? updatedDecision : d)));
  };

  const handleExportMarkdown = () => {
    if (!currentDecision) return;
    const { decisionTitle, verdict, options, criteria, devilsAdvocate } = currentDecision;

    let md = `# The Tiebreaker - Decision Analysis Report\n\n`;
    md += `**Decision Question:** ${decisionTitle}\n`;
    md += `**Date:** ${new Date().toLocaleDateString()}\n\n`;
    md += `## 🏆 The Tiebreaker Verdict\n`;
    md += `**Recommendation:** ${verdict.headlineVerdict}\n`;
    md += `**Confidence Score:** ${verdict.confidenceScore}%\n\n`;
    md += `**Executive Summary:**\n${verdict.executiveSummary}\n\n`;
    md += `### Rationales:\n`;
    verdict.rationale.forEach(r => {
      md += `- ${r}\n`;
    });
    md += `\n**Subconscious Gut Check:** ${verdict.gutCheckPrompt}\n`;
    md += `**Next 24-Hour Action:** ${verdict.nextImmediateAction}\n\n`;

    md += `## ⚖️ Options & Pros / Cons\n\n`;
    options.forEach(opt => {
      md += `### Option: ${opt.title}\n`;
      md += `*${opt.description}*\n\n`;
      md += `**Pros:**\n`;
      opt.pros.forEach(p => (md += `- [${p.impact.toUpperCase()}] ${p.text}\n`));
      md += `\n**Cons:**\n`;
      opt.cons.forEach(c => (md += `- [${c.impact.toUpperCase()}] ${c.text}\n`));
      md += `\n`;
    });

    md += `## 📊 SWOT Analysis\n\n`;
    options.forEach(opt => {
      md += `### ${opt.title} - SWOT\n`;
      md += `- **Strengths:** ${opt.swot.strengths.join(', ')}\n`;
      md += `- **Weaknesses:** ${opt.swot.weaknesses.join(', ')}\n`;
      md += `- **Opportunities:** ${opt.swot.opportunities.join(', ')}\n`;
      md += `- **Threats:** ${opt.swot.threats.join(', ')}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiebreaker-${decisionTitle.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const tabs = [
    { id: 'suite', label: '360° Suite', icon: Layers },
    { id: 'proscons', label: 'Pros & Cons', icon: Scale },
    { id: 'comparison', label: 'Comparison Table', icon: Table },
    { id: 'swot', label: 'SWOT Analysis', icon: Grid },
    { id: 'matrix', label: 'Weighted Matrix', icon: Sliders },
    { id: 'verdict', label: 'The Verdict', icon: Trophy },
    { id: 'minigame', label: 'Tiebreaker Games', icon: Dices },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <Header
        currentDecision={currentDecision}
        savedCount={savedDecisions.length}
        onOpenSaved={() => setIsHistoryOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onNewDecision={() => {
          setCurrentDecision(null);
          setError(null);
        }}
        onExportMarkdown={handleExportMarkdown}
        onPrint={handlePrint}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold text-sm">Decision Analysis Notice</div>
              <div className="text-xs text-rose-200 mt-0.5">{error}</div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-rose-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Router */}
        {!currentDecision ? (
          <DecisionForm onSubmit={handleAnalyze} isLoading={isLoading} />
        ) : (
          <div className="space-y-6">
            {/* Decision Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    {currentDecision.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(currentDecision.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {currentDecision.decisionTitle}
                </h2>
                {currentDecision.userContext && (
                  <p className="text-xs text-slate-400 line-clamp-1">
                    <strong className="text-slate-300">Context:</strong> {currentDecision.userContext}
                  </p>
                )}
              </div>

              <button
                onClick={() => setCurrentDecision(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition self-start sm:self-auto cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Adjust Dilemma</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800/80 no-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ViewTab)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Tab View */}
            <div className="pt-2 animate-in fade-in duration-200">
              {activeTab === 'suite' && (
                <SuiteOverview
                  analysis={currentDecision}
                  onSelectTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'proscons' && (
                <ProsConsView
                  analysis={currentDecision}
                  onAddUserItem={handleAddUserItem}
                  onDeleteItem={handleDeleteItem}
                  onDeepDive={(optTitle, text, type) => {
                    setDeepDiveTarget({ optionTitle: optTitle, itemText: text, itemType: type });
                  }}
                />
              )}

              {activeTab === 'comparison' && (
                <ComparisonTable analysis={currentDecision} />
              )}

              {activeTab === 'swot' && (
                <SwotView
                  analysis={currentDecision}
                  onDeepDive={(optTitle, text, type) => {
                    setDeepDiveTarget({ optionTitle: optTitle, itemText: text, itemType: type });
                  }}
                />
              )}

              {activeTab === 'matrix' && (
                <WeightedMatrixView
                  analysis={currentDecision}
                  onUpdateWeights={handleUpdateWeights}
                />
              )}

              {activeTab === 'verdict' && (
                <VerdictView
                  analysis={currentDecision}
                  onSelectTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'minigame' && (
                <TiebreakerGames analysis={currentDecision} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-400">The Tiebreaker</span>
            <span>—</span>
            <span>Cognitive Clarity & Multi-Angle Decision Intelligence</span>
          </div>
          <div>
            Powered by Gemini 3.8 Flash & Google AI Studio
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DeepDiveModal
        isOpen={!!deepDiveTarget}
        onClose={() => setDeepDiveTarget(null)}
        decisionTitle={currentDecision?.decisionTitle || ''}
        optionTitle={deepDiveTarget?.optionTitle || ''}
        itemText={deepDiveTarget?.itemText || ''}
        itemType={deepDiveTarget?.itemType || ''}
      />

      <SavedDecisionsModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={(dec) => {
          setCurrentDecision(dec);
          setActiveTab('suite');
        }}
        onDeleteDecision={(id) => {
          setSavedDecisions(prev => prev.filter(d => d.id !== id));
        }}
        onClearAll={() => {
          if (confirm('Clear all decision history?')) {
            setSavedDecisions([]);
          }
        }}
      />

      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={(preset) => {
          handleAnalyze({
            decision: preset.question,
            options: preset.options,
            context: preset.context,
            priorities: preset.priorities,
          });
        }}
      />
    </div>
  );
}
