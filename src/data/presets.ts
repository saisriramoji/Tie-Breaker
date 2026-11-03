export interface DecisionPreset {
  id: string;
  title: string;
  category: string;
  question: string;
  options: string[];
  context: string;
  priorities: string[];
}

export const DECISION_PRESETS: DecisionPreset[] = [
  {
    id: 'career-offer',
    title: 'New Executive Role vs. Stay Current Position',
    category: 'Career',
    question: 'Should I accept an offer as VP of Engineering at a Series B startup, or stay as Director at an established public tech company?',
    options: [
      'Accept VP Offer at Series B Startup',
      'Stay as Director at Established Company',
      'Leverage Offer to Negotiate Promotion Internally'
    ],
    context: 'The startup offers 30% salary increase + significant equity, but higher burn rate and 60-hour weeks. Current company offers steady RSUs, great work-life balance, but slow career advancement.',
    priorities: ['Wealth creation & equity upside', 'Work-life balance with family', 'Career prestige & leadership scale', 'Job security']
  },
  {
    id: 'home-buying',
    title: 'Buy Suburban Home vs. Rent in City Center',
    category: 'Financial & Lifestyle',
    question: 'Should we buy a 4-bedroom house in the suburbs with a 30-year mortgage, or keep renting a 2-bedroom downtown apartment and invest surplus cash?',
    options: [
      'Buy 4-Bed House in Suburbs',
      'Keep Renting Downtown & Invest in Index Funds',
      'Buy Smaller Condo in Urban Core'
    ],
    context: 'Current interest rates are ~6.5%. We have $120,000 saved for down payment. We love walkability and dining downtown, but we want space for a home office and potential future nursery.',
    priorities: ['Financial flexibility & liquid net worth', 'Quality of life & short commute', 'Long-term equity & stability', 'Personal space & yard']
  },
  {
    id: 'startup-vs-mba',
    title: 'Launch SaaS Startup vs. Pursue Top MBA',
    category: 'Education & Business',
    question: 'Should I invest my $150,000 savings into bootstrapping my B2B AI SaaS product full-time, or attend a top-10 MBA program?',
    options: [
      'Bootstrap B2B SaaS Startup Full-Time',
      'Attend Top-10 Full-Time MBA Program',
      'Pursue Part-Time/Executive MBA while Building SaaS'
    ],
    context: 'I have 4 years of software engineering experience. The startup has 15 beta users and $800 MRR. MBA offers lifetime alumni network, fallback pedigree, and venture access, but $200k+ total debt/cost.',
    priorities: ['Ownership & entrepreneurship speed', 'Alumni network & lifelong prestige', 'Downside risk protection', 'Immediate cash flow']
  },
  {
    id: 'tech-architecture',
    title: 'Migrate to Microservices vs. Modular Monolith',
    category: 'Technology',
    question: 'Should our engineering organization break our core legacy monolithic backend into independent microservices, or refactor into a modular monolith?',
    options: [
      'Migrate to Event-Driven Microservices',
      'Refactor into a Strict Modular Monolith',
      'Extract only the 2 Highest-Traffic Services to Microservices'
    ],
    context: 'Team size is 28 engineers across 4 squads. Deployment friction and database locks are increasing, but our DevOps/Kubernetes observability tooling is still relatively immature.',
    priorities: ['Developer deployment velocity', 'Operational simplicity & low debug overhead', 'System scalability', 'Low infra hosting costs']
  },
  {
    id: 'relocation-abroad',
    title: 'Relocate to Foreign Hub vs. Stay Local',
    category: 'Lifestyle & Personal',
    question: 'Should our family relocate across continents for a 3-year international assignment, or stay in our home city near extended family?',
    options: [
      'Accept 3-Year International Relocation',
      'Decline and Stay in Current City',
      'Negotiate 6-Month Remote Trial Period'
    ],
    context: 'Company pays full relocation package, private international school for kids, and housing allowance. However, aging parents live 20 minutes away from our current house.',
    priorities: ['Global life experience for children', 'Proximity and care for parents', 'Spouse career continuity', 'Adventure & new horizons']
  }
];
