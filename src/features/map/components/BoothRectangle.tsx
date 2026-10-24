import { Text, Texture } from 'pixi.js';
import { startTransition, useState } from 'react';

import { Circle } from '@/domain/circle/types';
import { useActiveCircleAction } from '@/features/map/contexts/ActiveCircleProvider';
import { APP_DRAWER_ID } from '@/layout/drawers/constants';
import { useAppDrawer } from '@/layout/drawers/useAppDrawer';

import { useMapRegistry } from '../contexts/MapProvider';

interface BoothRectangleProps {
  circle: Circle;
  texture: Texture;
  isActive?: boolean;
  isBookmarked?: boolean;
  registerTextRef?: (node: Text | null) => void;
}

function BoothRectangle({
  circle,
  texture,
  isActive = false,
  isBookmarked = false,

  registerTextRef
}: BoothRectangleProps) {
  const [hover, setHover] = useState(false);
  const { openDrawer } = useAppDrawer();
  const { setActiveCircleId } = useActiveCircleAction();
  const colorConfig = getColorConfig(isActive, isBookmarked);
  const { map } = useMapRegistry();

  function handleClick() {
    setActiveCircleId(circle.id);
    startTransition(() => {
      openDrawer(APP_DRAWER_ID.CIRCLE_DETAIL, {
        circle,
        hideOverlay: true,
        onClose: () => {
          setActiveCircleId('');
        }
      });
    });
  }

  return (
    <pixiContainer
      x={circle.rect.x}
      y={circle.rect.y}
      eventMode="static"
      onPointerTap={() => {
        if (map.current?.moving) return;
        handleClick();
      }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      cursor="pointer"
      cullable
    >
      <pixiSprite texture={texture} tint={hover ? colorConfig : undefined} />
      <BoothText
        circle={circle}
        isActive={isActive || isBookmarked}
        registerTextRef={registerTextRef}
      />
    </pixiContainer>
  );
}

export default BoothRectangle;

interface BoothTextProps {
  circle: Circle;
  isActive: boolean;
  registerTextRef?: (node: Text | null) => void;
}

function BoothText({ circle, isActive, registerTextRef }: BoothTextProps) {
  return splitCode(circle).map(({ text, x, y }) => (
    <pixiText
      ref={registerTextRef}
      eventMode="none"
      key={text}
      text={text}
      x={x}
      y={y}
      anchor={0.5}
      scale={0.25}
      style={{
        fontSize: 40,
        fill: isActive ? '#FFFFFF' : '#000000'
      }}
    />
  ));
}

function splitCode(circle: Circle): { x: number; y: number; text: string }[] {
  const codes = circle.code.split('/');

  if (
    circle.rect.direction === 'HORIZONTAL' &&
    codes.length === 1 &&
    circle.circleType === '1_SPACE'
  ) {
    const lines = codes[0]!.split('-');
    lines.splice(1, 0, '-');
    return lines.map((code, idx) => ({
      x: circle.rect.width / 2,
      y: circle.rect.height * getFraction(idx, lines.length, 0.7),
      text: code
    }));
  }

  if (circle.rect.direction === 'VERTICAL' && codes.length > 1) {
    return codes.map((code, idx) => ({
      x: circle.rect.width / 2,
      y: circle.rect.height * getFraction(idx, codes.length),
      text: code
    }));
  }

  if (circle.rect.direction === 'HORIZONTAL' && codes.length > 1) {
    return codes.map((code, idx) => ({
      x: circle.rect.width * getFraction(idx, codes.length),
      y: circle.rect.height / 2,
      text: code
    }));
  }

  return [
    {
      x: circle.rect.width / 2,
      y: circle.rect.height / 2,
      text: circle.code
    }
  ];
}

function getFraction(idx: number, total: number, offset = 1) {
  const center = 0.5;

  const standard = (2 * idx + 1) / (2 * total);

  return center + (standard - center) * offset;
}

function getColorConfig(isActive: boolean, isBookmarked: boolean) {
  if (isActive) {
    return '#003b84';
  }

  if (isBookmarked) {
    return '#214da9';
  }

  return '#729fe8';
}
