import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { StorybookTeddy } from '../StorybookTeddy';

interface SceneSevenFinaleProps {
  finaleLine1: string;
  finaleLine2: string;
  finaleGreeting: string;
  finaleClosing: string;
  onRestart: () => void;
}

export function SceneSevenFinale({
  finaleLine1,
  finaleLine2,
  finaleGreeting,
  finaleClosing,
  onRestart,
}: SceneSevenFinaleProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hasEnteredView, setHasEnteredView] = useState(false);

  return (
    <section
      className="relative py-24 sm:py-32 px-6 overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, rgba(255,245,233,0) 0%, rgba(244,198,168,0.28) 42%, rgba(233,174,187,0.24) 100%)',
      }}
    >
      <motion.div
        className="w-full max-w-xl mx-auto text-center"
        onViewportEnter={() => setHasEnteredView(true)}
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* Bear sitting beside an empty space, looking softly toward her */}
        <motion.div
          className="flex items-end justify-center gap-6 sm:gap-10 mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={hasEnteredView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
        >
          <StorybookTeddy pose="yearning" className="w-36 h-36 sm:w-40 sm:h-40" />

          {/* Softly lit empty seat/space beside him */}
          <div className="flex flex-col items-center pb-3" aria-hidden="true">
            <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-full border border-dashed border-[#715447]/25 bg-[#FFFDF9]/45 flex items-center justify-center">
              <span className="font-hand text-lg text-[#715447]/65">your spot</span>
            </div>
            <div className="w-20 h-2.5 mt-2 rounded-full bg-[#715447]/10" />
          </div>
        </motion.div>

        {/* Paced Emotional Reveals */}
        <div className="space-y-8 sm:space-y-10">
          <motion.p
            className="font-serif text-2xl sm:text-3xl text-[#715447] leading-relaxed"
            style={{ textWrap: 'balance' }}
            initial={{ opacity: 0, y: 12 }}
            animate={hasEnteredView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.2 }}
          >
            {finaleLine1}
          </motion.p>

          <motion.p
            className="font-serif text-3xl sm:text-4xl text-[#4E382E] font-medium leading-tight"
            style={{ textWrap: 'balance' }}
            initial={{ opacity: 0, y: 12 }}
            animate={hasEnteredView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.95,
              delay: prefersReducedMotion ? 0.2 : 1.15,
            }}
          >
            {finaleLine2}
          </motion.p>

          <motion.div
            className="pt-4 space-y-3"
            initial={{ opacity: 0, y: 14 }}
            animate={hasEnteredView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 1.0,
              delay: prefersReducedMotion ? 0.3 : 2.15,
            }}
          >
            <h2
              className="font-serif text-4xl sm:text-[2.75rem] text-[#C95B63] font-medium leading-tight"
              style={{ textWrap: 'balance' }}
            >
              {finaleGreeting}
            </h2>
            <p className="text-base sm:text-lg text-[#4E382E]/90 leading-relaxed max-w-md mx-auto">
              {finaleClosing}
            </p>
          </motion.div>
        </div>

        {/* Final Little Bear Hugging a Heart */}
        <motion.div
          className="mt-12 mb-10 flex justify-center"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={hasEnteredView ? { opacity: 1, scale: 1 } : {}}
          transition={{
            duration: 0.9,
            delay: prefersReducedMotion ? 0.35 : 2.75,
          }}
        >
          <StorybookTeddy pose="hugging-heart" className="w-40 h-40 sm:w-44 sm:h-44" />
        </motion.div>

        {/* Restart Story Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={hasEnteredView ? { opacity: 1 } : {}}
          transition={{
            duration: 0.8,
            delay: prefersReducedMotion ? 0.4 : 3.2,
          }}
        >
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 rounded-full border border-[#715447]/25 bg-[#FFFDF9]/90 text-[#715447] text-sm font-medium shadow-sm hover:bg-[#FFFDF9] hover:border-[#715447]/40 active:scale-[0.97] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C95B63] whitespace-nowrap"
          >
            Start our little story again ↺
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
