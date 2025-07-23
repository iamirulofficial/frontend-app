import type { PlanningData, WbsItem } from '@/lib/types';

export const brightSpots = [
  { district: 'Dakshina Kannada', roi: 0.14, delayDays: -12, qc: 92 },
  { district: 'Bhagalpur', roi: 0.11, delayDays: -8, qc: 90 },
  { district: 'Pune', roi: 0.16, delayDays: -15, qc: 95 },
  { district: 'Dindori', roi: 0.13, delayDays: -10, qc: 91 },
  { district: 'Jaipur', roi: 0.10, delayDays: -6, qc: 88 },
];

export const wbs: WbsItem[] = [
  { id: 1, task: 'Drone Survey', p80Risk: 0.66, duration: 14 },
  { id: 2, task: 'Legacy OCR', p80Risk: 0.22, duration: 10 },
  { id: 3, task: 'Boundary Validation', p80Risk: 0.31, duration: 18 },
  { id: 4, task: 'Notary-DAO Setup', p80Risk: 0.48, duration: 12 },
  { id: 5, task: 'API Marketplace Hookup', p80Risk: 0.27, duration: 20 },
  { id: 6, task: 'Revenue Rail Integration', p80Risk: 0.35, duration: 16 },
  { id: 7, task: 'Citizen App UAT', p80Risk: 0.40, duration: 10 },
];

export const wbsRegenerated: WbsItem[] = [
  { id: 4, task: 'Notary-DAO Setup', duration: 14, p80Risk: 0.75 }, // was 48->75%
  { id: 1, task: 'Drone Survey', duration: 16, p80Risk: 0.65 },     // was 66->65%
  { id: 3, task: 'Boundary Validation', duration: 18, p80Risk: 0.28 },
  { id: 2, task: 'Legacy OCR', p80Risk: 0.20, duration: 10 },
  { id: 5, task: 'API Marketplace Hookup', p80Risk: 0.25, duration: 20 },
  { id: 6, task: 'Revenue Rail Integration', p80Risk: 0.32, duration: 16 },
  { id: 7, task: 'Citizen App UAT', p80Risk: 0.38, duration: 10 },
];

export const scenarios = [
  { id: 'SC-A', irr: 0.12, delay: -6, failedKPIs: 1 },
  { id: 'SC-B', irr: 0.11, delay: -2, failedKPIs: 0 }
];

export const corpusProjects = [
    { id: 'aadhaar', name: 'Aadhaar' },
    { id: 'upi', name: 'UPI' },
    { id: 'digilocker', name: 'DigiLocker' },
    { id: 'ndhm', name: 'NDHM' },
    { id: 'gstn', name: 'GSTN' },
    { id: 'pmgsy', name: 'PMGSY Bridges' },
];

export const insights: Record<string, { success: {id: string, title: string, detail: string}[], pitfalls: {id: string, title: string, detail: string}[] }> = {
  aadhaar: {
    success: [
      {id:'aad-1', title:'Bi-modal enrolment', detail:'Fingerprint + iris reduced duplicate IDs by 0.3%.'},
      {id:'aad-2', title:'E-KYC API', detail:'Cut bank onboarding cost 80%.'}
    ],
    pitfalls: [
      {id:'aad-p1', title:'Privacy litigation', detail:'SC ruling forced overhaul of data-sharing policy.'}
    ]
  },
  upi: { 
    success: [
        {id:'upi-1', title:'Interoperability hub', detail:'Single API layer for all banks drove massive adoption.'},
        {id:'upi-2', title:'2FA at scale', detail:'Seamless two-factor auth built into the flow.'}
    ],
    pitfalls: [
        {id:'upi-p1', title:'Initial MDR battle', detail:'Zero-MDR policy was contentious for banks.'}
    ]
  },
  digilocker: { 
    success: [
        {id:'dig-1', title:'Consent-driven sharing', detail:'Gave citizens full control over their documents.'},
    ],
    pitfalls: [
        {id:'dig-p1', title:'Slow initial adoption', detail:'Required major push from government departments to be useful.'}
    ]
  },
  ndhm: {
    success: [{id:'ndhm-1', title:'FHIR-compliant APIs', detail:'Standardized health records across providers.'}],
    pitfalls: []
  },
  gstn: {
    success: [],
    pitfalls: [{id:'gstn-p1', title:'GSTN load storm 2017', detail:'Underestimated server load caused 18h outage on launch day.'}]
  },
  pmgsy: {
    success: [{id:'pmgsy-1', title:'Geo-tagged asset monitoring', detail:'Photos of roads/bridges linked to GIS reduced corruption.'}],
    pitfalls: []
  }
};

