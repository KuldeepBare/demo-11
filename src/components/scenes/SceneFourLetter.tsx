import { motion, useReducedMotion } from 'motion/react';
import { StorybookTeddy } from '../StorybookTeddy';

interface SceneFourLetterProps {
  heading: string;
  letterBody: string;
}

export function SceneFourLetter({ heading, letterBody }: SceneFourLetterProps) {
  const prefersReducedMotion = useReducedMotion();

  const paragraphs = letterBody
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="relative py-20 sm:py-28 px-5 sm:px-8">
      <div className="w-full max-w-2xl mx-auto">
        <motion.article
          className="relative rounded-3xl letter-ruled-paper border border-[#715447]/15 px-6 py-10 sm:px-12 sm:py-14 shadow-[0_22px_54px_rgba(113,84,71,0.08)]"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          {/* Subtle Wax Seal Accent at Top */}
          <div className="flex justify-center mb-6" aria-hidden="true">
            <svg viewBox="0 0 40 40" className="w-9 h-9">
              <circle cx="20" cy="20" r="16" fill="#E9AEBB" fillOpacity="0.45" stroke="#C95B63" strokeOpacity="0.45" strokeWidth="1.4" />
              <path
                d="M20 15C20 15 17 12 14.5 14C12 16 13.5 21 20 25.5C26.5 21 28 16 25.5 14C23 12 20 15 20 15Z"
                fill="#C95B63"
                fillOpacity="0.82"
              />
            </svg>
          </div>

          <motion.h2
            className="font-serif text-3xl sm:text-4xl text-[#4E382E] font-medium text-center leading-tight mb-9"
            style={{ textWrap: 'balance' }}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
          >
            {heading}
          </motion.h2>

          {/* Scroll-Revealed Paragraphs (Never Typewriter) */}
          <div className="space-y-5 max-w-[58ch] mx-auto text-[1.03rem] sm:text-[1.08rem] leading-[1.85] text-[#4E382E]">
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                className="whitespace-pre-line"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  delay: Math.min(index * 0.04, 0.2),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Sitting Bear Holding a Heart at Letter Bottom */}
          <motion.div
            className="mt-10 pt-6 border-t border-[#715447]/12 flex flex-col items-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
          >
            <StorybookTeddy pose="letter-heart" className="w-32 h-32 sm:w-36 sm:h-36" />
          </motion.div>
        </motion.article>
      </div>
    </section>
  );
}
