/**
 * Semantic icon keys → Lucide glyphs and default presentation metadata.
 * @see docs/ICONS.md
 */
export const ICON_SIZES = [16, 20, 24, 32, 48] as const;
export type IconSize = (typeof ICON_SIZES)[number];

export const DEFAULT_STROKE_WIDTH = 1.5;

export type LucideGlyph =
  | 'ArrowUp'
  | 'Award'
  | 'BadgePercent'
  | 'Ban'
  | 'BedDouble'
  | 'Bookmark'
  | 'BookmarkCheck'
  | 'BookmarkX'
  | 'BrushCleaning'
  | 'Calculator'
  | 'CalendarClock'
  | 'ChartNoAxesColumnIncreasing'
  | 'ChefHat'
  | 'ChevronDown'
  | 'ChevronLeft'
  | 'ChevronRight'
  | 'CircleAlert'
  | 'CircleCheck'
  | 'CircleMinus'
  | 'CirclePlus'
  | 'ClipboardList'
  | 'Compass'
  | 'Droplets'
  | 'ExternalLink'
  | 'FileWarning'
  | 'Flame'
  | 'Footprints'
  | 'Gauge'
  | 'GitCompare'
  | 'Headphones'
  | 'History'
  | 'House'
  | 'Info'
  | 'Laptop'
  | 'LayoutGrid'
  | 'Leaf'
  | 'Link'
  | 'LoaderCircle'
  | 'Lock'
  | 'Mail'
  | 'Moon'
  | 'Newspaper'
  | 'Package'
  | 'Puzzle'
  | 'Refrigerator'
  | 'Scale'
  | 'ScrollText'
  | 'Search'
  | 'SearchX'
  | 'ShieldCheck'
  | 'Smartphone'
  | 'Sparkles'
  | 'Sun'
  | 'TriangleAlert'
  | 'Trophy'
  | 'Tv'
  | 'Users'
  | 'WashingMachine'
  | 'Watch'
  | 'Wind'
  | 'Wrench'
  | 'X';

export type IconMapMeta = {
  lucide: LucideGlyph;
  defaultSize?: IconSize;
};

