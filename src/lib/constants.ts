export const POSITIONS = [
  "P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH", "EH",
] as const;

export const AT_BAT_RESULTS = {
  hits: ["single", "double", "triple", "home_run", "ground_rule_double"] as const,
  walks: ["walk", "hbp", "ibb", "catchers_interference"] as const,
  outs: [
    "strikeout_swinging", "strikeout_looking",
    "groundout", "flyout", "lineout", "popout",
    "fielders_choice", "double_play", "triple_play",
    "sacrifice_fly", "sacrifice_bunt",
  ] as const,
  errors: ["error"] as const,
};

export const ALL_RESULTS = [
  ...AT_BAT_RESULTS.hits,
  ...AT_BAT_RESULTS.walks,
  ...AT_BAT_RESULTS.outs,
  ...AT_BAT_RESULTS.errors,
] as const;

export const RESULT_LABELS: Record<string, string> = {
  single: "1B",
  double: "2B",
  triple: "3B",
  home_run: "HR",
  ground_rule_double: "GRD",
  walk: "BB",
  hbp: "HBP",
  ibb: "IBB",
  strikeout_swinging: "K",
  strikeout_looking: "KL",
  groundout: "GO",
  flyout: "FO",
  lineout: "LO",
  popout: "PO",
  fielders_choice: "FC",
  double_play: "DP",
  triple_play: "TP",
  sacrifice_fly: "SF",
  sacrifice_bunt: "SAC",
  error: "E",
  catchers_interference: "CI",
};

export const RESULT_FULL_NAMES: Record<string, string> = {
  single: "Single",
  double: "Double",
  triple: "Triple",
  home_run: "Home Run",
  ground_rule_double: "Ground Rule Double",
  walk: "Base on Balls",
  hbp: "Hit By Pitch",
  ibb: "Intentional Walk",
  strikeout_swinging: "Strikeout (Swinging)",
  strikeout_looking: "Strikeout (Looking)",
  groundout: "Ground Out",
  flyout: "Fly Out",
  lineout: "Line Out",
  popout: "Pop Out",
  fielders_choice: "Fielder's Choice",
  double_play: "Double Play",
  triple_play: "Triple Play",
  sacrifice_fly: "Sacrifice Fly",
  sacrifice_bunt: "Sacrifice Bunt",
  error: "Error",
  catchers_interference: "Catcher's Interference",
};

export const RESULT_COLORS: Record<string, string> = {
  single: "#22c55e",
  double: "#3b82f6",
  triple: "#f97316",
  home_run: "#ef4444",
  ground_rule_double: "#3b82f6",
  walk: "#a855f7",
  hbp: "#a855f7",
  ibb: "#a855f7",
  groundout: "#6b7280",
  flyout: "#6b7280",
  lineout: "#6b7280",
  popout: "#6b7280",
  strikeout_swinging: "#6b7280",
  strikeout_looking: "#6b7280",
  fielders_choice: "#6b7280",
  double_play: "#6b7280",
  triple_play: "#6b7280",
  sacrifice_fly: "#6b7280",
  sacrifice_bunt: "#6b7280",
  error: "#eab308",
  catchers_interference: "#a855f7",
};

export const BASE_PLAY_LABELS: Record<string, string> = {
  stolen_base: "Stolen Base",
  caught_stealing: "Caught Stealing",
  wild_pitch: "Wild Pitch",
  passed_ball: "Passed Ball",
  balk: "Balk",
  picked_off: "Picked Off",
  other: "Other",
  end_half: "Half-inning ended",
};

export const LEVELS = [
  { value: "little_league", label: "Little League" },
  { value: "travel", label: "Travel Ball" },
  { value: "rec", label: "Recreational" },
  { value: "high_school", label: "High School" },
  { value: "college", label: "College" },
] as const;

export const SPORTS = ["baseball", "softball"] as const;

export const GAME_LENGTHS = [3, 4, 5, 6, 7, 8, 9] as const;

// Typical regulation game length, used to pre-fill a new team's setting.
// Coaches can change it, since leagues vary (e.g. 12U travel often plays 6).
export function suggestedInnings(sport: string, level: string): number {
  if (sport === "softball") return 7;
  if (level === "college") return 9;
  if (level === "high_school" || level === "travel") return 7;
  return 6;
}

export const PITCH_RESULTS = [
  "called_strike",
  "swinging_strike",
  "foul",
  "ball",
  "in_play",
  "hit_by_pitch",
] as const;

export const PITCH_RESULT_LABELS: Record<string, string> = {
  called_strike: "Called Strike",
  swinging_strike: "Swinging Strike",
  foul: "Foul",
  ball: "Ball",
  in_play: "In Play",
  hit_by_pitch: "HBP",
};

export const PITCH_RESULT_SHORT: Record<string, string> = {
  called_strike: "CS",
  swinging_strike: "SS",
  foul: "F",
  ball: "B",
  in_play: "IP",
  hit_by_pitch: "HBP",
};

export const PITCH_RESULT_COLORS: Record<string, string> = {
  called_strike: "#ef4444",
  swinging_strike: "#dc2626",
  foul: "#f97316",
  ball: "#3b82f6",
  in_play: "#22c55e",
  hit_by_pitch: "#a855f7",
};

export const PURCHASE_PRICE = 39;
export const PURCHASE_TYPE = "one-time";
