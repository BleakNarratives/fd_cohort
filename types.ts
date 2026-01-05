
export enum Brand {
  KINGS_COUNCIL = 'KINGS_COUNCIL',
  FANDUEL_COHORT = 'FANDUEL_COHORT',
  TITAN_UNIVERSAL = 'TITAN_UNIVERSAL'
}

export enum AdvisorMode {
  SINGLE = 'SINGLE_ADVISOR',
  SWARM = 'AGENTIC_SWARM'
}

export enum PsychState {
  OPTIMAL = 'OPTIMAL',
  FOCUSED = 'FOCUSED',
  VOLATILE = 'VOLATILE',
  FATIGUED = 'FATIGUED'
}

export interface BiometricTelemetry {
  heartRateSim: number;
  stressFactor: number;
  focusIndex: number;
  sessionDuration: number;
}

export interface Bankroll {
  total: number;
  available: number;
  inFlight: number;
  currency: string;
}

export interface BetData {
  id: string;
  timestamp: string;
  event: string;
  odds: number;
  marketName: string;
  status: 'LIVE' | 'UPCOMING' | 'CLOSED';
  type: string;
  alphaScore?: number;
  neuralSync?: number; 
  sources?: { uri: string; title: string }[];
}

export enum Tab {
  ALPHA_FLOW = 'ALPHA_FLOW',
  COHORT_ENGINE = 'COHORT_ENGINE',
  NEURAL_COMMAND = 'NEURAL_COMMAND',
  MARKET_INTEL = 'MARKET_INTEL',
  BRIDGE = 'BRIDGE',
  ASSETS = 'SHIPPABLE_ASSETS'
}
