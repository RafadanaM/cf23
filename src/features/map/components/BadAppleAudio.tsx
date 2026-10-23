import { useEffect, useRef } from 'react';

import { useBadApple } from '../contexts/BadAppleProvider';

function BadAppleAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { play, show } = useBadApple();

  useEffect(() => {
    const audio = audioRef.current;
    if (play) {
      audio?.play();
    } else {
      audio?.pause();
    }

    return () => {
      audio?.pause();
    };
  }, [play]);

  if (!show) return null;

  return (
    <audio ref={audioRef} autoPlay={false} className="hidden" src="/bad_apple.webm" />
  );
}

export default BadAppleAudio;
