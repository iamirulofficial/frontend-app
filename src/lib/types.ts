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
  pppFinancials: {
    concessionLength: number;
    viabilityGapFunding: number;
    userFee: number;
  };
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
  valueCreation: {
    apiMarketplace: {
      name: string;
      description: string;
      value: string;
    };
    ancillaryServices: {
      name: string;
      description: string;
      value: string;
    };
  };
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
    isMismatch: boolean;
  }[];
  qualityScorecard: {
    averageScore: number;
    parcelsForResurvey: number;
  };
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
  pppOversight: {
    metric: string;
    target: string;
    actual: string;
    status: 'on-track' | 'at-risk' | 'breached';
  }[];
}

export interface BhuSetuData {
  planning: PlanningData;
  execution: ExecutionData;
  verification: VerificationData;
  monitor: MonitorData;
}