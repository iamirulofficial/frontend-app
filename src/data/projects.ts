import type { Project } from '@/lib/types';

export const projects: Project[] = [
  {
    id: 'bhu-setu-2',
    name: 'Bhu-Setu 2.0',
    sector: 'Land & Urban',
    status: 'active',
    kpi: { roi: 0.12, delayDays: -8, quality: 88 },
    description: 'A national-level project for digitizing land records and streamlining property transactions.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'swasthya-connect',
    name: 'Swasthya Connect',
    sector: 'Health',
    status: 'completed',
    kpi: { roi: 0.18, delayDays: 15, quality: 92 },
    description: 'Telemedicine platform connecting rural patients with urban specialists.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'gatishil-logistics',
    name: 'GatiShil Logistics',
    sector: 'Transport',
    status: 'on-hold',
    kpi: { roi: 0.09, delayDays: 45, quality: 75 },
    description: 'Integrated logistics network for optimizing freight movement across the country.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
    {
    id: 'jal-jeevan',
    name: 'Jal Jeevan',
    sector: 'Water',
    status: 'completed',
    kpi: { roi: 0.22, delayDays: -5, quality: 95 },
    description: 'Nationwide initiative to provide safe and adequate drinking water through individual household tap connections.',
    imageUrl: 'https://placehold.co/600x400.png',
  }
];