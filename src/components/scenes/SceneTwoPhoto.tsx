import { motion, useReducedMotion } from 'motion/react';
import { StorybookTeddy } from '../StorybookTeddy';

interface SceneTwoPhotoProps {
  photoTitle: string;
  photoSubtitle: string;
  photoHandwrittenNote: string;
  photoDataUrl: string | null;
}

export function SceneTwoPhoto({
  photoTitle,
  photoSubtitle,
  photoHandwrittenNote,
  photoDataUrl,
}: SceneTwoPhotoProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative py-20 sm:py-28 px-5 sm:px-8 flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Photo Placement Frame */}
        <motion.div
          className="relative w-full max-w-[340px] sm:max-w-[390px]"
          initial={{
            opacity: 0,
            y: prefersReducedMotion ? 0 : 28,
            rotate: prefersReducedMotion ? 0 : -2.5,
            scale: prefersReducedMotion ? 1 : 0.96,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            rotate: prefersReducedMotion ? 0 : -0.8,
            scale: 1,
          }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Decorative Washi Tape Strips */}
          <div
            className="absolute -top-3.5 left-10 w-20 h-6 bg-[#E9AEBB]/55 border border-[#715447]/10 -rotate-6 z-20 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -top-3 right-10 w-16 h-6 bg-[#F4C6A8]/65 border border-[#715447]/10 rotate-8 z-20 pointer-events-none"
            aria-hidden="true"
          />

          {/* Matte Storybook Polaroid / Frame */}
          <div className="relative rounded-2xl bg-[#FFFDF9] p-3 sm:p-4 pb-12 sm:pb-14 border border-[#715447]/14 shadow-[0_20px_50px_rgba(113,84,71,0.12)]">
            <div className="relative w-full rounded-xl overflow-hidden bg-[#F8EAE0]">
              {photoDataUrl ? (
                <img
                  src={photoDataUrl}
                  alt="A favourite photograph of the birthday girl"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto block"
                />
              ) : (
                <div className="w-full py-16 px-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#FFF5E9] to-[#F8EAE0]">
                  <svg
                    viewBox="0 0 80 80"
                    className="w-16 h-16 mb-4 text-[#C95B63]/65"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="10"
                      y="14"
                      width="60"
                      height="52"
                      rx="8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <path
                      d="M40 31C40 31 35 26 30.5 29.5C26.5 32.5 29 39.5 40 46C51 39.5 53.5 32.5 49.5 29.5C45 26 40 31 40 31Z"
                      fill="#E9AEBB"
                      stroke="#715447"
                      strokeWidth="1.6"
                    />
                  </svg>
                  <p className="font-serif text-xl text-[#4E382E] mb-1">
                    A frame waiting for your favourite photo
                  </p>
                  <p className="text-sm text-[#715447]/80 max-w-xs">
                    Upload her photo in the personalization panel to reveal it right here without cropping.
                  </p>
                </div>
              )}
            </div>

            {/* Handwritten Note on Frame Margin */}
            {photoHandwrittenNote.trim() && (
              <p className="font-hand text-2xl sm:text-[1.7rem] text-[#715447] text-center mt-4 -mb-6 tracking-wide">
                {photoHandwrittenNote}
              </p>
            )}

            {/* Small Animated Sparkles */}
            {!prefersReducedMotion && (
              <>
                <motion.svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 absolute -left-4 top-1/4 pointer-events-none"
                  animate={{ opacity: [0.3, 0.95, 0.3], scale: [0.8, 1.15, 0.8] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden="true"
                >
                  <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" fill="#E9AEBB" />
                </motion.svg>
                <motion.svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 absolute -right-3 top-1/3 pointer-events-none"
                  animate={{ opacity: [0.25, 0.9, 0.25], scale: [0.85, 1.2, 0.85] }}
                  transition={{ duration: 2.8, delay: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden="true"
                >
                  <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" fill="#F4C6A8" />
                </motion.svg>
              </>
            )}
          </div>

          {/* Tiny Teddy Bear Holding a Flower peeking beside bottom corner */}
          <motion.div
            className="absolute -bottom-8 -right-3 sm:-right-10 z-20 pointer-events-none"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <StorybookTeddy pose="flower" className="w-24 h-24 sm:w-28 sm:h-28" />
          </motion.div>
        </motion.div>

        {/* Caption & Personal Subtitle */}
        <motion.div
          className="mt-14 text-center max-w-lg px-2"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, delay: 0.2 }}
        >
          <h2
            className="font-serif text-3xl sm:text-4xl text-[#4E382E] font-medium leading-tight mb-3"
            style={{ textWrap: 'balance' }}
          >
            {photoTitle}
          </h2>
          {photoSubtitle.trim() && (
            <p className="text-base sm:text-lg text-[#715447] leading-relaxed">
              {photoSubtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
