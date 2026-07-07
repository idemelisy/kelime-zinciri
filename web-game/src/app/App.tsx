// import { useEffect, useRef, useState, type FormEvent } from 'react';
// import Keyboard from "../components/Keyboard";
// import Header from "../components/Header";
// import GoalBar from "../components/GoalBar";
// import WordChain from "../components/WordChain";
// import MessageBox from "../components/MessageBox";
// import VictoryScreen from "../components/VictoryScreen";
// import CircularTimer from "../components/CircularTimer";
// import LandingPage from "../components/LandingPage";
// import "./App.css";  
//  import "../styles/variables.css";
// import { Motor } from '../domain/game/motor';
// import { generatePuzzle, type Puzzle } from '../domain/game/puzzle';
// import { loadDictionary } from '../infrastructure/dictionary/loadDictionary';

// function displayWord(word: string): string {
//   return word.toLocaleUpperCase('tr-TR');
// }

// export default function App() {
//   const [motor, setMotor] = useState<Motor | null>(null);
//   const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
//   const [currentWord, setCurrentWord] = useState('');
//   const [enteredWords, setEnteredWords] = useState<string[]>([]);
//   const [validationMessages, setValidationMessages] = useState<string[]>([]);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [gameOver, setGameOver] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);
// const [startTime, setStartTime] = useState(Date.now());
// const [elapsedSeconds, setElapsedSeconds] = useState(0);
//   const [shakeInput, setShakeInput] = useState(false);
//   const [gameStarted, setGameStarted] = useState(false);
//   const TURN_TIME = 7;
// const [timeLeft, setTimeLeft] = useState(TURN_TIME);
// const [isTimeOut, setIsTimeOut] = useState(false);
//   function createNewPuzzle(gameMotor: Motor) {

//     const nextPuzzle = generatePuzzle(gameMotor);

//     setPuzzle({
//         ...nextPuzzle,
//         start: Motor.normalize(nextPuzzle.start),
//         target: Motor.normalize(nextPuzzle.target),
//         solution: nextPuzzle.solution.map(Motor.normalize),
//     });

//     setEnteredWords([
//         Motor.normalize(nextPuzzle.start),
//     ]);

//     setCurrentWord("");

//     setValidationMessages([]);

//     setSuccessMessage("");

//     setGameOver(false);
//     setStartTime(Date.now());
// setElapsedSeconds(0);
//     setTimeLeft(TURN_TIME);
//     console.debug(nextPuzzle.solution);
// }
//   useEffect(() => {
//     let active = true;

//    loadDictionary().then(({ wideWords, narrowWords }) => {
//     if (!active) {
//       return;
//     }
//   const gameMotor = new Motor(wideWords, narrowWords);

//   setMotor(gameMotor);
//   createNewPuzzle(gameMotor);
//   setIsTimeOut(false);
// });
//     return () => {
//       active = false;
//     };
//   }, []);
// useEffect(() => {
//   // Oyun bittiyse veya puzzle henüz yüklenmediyse sayacı çalıştırma
//   if (gameOver || !puzzle) return;

//   const timer = setInterval(() => {
//     setTimeLeft((prev) => {
//       if (prev <= 1) {
//         clearInterval(timer);
//         setIsTimeOut(true);
//         setGameOver(true);
//         setSuccessMessage("");
//         setValidationMessages(["⏰ Süre doldu!"]);
//         return 0;
//       }
//       return prev - 1;
//     });
//   }, 1000);

//   // ⚡ ÖNEMLİ: Her saniye değişiminde veya kelime gönderilip timeLeft sıfırlandığında 
//   // eski zamanlayıcıyı temizleyip yenisini başlatır.
//   return () => clearInterval(timer);

// }, [gameOver, puzzle, timeLeft]); // 🚀 Bağımlılıklar arasına `timeLeft` eklendi!
// const handleKeyClick = (key: string) => {
//   if (gameOver) return;
//   // Mevcut kelimenin sonuna basılan harfi ekle
//   setCurrentWord((prev) => prev + key);
//   inputRef.current?.focus();
// };

