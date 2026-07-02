import { Motor } from './motor';

export type Puzzle = {
  start: string;
  target: string;
  solution: string[];
};

function randomNeighbor(motor: Motor, word: string, used: Set<string>): string | null {
  const candidates = motor.neighbors(word).filter((candidate) => !used.has(Motor.normalize(candidate)));

  if (candidates.length === 0) {
    return null;
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function generatePuzzle(motor: Motor): Puzzle {
  const allWords = motor.allWords();

  if (allWords.length === 0) {
    throw new Error('Dictionary is empty');
  }

  while (true) {
    const start = allWords[Math.floor(Math.random() * allWords.length)];
    const used = new Set([Motor.normalize(start)]);

    const word1 = randomNeighbor(motor, start, used);
    if (!word1) {
      continue;
    }
    used.add(Motor.normalize(word1));

    const word2 = randomNeighbor(motor, word1, used);
    if (!word2) {
      continue;
    }
    used.add(Motor.normalize(word2));

    const word3 = randomNeighbor(motor, word2, used);
    if (!word3) {
      continue;
    }
    used.add(Motor.normalize(word3));

    const targetCandidates = motor
      .neighbors(word3)
      .filter((candidate) => !used.has(Motor.normalize(candidate)));

    if (targetCandidates.length === 0) {
      continue;
    }

    const target = targetCandidates[Math.floor(Math.random() * targetCandidates.length)];

    return {
      start,
      target,
      solution: [start, word1, word2, word3, target],
    };
  }
}
