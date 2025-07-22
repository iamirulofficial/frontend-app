import type { PlanningData } from '@/lib/types';

export const brightSpots = [
  { district: 'Dakshina Kannada', roi: 0.14, delayDays: -12, qc: 92 },
  { district: 'Bhagalpur', roi: 0.11, delayDays: -8, qc: 90 },
  { district: 'Pune', roi: 0.16, delayDays: -15, qc: 95 },
  { district: 'Dindori', roi: 0.13, delayDays: -10, qc: 91 },
  { district: 'Jaipur', roi: 0.10, delayDays: -6, qc: 88 },
];

export const wbs = [
  { id: 1, task: 'Drone Survey', p80Risk: 0.66, duration: 14 },
  { id: 2, task: 'Legacy OCR', p80Risk: 0.22, duration: 10 },
  { id: 3, task: 'Boundary Validation', p80Risk: 0.31, duration: 18 },
  { id: 4, task: 'Notary-DAO Setup', p80Risk: 0.48, duration: 12 },
  { id: 5, task: 'API Marketplace Hookup', p80Risk: 0.27, duration: 20 },
  { id: 6, task: 'Revenue Rail Integration', p80Risk: 0.35, duration: 16 },
  { id: 7, task: 'Citizen App UAT', p80Risk: 0.40, duration: 10 },
];

export const scenarios = [
  { id: 'SC-A', irr: 0.12, delay: -6, failedKPIs: 1 },
  { id: 'SC-B', irr: 0.11, delay: -2, failedKPIs: 0 }
];

export const sparkLibrary = [
    {
        name: 'Aadhaar',
        sector: 'Identity',
        logoUrl: 'https://placehold.co/100x100.png',
        outcomes: ['1.3B IDs in 10 yrs', '99.5% auth uptime'],
        keystones: ['Bi-modal enrollment', 'E-KYC API']
    },
    {
        name: 'UPI',
        sector: 'Payments',
        logoUrl: 'https://placehold.co/100x100.png',
        outcomes: ['100Bn tx/month', '0.01% fraud'],
        keystones: ['Interoperability hub', '2FA at scale']
    },
    {
        name: 'DigiLocker',
        sector: 'Documents',
        logoUrl: 'https://placehold.co/100x100.png',
        outcomes: ['8 Cr docs served', '80% govt adoption'],
        keystones: ['Consent-driven sharing', 'Hash-verify']
    },
    {
        name: 'NDHM',
        sector: 'Health Records',
        logoUrl: 'https://placehold.co/100x100.png',
        outcomes: ['50 Cr health IDs', '20mm records exchanged'],
        keystones: ['FHIR-compliant APIs', 'OTT-onboarding']
    }
];

export const pppRisk = [
    { factor: 'Land Litigation', gov: 100, private: 0 },
    { factor: 'Tech Obsolescence', gov: 30, private: 70 },
    { factor: 'Demand Shortfall', gov: 60, private: 40 },
    { factor: 'Drone Permit Delays', gov: 20, private: 80 },
];


export const planningData: PlanningData = {
    brightSpots,
    wbs,
    scenarios,
    sparkLibrary,
    pppRisk
};