export const ICON_MAP = {
  'nav.home': { lucide: 'House', defaultSize: 24 },
  'nav.search': { lucide: 'Search', defaultSize: 20 },
  'nav.categories': { lucide: 'LayoutGrid', defaultSize: 24 },
  'nav.saved': { lucide: 'Bookmark', defaultSize: 24 },
  'nav.tools': { lucide: 'Wrench', defaultSize: 24 },
  'nav.mega-chevron': { lucide: 'ChevronDown', defaultSize: 16 },
  'nav.chevron-right': { lucide: 'ChevronRight', defaultSize: 20 },
  'nav.back-to-top': { lucide: 'ArrowUp', defaultSize: 20 },

  'tab.home': { lucide: 'House', defaultSize: 24 },
  'tab.search': { lucide: 'Search', defaultSize: 24 },
  'tab.browse': { lucide: 'LayoutGrid', defaultSize: 24 },
  'tab.saved': { lucide: 'Bookmark', defaultSize: 24 },
  'tab.tools': { lucide: 'Wrench', defaultSize: 24 },

  'list.air-fryers': { lucide: 'Flame', defaultSize: 24 },
  'list.air-purifiers': { lucide: 'Wind', defaultSize: 24 },
  'list.mattress': { lucide: 'BedDouble', defaultSize: 24 },
  'list.vacuum': { lucide: 'BrushCleaning', defaultSize: 24 },
  'list.earbuds': { lucide: 'Headphones', defaultSize: 24 },
  'list.cleansers': { lucide: 'Droplets', defaultSize: 24 },
  'list.washing-machines': { lucide: 'WashingMachine', defaultSize: 24 },
  'list.laptops': { lucide: 'Laptop', defaultSize: 24 },
  'list.smart-watches': { lucide: 'Watch', defaultSize: 24 },
  'list.smart-tvs': { lucide: 'Tv', defaultSize: 24 },
  'list.running-shoes': { lucide: 'Footprints', defaultSize: 24 },

  'category.kitchen': { lucide: 'ChefHat', defaultSize: 32 },
  'category.air': { lucide: 'Wind', defaultSize: 32 },
  'category.sleep': { lucide: 'Moon', defaultSize: 32 },
  'category.appliances': { lucide: 'Refrigerator', defaultSize: 32 },
  'category.audio': { lucide: 'Headphones', defaultSize: 32 },
  'category.computing': { lucide: 'Laptop', defaultSize: 32 },
  'category.phones': { lucide: 'Smartphone', defaultSize: 32 },
  'category.tv': { lucide: 'Tv', defaultSize: 32 },
  'category.beauty': { lucide: 'Sparkles', defaultSize: 32 },
  'category.fitness': { lucide: 'Footprints', defaultSize: 32 },
  'category.all': { lucide: 'LayoutGrid', defaultSize: 24 },

  'score.perf': { lucide: 'Gauge', defaultSize: 20 },
  'score.value': { lucide: 'BadgePercent', defaultSize: 20 },
  'score.rel': { lucide: 'ShieldCheck', defaultSize: 20 },
  'score.feat': { lucide: 'Puzzle', defaultSize: 20 },
  'score.warr': { lucide: 'Award', defaultSize: 20 },
  'score.avail': { lucide: 'Package', defaultSize: 20 },
  'score.safe': { lucide: 'Leaf', defaultSize: 20 },
  'score.total': { lucide: 'ChartNoAxesColumnIncreasing', defaultSize: 20 },

  'trust.about': { lucide: 'Info', defaultSize: 32 },
  'trust.editorial': { lucide: 'Newspaper', defaultSize: 32 },
  'trust.affiliate': { lucide: 'Link', defaultSize: 32 },
  'trust.team': { lucide: 'Users', defaultSize: 32 },
  'trust.corrections': { lucide: 'FileWarning', defaultSize: 32 },
  'trust.contact': { lucide: 'Mail', defaultSize: 32 },
  'trust.privacy': { lucide: 'Lock', defaultSize: 32 },
  'trust.terms': { lucide: 'Scale', defaultSize: 32 },
  'trust.methodology': { lucide: 'ClipboardList', defaultSize: 32 },
  'trust.no-paid': { lucide: 'Ban', defaultSize: 32 },
  'trust.dated': { lucide: 'CalendarClock', defaultSize: 32 },
  'trust.scorecard': { lucide: 'ScrollText', defaultSize: 32 },
  'trust.log': { lucide: 'History', defaultSize: 32 },

  'product.save': { lucide: 'Bookmark', defaultSize: 16 },
  'product.saved': { lucide: 'BookmarkCheck', defaultSize: 16 },
  'product.thin-evidence': { lucide: 'TriangleAlert', defaultSize: 16 },
  'product.pro': { lucide: 'CirclePlus', defaultSize: 16 },
  'product.con': { lucide: 'CircleMinus', defaultSize: 16 },
  'product.expand': { lucide: 'ChevronDown', defaultSize: 16 },
  'product.source': { lucide: 'ExternalLink', defaultSize: 16 },
  'product.compare': { lucide: 'GitCompare', defaultSize: 20 },
  'product.rank-gold': { lucide: 'Trophy', defaultSize: 20 },

  'tool.finder': { lucide: 'Compass', defaultSize: 16 },
  'tool.vacuum': { lucide: 'BrushCleaning', defaultSize: 16 },
  'tool.cleanser': { lucide: 'Droplets', defaultSize: 16 },
  'tool.airfryer': { lucide: 'Flame', defaultSize: 16 },
  'tool.purifier': { lucide: 'Wind', defaultSize: 16 },
  'tool.cost': { lucide: 'Calculator', defaultSize: 16 },
  'tool.mattress': { lucide: 'BedDouble', defaultSize: 16 },
  'tool.back': { lucide: 'ChevronLeft', defaultSize: 16 },
  'tool.compare': { lucide: 'GitCompare', defaultSize: 20 },

  'state.close': { lucide: 'X', defaultSize: 16 },
  'state.theme-light': { lucide: 'Sun', defaultSize: 20 },
  'state.theme-dark': { lucide: 'Moon', defaultSize: 20 },
  'state.loading': { lucide: 'LoaderCircle', defaultSize: 20 },
  'state.empty-saved': { lucide: 'BookmarkX', defaultSize: 32 },
  'state.empty-search': { lucide: 'SearchX', defaultSize: 32 },
  'state.error': { lucide: 'CircleAlert', defaultSize: 20 },
  'state.success': { lucide: 'CircleCheck', defaultSize: 20 },
  'state.external': { lucide: 'ExternalLink', defaultSize: 16 },
} as const satisfies Record<string, IconMapMeta>;

