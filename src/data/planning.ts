import type { PlanningData } from '@/lib/types';

export const brightSpots = [
  { district: 'Dakshina Kannada', roi: 0.14, delayDays: -12, qc: 92 },
  { district: 'Bhagalpur', roi: 0.11, delayDays: -8, qc: 90 },
  { district: 'Pune', roi: 0.16, delayDays: -15, qc: 95 },
  { district: 'Dindori', roi: 0.13, delayDays: -10, qc: 91 },
  { district: 'Jaipur', roi: 0.10, delayDays: 5, qc: 88 },
];

export const wbs = [
  { id: 1, task: 'Drone Survey', p80Risk: 0.66, duration: 14 },
  { id: 2, task: 'Legacy OCR', p80Risk: 0.22, duration: 10 },
  { id: 3, task: 'Boundary Validation', p80Risk: 0.45, duration: 25 },
  { id: 4, task: 'Notary-DAO Setup', p80Risk: 0.75, duration: 18 },
  { id: 5, task: 'API Marketplace Hookup', p80Risk: 0.30, duration: 30 },
  { id: 6, task: 'Revenue Rail Integration', p80Risk: 0.15, duration: 22 },
  { id: 7, task: 'Citizen App UAT', p80Risk: 0.25, duration: 12 },
];

export const scenarios = [
  { id: 'SC-A', irr: 0.12, delay: -6, failedKPIs: 1 },
  { id: 'SC-B', irr: 0.11, delay: -2, failedKPIs: 0 }
];

export const planningData: PlanningData = {
    brightSpots,
    wbs,
    scenarios
}
