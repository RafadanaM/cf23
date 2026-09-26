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
    (circle.rect.type === 'VERTICAL' || circle.rect.type === 'A_Z_HORIZONTAL') &&
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
        <tspan
          key={line}
          x={x}
          dy={
            idx === 0
              ? `-${(lines.length - 1) * 0.5}em`
              : lines.length === 3
                ? '0.9em'
                : '1.6em'
          }
        >
          {line}
        </tspan>
      ))}
    </text>
  );
}

export default memo(CircleCodeText);
