/**
 * Site icon registry — Lucide stroke icons, 24×24 grid, tree-shaken imports only.
 */
import type { IconNode } from 'lucide';
import {
  ArrowUp,
  BedDouble,
  Bookmark,
  BookmarkCheck,
  BrushCleaning,
  Calculator,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Droplets,
  Flame,
  GitCompare,
  Heart,
  House,
  LayoutGrid,
  Moon,
  Search,
  Sun,
  Wind,
  Wrench,
  X,
} from 'lucide';

export const ICONS = {
  home: House,
  search: Search,
  grid: LayoutGrid,
  bookmark: Bookmark,
  'bookmark-check': BookmarkCheck,
  tools: Wrench,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  heart: Heart,
  sun: Sun,
  moon: Moon,
  x: X,
  'arrow-up': ArrowUp,
  compare: GitCompare,
  'tool-finder': Compass,
  'tool-vacuum': BrushCleaning,
  'tool-cleanser': Droplets,
  'tool-airfryer': Flame,
  'tool-purifier': Wind,
  'tool-cost': Calculator,
  'tool-mattress': BedDouble,
} as const;

export type IconName = keyof typeof ICONS;

export const DEFAULT_STROKE_WIDTH = 1.75;

export function getIconNodes(name: IconName): IconNode {
  return ICONS[name];
}

/** Mobile tab / rail keys → registry names */
export const NAV_ICON_NAMES = {
  home: 'home',
  search: 'search',
  grid: 'grid',
  bookmark: 'bookmark',
  tools: 'tools',
} as const satisfies Record<string, IconName>;

export const TOOL_TAB_ICONS: Record<string, IconName> = {
  finder: 'tool-finder',
  vacuum: 'tool-vacuum',
  cleanser: 'tool-cleanser',
  airfryer: 'tool-airfryer',
  purifier: 'tool-purifier',
  cost: 'tool-cost',
  mattress: 'tool-mattress',
};