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
  // 1. Geniş liste yerine sadece DAR kelimeleri tutan metodu çağırıyoruz
  // Not: Motor sınıfınızda bu metodun adı farklı olabilir (örn: getDarWords, darWords, allWords)
  // motor.allWords() metodunun TypeScript'te de sadece dar kelimeleri döndüğünden emin olun.
  const darWords = motor.allWords(); 
  
  // Hızlı arama için dar kelimeleri bir Set haline getirelim
  const darWordsSet = new Set(darWords.map(w => Motor.normalize(w)));

  while (true) {
    // 🚀 BAŞLANGIÇ KELİMESİNİ DAR LİSTEDEN SEÇİYORUZ
    const start = darWords[Math.floor(Math.random() * darWords.length)];
    const used = new Set([Motor.normalize(start)]);

    const w1 = randomNeighbor(motor, start, used);
    if (!w1) continue;
    used.add(Motor.normalize(w1));

    const w2 = randomNeighbor(motor, w1, used);
    if (!w2) continue;
    used.add(Motor.normalize(w2));

    const w3 = randomNeighbor(motor, w2, used);
    if (!w3) continue;
    used.add(Motor.normalize(w3));

    // 🚀 HEDEF KELİME ADAYLARINI SADECE DAR LİSTEDEN SEÇİYORUZ
    const neighborsOfW3 = motor.neighbors(w3);
    const targetCandidates = neighborsOfW3.filter(w => 
      !used.has(Motor.normalize(w)) && darWordsSet.has(Motor.normalize(w))
    );

    if (targetCandidates.length === 0) continue;

    const target = targetCandidates[Math.floor(Math.random() * targetCandidates.length)];

    return {
      start: start,
      target: target,
      solution: [start, w1, w2, w3, target]
    };
  }
}