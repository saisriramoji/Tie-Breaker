import React, { useEffect, useState } from 'react';
import { X, Sparkles, AlertCircle, CheckCircle2, HelpCircle, Loader2 } from 'lucide-react';

interface DeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  decisionTitle: string;
  optionTitle: string;
  itemText: string;
  itemType: string;
}

export const DeepDiveModal: React.FC<DeepDiveModalProps> = ({
  isOpen,
  onClose,
  decisionTitle,
  optionTitle,
  itemText,
  itemType,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    deeperInsight?: string;
    probabilityImpactAssessment?: string;
    actionSteps?: string[];
    reflectiveQuestion?: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen || !itemText) return;

    let isMounted = true;
    setLoading(true);
    setData(null);

    fetch('/api/deep-dive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        decisionTitle,
        optionTitle,
        itemText,
        itemType,
      }),
    })
      .then(res => res.json())
      .then(result => {
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setData({ error: err.message || 'Failed to load deep dive.' });
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, itemText, optionTitle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-white">
                AI Deep Dive & Strategic Dissection
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Focusing on Option: <strong className="text-slate-200">{optionTitle}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Focus Item Quote */}
        <div className="my-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 shrink-0">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">
            Subject Matter ({itemType}):
          </div>
          <div className="text-sm font-semibold text-amber-300">
            "{itemText}"
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
              <span className="text-xs font-medium">Deconstructing strategic implications...</span>
            </div>
          ) : data?.error ? (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs">
              {data.error}
            </div>
          ) : data ? (
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Deeper Insight */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Hidden Dynamics & Underlying Reality
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {data.deeperInsight}
                </p>
              </div>

              {/* Probability vs Impact */}
              {data.probabilityImpactAssessment && (
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Probability & Impact Profile
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {data.probabilityImpactAssessment}
                  </p>
                </div>
              )}

              {/* Action Steps */}
              {data.actionSteps && data.actionSteps.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Tactical Action & Mitigation Steps
                  </div>
                  <ul className="space-y-2">
                    {data.actionSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reflective Question */}
              {data.reflectiveQuestion && (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1">
                  <div className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>The Acid-Test Question for Yourself</span>
                  </div>
                  <p className="text-purple-100 italic font-medium leading-relaxed">
                    "{data.reflectiveQuestion}"
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 mt-2 border-t border-slate-800 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
