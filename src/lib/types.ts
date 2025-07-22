export interface Project {
  id: string;
  name: string;
  sector: string;
  status: 'active' | 'completed' | 'on-hold';
  kpi: {
    roi: number;
    delayDays: number;
    quality: number;
  };
  description: string;
  imageUrl: string;
}

export interface PlanningData {
  scenarios: {
    id: string;
    irr: number;
    delayRisk: number;
    capexCr: number;
  }[];
}

export interface ExecutionData {
  districts: {
    name: string;
    progress: number;
    capex: number;
    revenue: number;
    qcScore: number;
  }[];
  inclusiveModel: {
    title: string;
    value: string;
  }[];
  pppTerms: {
    title: string;
    value: string;
  }[];
}

export interface VerificationData {
  citizenUploads: number;
  flaggedMismatches: number;
  auditLogs: {
    id: string;
    description: string;
    status: 'open' | 'closed';
  }[];
  citizenWall: {
    id: string;
    imageUrl: string;
    location: string;
  }[];
}

export interface MonitorData {
  iotPacketsPerMin: number;
  revenueToday: number;
  apiCalls: number;
  anomalies: {
    id:string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
}

export interface BhuSetuData {
  planning: PlanningData;
  execution: ExecutionData;
  verification: VerificationData;
  monitor: MonitorData;
}
