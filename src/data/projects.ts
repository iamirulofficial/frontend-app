import type { Project } from '@/lib/types';

export const projects: Project[] = [
  {
    id: 'bhu-setu-2',
    name: 'Bhu-Setu 2.0',
    sector: 'Land & Urban',
    status: 'active',
    kpi: { roi: 0, delayDays: 0, quality: 0 },
    description: 'A national-level project for digitizing land records and streamlining property transactions.',
    imageUrl: 'https://picsum.photos/600/400?random=1',
  },
  {
    id: 'swasthya-connect',
    name: 'Swasthya Connect',
    sector: 'Health',
    status: 'completed',
    kpi: { roi: 0.18, delayDays: 15, quality: 92 },
    description: 'Telemedicine platform connecting rural patients with urban specialists.',
    imageUrl: 'https://picsum.photos/600/400?random=2',
  },
  {
    id: 'gatishil-logistics',
    name: 'GatiShil Logistics',
    sector: 'Transport',
    status: 'on-hold',
    kpi: { roi: 0.09, delayDays: 45, quality: 75 },
    description: 'Integrated logistics network for optimizing freight movement across the country.',
    imageUrl: 'https://picsum.photos/600/400?random=3',
  },
    {
    id: 'jal-jeevan',
    name: 'Jal Jeevan',
    sector: 'Water',
    status: 'completed',
    kpi: { roi: 0.22, delayDays: -5, quality: 95 },
    description: 'Nationwide initiative to provide safe and adequate drinking water through individual household tap connections.',
    imageUrl: 'https://picsum.photos/600/400?random=4',
  }
];
