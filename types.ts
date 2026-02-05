export interface Chapter {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface Verse {
  id: number;
  verse_key: string;
  text_uthmani?: string;
  text_indopak?: string;
  translations?: Translation[];
  words?: Word[];
}

export interface Translation {
  id: number;
  resource_id: number;
  text: string;
}

export interface Word {
  id: number;
  position: number;
  audio_url: string;
  char_type_name: string;
  text_uthmani: string;
  translation: {
    text: string;
    language_name: string;
  };
  transliteration: {
    text: string;
    language_name: string;
  };
}

export interface Reciter {
  id: number;
  name: string;
  style?: string;
  recitation_style?: string;
}

export interface AudioResponse {
  audio_url: string;
}

// App State Types
export type ScriptType = 'uthmani' | 'indopak';
export type ReadingMode = 'translation' | 'reading'; // Translation shows side-by-side, Reading is just Arabic

export interface AppSettings {
  script: ScriptType;
  arabicFontSize: number;
  translationFontSize: number;
  showTranslation: boolean;
  darkMode: boolean;
  reciterId: number;
  autoScroll: boolean;
}