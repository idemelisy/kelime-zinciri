export async function loadDictionary(): Promise<string[]> {
  const response = await fetch('/dictionary.json');

  if (!response.ok) {
    throw new Error('Failed to load dictionary.json');
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Invalid dictionary format');
  }

  return data.filter((word): word is string => typeof word === 'string');
}
