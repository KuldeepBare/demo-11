import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { StorybookTeddy } from '../StorybookTeddy';

interface SceneSixLittleThingsProps {
  heading: string;
  giftMessages: [string, string, string];
}

export function SceneSixLittleThings({
  heading,
  giftMessages,
}: SceneSixLittleThingsProps) {
  const prefersReducedMotion = useReducedMotion();
  const [boxOpened, setBoxOpened] = useState(false);
  const [openedEnvelopes, setOpenedEnvelopes] = useState<Set<number>>(() => new Set());
  const [justOpened, setJustOpened] = useState<number | null>(null);

  const handleOpenBox = () => {
    setBoxOpened(true);
  };

  const handleToggleEnvelope = (idx: number) => {
    setOpenedEnvelopes((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    setJustOpened(idx);
    window.setTimeout(() => {
      setJustOpened((curr) => (curr === idx ? null : curr));
    }, 900);
  };

  return (
    <section className="relative py-20 sm:py-28 px-5 sm:px-8">
      <div className="w-full max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <h2
            className="font-serif text-3xl sm:text-4xl text-[#4E382E] font-medium leading-tight mb-2.5"
            style={{ textWrap: 'balance' }}
          >
            {heading}
          </h2>
          <p className="text-sm sm:text-base text-[#715447]/80">
            {boxOpened
              ? 'Tap each little envelope to read what is inside'
              : 'Tap the keepsake box to open it'}
          </p>
        </motion.div>

        {/* Teddy Bear Beside the Keepsake Box */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-10">
          <StorybookTeddy
            pose="gift-box"
            actionActive={justOpened !== null || boxOpened}
            reaction={justOpened !== null ? 'hug' : 'idle'}
            className="w-32 h-32 sm:w-36 sm:h-36 shrink-0"
          />

          <button
            type="button"
            onClick={handleOpenBox}
            aria-label={boxOpened ? 'Keepsake box opened' : 'Open keepsake box'}
            className="group relative flex flex-col items-center justify-center p-4 rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C95B63] cursor-pointer"
          >
            <svg viewBox="0 0 180 150" className="w-40 h-36 overflow-visible" aria-hidden="true">
              {/* Ground Shadow */}
              <ellipse cx="90" cy="136" rx="64" ry="8" fill="#715447" fillOpacity="0.1" />

              {/* Box Base */}
              <rect
                x="32"
                y="62"
                width="116"
                height="70"
                rx="10"
                fill="#FFFDF9"
                stroke="#715447"
                strokeWidth="2.4"
              />
              {/* Vertical Satin Ribbon on Base */}
              <rect x="81" y="63" width="18" height="68" fill="#E9AEBB" />

              {/* Inner Warm Glow when opened */}
              {boxOpened && (
                <ellipse cx="90" cy="64" rx="48" ry="10" fill="#F4C6A8" fillOpacity="0.55" />
              )}

              {/* Box Lid (lifts smoothly when opened) */}
              <motion.g
                animate={
                  boxOpened
                    ? {
                        y: -24,
                        rotate: -12,
                        x: -6,
                      }
                    : {
                        y: [0, -2, 0],
                        rotate: 0,
                        x: 0,
                      }
                }
                transition={
                  boxOpened
                    ? { duration: prefersReducedMotion ? 0.15 : 0.65, ease: [0.16, 1, 0.3, 1] }
                    : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                }
                style={{ transformOrigin: '32px 62px' }}
              >
                <rect
                  x="26"
                  y="44"
                  width="128"
                  height="22"
                  rx="7"
                  fill="#FCEEE2"
                  stroke="#715447"
                  strokeWidth="2.4"
                />
                <rect x="81" y="45" width="18" height="20" fill="#E9AEBB" />
                {/* Satin Ribbon Bow */}
                <path
                  d="M90 44C78 30 62 32 66 41C69 47 82 46 90 44Z"
                  fill="#E9AEBB"
                  stroke="#715447"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M90 44C102 30 118 32 114 41C111 47 98 46 90 44Z"
                  fill="#E9AEBB"
                  stroke="#715447"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle cx="90" cy="43" r="4.5" fill="#C95B63" stroke="#715447" strokeWidth="1.8" />
              </motion.g>
            </svg>

            {!boxOpened && (
              <span className="mt-1 inline-flex items-center min-h-[40px] px-5 py-1.5 rounded-full bg-[#FFFDF9] border border-[#715447]/20 text-sm font-medium text-[#715447] group-hover:bg-[#F4C6A8]/25 transition-colors">
                Open the box ♡
              </span>
            )}
          </button>
        </div>

        {/* Three Revealable Envelopes */}
        <AnimatePresence>
          {boxOpened && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-5"
            >
              {giftMessages.map((msg, idx) => {
                const isOpen = openedEnvelopes.has(idx);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.16,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleEnvelope(idx)}
                      aria-expanded={isOpen}
                      className={`w-full min-h-[188px] rounded-2xl border p-5 text-center flex flex-col items-center justify-center transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C95B63] ${
                        isOpen
                          ? 'bg-[#FFFDF9] border-[#E9AEBB] shadow-[0_14px_34px_rgba(201,91,99,0.11)]'
                          : 'bg-[#FFFDF9]/90 border-[#715447]/15 shadow-[0_10px_26px_rgba(113,84,71,0.06)] hover:border-[#E9AEBB] hover:-translate-y-0.5'
                      }`}
                    >
                      {!isOpen ? (
                        <div className="flex flex-col items-center">
                          <svg viewBox="0 0 72 52" className="w-16 h-12 mb-3" fill="none" aria-hidden="true">
                            <rect
                              x="4"
                              y="6"
                              width="64"
                              height="40"
                              rx="6"
                              fill="#FFF5E9"
                              stroke="#715447"
                              strokeWidth="2"
                            />
                            <path
                              d="M6 8L36 30L66 8"
                              stroke="#715447"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M36 27C36 27 32 23.5 29.5 25.5C27.5 27 29 30.5 36 34.5C43 30.5 44.5 27 42.5 25.5C40 23.5 36 27 36 27Z"
                              fill="#C95B63"
                            />
                          </svg>
                          <span className="font-hand text-xl text-[#715447]">
                            Little note #{idx + 1}
                          </span>
                          <span className="text-xs text-[#715447]/65 mt-1">
                            Tap to open
                          </span>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.94 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.35 }}
                          className="flex flex-col items-center"
                        >
                          <span className="font-hand text-lg text-[#C95B63] mb-2">
                            For you, #{idx + 1}
                          </span>
                          <p className="font-serif text-lg sm:text-xl text-[#4E382E] leading-relaxed">
                            “{msg}”
                          </p>
                        </motion.div>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
