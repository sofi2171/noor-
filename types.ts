
export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunrise: string;
}

export interface Hadith {
  text: string;
  source: string;
  narrator: string;
  authenticity: string;
}

export interface QuranVerse {
  text: string;
  translation: string;
  surah: string;
  number: number;
}

export interface Adhkar {
  id: number;
  arabic: string;
  translation: string;
  benefit?: string;
}

export type ActiveTab = 'dashboard' | 'quran' | 'hadith' | 'scholar' | 'zakat' | 'qibla' | 'tasbeeh';
export type Language = 'ur' | 'en';

export interface Surah {
  id: number;
  name: string;
  english: string;
  verses: number;
  type: string;
}
