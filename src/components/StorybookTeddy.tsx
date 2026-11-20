import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export type TeddyPose =
  | 'envelope'
  | 'flower'
  | 'walking'
  | 'letter-heart'
  | 'headphones'
  | 'gift-box'
  | 'yearning'
  | 'hugging-heart';

export type TeddyReaction = 'idle' | 'bounce' | 'spin' | 'hug' | 'heart';

interface StorybookTeddyProps {
  pose: TeddyPose;
  className?: string;
  actionActive?: boolean;
  isPlaying?: boolean;
  reaction?: TeddyReaction;
  facing?: 'left' | 'right';
}

export function StorybookTeddy({
  pose,
  className = 'w-44 h-44',
  actionActive = false,
  isPlaying = false,
  reaction = 'idle',
  facing = 'right',
}: StorybookTeddyProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural periodic eye blink
  useEffect(() => {
    if (prefersReducedMotion || pose === 'hugging-heart') return;
    let timeoutId: number;
    let blinkResetId: number;

    const scheduleBlink = () => {
      const delay = 2800 + Math.random() * 2600;
      timeoutId = window.setTimeout(() => {
        setIsBlinking(true);
        blinkResetId = window.setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 160);
      }, delay);
    };

    scheduleBlink();
    return () => {
      window.clearTimeout(timeoutId);
      window.clearTimeout(blinkResetId);
    };
  }, [prefersReducedMotion, pose]);

  const showHappyClosedEyes = pose === 'hugging-heart' || (pose === 'gift-box' && actionActive) || reaction === 'hug';

  const bodyReactionAnimate =
    prefersReducedMotion
      ? {}
      : reaction === 'bounce'
        ? { y: [0, -14, 0, -8, 0], transition: { duration: 0.75, ease: 'easeOut' as const } }
        : reaction === 'spin'
          ? { rotate: [0, -12, 12, -6, 0], scale: [1, 1.06, 1], transition: { duration: 0.75 } }
          : reaction === 'hug' || reaction === 'heart'
            ? { scale: [1, 1.08, 0.98, 1.04, 1], transition: { duration: 0.7 } }
            : {};

  const headBobAnimate =
    prefersReducedMotion
      ? {}
      : pose === 'headphones' && isPlaying
        ? {
            rotate: [-3.5, 4, -3.5],
            y: [0, 2.5, 0],
            transition: { duration: 1.15, repeat: Infinity, ease: 'easeInOut' as const },
          }
        : pose === 'envelope' && !actionActive
          ? {
              rotate: [-1.5, 2.2, -1.5],
              transition: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' as const },
            }
          : pose === 'yearning'
            ? {
                rotate: [-2, 1.5, -2],
                transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const },
              }
            : {
                rotate: [-1, 1, -1],
                transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' as const },
              };

  const breathingAnimate =
    prefersReducedMotion
      ? {}
      : pose === 'walking'
        ? {
            y: [0, -2.5, 0],
            transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' as const },
          }
        : {
            scaleY: [1, 1.022, 1],
            scaleX: [1, 0.99, 1],
            transition: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' as const },
          };

  return (
    <motion.div
      className={`inline-flex items-center justify-center select-none ${className}`}
      animate={bodyReactionAnimate}
      style={{
        transform: pose === 'walking' && facing === 'left' ? 'scaleX(-1)' : undefined,
      }}
    >
      <svg
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_10px_22px_rgba(113,84,71,0.12)]"
        aria-hidden="true"
      >
        {/* Ground Soft Shadow */}
        <ellipse cx="110" cy="198" rx="52" ry="9" fill="#715447" fillOpacity="0.1" />

        {/* Floating Music Notes when headphones playing */}
        {pose === 'headphones' && isPlaying && !prefersReducedMotion && (
          <g>
            <motion.path
              d="M168 62V44L180 41V58"
              stroke="#C95B63"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: [0, 0.9, 0], y: [6, -12, -20] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.circle
              cx="165"
              cy="63"
              r="3.2"
              fill="#C95B63"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: [0, 0.9, 0], y: [6, -12, -20] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.circle
              cx="177"
              cy="59"
              r="3.2"
              fill="#C95B63"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: [0, 0.9, 0], y: [6, -12, -20] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            />
          </g>
        )}

        {/* Reaction Tiny Heart */}
        {(reaction === 'heart' || reaction === 'hug' || (pose === 'envelope' && actionActive)) &&
          !prefersReducedMotion && (
            <motion.path
              d="M110 34C110 34 102 27 97 31C92.5 34.5 96 42 110 50C124 42 127.5 34.5 123 31C118 27 110 34 110 34Z"
              fill="#C95B63"
              initial={{ opacity: 0, y: 8, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], y: [8, -16, -26], scale: [0.7, 1.1, 0.9] }}
              transition={{ duration: 1.4, repeat: pose === 'envelope' && actionActive ? 0 : 1 }}
            />
          )}

        {/* TORSO & LIMBS GROUP (Breathing) */}
        <motion.g
          animate={breathingAnimate}
          style={{ transformOrigin: '110px 165px' }}
        >
          {/* Seated or Walking Legs */}
          {pose === 'walking' ? (
            <>
              <motion.g
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        rotate: [-14, 14, -14],
                        transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' },
                      }
                }
                style={{ transformOrigin: '92px 166px' }}
              >
                <rect x="78" y="158" width="24" height="34" rx="12" fill="#CE9973" stroke="#715447" strokeWidth="2.4" />
                <ellipse cx="90" cy="186" rx="10" ry="6.5" fill="#F8E7D6" />
              </motion.g>
              <motion.g
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        rotate: [14, -14, 14],
                        transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' },
                      }
                }
                style={{ transformOrigin: '126px 166px' }}
              >
                <rect x="114" y="158" width="24" height="34" rx="12" fill="#D9A883" stroke="#715447" strokeWidth="2.4" />
                <ellipse cx="126" cy="186" rx="10" ry="6.5" fill="#F8E7D6" />
              </motion.g>
            </>
          ) : (
            <>
              {/* Left Seated Foot */}
              <ellipse cx="78" cy="179" rx="20" ry="15" transform="rotate(-14 78 179)" fill="#D9A883" stroke="#715447" strokeWidth="2.4" />
              <ellipse cx="76" cy="180" rx="11" ry="8" transform="rotate(-14 76 180)" fill="#F8E7D6" />
              <circle cx="71" cy="174" r="2.2" fill="#E9AEBB" />
              <circle cx="76" cy="172" r="2.2" fill="#E9AEBB" />
              <circle cx="81" cy="174" r="2.2" fill="#E9AEBB" />

              {/* Right Seated Foot */}
              <ellipse cx="142" cy="179" rx="20" ry="15" transform="rotate(14 142 179)" fill="#D9A883" stroke="#715447" strokeWidth="2.4" />
              <ellipse cx="144" cy="180" rx="11" ry="8" transform="rotate(14 144 180)" fill="#F8E7D6" />
              <circle cx="139" cy="174" r="2.2" fill="#E9AEBB" />
              <circle cx="144" cy="172" r="2.2" fill="#E9AEBB" />
              <circle cx="149" cy="174" r="2.2" fill="#E9AEBB" />
            </>
          )}

          {/* Plush Torso */}
          <ellipse cx="110" cy="145" rx="41" ry="43" fill="#D9A883" stroke="#715447" strokeWidth="2.5" />
          {/* Soft Cream Tummy Patch */}
          <ellipse cx="110" cy="148" rx="25" ry="28" fill="#FCEEE2" />

          {/* Left Arm */}
          <motion.g
            animate={
              prefersReducedMotion
                ? {}
                : pose === 'walking'
                  ? {
                      rotate: [16, -16, 16],
                      transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' },
                    }
                  : pose === 'gift-box' && actionActive
                    ? { rotate: [0, 12, 0], transition: { duration: 0.6 } }
                    : {}
            }
            style={{ transformOrigin: '76px 128px' }}
          >
            <ellipse
              cx={pose === 'hugging-heart' || pose === 'letter-heart' ? '82' : '69'}
              cy={pose === 'hugging-heart' || pose === 'letter-heart' ? '143' : '138'}
              rx="14"
              ry="22"
              transform={
                pose === 'hugging-heart' || pose === 'letter-heart'
                  ? 'rotate(-36 82 143)'
                  : 'rotate(24 69 138)'
              }
              fill="#D9A883"
              stroke="#715447"
              strokeWidth="2.4"
            />
          </motion.g>

          {/* Right Arm (Waves when envelope opens!) */}
          <motion.g
            animate={
              prefersReducedMotion
                ? {}
                : pose === 'envelope' && actionActive
                  ? {
                      rotate: [-10, -48, -18, -46, -15],
                      transition: { duration: 0.85, ease: 'easeInOut' },
                    }
                  : pose === 'walking'
                    ? {
                        rotate: [-16, 16, -16],
                        transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' },
                      }
                    : {}
            }
            style={{ transformOrigin: '144px 128px' }}
          >
            <ellipse
              cx={pose === 'hugging-heart' || pose === 'letter-heart' ? '138' : '151'}
              cy={pose === 'hugging-heart' || pose === 'letter-heart' ? '143' : '138'}
              rx="14"
              ry="22"
              transform={
                pose === 'hugging-heart' || pose === 'letter-heart'
                  ? 'rotate(36 138 143)'
                  : 'rotate(-24 151 138)'
              }
              fill="#D9A883"
              stroke="#715447"
              strokeWidth="2.4"
            />
          </motion.g>
        </motion.g>

        {/* POSE PROPS HELD IN PAWS */}
        {/* Pose 1: Envelope */}
        {pose === 'envelope' && (
          <g transform="translate(82, 134)">
            {/* Envelope Back */}
            <rect x="0" y="6" width="56" height="36" rx="4" fill="#FFFDF9" stroke="#715447" strokeWidth="2.2" />
            {/* Inner Letter peeking out when opened */}
            <motion.rect
              x="6"
              y="10"
              width="44"
              height="26"
              rx="2"
              fill="#FFF5E9"
              stroke="#E9AEBB"
              strokeWidth="1.5"
              animate={{ y: actionActive ? -10 : 10 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            />
            {/* Bottom Flap Lines */}
            <path d="M2 40L28 23L54 40" stroke="#715447" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            {/* Top Flap (Opens!) */}
            <motion.path
              d="M2 8L28 26L54 8"
              fill="#F8E8DA"
              stroke="#715447"
              strokeWidth="2"
              strokeLinejoin="round"
              animate={{
                scaleY: actionActive ? -0.85 : 1,
                y: actionActive ? -1 : 0,
              }}
              style={{ transformOrigin: '28px 8px' }}
              transition={{ duration: 0.4 }}
            />
            {/* Tiny Pink Wax Heart Seal */}
            <motion.path
              d="M28 24C28 24 24 20.5 21.5 22.5C19.5 24 21 27.5 28 31.5C35 27.5 36.5 24 34.5 22.5C32 20.5 28 24 28 24Z"
              fill="#C95B63"
              animate={{ opacity: actionActive ? 0 : 1, scale: actionActive ? 0.5 : 1 }}
              transition={{ duration: 0.25 }}
            />
          </g>
        )}

        {/* Pose 2 & 7a: Holding a Wildflower */}
        {(pose === 'flower' || pose === 'yearning') && (
          <motion.g
            transform="translate(145, 102)"
            animate={
              prefersReducedMotion
                ? {}
                : { rotate: [-4, 5, -4], transition: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' } }
            }
            style={{ transformOrigin: '10px 42px' }}
          >
            <path d="M10 42C11 30 13 21 15 12" stroke="#6E8B6B" strokeWidth="2.4" strokeLinecap="round" />
            <ellipse cx="7" cy="28" rx="5.5" ry="3" transform="rotate(-30 7 28)" fill="#89A884" />
            <circle cx="15" cy="6" r="4.5" fill="#E9AEBB" />
            <circle cx="20.5" cy="10" r="4.5" fill="#F4C6A8" />
            <circle cx="18.5" cy="16" r="4.5" fill="#E9AEBB" />
            <circle cx="11.5" cy="16" r="4.5" fill="#F4C6A8" />
            <circle cx="9.5" cy="10" r="4.5" fill="#E9AEBB" />
            <circle cx="15" cy="11" r="4" fill="#FFF5E9" stroke="#715447" strokeWidth="1.2" />
          </motion.g>
        )}

        {/* Pose 4 & 7b: Holding / Hugging Plush Heart */}
        {(pose === 'letter-heart' || pose === 'hugging-heart') && (
          <motion.g
            animate={
              prefersReducedMotion
                ? {}
                : { scale: [1, 1.05, 1], transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } }
            }
            style={{ transformOrigin: '110px 148px' }}
          >
            <path
              d="M110 135C110 135 97 122 87 130C78 137 83 153 110 168C137 153 142 137 133 130C123 122 110 135 110 135Z"
              fill={pose === 'hugging-heart' ? '#C95B63' : '#E9AEBB'}
              stroke="#715447"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path
              d="M93 136C95 133 98 132 100 133"
              stroke="#FFFDF9"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
          </motion.g>
        )}

        {/* HEAD GROUP */}
        <motion.g animate={headBobAnimate} style={{ transformOrigin: '110px 104px' }}>
          {/* Left Ear */}
          <circle cx="71" cy="57" r="18" fill="#D9A883" stroke="#715447" strokeWidth="2.5" />
          <circle cx="72" cy="58" r="10" fill="#F8E7D6" />

          {/* Right Ear */}
          <circle cx="149" cy="57" r="18" fill="#D9A883" stroke="#715447" strokeWidth="2.5" />
          <circle cx="148" cy="58" r="10" fill="#F8E7D6" />

          {/* Headphones (Behind/Over Ears) */}
          {pose === 'headphones' && (
            <g>
              <path
                d="M60 88C60 52 82 34 110 34C138 34 160 52 160 88"
                stroke="#715447"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M62 88C62 54 83 37 110 37C137 37 158 54 158 88"
                stroke="#E9AEBB"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Round Bear Head */}
          <ellipse cx="110" cy="84" rx="46" ry="40" fill="#D9A883" stroke="#715447" strokeWidth="2.5" />

          {/* Ear Cushions for Headphones */}
          {pose === 'headphones' && (
            <g>
              <rect x="52" y="72" width="14" height="28" rx="7" fill="#FFFDF9" stroke="#715447" strokeWidth="2.4" />
              <rect x="55" y="76" width="5" height="20" rx="2.5" fill="#E9AEBB" />
              <rect x="154" y="72" width="14" height="28" rx="7" fill="#FFFDF9" stroke="#715447" strokeWidth="2.4" />
              <rect x="160" y="76" width="5" height="20" rx="2.5" fill="#E9AEBB" />
            </g>
          )}

          {/* Cream Snout / Muzzle */}
          <ellipse cx="110" cy="95" rx="18" ry="14" fill="#FCEEE2" />

          {/* Rosy Dusty-Pink Cheeks */}
          <ellipse cx="79" cy="92" rx="7.5" ry="4.8" fill="#E9AEBB" opacity="0.72" />
          <ellipse cx="141" cy="92" rx="7.5" ry="4.8" fill="#E9AEBB" opacity="0.72" />

          {/* Eyes */}
          {showHappyClosedEyes ? (
            <>
              <path d="M84 82C86 78 91 78 93 82" stroke="#3E2A22" strokeWidth="2.6" strokeLinecap="round" />
              <path d="M127 82C129 78 134 78 136 82" stroke="#3E2A22" strokeWidth="2.6" strokeLinecap="round" />
            </>
          ) : isBlinking ? (
            <>
              <path d="M83 81H94" stroke="#3E2A22" strokeWidth="2.6" strokeLinecap="round" />
              <path d="M126 81H137" stroke="#3E2A22" strokeWidth="2.6" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="88.5" cy="80.5" r="4.6" fill="#3E2A22" />
              <circle cx="87" cy="78.8" r="1.5" fill="#FFFDF9" />
              <circle cx="131.5" cy="80.5" r="4.6" fill="#3E2A22" />
              <circle cx="130" cy="78.8" r="1.5" fill="#FFFDF9" />
            </>
          )}

          {/* Cute Stitched Nose & Smile */}
          <ellipse cx="110" cy="89" rx="5.5" ry="4" fill="#5D4037" />
          <ellipse cx="108.5" cy="88" rx="1.6" ry="0.9" fill="#FFFDF9" opacity="0.55" />
          <path d="M110 93V97" stroke="#5D4037" strokeWidth="2.1" strokeLinecap="round" />
          <path
            d="M103.5 97.5C105.5 100.5 108.5 100 110 97.5C111.5 100 114.5 100.5 116.5 97.5"
            stroke="#5D4037"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      </svg>
    </motion.div>
  );
}
