import { motion, useReducedMotion } from 'motion/react';

const PETALS = [
  { id: 1, left: '8%', size: 14, duration: 15, delay: 0, drift: 28, color: '#E9AEBB' },
  { id: 2, left: '24%', size: 11, duration: 19, delay: 3.5, drift: -24, color: '#F4C6A8' },
  { id: 3, left: '52%', size: 13, duration: 17, delay: 6, drift: 22, color: '#E9AEBB' },
  { id: 4, left: '76%', size: 10, duration: 21, delay: 2, drift: -30, color: '#F4C6A8' },
  { id: 5, left: '91%', size: 12, duration: 16, delay: 8, drift: -18, color: '#E9AEBB' },
];

const STARS = [
  { id: 1, left: '14%', top: '16%', size: 10, delay: 0 },
  { id: 2, left: '84%', top: '22%', size: 12, delay: 1.8 },
  { id: 3, left: '22%', top: '62%', size: 9, delay: 3.1 },
  { id: 4, left: '78%', top: '74%', size: 11, delay: 0.9 },
  { id: 5, left: '48%', top: '11%', size: 8, delay: 2.4 },
];

export function AmbientParticles() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-10"
      aria-hidden="true"
    >
      {/* Drifting Soft Petals */}
      {PETALS.map((petal) => (
        <motion.svg
          key={petal.id}
          viewBox="0 0 24 24"
          className="absolute -top-8 opacity-60"
          style={{ left: petal.left, width: petal.size, height: petal.size }}
          animate={{
            y: ['0vh', '108vh'],
            x: [0, petal.drift, -petal.drift * 0.6, 0],
            rotate: [0, 140, 290, 360],
            opacity: [0, 0.55, 0.45, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <path
            d="M12 3C16.5 6.5 18 12.5 12 20.5C6 12.5 7.5 6.5 12 3Z"
            fill={petal.color}
          />
        </motion.svg>
      ))}

      {/* Twinkling Warm Stars */}
      {STARS.map((star) => (
        <motion.svg
          key={star.id}
          viewBox="0 0 24 24"
          className="absolute"
          style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
          animate={{
            opacity: [0.18, 0.72, 0.18],
            scale: [0.85, 1.15, 0.85],
          }}
          transition={{
            duration: 4.5,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <path
            d="M12 2L14.1 9.9L22 12L14.1 14.1L12 22L9.9 14.1L2 12L9.9 9.9L12 2Z"
            fill="#F4C6A8"
          />
        </motion.svg>
      ))}

      {/* Gentle Animated Butterfly 1 */}
      <motion.div
        className="absolute top-[28%] left-[-40px]"
        animate={{
          x: ['0vw', '108vw'],
          y: [0, -28, 16, -22, 12],
          opacity: [0, 0.7, 0.7, 0.7, 0],
        }}
        transition={{
          duration: 32,
          delay: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.svg
          viewBox="0 0 36 28"
          className="w-6 h-5"
          animate={{ scaleX: [1, 0.35, 1] }}
          transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M18 14C13 4 3 4 4 12C5 18 12 18 18 14Z"
            fill="#E9AEBB"
            fillOpacity="0.85"
          />
          <path
            d="M18 14C23 4 33 4 32 12C31 18 24 18 18 14Z"
            fill="#E9AEBB"
            fillOpacity="0.85"
          />
          <path
            d="M18 15C14 17 10 24 13 25C16 26 18 20 18 15Z"
            fill="#F4C6A8"
            fillOpacity="0.85"
          />
          <path
            d="M18 15C22 17 26 24 23 25C20 26 18 20 18 15Z"
            fill="#F4C6A8"
            fillOpacity="0.85"
          />
          <line x1="18" y1="10" x2="18" y2="21" stroke="#715447" strokeWidth="1.5" strokeLinecap="round" />
        </motion.svg>
      </motion.div>

      {/* Gentle Animated Butterfly 2 */}
      <motion.div
        className="absolute top-[68%] right-[-40px]"
        animate={{
          x: ['0vw', '-108vw'],
          y: [0, 20, -26, 14, -18],
          opacity: [0, 0.6, 0.6, 0.6, 0],
        }}
        transition={{
          duration: 38,
          delay: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.svg
          viewBox="0 0 36 28"
          className="w-5 h-4"
          animate={{ scaleX: [1, 0.3, 1] }}
          transition={{ duration: 0.62, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M18 14C13 4 3 4 4 12C5 18 12 18 18 14Z" fill="#F4C6A8" fillOpacity="0.8" />
          <path d="M18 14C23 4 33 4 32 12C31 18 24 18 18 14Z" fill="#F4C6A8" fillOpacity="0.8" />
          <path d="M18 15C14 17 10 24 13 25C16 26 18 20 18 15Z" fill="#E9AEBB" fillOpacity="0.8" />
          <path d="M18 15C22 17 26 24 23 25C20 26 18 20 18 15Z" fill="#E9AEBB" fillOpacity="0.8" />
          <line x1="18" y1="10" x2="18" y2="21" stroke="#715447" strokeWidth="1.5" strokeLinecap="round" />
        </motion.svg>
      </motion.div>
    </div>
  );
}
