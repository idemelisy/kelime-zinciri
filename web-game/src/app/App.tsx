import { useEffect, useRef, useState, type FormEvent } from 'react';
import Header from "../components/Header";
import GoalBar from "../components/GoalBar";
import WordChain from "../components/WordChain";
import MessageBox from "../components/MessageBox";
import HowToPlay from "../components/HowToPlay";
import "./App.css";  
 import "../styles/variables.css";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [showHelp, setShowHelp] = useState(true);
  function createNewPuzzle(gameMotor: Motor) {

    const nextPuzzle = generatePuzzle(gameMotor);

    setPuzzle({
        ...nextPuzzle,
        start: Motor.normalize(nextPuzzle.start),
        target: Motor.normalize(nextPuzzle.target),
        solution: nextPuzzle.solution.map(Motor.normalize),
    });

    setEnteredWords([
        Motor.normalize(nextPuzzle.start),
    ]);

    setCurrentWord("");

    setValidationMessages([]);

    setSuccessMessage("");

    setGameOver(false);

    console.debug(nextPuzzle.solution);
}
  useEffect(() => {
    let active = true;

    loadDictionary().then((words) => {
  if (!active) {
    return;
  }

  const gameMotor = new Motor(words);

  setMotor(gameMotor);

  createNewPuzzle(gameMotor);
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
      setCurrentWord('');
      
      return;
    }
    inputRef.current?.focus();
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
       <Header

title="Kelime Zinciri"

subtitle="Önceki kelimenin son harfiyle başlayan kelimeleri üret."    />
{showHelp && (
    <HowToPlay
        onClose={() => setShowHelp(false)}/>
)}


        {puzzle && (

<GoalBar

start={displayWord(puzzle.start)}

target={displayWord(puzzle.target)}

/>

)}
<WordChain
    words={enteredWords.map(displayWord)}
/>
      
        {!gameOver ? (
          <form className="entry-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="word-input">
              Enter next word
            </label>
            <input
              ref={inputRef}
              autoFocus
              id="word-input"
              name="word-input"
              type="text"
              placeholder="Kelime girin..."
              autoComplete="off"
              value={currentWord}
              onChange={(event) => setCurrentWord(Motor.normalize(event.target.value))}
            />
            <button type="submit" disabled={!puzzle}>
                Gönder
            </button>
          </form>
) : (

motor && (

<button
className="new-game-btn"
onClick={() => createNewPuzzle(motor)}
>

Yeni Oyun

</button>

)

)}

        

       <MessageBox
    success={successMessage}
    errors={validationMessages}
/>
      </section>
    </main>
  );
}
