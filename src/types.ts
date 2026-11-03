export interface ProConItem {
  id: string;
  text: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  category?: string; // e.g., Financial, Career, Well-being, Effort, Long-term
  notes?: string;
  userAdded?: boolean;
}

export interface OptionSwot {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  pros: ProConItem[];
  cons: ProConItem[];
  swot: OptionSwot;
  overallScore: number; // 0 - 100
  keyBenefit: string;
  keyRisk: string;
}

export interface ComparisonCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // 1 to 10
  scores: Record<string, number>; // optionId -> score 1 to 10
  analysis: Record<string, string>; // optionId -> brief note on why
}

export interface DevilsAdvocateInsight {
  optionId: string;
  hiddenAssumption: string;
  worstCaseScenario: string;
  mitigationTip: string;
}

export interface TenTenTenRule {
  tenMinutes: string;
  tenMonths: string;
  tenYears: string;
}

export interface TiebreakerVerdict {
  recommendedOptionId: string;
  headlineVerdict: string;
  executiveSummary: string;
  confidenceScore: number; // 0 - 100
  rationale: string[];
  gutCheckPrompt: string; // The subconscious gut check question
  tenTenTen: TenTenTenRule;
  nextImmediateAction: string;
}

export interface DecisionAnalysis {
  id: string;
  decisionTitle: string;
  userContext?: string;
  category: string;
  createdAt: string;
  options: DecisionOption[];
  criteria: ComparisonCriterion[];
  devilsAdvocate: DevilsAdvocateInsight[];
  verdict: TiebreakerVerdict;
}

export type ViewTab = 'suite' | 'proscons' | 'comparison' | 'swot' | 'matrix' | 'verdict' | 'minigame';
