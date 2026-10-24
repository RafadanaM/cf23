import { BitmapFont, BitmapText, Container, Sprite, Texture } from 'pixi.js';
import { startTransition, useCallback, useMemo, useState } from 'react';

import { Circle } from '@/domain/circle/types';
import { useActiveCircleAction } from '@/features/map/contexts/ActiveCircleProvider';
import { APP_DRAWER_ID } from '@/layout/drawers/constants';
import { useAppDrawer } from '@/layout/drawers/useAppDrawer';

import { useMapRegistry } from '../contexts/MapProvider';

BitmapFont.install({
  name: 'boothDefault',
  style: { fontFamily: 'Helvetica', fontSize: 80, fill: '#FFFFFF' },
  chars: [['A', 'Z'], ['0', '9'], '-_ '],
  resolution: 4
});

interface BoothRectangleProps {
  circle: Circle;
  texture: Texture;
  isActive?: boolean;
  isBookmarked?: boolean;
  registerTextRef?: (node: BitmapText | null) => void;
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

export function useBoothRectangle() {
  const { openDrawer } = useAppDrawer();
  const { setActiveCircleId } = useActiveCircleAction();
  const { map } = useMapRegistry();

  const createBoothRectangle = useCallback(
    ({
      texture,
      circle,
      registerTextRef,
      isActive = false,
      isBookmarked = false
    }: BoothRectangleProps) => {
      const mapInstance = map.current;
      const colorConfig = getColorConfig(isActive, isBookmarked);

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

      const sprite = new Sprite({
        texture
      });

      const texts = splitCode(circle).map(
        ({ text, x, y }) =>
          new BitmapText({
            eventMode: 'none',
            text,
            x,
            y,
            anchor: 0.5,
            scale: 0.25,
            style: {
              fontFamily: 'boothDefault',
              fontSize: 40
            }
          })
      );

      for (const text of texts) {
        text.tint = isActive || isBookmarked ? '#FFFFFF' : '#000000';
      }

      const container = new Container({
        eventMode: 'static',
        x: circle.rect.x,
        y: circle.rect.y,
        cursor: 'pointer'
      });

      container.on('pointertap', () => {
        if (mapInstance?.moving) return;
        handleClick();
      });

      container.on('pointerenter', () => {
        sprite.tint = colorConfig;
      });

      container.on('pointerleave', () => {
        sprite.tint = '#FFFFFF';
      });

      container.addChild(sprite, ...texts);

      for (const text of texts) {
        registerTextRef?.(text);
      }

      return container;
    },
    [openDrawer, setActiveCircleId, map]
  );

  return useMemo(() => ({ createBoothRectangle }), [createBoothRectangle]);
}

interface BoothTextProps {
  circle: Circle;
  isActive: boolean;
  registerTextRef?: (node: BitmapText | null) => void;
}

function BoothText({ circle, isActive, registerTextRef }: BoothTextProps) {
  return splitCode(circle).map(({ text, x, y }) => (
    <pixiBitmapText
      ref={registerTextRef}
      eventMode="none"
      key={text}
      text={text}
      x={x}
      y={y}
      anchor={0.5}
      scale={0.25}
      style={{
        fontFamily: 'boothDefault',
        fontSize: 40
      }}
      tint={isActive ? '#FFFFFF' : '#000000'}
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
