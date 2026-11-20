import type { BirthdayConfig } from '../types/birthday';

export const DEFAULT_LETTER = `Happy birthday, my love.

Happy birthday madam jii... ❤️

Sach bolu toh mujhe samajh hi nahi aa raha ki aaj kya likhu aur kaise likhu, kyunki jo feel karta hu na tere liye, woh words mein explain karna thoda mushkil hai. Aur aaj sabse zyada bura is baat ka lag raha hai ki main tere saath nahi hu. Kaash aaj tere paas hota, tujhe hug karta, tere saath time spend karta, tujhe pareshan karta, tere saath hasta aur bas tere paas rehta.

Pata hai, tu meri life mein kab aayi aur kab itni important ho gayi, mujhe khud pata nahi chala. But ab meri life ke bohot saare chhote chhote parts mein tu hai. Din mein kuch achha ho toh tujhe batana, kuch bura ho toh tere paas aana, random baatein karna, tera mood, teri bakbak, tere nakhre, tujhe manana, tere saath faltu ki baaton pe hasna. I genuinely love all of it. Even the moments jab hum kuch baat nahi kar rahe hote, tab bhi tere saath rehna achha lagta hai.

Tu shayad khud nahi jaanti ki mere liye kitni special hai. Aur main shayad har baar tujhe sahi se bata bhi nahi pata. But I hope tu kabhi khud ko less samjhe toh meri nazar se khud ko dekhna. Tu bohot precious hai, aur tu jitni khushi, pyaar aur achhi cheezein deserve karti hai na, I hope tujhe life mein woh sab mile. Tere saare dreams poore ho, tu apni life mein bohot aage jaaye, khush rahe, aur tere chehre pe ye smile hamesha rahe.

Aur haan, mujhe pata hai main kabhi kabhi irritate karta hu, faltu mein tang karta hu, stupid baatein karta hu, but trust me, I wouldn't trade all of that for anything. Tu meri favourite person hai, even when you're being annoying (which is quite often 😂).

Aaj main tere paas nahi hu, aur ye thoda unfair hai, but distance doesn't change how much you mean to me. Agar teleport hona possible hota na, toh abhi tak main tere paas pahunch chuka hota.

I hope tera aaj ka din bohot achha jaaye, tu bohot hase, bohot khush rahe aur tujhe feel ho ki tu kitni loved hai.

Happy birthday, baby. ❤️ Thank you for being you, for being in my life, and for making so many ordinary days feel special.

I love you. And I really, really wish I was there with you today.`;

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
