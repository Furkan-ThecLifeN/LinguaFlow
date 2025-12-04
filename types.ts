
export interface Word {
  id: string;
  text: string;
  pos: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition';
  pronunciation: string;
  definition: string;
  forms?: {
    past?: string;
    pastParticiple?: string;
  };
  examples: Example[];
  translations: {
    tr: string;
  };
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  createdAt: number; // Timestamp for dashboard charts
}

export interface Example {
  id: string;
  en: string;
  tr: string;
}

export interface LyricLine {
  id: string;
  startSec: number;
  endSec: number;
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  lyrics: LyricLine[];
}

export interface UserProgress {
  wordId: string;
  easiness: number;
  interval: number;
  repetitions: number;
  nextReviewDate: number;
}

export interface UserStats {
  totalStudyTimeMinutes: number;
  wordsLearned: number;
  songsListened: number;
  lastLoginDate: string;
}

export interface UserProfile {
  id: string; // Unique ID for local storage key
  name: string;
  email: string;
  password?: string; // For local auth simulation
  avatarUrl: string;
  stats: UserStats;
}

export enum GameType {
  MATCHING = 'MATCHING',
  FLASHCARD = 'FLASHCARD',
  VERB_FORMS = 'VERB_FORMS'
}
