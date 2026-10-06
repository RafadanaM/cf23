import { memo } from 'react';
import { Circle } from '@/domain/circle/types';

interface CircleCodeTextProps {
  circle: Circle;
  isActive?: boolean;
  offsetX?: number;
  offsetY?: number;
}

function CircleCodeText({
  circle,
  isActive,
  offsetX = 0,
  offsetY = 0
}: CircleCodeTextProps) {
  const x = offsetX + circle.rect.x + circle.rect.width / 2;
  const y = offsetY + circle.rect.y + circle.rect.height / 2;

  let lines = circle.code.split('/');

  if (
    circle.rect.direction === 'HORIZONTAL' &&
    lines.length === 1 &&
    lines[0] &&
    circle.circleType === '1_SPACE'
  ) {
    lines = lines[0].split('-');
    lines.splice(1, 0, '-');
  }

  return (
    <text
      dominantBaseline="middle"
      textAnchor="middle"
      x={x}
      y={y}
      fontSize={9}
      fill={isActive ? 'white' : 'black'}
      className="font-medium"
    >
      {lines.map((line, idx) => (
        <tspan key={line} x={getDx(circle, lines, x, idx)} dy={getDy(circle, lines, idx)}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export default memo(CircleCodeText);

function getDx(circle: Circle, lines: string[], baseX: number, idx: number) {
  if (
    circle.circleType === 'BOOTH_B' &&
    lines.length === 2 &&
    circle.rect.direction === 'HORIZONTAL'
  ) {
    return baseX + (idx === 0 ? 20 : -20);
  }

  if (
    circle.circleType === '4_SPACE' &&
    lines.length === 2 &&
    circle.rect.direction === 'HORIZONTAL'
  ) {
    return baseX + (idx === 0 ? 20 : -20);
  }

  return baseX;
}

function getDy(circle: Circle, lines: string[], idx: number) {
  try {
    return tryBetterDy(circle, lines, idx);
  } catch {
    return fallbackDy(lines, idx);
  }
}

function fallbackDy(lines: string[], idx: number) {
  if (idx === 0) return `-${(lines.length - 1) * 0.5}em`;

  if (lines.length === 3) return `0.9em`;

  return `1.6em`;
}

function tryBetterDy(circle: Circle, lines: string[], idx: number) {
  if (
    circle.circleType === '4_SPACE' &&
    lines.length === 2 &&
    circle.rect.direction === 'VERTICAL'
  ) {
    const startNumber = Number(lines[0]!.substring(2, 4));

    const isUpwards = startNumber > 0 && startNumber <= 30;

    const dy = (idx === 0 ? 22 : -22 * (idx + 1)) * (isUpwards ? 1 : -1);

    return `${dy}px`;
  }

  if (
    (circle.circleType === 'BOOTH_B' || circle.circleType === '4_SPACE') &&
    lines.length === 2 &&
    circle.rect.direction === 'HORIZONTAL'
  ) {
    return 0;
  }

  if (
    circle.circleType === 'BOOTH_B' &&
    lines.length === 2 &&
    circle.rect.direction === 'VERTICAL'
  ) {
    const startNumber = Number(lines[0]!.substring(3, 5));

    const isUpwards = startNumber > 0 && startNumber <= 26;

    const dy = (idx === 0 ? 22 : -22 * (idx + 1)) * (isUpwards ? 1 : -1);

    return `${dy}px`;
  }

  return fallbackDy(lines, idx);
}
