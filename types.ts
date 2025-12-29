
export interface BetData {
  id: string;
  timestamp: string;
  event: string;
  odds: number;
  marketName: string;
  status: 'LIVE' | 'UPCOMING' | 'CLOSED';
  type: string;
  groundingSource?: string;
}

export enum Tab {
  MARKETS = 'MARKETS',
  STRATEGY = 'STRATEGY',
  SCRIPTS = 'SCRIPTS',
  ACCURACY = 'ACCURACY',
  SETTINGS = 'SETTINGS',
  RESPONSIBLE_PLAY = 'RESPONSIBLE_PLAY'
}

export interface SafetySettings {
  sessionWarnings: boolean;
  warningInterval: number; // in minutes
  maxSessionTime: number; // in minutes
}
