import { readFile, writeFile } from 'node:fs/promises';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDirectory, '..', '..');
const sourceDirectory = path.join(workspaceRoot, 'Turkce-Kelime-Listesi');
const outputFile = path.join(workspaceRoot, 'web-game', 'public', 'dictionary.json');

const fileNames = (await readdir(sourceDirectory)).filter((fileName) => fileName.endsWith('.list'));
const words = new Set();

for (const fileName of fileNames) {
  const filePath = path.join(sourceDirectory, fileName);
  const content = await readFile(filePath, 'utf8');

  for (const line of content.split(/\r?\n/)) {
    const word = line.trim();
    if (word) {
      words.add(word);
    }
  }
}

await writeFile(outputFile, JSON.stringify([...words], null, 2), 'utf8');
console.log(`Wrote ${words.size} words to ${outputFile}`);
