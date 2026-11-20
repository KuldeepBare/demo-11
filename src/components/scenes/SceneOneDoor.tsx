import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { StorybookTeddy } from '../StorybookTeddy';

interface SceneOneDoorProps {
  openingTitle: string;
  openingSubtitle: string;
  onEnter: () => void;
}

export function SceneOneDoor({
  openingTitle,
  openingSubtitle,
  onEnter,
}: SceneOneDoorProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    window.setTimeout(() => {
      onEnter();
    }, prefersReducedMotion ? 220 : 920);
  };

  return (
    <motion.section
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center px-6 py-12 overflow-hidden paper-grain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.03 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Warm Radial Candlelight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(244, 198, 168, 0.32) 0%, rgba(233, 174, 187, 0.14) 36%, rgba(255, 245, 233, 0) 72%)',
        }}
        aria-hidden="true"
      />

      {/* Storybook Cover Border Frame */}
      <div className="relative z-20 w-full max-w-md md:max-w-lg rounded-[28px] border border-[#715447]/15 bg-[#FFFDF9]/75 px-7 py-12 md:px-12 md:py-14 text-center shadow-[0_24px_60px_rgba(113,84,71,0.08)]">
        {/* Delicate Corner Flourishes */}
        <span
          className="absolute top-4 left-4 w-5 h-5 border-t border-l border-[#715447]/25 rounded-tl-lg pointer-events-none"
          aria-hidden="true"
        />
        <span
          className="absolute top-4 right-4 w-5 h-5 border-t border-r border-[#715447]/25 rounded-tr-lg pointer-events-none"
          aria-hidden="true"
        />
        <span
          className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-[#715447]/25 rounded-bl-lg pointer-events-none"
          aria-hidden="true"
        />
        <span
          className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-[#715447]/25 rounded-br-lg pointer-events-none"
          aria-hidden="true"
        />

        {/* Teddy Bear with Envelope */}
        <div className="relative flex justify-center mb-6">
          <StorybookTeddy
            pose="envelope"
            actionActive={isOpening}
            className="w-44 h-44 sm:w-48 sm:h-48"
          />

          {/* Sparkles when tapped */}
          {isOpening && !prefersReducedMotion && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
              {[
                { x: -56, y: -42, delay: 0.05 },
                { x: 58, y: -38, delay: 0.12 },
                { x: -44, y: 18, delay: 0.18 },
                { x: 46, y: 20, delay: 0.22 },
              ].map((s, idx) => (
                <motion.svg
                  key={idx}
                  viewBox="0 0 24 24"
                  className="w-4 h-4 absolute"
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                  animate={{ opacity: [0, 1, 0], x: s.x, y: s.y, scale: [0.4, 1.15, 0.7] }}
                  transition={{ duration: 0.8, delay: s.delay, ease: 'easeOut' }}
                >
                  <path
                    d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z"
                    fill={idx % 2 === 0 ? '#E9AEBB' : '#F4C6A8'}
                  />
                </motion.svg>
              ))}
            </div>
          )}
        </div>

        <motion.h1
          className="font-serif text-4xl sm:text-[2.75rem] leading-[1.15] tracking-tight text-[#4E382E] font-medium mb-3"
          style={{ textWrap: 'balance' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {openingTitle}
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg text-[#715447] leading-relaxed mb-9 max-w-xs mx-auto"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {openingSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <button
            type="button"
            onClick={handleOpen}
            disabled={isOpening}
            className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-full bg-[#715447] text-[#FFFDF9] text-base font-medium tracking-wide shadow-[0_10px_24px_rgba(113,84,71,0.22)] hover:bg-[#5E4439] active:scale-[0.97] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C95B63] cursor-pointer disabled:opacity-80 whitespace-nowrap"
          >
            {isOpening ? 'Opening...' : 'Come inside ♡'}
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
