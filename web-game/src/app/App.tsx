import { useEffect, useState, type FormEvent } from 'react';
import './App.css';
import { Motor } from '../domain/game/motor';
import { generatePuzzle, type Puzzle } from '../domain/game/puzzle';
import { loadDictionary } from '../infrastructure/dictionary/loadDictionary';

function displayWord(word: string): string {
  return word.toLocaleUpperCase('tr-TR');
}

export default function App() {
  const [motor, setMotor] = useState<Motor | null>(null);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [currentWord, setCurrentWord] = useState('');
  const [enteredWords, setEnteredWords] = useState<string[]>([]);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  useEffect(() => {
    let active = true;

    loadDictionary().then((words) => {
      if (!active) {
        return;
      }

      const motor = new Motor(words);
      const nextPuzzle = generatePuzzle(motor);
      setMotor(motor);
      setPuzzle({
        ...nextPuzzle,
        start: Motor.normalize(nextPuzzle.start),
        target: Motor.normalize(nextPuzzle.target),
        solution: nextPuzzle.solution.map((word) => Motor.normalize(word)),
      });
      setEnteredWords([Motor.normalize(nextPuzzle.start)]);
      setValidationMessages([]);
      setSuccessMessage('');
      setGameOver(false);
      console.debug('Puzzle solution', nextPuzzle.solution);
    });

    return () => {
      active = false;
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!motor || !puzzle) {
      return;
    }

    const nextWord = Motor.normalize(currentWord);
    const nextMessages: string[] = [];
    const previousWord = enteredWords[enteredWords.length - 1];

    if (!nextWord) {
      nextMessages.push('Kelime girin.');
    }

    if (nextWord && !motor.contains(nextWord)) {
      nextMessages.push('Kelime sözlükte yok.');
    }

    if (nextWord && enteredWords.some((word) => word === nextWord)) {
      nextMessages.push('Kelime zaten kullanıldı.');
    }

    if (nextWord && previousWord && nextWord[0] !== previousWord[previousWord.length - 1]) {
      nextMessages.push(`Kelime '${previousWord[previousWord.length - 1]}' harfiyle başlamalı.`);
    }

    if (nextMessages.length > 0) {
      setValidationMessages(nextMessages);
      setSuccessMessage('');
      return;
    }

    const updatedWords = [...enteredWords, nextWord];
    setEnteredWords(updatedWords);
    setCurrentWord('');
    setValidationMessages([]);

    if (nextWord[nextWord.length - 1] === puzzle.target[0]) {
      setGameOver(true);
      setSuccessMessage('Başarılı! Hedef kelimeye ulaştınız.');
      return;
    }

    setSuccessMessage('');
  }

  return (
    <main className="game-shell">
      <section className="game-card" aria-labelledby="game-title">
        <header className="game-header">
          
          <h1 id="game-title">Kelime Zinciri</h1>
          <p className="subtitle">Önceki kelimenin son harfiyle başlayan kelimeleri üret ve zinciri tamamla</p>
        </header>

        <dl className="word-summary" aria-label="Game words">
          <div>
            <dt>Başlangıç</dt>
            <dd>{puzzle ? displayWord(puzzle.start) : 'Loading...'}</dd>
          </div>
          <div>
            <dt>Hedef Kelime</dt>
            <dd>{puzzle ? displayWord(puzzle.target) : 'Loading...'}</dd>
          </div>
        </dl>

        <section className="panel" aria-labelledby="entered-words-title">
         
          <ul className="word-list" aria-live="polite">
            {enteredWords.map((word) => (
              <li key={word}>{displayWord(word)}</li>
            ))}
          </ul>
        </section>

        {!gameOver ? (
          <form className="entry-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="word-input">
              Enter next word
            </label>
            <input
              id="word-input"
              name="word-input"
              type="text"
              placeholder="Kelime girin..."
              autoComplete="off"
              value={displayWord(currentWord)}
              onChange={(event) => setCurrentWord(Motor.normalize(event.target.value))}
            />
            <button type="submit" disabled={!puzzle}>
                Gönder
            </button>
          </form>
        ) : null}

        <section className="panel validation-panel">
          <ul className="message-list" aria-live="polite">
            {successMessage ? <li className="success-message">{successMessage}</li> : null}
            {validationMessages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
