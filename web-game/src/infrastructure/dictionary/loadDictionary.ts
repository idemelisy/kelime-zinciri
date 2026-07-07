export type DictionaryData = {
  wideWords: string[];
  narrowWords: string[];
};

export async function loadDictionary(): Promise<DictionaryData> {
  // İki dosyayı da aynı anda (paralel) çekiyoruz
  const [wideResponse, narrowResponse] = await Promise.all([
    fetch('/dictionary.json'),
    fetch('/dar_dictionary.json') // 🚀 Dar kelimelerin olduğu yeni JSON dosyası
  ]);

  if (!wideResponse.ok) {
    throw new Error('Failed to load dictionary.json');
  }
  if (!narrowResponse.ok) {
    throw new Error('Failed to load dar_dictionary.json');
  }

  const wideData: unknown = await wideResponse.json();
  const narrowData: unknown = await narrowResponse.json();

  if (!Array.isArray(wideData) || !Array.isArray(narrowData)) {
    throw new Error('Invalid dictionary format');
  }

  const filterStrings = (list: unknown[]): string[] =>
    list.filter((word): word is string => typeof word === 'string');

  return {
    wideWords: filterStrings(wideData),
    narrowWords: filterStrings(narrowData)
  };
}