export type IconMapKey = keyof typeof ICON_MAP;

/** Launch list slug → icon-map key */
export const LIST_SLUG_ICONS: Record<string, IconMapKey> = {
  'best-air-fryers-malaysia': 'list.air-fryers',
  'best-air-purifiers-malaysia': 'list.air-purifiers',
  'best-mattress-malaysia': 'list.mattress',
  'best-vacuum-cleaners-malaysia': 'list.vacuum',
  'best-wireless-earbuds-malaysia': 'list.earbuds',
  'best-facial-cleansers-malaysia': 'list.cleansers',
  'best-washing-machines-malaysia': 'list.washing-machines',
  'best-laptops-for-students-malaysia': 'list.laptops',
  'best-smart-watches-malaysia': 'list.smart-watches',
  'best-smart-tvs-malaysia': 'list.smart-tvs',
  'best-running-shoes-malaysia': 'list.running-shoes',
};

/** Category hub id → icon-map key */
export const CATEGORY_ICONS: Record<string, IconMapKey> = {
  kitchen: 'category.kitchen',
  air: 'category.air',
  sleep: 'category.sleep',
  appliances: 'category.appliances',
  audio: 'category.audio',
  computing: 'category.computing',
  phones: 'category.phones',
  tv: 'category.tv',
  beauty: 'category.beauty',
  fitness: 'category.fitness',
};

/** Scorecard criterion id (CRIT[0]) → icon-map key */
export const SCORE_CRIT_ICONS: Record<string, IconMapKey> = {
  perf: 'score.perf',
  value: 'score.value',
  rel: 'score.rel',
  feat: 'score.feat',
  warr: 'score.warr',
  avail: 'score.avail',
  safe: 'score.safe',
};

/** Trust footer route → icon-map key */
export const TRUST_ROUTE_ICONS: Record<string, IconMapKey> = {
  '/about': 'trust.about',
  '/editorial-policy': 'trust.editorial',
  '/affiliate-disclosure': 'trust.affiliate',
  '/team': 'trust.team',
  '/corrections': 'trust.corrections',
  '/contact': 'trust.contact',
  '/privacy': 'trust.privacy',
  '/terms': 'trust.terms',
  '/how-we-rank': 'trust.methodology',
};

/** Mobile tab `icon` field from routes → icon-map key */
export const MOBILE_TAB_ICONS: Record<string, IconMapKey> = {
  home: 'tab.home',
  search: 'tab.search',
  grid: 'tab.browse',
  bookmark: 'tab.saved',
  tools: 'tab.tools',
};

/** Tools hub tab id → icon-map key */
export const TOOL_TAB_ICONS: Record<string, IconMapKey> = {
  finder: 'tool.finder',
  vacuum: 'tool.vacuum',
  cleanser: 'tool.cleanser',
  airfryer: 'tool.airfryer',
  purifier: 'tool.purifier',
  cost: 'tool.cost',
  mattress: 'tool.mattress',
};

export const ICON_MAP_KEYS = Object.keys(ICON_MAP) as IconMapKey[];