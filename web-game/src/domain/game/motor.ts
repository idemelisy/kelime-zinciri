export class Motor {
  private readonly wordsByLetter: Record<string, string[]>;
  private readonly wordSet: Set<string>;
  private readonly allWordsList: string[];

  constructor(words: string[]) {
    this.wordsByLetter = {};
    this.wordSet = new Set();
    this.allWordsList = [];

    for (const word of words) {
      const cleanWord = Motor.normalize(word);
      if (!cleanWord) {
        continue;
      }

      this.wordSet.add(cleanWord);
      this.allWordsList.push(word.trim());
      const firstLetter = cleanWord[0];
      const bucket = this.wordsByLetter[firstLetter] ?? [];
      bucket.push(word.trim());
      this.wordsByLetter[firstLetter] = bucket;
    }
  }

  static normalize(word: string): string {
    return word.trim().toLowerCase();
  }

  contains(word: string): boolean {
    return this.wordSet.has(Motor.normalize(word));
  }

  allWords(): string[] {
    return [...this.allWordsList];
  }

  neighbors(word: string): string[] {
    const normalized = Motor.normalize(word);
    if (!normalized) {
      return [];
    }

    return [...(this.wordsByLetter[normalized[normalized.length - 1]] ?? [])];
  }
}
