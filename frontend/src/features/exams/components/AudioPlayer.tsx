import { useRef, useState } from "react";

export default function AudioPlayer({
  audioUrl,
  playOnce,
}: {
  audioUrl: string;
  playOnce: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Audio Player</h3>
      <audio
        ref={audioRef}
        src={audioUrl}
        controls
        className="w-full"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => playOnce && setIsPlaying(false)}
      />
      {playOnce && isPlaying && (
        <p className="text-sm text-amber-600 mt-3">
          Note: Audio plays once only (like real test)
        </p>
      )}
    </div>
  );
}
