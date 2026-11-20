import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { StorybookTeddy } from '../StorybookTeddy';

interface SceneFiveVoiceProps {
  heading: string;
  subtitle: string;
  audioDataUrl: string | null;
  audioFileName: string | null;
}

const WAVE_HEIGHTS = [16, 26, 34, 22, 38, 28, 18, 36, 30, 20, 34, 24, 18, 32, 26, 16];

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function SceneFiveVoice({
  heading,
  subtitle,
  audioDataUrl,
  audioFileName,
}: SceneFiveVoiceProps) {
  const prefersReducedMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setAudioError(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [audioDataUrl]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !audioDataUrl) return;
    setAudioError(null);

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setAudioError('Tap play again to allow audio playback on your phone.');
        setIsPlaying(false);
      }
    }
  };

  const handleReplay = async () => {
    const audio = audioRef.current;
    if (!audio || !audioDataUrl) return;
    setAudioError(null);
    audio.currentTime = 0;
    setCurrentTime(0);
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextTime = Number(e.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <section className="relative py-20 sm:py-28 px-5 sm:px-8">
      <div className="w-full max-w-lg mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7 }}
        >
          <h2
            className="font-serif text-3xl sm:text-4xl text-[#4E382E] font-medium leading-tight mb-2.5"
            style={{ textWrap: 'balance' }}
          >
            {heading}
          </h2>
          <p className="text-base sm:text-lg text-[#715447] mb-8">{subtitle}</p>
        </motion.div>

        {/* Minimalist Intimate Player Card */}
        <motion.div
          className={`relative rounded-3xl bg-[#FFFDF9] border px-6 py-8 sm:px-9 sm:py-10 transition-shadow duration-500 ${
            isPlaying
              ? 'border-[#E9AEBB] shadow-[0_22px_54px_rgba(201,91,99,0.12)]'
              : 'border-[#715447]/15 shadow-[0_18px_46px_rgba(113,84,71,0.08)]'
          }`}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75 }}
        >
          {/* Soft ambient glow behind bear when playing */}
          {isPlaying && (
            <motion.div
              className="absolute inset-x-10 top-6 h-36 rounded-full bg-[#E9AEBB]/20 blur-2xl pointer-events-none"
              animate={prefersReducedMotion ? {} : { opacity: [0.4, 0.85, 0.4] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
          )}

          {/* Teddy Bear Wearing Headphones */}
          <div className="relative z-10 flex justify-center mb-4">
            <StorybookTeddy
              pose="headphones"
              isPlaying={isPlaying}
              className="w-36 h-36 sm:w-40 sm:h-40"
            />
          </div>

          {audioDataUrl ? (
            <div className="relative z-10">
              <audio
                ref={audioRef}
                src={audioDataUrl}
                preload="metadata"
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onError={() =>
                  setAudioError('This audio format could not be played. Try uploading an MP3 or M4A file.')
                }
              />

              {/* Animated Waveform */}
              <div
                className="flex items-center justify-center gap-1.5 h-11 mb-5 px-2"
                aria-hidden="true"
              >
                {WAVE_HEIGHTS.map((baseHeight, idx) => (
                  <motion.span
                    key={idx}
                    className="w-1.5 rounded-full bg-[#C95B63]"
                    style={{
                      opacity: isPlaying ? 0.85 : 0.3,
                      height: `${Math.round(baseHeight * 0.45)}px`,
                    }}
                    animate={
                      isPlaying && !prefersReducedMotion
                        ? {
                            height: [
                              `${Math.round(baseHeight * 0.4)}px`,
                              `${baseHeight}px`,
                              `${Math.round(baseHeight * 0.55)}px`,
                            ],
                          }
                        : { height: `${Math.round(baseHeight * 0.45)}px` }
                    }
                    transition={
                      isPlaying && !prefersReducedMotion
                        ? {
                            duration: 0.75 + (idx % 4) * 0.14,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'easeInOut',
                            delay: idx * 0.05,
                          }
                        : { duration: 0.3 }
                    }
                  />
                ))}
              </div>

              {/* Scrubber Progress Bar */}
              <div className="mb-2">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Audio playback position"
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#C95B63] bg-[#F4C6A8]/40"
                  style={{
                    background: `linear-gradient(to right, #C95B63 ${progressPercent}%, rgba(244, 198, 168, 0.45) ${progressPercent}%)`,
                  }}
                />
              </div>

              {/* Tabular Timestamps */}
              <div className="flex items-center justify-between text-xs text-[#715447]/80 tabular-nums mb-6">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Play / Pause & Replay Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause voice recording' : 'Play voice recording'}
                  className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-7 py-3 rounded-full bg-[#715447] text-[#FFFDF9] text-sm font-medium shadow-[0_8px_20px_rgba(113,84,71,0.2)] hover:bg-[#5E4439] active:scale-[0.97] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C95B63] whitespace-nowrap"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Listen</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReplay}
                  aria-label="Replay from start"
                  className="inline-flex items-center justify-center min-w-[48px] min-h-[48px] rounded-full border border-[#715447]/20 bg-[#FFF5E9] text-[#715447] hover:bg-[#F4C6A8]/35 active:scale-[0.96] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C95B63]"
                  title="Replay"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {audioFileName && (
                <p className="mt-4 text-xs text-[#715447]/65 truncate max-w-xs mx-auto">
                  {audioFileName}
                </p>
              )}

              {audioError && (
                <p className="mt-3 text-xs text-[#C95B63]">{audioError}</p>
              )}
            </div>
          ) : (
            <div className="relative z-10 py-3">
              <p className="font-serif text-xl text-[#4E382E] mb-1.5">
                Voice note ready to be added
              </p>
              <p className="text-sm text-[#715447]/80 max-w-xs mx-auto leading-relaxed">
                Upload your MP3 voice message in the personalization panel so she can press play and hear you right here.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