// const handleDelete = () => {
//   if (gameOver) return;
//   // Son harfi sil
//   setCurrentWord((prev) => prev.slice(0, -1));
//   inputRef.current?.focus();
// };
//   function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     if (!motor || !puzzle) {
//       return;
//     }
//     const nextWord = Motor.normalize(currentWord);
//     const nextMessages: string[] = [];
//     const previousWord = enteredWords[enteredWords.length - 1];
//     if (!nextWord) {
//       nextMessages.push('Kelime girin.');
//     }
//     else if (nextWord && !motor.contains(nextWord)) {
//       nextMessages.push('Kelime sözlükte yok.');
//     }
//     else if (nextWord && enteredWords.some((word) => word === nextWord)) {
//       nextMessages.push('Kelime zaten kullanıldı.');
//     }
//     else if (nextWord && previousWord && nextWord[0] !== previousWord[previousWord.length - 1]) {
//       nextMessages.push(`Kelime '${previousWord[previousWord.length - 1]}' harfiyle başlamalı.`);
//     }
//     if (nextMessages.length > 0) {
//     setShakeInput(true);
//     setTimeout(() => {
//         setShakeInput(false);
//     }, 450);
//     setValidationMessages(nextMessages);
//     setSuccessMessage('');
//     setCurrentWord('');
//     return;
// }
//     inputRef.current?.focus();
//     const updatedWords = [...enteredWords, nextWord];
//     setEnteredWords(updatedWords);
//     setTimeLeft(TURN_TIME);
//     setCurrentWord('');
//     setValidationMessages([]);

//    if (nextWord[nextWord.length - 1] === puzzle.target[0]) {
//     setEnteredWords([...updatedWords, puzzle.target]);
//     setElapsedSeconds(
//         Math.floor(
//             (Date.now() - startTime) / 1000
//         )
//     );

//     setGameOver(true);

//     setSuccessMessage("");

//     return;
// }

//     setSuccessMessage('');
//   }
//  if (!gameStarted) {
//     return (
//       <main className="game-shell">
//         <LandingPage
//           onStart={() => setGameStarted(true)}/>
//       </main>);}
//   return (
//     <main className="game-shell">
//       <section className="game-card" aria-labelledby="game-title"> 
//        <Header
//         title="Kelime Zinciri" subtitle=""/>
//         {puzzle && !gameOver &&(<GoalBar start={displayWord(puzzle.start)} 
//         target={displayWord(puzzle.target)}/>)}

//       {!gameOver && (
//         <CircularTimer
//           timeLeft={timeLeft}
//           totalTime={TURN_TIME}
//         />
//       )}
// <WordChain
//     words={enteredWords.map(displayWord)}
//     completed={gameOver}
// />
      
//         {!gameOver ? (

// <form className="entry-form" onSubmit={handleSubmit}>

// <label className="sr-only" htmlFor="word-input">
// Enter next word
// </label>

// <input
// ref={inputRef}
// autoFocus
// id="word-input"
// name="word-input"
// type="text"

// autoComplete="off"
// value={currentWord}
// onChange={(event)=>
// setCurrentWord(
// Motor.normalize(event.target.value)
// )}
// />


// </form>
// ) : (
//         motor && (
//           isTimeOut ? (
//             <div className="timeout-screen">
//               <h2>⏱️ Süre Doldu!</h2>
//               <p>Zamanında kelime üretemediğin için oyun bitti.</p>
//               <button className="new-game-btn" onClick={() => createNewPuzzle(motor)}>
//                 Yeniden Dene
//               </button>
//             </div>
//           ) : (
//             <VictoryScreen
//               wordsUsed={enteredWords.length}
//               elapsedSeconds={elapsedSeconds}
//               onNewGame={() => createNewPuzzle(motor)}
//             />
//           )
//         )
//       )}

