import type { Project } from '@/lib/types';

export const projects: Project[] = [
  {
    id: 'bhu-setu-2',
    name: 'Bhu-Setu 2.0',
    sector: 'Land & Urban',
    status: 'active',
    kpi: { roi: 0, delayDays: 0, quality: 0 },
    description: 'A national-level project for digitizing land records and streamlining property transactions.',
    imageUrl: 'https://images.unsplash.com/photo-1504992963429-56f9b6a18815?q=80&w=600',
  },
  {
    id: 'swasthya-connect',
    name: 'Swasthya Connect',
    sector: 'Health',
    status: 'completed',
    kpi: { roi: 0.18, delayDays: 15, quality: 92 },
    description: 'Telemedicine platform connecting rural patients with urban specialists.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600',
  },
  {
    id: 'gatishil-logistics',
    name: 'GatiShil Logistics',
    sector: 'Transport',
    status: 'on-hold',
    kpi: { roi: 0.09, delayDays: 45, quality: 75 },
    description: 'Integrated logistics network for optimizing freight movement across the country.',
    imageUrl: 'https://images.unsplash.com/photo-1578574577315-3f160d005795?q=80&w=600',
  },
    {
    id: 'jal-jeevan',
    name: 'Jal Jeevan',
    sector: 'Water',
    status: 'completed',
    kpi: { roi: 0.22, delayDays: -5, quality: 95 },
    description: 'Nationwide initiative to provide safe and adequate drinking water through individual household tap connections.',
    imageUrl: 'https://images.unsplash.com/photo-1551835522-c3b80a9554f1?q=80&w=600',
  }
];
