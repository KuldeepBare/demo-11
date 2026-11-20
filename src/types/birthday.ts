export interface BirthdayConfig {
  recipientName: string;
  openingTitle: string;
  openingSubtitle: string;
  photoTitle: string;
  photoSubtitle: string;
  photoHandwrittenNote: string;
  photoDataUrl: string | null;
  journeyHeading: string;
  journeyMessages: [string, string, string, string, string];
  letterHeading: string;
  letterBody: string;
  voiceHeading: string;
  voiceSubtitle: string;
  audioDataUrl: string | null;
  audioFileName: string | null;
  giftsHeading: string;
  giftMessages: [string, string, string];
  finaleLine1: string;
  finaleLine2: string;
  finaleGreeting: string;
  finaleClosing: string;
}

export interface ExportedPayload extends BirthdayConfig {
  hideEditor?: boolean;
}

declare global {
  interface Window {
    __BIRTHDAY_EXPORTED_CONFIG__?: Partial<BirthdayConfig>;
    __BIRTHDAY_HIDE_EDITOR__?: boolean;
  }
}
