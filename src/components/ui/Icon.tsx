import { createElement } from 'preact';
import {
  DEFAULT_STROKE_WIDTH,
  getIconNodes,
  type IconName,
} from '../../icons';

export type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  class?: string;
  decorative?: boolean;
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
  size = 24,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  class: className,
  decorative = true,
}: IconProps) {
  const nodes = getIconNodes(name);
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
      class={['tb-icon', className].filter(Boolean).join(' ')}
      aria-hidden={decorative ? true : undefined}
    >
      {nodes.map(([tag, attrs], i) =>
        SVG_TAGS.has(tag)
          ? createElement(tag, { ...attrs, key: i })
          : null,
      )}
    </svg>
  );
}