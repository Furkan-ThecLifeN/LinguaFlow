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

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

export enum GameType {
  MATCHING = 'MATCHING',
  FLASHCARD = 'FLASHCARD',
  VERB_FORMS = 'VERB_FORMS'
}