import type { BirthdayConfig } from '../types/birthday';

export const DEFAULT_LETTER = `Happy birthday, my love.

I wish I could be there today. I wish I could see your smile, annoy you in person, hold your hand and make this day feel a little more special.

But even with all this distance between us, there's one thing distance has never managed to change — the way I feel about you.

You have become a part of my everyday life in ways I can't even explain. The little conversations, your random moods, your laughter, the way you tell me things, even the moments when we don't have anything to say.

I hope this new year of your life brings you the kind of happiness you deserve. I hope you achieve everything you dream about. And whenever life gets difficult, I hope you remember that somewhere, there's someone who believes in you, chooses you, and loves you more than he knows how to express.

I can't be there to celebrate with you today, but if love could travel, mine would already be sitting right next to you.

Happy birthday. I love you.`;

export const DEFAULT_BIRTHDAY_CONFIG: BirthdayConfig = {
  recipientName: 'baby',
  openingTitle: 'Hey, birthday girl.',
  openingSubtitle: 'I made a tiny little world for you.',
  photoTitle: 'One of my favourite people in this entire world.',
  photoSubtitle: 'Even from miles away, seeing your smile makes everything softer.',
  photoHandwrittenNote: 'my favourite view',
  photoDataUrl: '/assets/aistudio/Snapchat-1892629192.jpg_8d6c0cff.jpeg',
  journeyHeading: 'A few little things I carry with me',
  journeyMessages: [
    "You're my favourite notification.",
    'Even ordinary days feel different with you.',
    "If I could teleport anywhere, you already know where I'd go.",
    "You're the person I'd choose in every version of my life.",
    'No distance has ever made me feel less yours.',
  ],
  letterHeading: 'Some things I wish I could tell you in person.',
  letterBody: DEFAULT_LETTER,
  voiceHeading: "There's something I wanted you to hear.",
  voiceSubtitle: 'Not in a text. In my own voice.',
  audioDataUrl: null,
  audioFileName: null,
  giftsHeading: 'I kept a few little things for you.',
  giftMessages: [
    'I hope you never forget how special you are to me.',
    'I wish I could steal a hug from you right now.',
    "No matter how far apart we are, you're still my favourite place.",
  ],
  finaleLine1: 'If I could be anywhere in the world right now...',
  finaleLine2: "I'd be right next to you.",
  finaleGreeting: 'Happy birthday, baby.',
  finaleClosing: 'I love you. More than this little website could ever tell you.',
};

export function mergeConfig(partial?: Partial<BirthdayConfig> | null): BirthdayConfig {
  if (!partial) {
    return {
      ...DEFAULT_BIRTHDAY_CONFIG,
      journeyMessages: [...DEFAULT_BIRTHDAY_CONFIG.journeyMessages] as [
        string,
        string,
        string,
        string,
        string,
      ],
      giftMessages: [...DEFAULT_BIRTHDAY_CONFIG.giftMessages] as [string, string, string],
    };
  }

  const journeyMessages: [string, string, string, string, string] = [
    partial.journeyMessages?.[0] ?? DEFAULT_BIRTHDAY_CONFIG.journeyMessages[0],
    partial.journeyMessages?.[1] ?? DEFAULT_BIRTHDAY_CONFIG.journeyMessages[1],
    partial.journeyMessages?.[2] ?? DEFAULT_BIRTHDAY_CONFIG.journeyMessages[2],
    partial.journeyMessages?.[3] ?? DEFAULT_BIRTHDAY_CONFIG.journeyMessages[3],
    partial.journeyMessages?.[4] ?? DEFAULT_BIRTHDAY_CONFIG.journeyMessages[4],
  ];

  const giftMessages: [string, string, string] = [
    partial.giftMessages?.[0] ?? DEFAULT_BIRTHDAY_CONFIG.giftMessages[0],
    partial.giftMessages?.[1] ?? DEFAULT_BIRTHDAY_CONFIG.giftMessages[1],
    partial.giftMessages?.[2] ?? DEFAULT_BIRTHDAY_CONFIG.giftMessages[2],
  ];

  return {
    ...DEFAULT_BIRTHDAY_CONFIG,
    ...partial,
    journeyMessages,
    giftMessages,
  };
}