const radarDataRaw = [
  { id: 'aadhaar', name: 'Aadhaar', data: [
    { axis: 'Cost', value: 0.4 }, { axis: 'Delay', value: 0.7 }, { axis: 'Quality', value: 0.9 }, { axis: 'Scale', value: 1.0 }, { axis: 'Inclusivity', value: 0.85 }, { axis: 'User Adoption', value: 1.0 }, { axis: 'Security', value: 0.9 }
  ]},
  { id: 'upi', name: 'UPI', data: [
    { axis: 'Cost', value: 0.6 }, { axis: 'Delay', value: 0.9 }, { axis: 'Quality', value: 0.9 }, { axis: 'Scale', value: 0.95 }, { axis: 'Inclusivity', value: 0.9  }, { axis: 'User Adoption', value: 1.0 }, { axis: 'Security', value: 0.95 }
  ]},
  { id: 'digilocker', name: 'DigiLocker', data: [
    { axis: 'Cost', value: 0.3 }, { axis: 'Delay', value: 0.6 }, { axis: 'Quality', value: 0.8 }, { axis: 'Scale', value: 0.7 }, { axis: 'Inclusivity', value: 0.75 }, { axis: 'User Adoption', value: 0.8 }, { axis: 'Security', value: 0.9 }
  ]},
  { id: 'ndhm', name: 'NDHM', data: [
    { axis: 'Cost', value: 0.5 }, { axis: 'Delay', value: 0.5 }, { axis: 'Quality', value: 0.7 }, { axis: 'Scale', value: 0.6 }, { axis: 'Inclusivity', value: 0.8 }, { axis: 'User Adoption', value: 0.6 }, { axis: 'Security', value: 0.8 }
  ]},
  { id: 'gstn', name: 'GSTN', data: [
    { axis: 'Cost', value: 0.8 }, { axis: 'Delay', value: 0.4 }, { axis: 'Quality', value: 0.5 }, { axis: 'Scale', value: 0.85 }, { axis: 'Inclusivity', value: 0.6 }, { axis: 'User Adoption', value: 0.9 }, { axis: 'Security', value: 0.85 }
  ]},
  { id: 'pmgsy', name: 'PMGSY', data: [
    { axis: 'Cost', value: 0.7 }, { axis: 'Delay', value: 0.6 }, { axis: 'Quality', value: 0.7 }, { axis: 'Scale', value: 0.8 }, { axis: 'Inclusivity', value: 1.0 }, { axis: 'User Adoption', value: 0.7 }, { axis: 'Security', value: 0.7 }
  ]}
];

export const radarAxes = ['Cost', 'Delay', 'Quality', 'Scale', 'Inclusivity', 'User Adoption', 'Security'];

export const radarPolygons = radarDataRaw.map(d => ({
    id: d.id,
    name: d.name,
    data: d.data.map(item => ({...item}))
}));


export const pppRisk = [
    { factor: 'Land Litigation', gov: 100, private: 0 },
    { factor: 'Tech Obsolescence', gov: 30, private: 70 },
    { factor: 'Demand Shortfall', gov: 60, private: 40 },
    { factor: 'Drone Permit Delays', gov: 20, private: 80 },
];

export const failureDrivers = [
  { reason:'Drone permit delays', impactPct: 42 },
  { reason:'User-fee shortfall', impactPct: 33 },
  { reason:'Land litigation spikes', impactPct: 25 }
];


export const planningData = {
    brightSpots,
    wbs,
    scenarios,
    pppRisk,
    failureDrivers
};
