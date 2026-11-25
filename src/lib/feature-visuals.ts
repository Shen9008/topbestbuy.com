/** Premium feature illustration basenames (`public/icons/premium/<id>.svg`). */

export const VALUE_VISUAL_IDS = {
  pick: 'value-pick',
  tradeoffs: 'value-tradeoffs',
  malaysia: 'value-malaysia',
} as const;

export type ValueVisualId = keyof typeof VALUE_VISUAL_IDS;

export const TRUST_VISUAL_IDS = {
  'no-paid': 'trust-no-paid',
  dated: 'trust-dated',
  scorecard: 'trust-scorecard',
  log: 'trust-log',
} as const;

export type TrustVisualId = keyof typeof TRUST_VISUAL_IDS;

export const TOOL_VISUAL_IDS = {
  finder: 'tool-finder',
  vacuum: 'tool-vacuum',
  cleanser: 'tool-cleanser',
  purifier: 'tool-purifier',
  airfryer: 'tool-airfryer',
  cost: 'tool-cost',
  mattress: 'tool-mattress',
} as const;

export type ToolVisualId = keyof typeof TOOL_VISUAL_IDS;