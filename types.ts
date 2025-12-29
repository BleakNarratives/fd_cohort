
export interface BetData {
  id: string;
  timestamp: string;
  event: string;
  odds: number;
  stake: number;
  potentialReturn: number;
  status: 'WON' | 'LOST' | 'PENDING' | 'SECURE_TRANSIT';
  type: string;
}

export interface AnalyticsSummary {
  totalStake: number;
  totalReturn: number;
  winRate: number;
  profit: number;
  roi: number;
}

export interface SessionSettings {
  maxSessionMinutes: number;
  stopLossLimit: number;
  alertsEnabled: boolean;
  stealthMode: boolean;
  voiceActive: boolean;
}

export enum Tab {
  DASHBOARD = 'DASHBOARD',
  TERMINAL = 'TERMINAL',
  DEPLOYMENT = 'DEPLOYMENT',
  SETTINGS = 'SETTINGS',
  VAULT = 'VAULT'
}

export interface SecurityEvent {
  id: string;
  type: 'ENCRYPTION' | 'SYNC' | 'WIPE' | 'ACCESS';
  timestamp: string;
  status: 'SUCCESS' | 'WARNING';
}
