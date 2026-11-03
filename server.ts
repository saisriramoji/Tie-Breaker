import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Route: Comprehensive Decision Analysis
  app.post('/api/analyze-decision', async (req: Request, res: Response) => {
    try {
      const { decision, options, context, priorities } = req.body;

      if (!decision || typeof decision !== 'string' || !decision.trim()) {
        res.status(400).json({ error: 'A decision description or question is required.' });
        return;
      }

      const prompt = `You are "The Tiebreaker", an elite decision intelligence analyst, cognitive psychologist, and strategic executive advisor.
Analyze the user's decision dilemma and deliver a comprehensive, actionable decision package.

USER DECISION: "${decision.trim()}"
${context ? `USER CONTEXT & CONSTRAINTS: "${context.trim()}"` : ''}
${priorities && Array.isArray(priorities) && priorities.length > 0 ? `CORE PRIORITIES: ${priorities.join(', ')}` : ''}
${options && Array.isArray(options) && options.length > 0 ? `CANDIDATE OPTIONS GIVEN BY USER: ${options.filter(Boolean).join(', ')}` : 'Formulate 2 to 3 logical, high-impact contrasting options (or "Status Quo" vs "Bold Pivot" vs "Pragmatic Hybrid" if none given).'}

Provide a rigorous analysis containing:
1. Clear options (2 to 4 options max, with distinct IDs like 'opt-1', 'opt-2', etc.)
2. Pros and Cons for each option (3-5 pros and 3-5 cons per option, with impact: 'low' | 'medium' | 'high' | 'critical', and a category like 'Financial', 'Career', 'Well-being', 'Time/Effort', 'Risk')
3. SWOT analysis for each option:
   - Strengths (internal advantages)
   - Weaknesses (internal drawbacks)
   - Opportunities (external upside/tailwinds)
   - Threats (external risks/headwinds)
4. Comparison Criteria (4-6 key evaluation criteria such as 'Long-term ROI', 'Work-Life Quality', 'Implementation Ease', 'Financial Risk', 'Career Growth', etc.), with default weights (1-10) and scores (1-10) for each option plus a brief explanatory note.
5. Devil's Advocate Insights (unmasking hidden assumptions and worst-case scenarios for each option).
6. The Tiebreaker Verdict:
   - The single best option recommended based on sound logic, expected value, and regret minimization
   - Confidence score (0-100)
   - 3-4 bullet rationales
   - Subconscious Gut-Check Prompt (a powerful question that cuts through overthinking)
   - 10-10-10 Rule analysis: How will you feel about this in 10 minutes, 10 months, and 10 years?
   - Next immediate 24-hour action step.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are The Tiebreaker AI. Always return valid, well-structured JSON conforming to the schema. Be insightful, unbiased, pragmatic, and psychologically astute. Avoid generic clichés. Give sharp, nuanced points with real substance.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, description: 'Category e.g. Career, Financial, Lifestyle, Technology, Business, Education' },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    overallScore: { type: Type.NUMBER, description: '0 to 100 estimated initial score' },
                    keyBenefit: { type: Type.STRING },
                    keyRisk: { type: Type.STRING },
                    pros: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING },
                          impact: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] },
                          category: { type: Type.STRING },
                          notes: { type: Type.STRING },
                        },
                        required: ['id', 'text', 'impact'],
                      },
                    },
                    cons: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING },
                          impact: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] },
                          category: { type: Type.STRING },
                          notes: { type: Type.STRING },
                        },
                        required: ['id', 'text', 'impact'],
                      },
                    },
                    swot: {
                      type: Type.OBJECT,
                      properties: {
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                        threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
                    },
                  },
                  required: ['id', 'title', 'description', 'pros', 'cons', 'swot', 'keyBenefit', 'keyRisk'],
                },
              },
              criteria: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    weight: { type: Type.INTEGER, description: '1 to 10 scale' },
                    scores: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          optionId: { type: Type.STRING },
                          score: { type: Type.NUMBER, description: '1 to 10' },
                          explanation: { type: Type.STRING },
                        },
                        required: ['optionId', 'score'],
                      },
                    },
                  },
                  required: ['id', 'name', 'weight', 'scores'],
                },
              },
              devilsAdvocate: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    optionId: { type: Type.STRING },
                    hiddenAssumption: { type: Type.STRING },
                    worstCaseScenario: { type: Type.STRING },
                    mitigationTip: { type: Type.STRING },
                  },
                  required: ['optionId', 'hiddenAssumption', 'worstCaseScenario', 'mitigationTip'],
                },
              },
              verdict: {
                type: Type.OBJECT,
                properties: {
                  recommendedOptionId: { type: Type.STRING },
                  headlineVerdict: { type: Type.STRING },
                  executiveSummary: { type: Type.STRING },
                  confidenceScore: { type: Type.NUMBER, description: '0 to 100' },
                  rationale: { type: Type.ARRAY, items: { type: Type.STRING } },
                  gutCheckPrompt: { type: Type.STRING },
                  tenTenTen: {
                    type: Type.OBJECT,
                    properties: {
                      tenMinutes: { type: Type.STRING },
                      tenMonths: { type: Type.STRING },
                      tenYears: { type: Type.STRING },
                    },
                    required: ['tenMinutes', 'tenMonths', 'tenYears'],
                  },
                  nextImmediateAction: { type: Type.STRING },
                },
                required: ['recommendedOptionId', 'headlineVerdict', 'executiveSummary', 'confidenceScore', 'rationale', 'gutCheckPrompt', 'tenTenTen', 'nextImmediateAction'],
              },
            },
            required: ['options', 'criteria', 'devilsAdvocate', 'verdict'],
          },
        },
      });

      const text = response.text || '{}';
      const parsedData = JSON.parse(text);

      // Reformat criteria scores array to map for fast UI manipulation
      const formattedCriteria = (parsedData.criteria || []).map((c: any) => {
        const scoreMap: Record<string, number> = {};
        const noteMap: Record<string, string> = {};
        if (Array.isArray(c.scores)) {
          c.scores.forEach((s: any) => {
            if (s.optionId) {
              scoreMap[s.optionId] = s.score ?? 5;
              noteMap[s.optionId] = s.explanation ?? '';
            }
          });
        }
        return {
          id: c.id || `crit-${Math.random().toString(36).substring(2, 7)}`,
          name: c.name,
          description: c.description || '',
          weight: c.weight || 7,
          scores: scoreMap,
          analysis: noteMap,
        };
      });

      const completeAnalysis = {
        id: `dec-${Date.now()}`,
        decisionTitle: decision.trim(),
        userContext: context?.trim() || undefined,
        category: parsedData.category || 'General',
        createdAt: new Date().toISOString(),
        options: parsedData.options || [],
        criteria: formattedCriteria,
        devilsAdvocate: parsedData.devilsAdvocate || [],
        verdict: parsedData.verdict,
      };

      res.json(completeAnalysis);
    } catch (err: any) {
      console.error('Error analyzing decision:', err);
      res.status(500).json({
        error: err.message || 'An error occurred while analyzing the decision. Please try again.',
      });
    }
  });

  // API Route: Deep Dive on a specific point / risk mitigation
  app.post('/api/deep-dive', async (req: Request, res: Response) => {
    try {
      const { decisionTitle, optionTitle, itemText, itemType } = req.body;

      if (!itemText) {
        res.status(400).json({ error: 'Item text is required.' });
        return;
      }

      const prompt = `Regarding the decision "${decisionTitle || 'User Dilemma'}", focus on Option "${optionTitle || 'Selected Option'}":
Specifically dissect this ${itemType || 'aspect'}: "${itemText}"

Provide:
1. In-depth analysis: Why this matters and what hidden dynamics are involved.
2. 3 actionable mitigation or optimization steps.
3. Realistic probability vs impact assessment.
4. One probing reflective question the user should answer for themselves.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an executive strategic consultant. Provide structured, high-value tactical insight in JSON.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              deeperInsight: { type: Type.STRING },
              probabilityImpactAssessment: { type: Type.STRING },
              actionSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
              reflectiveQuestion: { type: Type.STRING },
            },
            required: ['deeperInsight', 'probabilityImpactAssessment', 'actionSteps', 'reflectiveQuestion'],
          },
        },
      });

      const text = response.text || '{}';
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error('Error on deep dive:', err);
      res.status(500).json({ error: err.message || 'Failed to generate deep dive analysis.' });
    }
  });

  // API Route: Quick tiebreak prompt
  app.post('/api/quick-break-tie', async (req: Request, res: Response) => {
    try {
      const { decisionTitle, options, situation } = req.body;
      const prompt = `The user is stuck in analysis paralysis between these options:
Decision: "${decisionTitle}"
Options: ${JSON.stringify(options)}
${situation ? `Notes: "${situation}"` : ''}

Break the tie immediately with ruthless clarity, psychological insight, and a dose of wisdom.
Tell them which one to choose, the single most compelling reason, the trap to avoid, and the "24-hour test".`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are The Tiebreaker. Deliver high conviction, compassionate clarity.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              winner: { type: Type.STRING },
              coreReason: { type: Type.STRING },
              trapToAvoid: { type: Type.STRING },
              twentyFourHourTest: { type: Type.STRING },
              gutCheckRule: { type: Type.STRING },
            },
            required: ['winner', 'coreReason', 'trapToAvoid', 'twentyFourHourTest', 'gutCheckRule'],
          },
        },
      });

      res.json(JSON.parse(response.text || '{}'));
    } catch (err: any) {
      console.error('Error on quick break tie:', err);
      res.status(500).json({ error: err.message || 'Failed to break tie.' });
    }
  });

  // Mount Vite or static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Tiebreaker server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
