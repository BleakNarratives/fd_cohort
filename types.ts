
export interface BetData {
  id: string;
  timestamp: string;
  event: string;
  odds: number;
  stake: number;
  potentialReturn: number;
  status: 'WON' | 'LOST' | 'PENDING';
  type: string;
}

export interface AnalyticsSummary {
  totalStake: number;
  totalReturn: number;
  winRate: number;
  profit: number;
  roi: number;
}

export interface ScriptOutput {
  scriptName: string;
  lastRun: string;
  status: 'SUCCESS' | 'ERROR' | 'IDLE';
  output: string;
}

export interface SessionSettings {
  maxSessionMinutes: number;
  stopLossLimit: number;
  alertsEnabled: boolean;
}

export enum Tab {
  DASHBOARD = 'DASHBOARD',
  ANALYTICS = 'ANALYTICS',
  COHORT_STRATEGY = 'COHORT_STRATEGY',
  TERMINAL = 'TERMINAL',
  DEPLOYMENT = 'DEPLOYMENT',
  SETTINGS = 'SETTINGS'
}
