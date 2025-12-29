
export interface BetData {
  id: string;
  timestamp: string;
  event: string;
  odds: number;
  marketName: string;
  status: 'LIVE' | 'UPCOMING' | 'CLOSED';
  type: string;
  groundingSource?: string;
  isBookmarked?: boolean;
}

export enum Tab {
  MARKETS = 'MARKETS',
  SCRIPTS = 'SCRIPTS',
  SETTINGS = 'SETTINGS',
  PITCH = 'PITCH',
  DOCS = 'DOCS',
  SAFETY = 'SAFETY',
  CALENDAR = 'CALENDAR'
}

export enum EngineMode {
  LIVE = 'LIVE_SCOUT',
  LOCAL = 'LOCAL_COHORT'
}

export interface FilterState {
  minOdds: number;
  maxOdds: number;
  sports: string[];
}

export interface SafetySettings {
  sessionWarnings: boolean;
  warningInterval: number;
  maxSessionTime: number;
  engineMode: EngineMode;
}
