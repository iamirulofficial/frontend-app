import type { BhuSetuData } from '@/lib/types';

export const bhuSetuData: BhuSetuData = {
  planning: {
    scenarios: [
      { id:'S-Base', irr:0.12, delayRisk:18, capexCr:500 },
      { id:'S-PPP-Boost', irr:0.16, delayRisk:12, capexCr:540 },
      { id:'S-HiLitigation', irr:0.08, delayRisk:25, capexCr:495 }
    ]
  },
  execution: {
    districts: [
      { name: 'Bhagalpur Digitisation', progress: 42, capex: 38, revenue: 12, qcScore: 86 },
      { name: 'Dindori Parcel Survey', progress: 68, capex: 27, revenue: 9, qcScore: 90 },
      { name: 'Jaipur Urban Mapping', progress: 25, capex: 55, revenue: 5, qcScore: 82 },
      { name: 'Pune Rural Titling', progress: 85, capex: 40, revenue: 20, qcScore: 95 },
    ],
    inclusiveModel: [
      { title: 'Beneficiaries', value: 'Small Landholders' },
      { title: 'Revenue Split', value: '80% State / 20% Partner' },
    ],
    pppTerms: [
      { title: 'Concession', value: '15 Years' },
      { title: 'Viability Gap Funding', value: '10%' },
    ]
  },
  verification: {
    citizenUploads: 1928,
    flaggedMismatches: 92,
    auditLogs: [
      { id: '#324', description: 'Discrepancy in plot area for parcel #A123', status: 'open' },
      { id: '#325', description: 'Corrective action: "drone resurvey"', status: 'closed' },
      { id: '#326', description: 'Pending approval for boundary change', status: 'open' },
    ],
    citizenWall: [
        { id: '1', imageUrl: 'https://placehold.co/300x400.png', location: 'Bhagalpur' },
        { id: '2', imageUrl: 'https://placehold.co/400x300.png', location: 'Dindori' },
        { id: '3', imageUrl: 'https://placehold.co/300x300.png', location: 'Jaipur' },
        { id: '4', imageUrl: 'https://placehold.co/400x400.png', location: 'Pune' },
        { id: '5', imageUrl: 'https://placehold.co/300x450.png', location: 'Bhagalpur' },
        { id: '6', imageUrl: 'https://placehold.co/450x300.png', location: 'Dindori' },
    ]
  },
  monitor: {
    iotPacketsPerMin: 1200,
    revenueToday: 2.3,
    apiCalls: 45000,
    anomalies: [
      { id: 'A-27', description: 'Excavation pace drift -14%', severity: 'medium' },
      { id: 'A-28', description: 'Unexpected API usage spike from Zone 3', severity: 'low' },
      { id: 'A-29', description: 'Survey drone #4 offline for 2 hours', severity: 'high' },
    ]
  }
};
