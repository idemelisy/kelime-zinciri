export class Motor {
  private readonly wordsByLetter: Record<string, string[]>;
  private readonly wordSet: Set<string>;
  private readonly wideWordsList: string[]; // Geniş liste
  private readonly narrowWordsList: string[]; // Dar liste (Yeni eklendi)

  // Artık constructor hem geniş (wideWords) hem dar (narrowWords) listeyi alıyor
  constructor(wideWords: string[], narrowWords: string[] = []) {
    this.wordsByLetter = {};
    this.wordSet = new Set();
    this.wideWordsList = [];
    this.narrowWordsList = [...narrowWords]; // Dar kelimeleri klonlayıp saklıyoruz

    for (const word of wideWords) {
      const cleanWord = Motor.normalize(word);
      if (!cleanWord) {
        continue;
      }

      this.wordSet.add(cleanWord);
      this.wideWordsList.push(word.trim());
      const firstLetter = cleanWord[0];
      const bucket = this.wordsByLetter[firstLetter] ?? [];
      bucket.push(word.trim());
      this.wordsByLetter[firstLetter] = bucket;
    }
  }

  static normalize(word: string): string {
    // Türkçe karakterleri güvenli şekilde küçültmek için yerel ayarlara uygun toLocaleLowerCase kullanmak daha iyidir
    return word.trim().toLocaleLowerCase('tr-TR');
  }

  contains(word: string): boolean {
    return this.wordSet.has(Motor.normalize(word));
  }

  // 🚀 ÖNEMLİ DEĞİŞİKLİK: puzzle.ts çağırınca sadece DAR kelimeleri dönecek
  allWords(): string[] {
    // Eğer dar liste boşsa (fallback olarak) geniş listeyi döner, doluysa sadece dar listeyi döner
    return this.narrowWordsList.length > 0 ? [...this.narrowWordsList] : [...this.wideWordsList];
  }

  // İhtiyaç halinde geniş kelimelerin hepsine erişmek istersen:
  allWideWords(): string[] {
    return [...this.wideWordsList];
  }

  neighbors(word: string): string[] {
    const normalized = Motor.normalize(word);
    if (!normalized) {
      return [];
    }

    return [...(this.wordsByLetter[normalized[normalized.length - 1]] ?? [])];
  }
}