//       {!gameOver && (
//         <MessageBox
//           success={successMessage}
//           errors={validationMessages}
//         />
//       )}

//       {!gameOver && puzzle && (
//         <Keyboard 
//           onKeyClick={handleKeyClick}
//           onDelete={handleDelete}
//           onSubmit={() => {
//             const mockEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
//             handleSubmit(mockEvent);
//           }}
//         />
//       )}

//     </section>
//   </main>
// );
// }
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Keyboard from "../components/Keyboard";
import Header from "../components/Header";
import GoalBar from "../components/GoalBar";
import WordChain from "../components/WordChain";
import MessageBox from "../components/MessageBox";
import VictoryScreen from "../components/VictoryScreen";
import CircularTimer from "../components/CircularTimer";
import LandingPage from "../components/LandingPage";
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
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [shakeInput, setShakeInput] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const TURN_TIME = 7;
  const [timeLeft, setTimeLeft] = useState(TURN_TIME);
  const [isTimeOut, setIsTimeOut] = useState(false);

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
    setStartTime(Date.now());
    setElapsedSeconds(0);
    setTimeLeft(TURN_TIME);
    console.debug(nextPuzzle.solution);
  }

  useEffect(() => {
    let active = true;

    loadDictionary().then(({ wideWords, narrowWords }) => {
      if (!active) return;
      const gameMotor = new Motor(wideWords, narrowWords);
      setMotor(gameMotor);
      createNewPuzzle(gameMotor);
      setIsTimeOut(false);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (gameOver || !puzzle) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeOut(true);
          setGameOver(true);
          setSuccessMessage("");
          setValidationMessages(["⏰ Süre doldu!"]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, puzzle, timeLeft]);

  const handleKeyClick = (key: string) => {
    if (gameOver) return;
    setCurrentWord((prev) => prev + key.toLocaleUpperCase('tr-TR'));
    inputRef.current?.focus();
  };

  const handleDelete = () => {
    if (gameOver) return;
    setCurrentWord((prev) => prev.slice(0, -1));
    inputRef.current?.focus();
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!motor || !puzzle) return;

    const nextWord = Motor.normalize(currentWord);
    const nextMessages: string[] = [];
    const previousWord = enteredWords[enteredWords.length - 1];

    if (!nextWord) {
      nextMessages.push('Kelime girin.');
    }
    else if (nextWord && !motor.contains(nextWord)) {
      nextMessages.push('Kelime sözlükte yok.');
    }
    else if (nextWord && enteredWords.some((word) => word === nextWord)) {
      nextMessages.push('Kelime zaten kullanıldı.');
    }
    else if (nextWord && previousWord && nextWord[0] !== previousWord[previousWord.length - 1]) {
      nextMessages.push(`Kelime '${previousWord[previousWord.length - 1]}' harfiyle başlamalı.`);
    }

    if (nextMessages.length > 0) {
      setShakeInput(true);
      setTimeout(() => {
          setShakeInput(false);
      }, 450);
      setValidationMessages(nextMessages);
      setSuccessMessage('');
      setCurrentWord('');
      return;
    }

    inputRef.current?.focus();
    const updatedWords = [...enteredWords, nextWord];
    setEnteredWords(updatedWords);
    setTimeLeft(TURN_TIME);
    setCurrentWord('');
    setValidationMessages([]);

    if (nextWord[nextWord.length - 1] === puzzle.target[0]) {
      setEnteredWords([...updatedWords, puzzle.target]);
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      setGameOver(true);
      setSuccessMessage("");
      return;
    }

    setSuccessMessage('');
  }

  // Ekranda boş bir yere basıldığında odağın (focus) kaybolmaması için tetikleyici
  const handleWrapperClick = () => {
    if (!gameOver) {
      inputRef.current?.focus();
    }
  };

  if (!gameStarted) {
    return (
      <main className="game-shell">
        <LandingPage onStart={() => setGameStarted(true)}/>
      </main>
    );
  }

  return (
    <main className="game-shell" onClick={handleWrapperClick}>
      <section className={`game-card ${shakeInput ? 'shake' : ''}`} aria-labelledby="game-title"> 
        <Header title="Kelime Zinciri" subtitle=""/>
        
        {puzzle && !gameOver && (
          <GoalBar start={displayWord(puzzle.start)} target={displayWord(puzzle.target)}/>
        )}

        {!gameOver && (
          <CircularTimer timeLeft={timeLeft} totalTime={TURN_TIME} />
        )}

        {/* SİLİNEN <WordChain ... /> YERİNE GELECEK YENİ YAPI */}
<div className="chain-panel">
  {enteredWords.map((word, wordIndex) => {
    const formattedWord = displayWord(word);
    const isLastWord = wordIndex === enteredWords.length - 1;

    return (
      <div key={wordIndex} className="chain-item">
        {/* Her kelime için Wordle tarzı yan yana dizilen satır */}
        <div className={`wordle-row historical ${gameOver ? 'completed-card' : ''}`}>
          {formattedWord.split('').map((char, charIndex) => {
            // Eğer bu listedeki en son kelimgeyse VE şu an bastığımız harf bu kelimenin SON harfiyse parlatıyoruz
            const isChainLink = isLastWord && charIndex === formattedWord.length - 1 && !gameOver;

            return (
              <div
                key={charIndex}
                className={`tile history-tile ${isChainLink ? 'chain-connector' : ''}`}
              >
                {char}
              </div>
            );
          })}
        </div>

        {/* Kelimeler arasındaki akış oku */}
        {wordIndex < enteredWords.length - 1 && (
          <div className="chain-arrow">↓</div>
        )}
      </div>
    );
  })}
</div>
        {!gameOver ? (
          <form className="entry-form" onSubmit={handleSubmit}>

            {/* Gerçek girdiyi alan şeffaf/görünmez input */}
            <input
              ref={inputRef}
              autoFocus
              id="word-input"
              name="word-input"
              type="text"
              autoComplete="off"
              value={currentWord}
              onChange={(event) => setCurrentWord(event.target.value.toLocaleUpperCase('tr-TR'))}
            />

            {/* Gerçek Zamanlı Üretilen Wordle Harf Kutucukları */}
            <div className="wordle-row">
              {/* Durum 1: Eğer kullanıcı henüz hiçbir şey yazmadıysa imleçli tek bir boş kutu koy */}
              {currentWord.length === 0 && (
                <div className="tile active-cursor"></div>
              )}

              {/* Durum 2: Kullanıcı harfe bastıkça dinamik olarak kutuları yana diz */}
              {currentWord.split('').map((char, index) => (
                <div
                  key={index}
                  className={`tile ${index === currentWord.length - 1 ? 'active-cursor' : ''}`}
                >
                  {char}
                </div>
              ))}
            </div>
          </form>
        ) : (
          motor && (
            isTimeOut ? (
              <div className="timeout-screen">
                <h2>⏱️ Süre Doldu!</h2>
                <p>Zamanında kelime üretemediğin için oyun bitti.</p>
                <button className="new-game-btn" onClick={() => createNewPuzzle(motor)}>
                  Yeniden Dene
                </button>
              </div>
            ) : (
              <VictoryScreen
                wordsUsed={enteredWords.length}
                elapsedSeconds={elapsedSeconds}
                onNewGame={() => createNewPuzzle(motor)}
              />
            )
          )
        )}

        {!gameOver && (
          <MessageBox success={successMessage} errors={validationMessages} />
        )}

        {!gameOver && puzzle && (
          <Keyboard 
            onKeyClick={handleKeyClick}
            onDelete={handleDelete}
            onSubmit={() => {
              const mockEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
              handleSubmit(mockEvent);
            }}
          />
        )}
      </section>
    </main>
  );
}