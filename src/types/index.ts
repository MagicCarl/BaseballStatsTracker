export interface Team {
  id: string;
  name: string;
  sport: string;
  level: string;
  defaultInnings: number;
  logoUrl: string | null;
  organizationId: string;
  _count?: {
    players: number;
    games: number;
  };
}

export interface Player {
  id: string;
  teamId: string;
  firstName: string;
  lastName: string;
  jerseyNumber: number | null;
  bats: string;
  throwsHand: string;
  primaryPosition: string | null;
  secondaryPosition: string | null;
  isActive: boolean;
}

export interface Game {
  id: string;
  teamId: string;
  seasonId: string | null;
  opponentName: string;
  gameDate: string;
  gameTime: string | null;
  location: string | null;
  isHome: boolean;
  inningsCount: number;
  status: string;
  ourScore: number;
  opponentScore: number;
  currentInning: number;
  isTopOfInning: boolean;
  outsInCurrentInning: number;
  notes: string | null;
}

export interface Season {
  id: string;
  teamId: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

export interface AtBatRecord {
  id: string;
  gameId: string;
  playerId: string | null;
  opponentBatterId: string | null;
  opponentPitcherId: string | null;
  inning: number;
  isTop: boolean;
  atBatNumberInGame: number;
  result: string;
  rbi: number;
  runsScored: number;
  runnerMoves?: unknown;
  lineupSpot?: number | null;
  runnerScored: boolean;
  stolenBases: number;
  caughtStealing: number;
  hitLocationX: number | null;
  hitLocationY: number | null;
  notes: string | null;
  player?: Player;
  opponentBatter?: OpponentBatterRecord | null;
  opponentPitcher?: OpponentPitcherRecord | null;
  pitches?: PitchRecord[];
}

export interface OpponentPitcherRecord {
  id: string;
  gameId: string;
  name: string;
  throwsHand: string;
  orderInGame: number;
}

export interface LineupEntryRecord {
  id: string;
  gameId: string;
  playerId: string;
  battingOrder: number;
  position: string;
  isStarter: boolean;
  player?: Player;
}

export interface OpponentBatterRecord {
  id: string;
  gameId: string;
  name: string;
  jerseyNumber: number | null;
  bats: string;
  orderInGame: number;
}

export interface PitchRecord {
  id: string;
  atBatId: string;
  pitchNumber: number;
  result: string;
  locationX: number | null;
  locationY: number | null;
}
