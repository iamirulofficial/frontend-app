import type { BhuSetuData } from '@/lib/types';

export const bhuSetuData: BhuSetuData = {
  planning: {
    scenarios: [
      { id:'S-Base', irr:0.12, delayRisk:18, capexCr:500 },
      { id:'S-PPP-Boost', irr:0.16, delayRisk:12, capexCr:540 },
      { id:'S-HiLitigation', irr:0.08, delayRisk:25, capexCr:495 }
    ],
    pppFinancials: {
      concessionLength: 15,
      viabilityGapFunding: 20,
      userFee: 25,
    }
  },
  execution: {
    districts: [
      { name: 'Bhagalpur Digitisation', progress: 42, capex: 38, revenue: 12, qcScore: 86 },
      { name: 'Dindori Parcel Survey', progress: 68, capex: 27, revenue: 9, qcScore: 90 },
      { name: 'Jaipur Urban Mapping', progress: 25, capex: 55, revenue: 5, qcScore: 82 },
      { name: 'Pune Rural Titling', progress: 85, capex: 40, revenue: 20, qcScore: 95 },
    ],
    inclusiveModel: [
      { title: 'Beneficiaries', value: 'Small Landholders, SHGs' },
      { title: 'Platform Fee', value: '₹2 per API call (Zero-rated for NGOs)' },
      { title: 'Access Method', value: 'Mobile vans for offline villages' },
    ],
    pppTerms: [
      { title: 'Concession', value: '15 Years (DBFOT)' },
      { title: 'Govt. Grant', value: '20% Viability Gap Funding' },
      { title: 'Revenue Share', value: '85% Govt / 15% Operator' },
      { title: 'Risk Allocation', value: 'Litigation (Govt), Tech (Operator)' },
    ],
    valueCreation: {
      apiMarketplace: {
        name: 'Inclusive Business Marketplace',
        description: 'Open APIs for parcels, valuation, and micro-loans, enabling fintech integration.',
        value: '35 Active Integrations'
      },
      ancillaryServices: {
        name: 'Value-Add Bundles',
        description: 'Paid add-ons like drone survey service desk and mobile outreach vans.',
        value: 'Ancillary Revenue: ₹1.2 Cr'
      }
    }
  },
  verification: {
    citizenUploads: 1928,
    flaggedMismatches: 92,
    auditLogs: [
      { id: '#CAR-021', description: 'Process log vs SOP Mismatch: Mutation approval time exceeds 5-day SLA.', status: 'open' },
      { id: '#CAR-020', description: 'Corrective Action Taken: Deployed RPA bot for notary reminders.', status: 'closed' },
      { id: '#CAR-019', description: 'Pending approval for boundary change based on drone resurvey.', status: 'open' },
    ],
    citizenWall: [
        { id: '1', imageUrl: 'https://placehold.co/300x400.png', location: 'Bhagalpur', isMismatch: false },
        { id: '2', imageUrl: 'https://placehold.co/400x300.png', location: 'Dindori', isMismatch: true },
        { id: '3', imageUrl: 'https://placehold.co/300x300.png', location: 'Jaipur', isMismatch: false },
        { id: '4', imageUrl: 'https://placehold.co/400x400.png', location: 'Pune', isMismatch: false },
        { id: '5', imageUrl: 'https://placehold.co/300x450.png', location: 'Bhagalpur', isMismatch: false },
        { id: '6', imageUrl: 'https://placehold.co/450x300.png', location: 'Dindori', isMismatch: false },
    ],
    qualityScorecard: {
      averageScore: 92,
      parcelsForResurvey: 124,
    }
  },
  monitor: {
    iotPacketsPerMin: 1200,
    revenueToday: 2.3,
    apiCalls: 45000,
    anomalies: [
      { id: 'A-29', description: 'Survey drone #4 offline for 2 hours', severity: 'high' },
      { id: 'A-27', description: 'Excavation pace drift -14%', severity: 'medium' },
      { id: 'A-28', description: 'Unexpected API usage spike from Zone 3', severity: 'low' },
    ],
    pppOversight: [
      { metric: 'CAPEX Spend', target: '≤ ₹500 Cr', actual: '₹480 Cr', status: 'on-track' },
      { metric: 'Service Uptime', target: '≥ 99.9%', actual: '99.8%', status: 'at-risk' },
      { metric: 'API Revenue', target: '≥ ₹20 L/day', actual: '₹23 L/day', status: 'on-track' },
      { metric: 'Mutation SLA', target: '< 5 days', actual: '5.8 days', status: 'breached' },
    ]
  }
};