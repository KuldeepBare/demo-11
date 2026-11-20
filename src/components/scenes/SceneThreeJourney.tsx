import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { StorybookTeddy, type TeddyReaction } from '../StorybookTeddy';

interface SceneThreeJourneyProps {
  heading: string;
  messages: [string, string, string, string, string];
}

const WAYPOINTS: Array<{
  id: number;
  label: string;
  type: 'flower' | 'star' | 'heart' | 'moon' | 'ribbon';
  xPercent: number;
  yPercent: number;
  reaction: TeddyReaction;
}> = [
  { id: 0, label: 'Wildflower', type: 'flower', xPercent: 22, yPercent: 12, reaction: 'bounce' },
  { id: 1, label: 'Starlight', type: 'star', xPercent: 74, yPercent: 30, reaction: 'spin' },
  { id: 2, label: 'Paper Heart', type: 'heart', xPercent: 26, yPercent: 50, reaction: 'heart' },
  { id: 3, label: 'Crescent', type: 'moon', xPercent: 74, yPercent: 70, reaction: 'hug' },
  { id: 4, label: 'Ribbon', type: 'ribbon', xPercent: 46, yPercent: 89, reaction: 'heart' },
];

function KeepsakeIcon({
  type,
  collected,
}: {
  type: 'flower' | 'star' | 'heart' | 'moon' | 'ribbon';
  collected: boolean;
}) {
  const fill = collected ? '#C95B63' : '#E9AEBB';
  const accent = collected ? '#F4C6A8' : '#FFFDF9';

  if (type === 'flower') {
    return (
      <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none" aria-hidden="true">
        <circle cx="18" cy="10" r="4.5" fill={fill} stroke="#715447" strokeWidth="1.5" />
        <circle cx="25" cy="15" r="4.5" fill="#F4C6A8" stroke="#715447" strokeWidth="1.5" />
        <circle cx="22.5" cy="23" r="4.5" fill={fill} stroke="#715447" strokeWidth="1.5" />
        <circle cx="13.5" cy="23" r="4.5" fill="#F4C6A8" stroke="#715447" strokeWidth="1.5" />
        <circle cx="11" cy="15" r="4.5" fill={fill} stroke="#715447" strokeWidth="1.5" />
        <circle cx="18" cy="17" r="4" fill={accent} stroke="#715447" strokeWidth="1.5" />
      </svg>
    );
  }

  if (type === 'star') {
    return (
      <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none" aria-hidden="true">
        <path
          d="M18 5L21.6 13.3L30.5 14.1L23.8 20L25.8 28.8L18 24.2L10.2 28.8L12.2 20L5.5 14.1L14.4 13.3L18 5Z"
          fill="#F4C6A8"
          stroke="#715447"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === 'heart') {
    return (
      <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none" aria-hidden="true">
        <path
          d="M18 12C18 12 13 7 8.5 10.5C4.5 13.5 7 21 18 28.5C29 21 31.5 13.5 27.5 10.5C23 7 18 12 18 12Z"
          fill={fill}
          stroke="#715447"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === 'moon') {
    return (
      <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none" aria-hidden="true">
        <path
          d="M23.5 24.5C18.5 24.5 14.5 20.5 14.5 15.5C14.5 12 16.4 9 19.2 7.5C13.5 7.7 9 12.4 9 18.2C9 24.1 13.8 29 19.8 29C23.5 29 26.8 27 28.7 24C27.1 24.3 25.3 24.5 23.5 24.5Z"
          fill="#F4C6A8"
          stroke="#715447"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none" aria-hidden="true">
      <path
        d="M18 17C13 13 7 12 7 17.5C7 22 13 21 18 17ZM18 17C23 13 29 12 29 17.5C29 22 23 21 18 17Z"
        fill="#E9AEBB"
        stroke="#715447"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M18 18L13 28M18 18L23 28" stroke="#715447" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="18" cy="17" r="2.8" fill="#C95B63" stroke="#715447" strokeWidth="1.4" />
    </svg>
  );
}

export function SceneThreeJourney({ heading, messages }: SceneThreeJourneyProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [collected, setCollected] = useState<Set<number>>(() => new Set([0]));
  const [reaction, setReaction] = useState<TeddyReaction>('idle');

  const currentWaypoint = WAYPOINTS[activeIndex];
  const prevX = activeIndex > 0 ? WAYPOINTS[activeIndex - 1].xPercent : 0;
  const facing: 'left' | 'right' = currentWaypoint.xPercent < prevX ? 'left' : 'right';

  const handleTapObject = (index: number) => {
    setActiveIndex(index);
    setCollected((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    const nextReaction = WAYPOINTS[index].reaction;
    setReaction(nextReaction);
    window.setTimeout(() => {
      setReaction('idle');
    }, 850);
  };

  return (
    <section className="relative py-20 sm:py-28 px-5 sm:px-8">
      <div className="w-full max-w-xl mx-auto">
        {/* Heading & Quiet Unboxed Counter */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7 }}
        >
          <h2
            className="font-serif text-3xl sm:text-4xl text-[#4E382E] font-medium mb-2.5"
            style={{ textWrap: 'balance' }}
          >
            {heading}
          </h2>
          <p className="text-sm text-[#715447]/80">
            Tap each little keepsake along the path · {collected.size} of 5 found
          </p>
        </motion.div>

        {/* Winding Storybook Path Canvas */}
        <div className="relative w-full h-[410px] sm:h-[440px] rounded-3xl bg-[#FFFDF9]/85 border border-[#715447]/12 shadow-[0_16px_44px_rgba(113,84,71,0.07)] overflow-hidden">
          {/* Winding Dotted Path SVG */}
          <svg
            viewBox="0 0 400 440"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            <path
              d="M 88 52 C 260 64, 335 110, 296 132 C 250 158, 70 185, 104 220 C 140 258, 330 272, 296 308 C 265 342, 165 362, 184 392"
              stroke="#E9AEBB"
              strokeOpacity="0.45"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 88 52 C 260 64, 335 110, 296 132 C 250 158, 70 185, 104 220 C 140 258, 330 272, 296 308 C 265 342, 165 362, 184 392"
              stroke="#715447"
              strokeOpacity="0.32"
              strokeWidth="2.2"
              strokeDasharray="6 7"
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          {/* 5 Collectible Interactive Keepsakes */}
          {WAYPOINTS.map((wp, idx) => {
            const isSelected = activeIndex === idx;
            const isFound = collected.has(idx);
            return (
              <button
                key={wp.id}
                type="button"
                onClick={() => handleTapObject(idx)}
                aria-label={`Open reminder ${idx + 1}: ${wp.label}`}
                style={{
                  left: `${wp.xPercent}%`,
                  top: `${wp.yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-20 min-w-[52px] min-h-[52px] rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C95B63] ${
                  isSelected
                    ? 'bg-[#FFF5E9] ring-2 ring-[#C95B63]/65 shadow-[0_6px_18px_rgba(201,91,99,0.2)] scale-110'
                    : isFound
                      ? 'bg-[#FFFDF9] border border-[#715447]/20 shadow-sm hover:scale-105'
                      : 'bg-[#FFFDF9] border border-[#E9AEBB] shadow-[0_6px_16px_rgba(233,174,187,0.3)] hover:scale-108'
                }`}
              >
                <KeepsakeIcon type={wp.type} collected={isFound} />
              </button>
            );
          })}

          {/* Walking Teddy Bear moving along waypoints */}
          <motion.div
            className="absolute z-30 pointer-events-none"
            animate={{
              left: `${Math.min(82, Math.max(14, currentWaypoint.xPercent + (currentWaypoint.xPercent > 50 ? -13 : 13)))}%`,
              top: `${Math.max(10, currentWaypoint.yPercent - 3)}%`,
            }}
            transition={{
              duration: prefersReducedMotion ? 0.1 : 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <StorybookTeddy
              pose="walking"
              reaction={reaction}
              facing={facing}
              className="w-20 h-20 sm:w-24 sm:h-24"
            />
          </motion.div>
        </div>

        {/* Revealed Romantic Message Card */}
        <div className="mt-6 min-h-[116px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl bg-[#FFFDF9] border border-[#715447]/15 px-6 py-5 text-center shadow-[0_10px_28px_rgba(113,84,71,0.06)]"
            >
              <p className="font-hand text-xl text-[#C95B63] mb-1">
                Note {activeIndex + 1} of 5
              </p>
              <p className="font-serif text-xl sm:text-2xl text-[#4E382E] leading-snug">
                “{messages[activeIndex]}”
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
