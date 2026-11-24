import { createElement } from 'preact';
import {
  DEFAULT_STROKE_WIDTH,
  getIconNodes,
  defaultIconSize,
  ICON_SIZES,
  type IconMapKey,
  type IconSize,
} from '../../icons';

export type IconProps = {
  name: IconMapKey;
  size?: IconSize;
  strokeWidth?: number;
  class?: string;
  decorative?: boolean;
  label?: string;
  spin?: boolean;
};

const SVG_TAGS = new Set([
  'circle',
  'ellipse',
  'line',
  'path',
  'polygon',
  'polyline',
  'rect',
]);

export default function Icon({
  name,
  size = defaultIconSize(name) as IconSize,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  class: className,
  decorative = true,
  label,
  spin = false,
}: IconProps) {
  if (!decorative && !label) {
    throw new Error(`Icon "${name}" with decorative={false} requires a label.`);
  }
  if (size !== undefined && !(ICON_SIZES as readonly number[]).includes(size)) {
    throw new Error(`Icon size must be one of ${ICON_SIZES.join(', ')}.`);
  }

  const nodes = getIconNodes(name);
  const isLoader = name === 'state.loading';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-linejoin="round"
      class={[
        'tb-icon',
        spin || isLoader ? 'tb-icon-spin' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
    >
      {nodes.map(([tag, attrs], i) =>
        SVG_TAGS.has(tag)
          ? createElement(tag, { ...attrs, key: i })
          : null,
      )}
    </svg>
  );
}