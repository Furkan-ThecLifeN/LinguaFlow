import { Song, Word, UserProgress } from './types';

export const MOCK_WORDS: Word[] = [
  {
    id: 'w1',
    text: 'Ephemeral',
    pos: 'adjective',
    pronunciation: '/əˈfem(ə)rəl/',
    definition: 'Lasting for a very short time.',
    difficulty: 'C1',
    translations: { tr: 'Geçici, fani' },
    examples: [
      { id: 'e1', en: 'Fashions are ephemeral, changing with every season.', tr: 'Modalar geçicidir, her sezon değişir.' }
    ]
  },
  {
    id: 'w2',
    text: 'Serendipity',
    pos: 'noun',
    pronunciation: '/ˌserənˈdipədē/',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
    difficulty: 'B2',
    translations: { tr: 'Mutlu tesadüf' },
    examples: [
      { id: 'e2', en: 'It was pure serendipity that we met at the coffee shop.', tr: 'Kahve dükkanında karşılaşmamız tam bir mutlu tesadüftü.' }
    ]
  },
  {
    id: 'w3',
    text: 'Run',
    pos: 'verb',
    pronunciation: '/rən/',
    definition: 'Move at a speed faster than a walk.',
    difficulty: 'A1',
    translations: { tr: 'Koşmak' },
    forms: { past: 'ran', pastParticiple: 'run' },
    examples: [
      { id: 'e3', en: 'I run every morning.', tr: 'Her sabah koşarım.' }
    ]
  },
  {
    id: 'w4',
    text: 'Resilient',
    pos: 'adjective',
    pronunciation: '/rəˈzilyənt/',
    definition: 'Able to withstand or recover quickly from difficult conditions.',
    difficulty: 'B2',
    translations: { tr: 'Dirençli, esnek' },
    examples: [
      { id: 'e4', en: 'Babies are generally very resilient.', tr: 'Bebekler genellikle çok dirençlidir.' }
    ]
  }
];

export const MOCK_SONGS: Song[] = [
  {
    id: 's1',
    title: 'Learning English Song',
    artist: 'Educational Beat',
    coverUrl: 'https://picsum.photos/200/200',
    // Using a placeholder audio that works (short beep/tone often available or a generic link)
    // For demo purposes, we will simulate playback if the URL doesn't actually load sound.
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 
    lyrics: [
      { id: 'l1', startSec: 0, endSec: 4, text: 'Welcome to the journey of learning' },
      { id: 'l2', startSec: 4, endSec: 8, text: 'Take a step, keep the fire burning' },
      { id: 'l3', startSec: 8, endSec: 12, text: 'Vocabulary grows day by day' },
      { id: 'l4', startSec: 12, endSec: 16, text: 'Practice hard and find your way' },
      { id: 'l5', startSec: 16, endSec: 20, text: 'Listen to the rhythm, speak it out loud' },
      { id: 'l6', startSec: 20, endSec: 25, text: 'Stand tall and make yourself proud' }
    ]
  }
];

export const MOCK_PROGRESS: UserProgress[] = [
  {
    wordId: 'w1',
    easiness: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewDate: Date.now() - 10000 // Due now
  }
];
