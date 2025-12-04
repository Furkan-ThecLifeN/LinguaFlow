import { UserProgress } from '../types';

/**
 * Calculates the next interval and easiness factor based on the SM-2 algorithm.
 * 
 * @param currentProgress Current state of the word for the user
 * @param quality 0-5 rating (0=blackout, 5=perfect)
 */
export const calculateSM2 = (
  currentProgress: UserProgress | undefined,
  quality: number
): UserProgress => {
  // Defaults for a new word
  let interval = 0;
  let repetitions = 0;
  let easiness = 2.5;

  if (currentProgress) {
    interval = currentProgress.interval;
    repetitions = currentProgress.repetitions;
    easiness = currentProgress.easiness;
  }

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easiness);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  // Update Easiness Factor
  easiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easiness < 1.3) easiness = 1.3;

  // Calculate next review date (in ms)
  const nextReviewDate = Date.now() + interval * 24 * 60 * 60 * 1000;

  return {
    wordId: currentProgress?.wordId || '',
    easiness,
    interval,
    repetitions,
    nextReviewDate
  };
};
