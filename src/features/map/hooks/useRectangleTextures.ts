import { useApplication } from '@pixi/react';
import { Graphics, Texture } from 'pixi.js';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';

import { useCircle } from '@/domain/circle/contexts/CircleProvider';

function createKey(width: number, height: number) {
  return `${width}-${height}`;
}

interface Config {
  isActive?: boolean;
  isBookmarked?: boolean;
}

function useRectangleTextures(config?: Config) {
  const { app } = useApplication();

  const { circles } = useCircle();

  const [textures, setTextures] = useState<Map<string, Texture>>(new Map());

  const isActive = config?.isActive ?? false;
  const isBookmarked = config?.isBookmarked ?? false;

  const getTexture = useCallback(
    (width: number, height: number) => {
      return textures.get(createKey(width, height));
    },
    [textures]
  );

  useEffect(() => {
    const colorConfig = getColorConfig(isActive, isBookmarked);

    const fillColor = colorConfig.backgroundColor;
    const fillAlpha = isActive || isBookmarked ? 1 : 0.25;
    const strokeColor = colorConfig.borderColor;

    const textureVariants = new Map<string, Texture>();

    for (const circle of circles) {
      const key = createKey(circle.rect.width, circle.rect.height);

      if (textureVariants.has(key)) {
        continue;
      }

      const graphic = new Graphics()
        .rect(0, 0, circle.rect.width, circle.rect.height)
        .fill({ color: fillColor, alpha: fillAlpha })
        .stroke({ width: 1, color: strokeColor });

      const texture = app.renderer.textureGenerator.generateTexture({
        target: graphic,
        antialias: true
      });

      textureVariants.set(key, texture);
    }

    startTransition(() => {
      setTextures(textureVariants);
    });

    return () => {
      textureVariants.forEach((texture) => texture.destroy());
    };
  }, [isActive, isBookmarked, circles, app.renderer.textureGenerator]);

  return useMemo(
    () => ({
      getTexture,
      isReady: textures.size
    }),
    [getTexture, textures]
  );
}

export default useRectangleTextures;

function getColorConfig(isActive: boolean, isBookmarked: boolean) {
  if (isActive) {
    return {
      backgroundColor: '#214da9',
      borderColor: '#003b84',
      backgroundColorHover: '#214da9'
    };
  }

  if (isBookmarked) {
    return {
      backgroundColor: '#4061a8',
      borderColor: '#214da9',
      backgroundColorHover: '#214da9'
    };
  }

  return {
    backgroundColor: '#ccd8eb',
    borderColor: '#729fe8',
    backgroundColorHover: '#a1bbe3'
  };
}
