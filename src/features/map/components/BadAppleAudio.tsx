import { useBadApple } from '../contexts/BadAppleProvider';

function BadAppleAudio() {
  const { show, registerAudio } = useBadApple();

  if (!show) return null;

  return (
    <audio
      ref={registerAudio}
      autoPlay={false}
      className="hidden"
      src="/bad_apple.webm"
    />
  );
}

export default BadAppleAudio;
