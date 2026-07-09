// import { useEffect, useRef, useState, type FormEvent } from 'react';
// import Keyboard from "../components/Keyboard";
// import Header from "../components/Header";
// import GoalBar from "../components/GoalBar";
// import MessageBox from "../components/MessageBox";
// import VictoryScreen from "../components/VictoryScreen";
// import CircularTimer from "../components/CircularTimer";
// import LandingPage from "../components/LandingPage";
// import "./App.css";  
// import "../styles/variables.css";
// import { Motor } from '../domain/game/motor';
// import { generatePuzzle, type Puzzle } from '../domain/game/puzzle';
// import { loadDictionary } from '../infrastructure/dictionary/loadDictionary';

// // --- 🎰 ZOR MOD / ÇARK TİPLERİ VE SEÇENEKLERİ ---
// type GameRule = 
//   | 'NONE' 
//   | 'NO_CYCLE'        
//   | 'BAN_VOWELS'      
//   | 'BAN_CONSONANTS'  
//   | 'MIN_LENGTH'      
//   | 'HALF_TIME';      

// interface WheelOption {
//   type: GameRule;
//   label: string;
//   description: string;
// }

// const WHEEL_OPTIONS: WheelOption[] = [
//   { type: 'NO_CYCLE', label: '🔄 Kısır Döngü Yasağı', description: 'Başlangıç kelimesinin son harfiyle biten kelime kullanamazsın!' },
//   { type: 'BAN_VOWELS', label: '🚫 Sesli Ambargosu', description: "İçinde 'A' veya 'E' geçen kelimeler yasak!" },
//   { type: 'BAN_CONSONANTS', label: '🚫 Sessiz Ambargosu', description: "İçinde 'K', 'L' veya 'M' geçen kelimeler yasak!" },
//   { type: 'MIN_LENGTH', label: '📏 Ağır Sıklet', description: 'En az 5 harfli kelimeler kullanmalısın!' },
//   { type: 'HALF_TIME', label: '⚡ Zaman Baskısı', description: 'Tur süren yarıya düştü!' },
// ];

// function displayWord(word: string): string {
//   return word.toLocaleUpperCase('tr-TR').normalize('NFC');
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
//   const [startTime, setStartTime] = useState(Date.now());
//   const [elapsedSeconds, setElapsedSeconds] = useState(0);
//   const [shakeInput, setShakeInput] = useState(false);
//   const [gameStarted, setGameStarted] = useState(false);
  
//   // --- 🛠️ MOD & ÇARK STATE YÖNETİMİ ---
//   const [gameMode, setGameMode] = useState<'NORMAL' | 'HARD' | null>(null);
//   const [activeRule, setActiveRule] = useState<GameRule>('NONE');
//   const [isSpinning, setIsSpinning] = useState(false);
//   const [wheelResult, setWheelResult] = useState<WheelOption | null>(null);
//   const [isRuleAccepted, setIsRuleAccepted] = useState(false);

//   const BASE_TURN_TIME = 7;
//   const [timeLeft, setTimeLeft] = useState(BASE_TURN_TIME);
//   const [isTimeOut, setIsTimeOut] = useState(false);

//   // Aktif kurala göre dinamik maksimum süreyi belirle
//   const currentMaxTime = activeRule === 'HALF_TIME' ? Math.floor(BASE_TURN_TIME / 2) : BASE_TURN_TIME;

//   function createNewPuzzle(gameMotor: Motor, keepRule = false) {
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
//     setIsTimeOut(false);
//     setStartTime(Date.now());
//     setElapsedSeconds(0);
    
//     // Zor modda yeni el istenirken her şeyi temizle ve oyuncuyu çarka yönlendir
//     if (gameMode === 'HARD' && !keepRule) {
//       setActiveRule('NONE');
//       setWheelResult(null);
//       setIsRuleAccepted(false);
//     } else {
//       setTimeLeft(activeRule === 'HALF_TIME' ? Math.floor(BASE_TURN_TIME / 2) : BASE_TURN_TIME);
//     }

//     console.debug(nextPuzzle.solution);
//     setTimeout(() => {
//       if (inputRef.current && (gameMode === 'NORMAL' || keepRule)) {
//         inputRef.current.value = "";
//         inputRef.current.focus();
//       }
//     }, 100);
//   }

//   // --- 🎰 ÇARK DÖNDÜRME MOTORU ---
//   function spinTheWheel() {
//     if (isSpinning) return;
//     setIsSpinning(true);
//     setValidationMessages([]);
//     setActiveRule('NONE'); // Yeniden çevirmede eski kuralı temizle

//     let count = 0;
//     const interval = setInterval(() => {
//       const randomOption = WHEEL_OPTIONS[Math.floor(Math.random() * WHEEL_OPTIONS.length)];
//       setWheelResult(randomOption);
//       count++;

//       if (count > 15) {
//         clearInterval(interval);
//         setIsSpinning(false);
//         // Çark durunca kuralı hafızaya yaz (Ama süreyi henüz başlatma)
//         setActiveRule(randomOption.type);
//       }
//     }, 100);
//   }

//   useEffect(() => {
//     let active = true;

//     loadDictionary().then(({ wideWords, narrowWords }) => {
//       if (!active) return;
//       const gameMotor = new Motor(wideWords, narrowWords);
//       setMotor(gameMotor);
//       createNewPuzzle(gameMotor);
//       setIsTimeOut(false);
//     });

//     return () => {
//       active = false;
//     };
//   }, []);

//   useEffect(() => {
//     // Sayaç korumaları: Çark ekranındayken veya oyun bitmişse geri sayımı kilitle
//     if (gameOver || !puzzle || isSpinning || gameMode === null ||(gameMode === 'HARD' && !isRuleAccepted)) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           setIsTimeOut(true);
//           setGameOver(true);
//           setSuccessMessage("");
//           setValidationMessages(["Süre doldu!"]);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => {
//       clearInterval(timer);
//     };
//   }, [gameOver, puzzle, enteredWords, activeRule, isSpinning, gameMode, isRuleAccepted]);

//   const handleKeyClick = (key: string) => {
//     if (gameOver || isSpinning || (gameMode === 'HARD' && !isRuleAccepted)) return;
// const updatedWord = (currentWord + key).toLocaleUpperCase('tr-TR').normalize('NFC');
//     setCurrentWord(updatedWord);

//     if (inputRef.current) {
//       inputRef.current.value = updatedWord;
//       inputRef.current.focus();
//     }
//   };
  
//   const handleDelete = () => {
//     if (gameOver || isSpinning || (gameMode === 'HARD' && !isRuleAccepted)) return;
    
//     const updatedWord = currentWord.slice(0, -1).normalize('NFC');
//     setCurrentWord(updatedWord);

//     if (inputRef.current) {
//       inputRef.current.value = updatedWord;
//       inputRef.current.focus();
//     }
//   };

//   function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     if (!motor || !puzzle || isSpinning || (gameMode === 'HARD' && !isRuleAccepted)) return;

//     const nextWord = Motor.normalize(currentWord);
//     const nextMessages: string[] = [];
//     const previousWord = enteredWords[enteredWords.length - 1];

//     // Klasik Kontroller
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

//     // Zor Mod / Çark Kural Doğrulamaları
//     if (nextMessages.length === 0 && gameMode === 'HARD') {
//       const upperNextWord = nextWord.toLocaleUpperCase('tr-TR');

//       if (activeRule === 'NO_CYCLE' && puzzle) {
//         const lastLetterOfStart = puzzle.start[puzzle.start.length - 1].toLocaleUpperCase('tr-TR');
//         if (upperNextWord.endsWith(lastLetterOfStart)) {
//           nextMessages.push(`Kural İhlali! Kelime '${lastLetterOfStart}' harfi ile bitemez.`);
//         }
//       }
//       else if (activeRule === 'BAN_VOWELS') {
//         if (upperNextWord.includes('A') || upperNextWord.includes('E')) {
//           nextMessages.push("Kural İhlali! Kelimede 'A' veya 'E' bulunamaz.");
//         }
//       }
//       else if (activeRule === 'BAN_CONSONANTS') {
//         if (upperNextWord.includes('K') || upperNextWord.includes('L') || upperNextWord.includes('M')) {
//           nextMessages.push("Kural İhlali! 'K', 'L' veya 'M' harfleri yasak.");
//         }
//       }
//       else if (activeRule === 'MIN_LENGTH') {
//         if (nextWord.length < 5) {
//           nextMessages.push('Kural İhlali! Kelime en az 5 harfli olmalı.');
//         }
//       }
//     }

//     if (nextMessages.length > 0) {
//       setShakeInput(true);
//       setTimeout(() => {
//           setShakeInput(false);
//       }, 450);
      
//       setValidationMessages(nextMessages);
//       setSuccessMessage('');
//       setCurrentWord('');
//       if (inputRef.current) {
//         inputRef.current.value = '';
//       }
//       return;
//     }

//     inputRef.current?.focus();
//     const updatedWords = [...enteredWords, nextWord];
//     setEnteredWords(updatedWords);
//     setTimeLeft(currentMaxTime);
//     setValidationMessages([]);

//     if (nextWord[nextWord.length - 1] === puzzle.target[0]) {
//       setEnteredWords([...updatedWords, puzzle.target]);
//       setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
//       setGameOver(true);
//       setSuccessMessage("");
//       return;
//     }

//     setSuccessMessage('');
//     setCurrentWord('');
//     if (inputRef.current) {
//       inputRef.current.value = '';
//     }
//   }

//   const handleWrapperClick = () => {
//     if (!gameOver && (gameMode === 'NORMAL' || isRuleAccepted)) {
//       inputRef.current?.focus();
//     }
//   };

//   // 1. Ekran: Giriş Ekranı (Landing)
//   if (!gameStarted) {
//     return (
//       <main className="game-shell">
//         <LandingPage onStart={() => setGameStarted(true)}/>
//       </main>
//     );
//   }

//   // 2. Ekran: Mod Seçim Ekranı
//   if (gameMode === null) {
//     return (
//       <main className="game-shell">
//         <div className="game-container mode-selection-container">
//           <Header title="Kelime Zinciri" subtitle="Oyun Modunu Seç" />
//           <div className="mode-buttons-wrapper">
//             <button className="mode-btn normal" onClick={() => setGameMode('NORMAL')}>
//               🟢 Normal Mod
//               <span>Klasik kurallarla sakin bir oyun.</span>
//             </button>
//             <button className="mode-btn hard" onClick={() => setGameMode('HARD')}>
//               🔴 Zor Mod (Çarklı)
//               <span>Çarkı çevir, değişen çılgın kurallarla yarış!</span>
//             </button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // 3. Ekran: Zor Mod Seçildiğinde Çark Çevirme Alanı
//  // 3. Ekran: Zor Mod Seçildiğinde Çark Çevirme Alanı (Kutunun Kendisine Basınca Döner)
//   if (gameMode === 'HARD' && !isRuleAccepted) {
//     return (
//       <main className="game-shell">
//         <div className="game-container wheel-container">
//           <Header title="Zor Mod Çarkı" subtitle="Bu oyunun kaderini belirlemek için aşağıdaki çarka dokunun!" />
          
//           {/* Çark Kutusu: Dönmüyorsa ve kural seçilmemişse tıklanabilir (onClick={spinTheWheel}) olur */}
//           <div 
//             className={`wheel-display 
//               ${isSpinning ? 'spinning' : ''} 
//               ${activeRule !== 'NONE' ? 'rule-selected' : ''} 
//               ${activeRule === 'NONE' && !isSpinning ? 'clickable-wheel' : ''}
//             `}
//             onClick={activeRule === 'NONE' && !isSpinning ? spinTheWheel : undefined}
//           >
//             {wheelResult ? (
//               <div className="wheel-result-card">
//                 <h3>{wheelResult.label}</h3>
//                 <p className="rule-description">{wheelResult.description}</p>
//               </div>
//             ) : (
//               <div className="wheel-placeholder">🎰 Çarkı Döndürmek İçin Dokun!</div>
//             )}
//           </div>

//           {/* Çark dönmeyi bitirdiğinde ve kural hazır olduğunda beliren BAŞLA butonu */}
//           {!isSpinning && activeRule !== 'NONE' && (
//             <button 
//               className="start-game-btn animate-bounce" 
//               onClick={() => {
//                 const dynamicTime = activeRule === 'HALF_TIME' ? Math.floor(BASE_TURN_TIME / 2) : BASE_TURN_TIME;
//                 setTimeLeft(dynamicTime);
//                 setIsRuleAccepted(true);
//                 setTimeout(() => {
//                   inputRef.current?.focus();
//                 }, 100);
//               }}
//             >
//               🎮 Kuralı Anladım, Başla!
//             </button>
//           )}
          
//           <button className="back-to-modes" onClick={() => {
//             setGameMode(null);
//             setActiveRule('NONE');
//             setWheelResult(null);
//             setIsRuleAccepted(false);
//           }}>
//             ⬅ Mod Seçimine Dön
//           </button>
//         </div>
//       </main>
//     );
//   }

//   // 4. Ekran: Ana Oyun Sahnesi
//   return (
//     <main className="game-shell" onClick={handleWrapperClick}>
//       <div className={`game-container ${shakeInput ? 'shake' : ''}`}> 
//         <Header 
//           title="Kelime Zinciri" 
//           subtitle={gameMode === 'HARD' && wheelResult ? `📢 Kural: ${wheelResult.label}` : ""}
//         />
        
//         {puzzle && !gameOver && (
//           <GoalBar start={displayWord(puzzle.start)} target={displayWord(puzzle.target)}/>
//         )}

//         {!gameOver && (
//           <CircularTimer timeLeft={timeLeft} totalTime={currentMaxTime} />
//         )}

//         {/* Kelime Geçmişi Paneli */}
//         {!isTimeOut && (
//           <div className="chain-panel">
//             {enteredWords.map((word, wordIndex) => {
//               const formattedWord = displayWord(word);
//               const isLastWord = wordIndex === enteredWords.length - 1;

//               return (
//                 <div key={wordIndex} className="chain-item">
//                   <div className={`wordle-row historical ${gameOver ? 'completed-card' : ''}`}>
//                     {([...formattedWord]).map((char, charIndex) => {
//                       const isChainLink = isLastWord && charIndex === formattedWord.length - 1 && !gameOver;

//                       return (
//                         <div
//                           key={charIndex}
//                           className={`tile history-tile ${isChainLink ? 'chain-connector' : ''}`}
//                         >
//                           {char}
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {wordIndex < enteredWords.length - 1 && (
//                     <div className="chain-arrow">↓</div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         <form className="entry-form" onSubmit={handleSubmit}>
//           <input
//             ref={inputRef}
//             autoFocus
//             id="word-input"
//             name="word-input"
//             type="text"
//             autoComplete="off"
//             inputMode="none" 
//             readOnly={false}
//             onChange={(event) => {
//               let upperValue = event.target.value.toLocaleUpperCase('tr-TR');
//               upperValue = upperValue.normalize('NFC');
//               setCurrentWord(upperValue);
//             }}
//           />

//           {!gameOver && (
//             <div className="wordle-row">
//               {currentWord.length === 0 && (
//                 <div className="tile active-cursor"></div>
//               )}
              
//               {([...currentWord.normalize('NFC')]).map((char, index) => (
//                 <div
//                   key={index}
//                   className={`tile ${index === currentWord.length - 1 ? 'active-cursor' : ''}`}
//                 >
//                   {char}
//                 </div>
//               ))}
//             </div>
//           )}
//         </form>

//         {!gameOver && (
//           <MessageBox success={successMessage} errors={validationMessages} />
//         )}

//         {puzzle && (
//           <Keyboard 
//             onKeyClick={handleKeyClick}
//             onDelete={handleDelete}
//             onSubmit={() => {
//               const mockEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
//               handleSubmit(mockEvent);
//             }}
//           />
//         )}

//         {/* Oyun Sonu Katmanı */}
//         {gameOver && motor && (
//           <div className="game-over-overlay">
//             <div className="game-over-card animate-popup">
//               {isTimeOut ? (
//                 <div className="timeout-screen">
//                   <h2>⏱️ Süre Doldu!</h2>
//                   <p>Zamanında kelime üretemediğin için oyun bitti.</p>
//                   <button className="new-game-btn" onClick={() => createNewPuzzle(motor)}>
//                     Yeniden Dene
//                   </button>
//                 </div>
//               ) : (
//                 <VictoryScreen
//                   wordsUsed={enteredWords.length}
//                   elapsedSeconds={elapsedSeconds}
//                   onNewGame={() => createNewPuzzle(motor)}
//                 />
//               )}
//               <button className="back-to-menu-btn" onClick={() => {
//                 setGameMode(null);
//                 setActiveRule('NONE');
//                 setWheelResult(null);
//                 setIsRuleAccepted(false);
//               }}>
//                 🏠 Ana Menüye Dön
//               </button>
//             </div>
//           </div>
//         )}

//       </div>
//     </main>
//   );
// }
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Keyboard from "../components/Keyboard";
import Header from "../components/Header";
import GoalBar from "../components/GoalBar";
import MessageBox from "../components/MessageBox";
import VictoryScreen from "../components/VictoryScreen";
import CircularTimer from "../components/CircularTimer";
import LandingPage from "../components/LandingPage";
import "./App.css";  
import "../styles/variables.css";
import { Motor } from '../domain/game/motor';
import { generatePuzzle, type Puzzle } from '../domain/game/puzzle';
import { loadDictionary } from '../infrastructure/dictionary/loadDictionary';

// ---  ZOR MOD / ÇARK TİPLERİ VE SEÇENEKLERİ ---
type GameRule = 
  | 'NONE' 
  | 'NO_CYCLE'        
  | 'BAN_VOWELS'      
  | 'BAN_CONSONANTS'  
  | 'MIN_LENGTH'      
  | 'HALF_TIME';      

interface WheelOption {
  type: GameRule;
  label: string;
  description: string;
}

const WHEEL_OPTIONS: WheelOption[] = [
  // 💡 Kısır Döngü açıklaması netleştirildi
  { type: 'NO_CYCLE', label: '🔄 Kısır Döngü Yasağı', description: 'Başlangıç kelimesinin son harfiyle biten kelime kullanamazsın!' },
  { type: 'BAN_VOWELS', label: '🚫 Sesli Ambargosu', description: "İçinde 'A' veya 'E' geçen kelimeler yasak!" },
  { type: 'BAN_CONSONANTS', label: '🚫 Sessiz Ambargosu', description: "İçinde 'K', 'L' veya 'M' geçen kelimeler yasak!" },
  { type: 'MIN_LENGTH', label: '📏 Ağır Sıklet', description: 'En az 5 harfli kelimeler kullanmalısın!' },
  // 💡 Süre açıklaması 12 saniyeye göre güncellendi
  { type: 'HALF_TIME', label: '⚡ Zaman Baskısı', description: 'Süre 12 saniyeden 6 saniyeye düşer! Elini çabuk tut!' },
];

function displayWord(word: string): string {
  // 💡 Türkçe İ harfi ayrışmasını önlemek için .normalize('NFC') eklendi
  return word.toLocaleUpperCase('tr-TR').normalize('NFC');
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
  
  // --- 🛠️ MOD & ÇARK STATE YÖNETİMİ ---
  const [gameMode, setGameMode] = useState<'NORMAL' | 'HARD' | null>(null);
  const [activeRule, setActiveRule] = useState<GameRule>('NONE');
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<WheelOption | null>(null);
  const [isRuleAccepted, setIsRuleAccepted] = useState(false);

  // 💡 Zor mod 12, normal mod 7 saniye olacak şekilde dinamik max süre hesaplaması
  const currentMaxTime = gameMode === 'HARD' 
    ? (activeRule === 'HALF_TIME' ? 6 : 12) 
    : 7;

  const [timeLeft, setTimeLeft] = useState(7); 
  const [isTimeOut, setIsTimeOut] = useState(false);

  function createNewPuzzle(gameMotor: Motor, keepRule = false) {
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
    setIsTimeOut(false);
    setStartTime(Date.now());
    setElapsedSeconds(0);
    
    if (gameMode === 'HARD' && !keepRule) {
      setActiveRule('NONE');
      setWheelResult(null);
      setIsRuleAccepted(false);
    } else {
      // 💡 Yeni el başlatılırken modun ve kuralın süre karşılığı atanıyor
      const dynamicDuration = gameMode === 'HARD' ? (activeRule === 'HALF_TIME' ? 6 : 12) : 7;
      setTimeLeft(dynamicDuration);
    }

    console.debug(nextPuzzle.solution);
    setTimeout(() => {
      if (inputRef.current && (gameMode === 'NORMAL' || keepRule)) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
    }, 100);
  }

  // ---  ÇARK DÖNDÜRME MOTORU ---
  function spinTheWheel() {
    if (isSpinning) return;
    setIsSpinning(true);
    setValidationMessages([]);
    setActiveRule('NONE'); 

    let count = 0;
    const interval = setInterval(() => {
      const randomOption = WHEEL_OPTIONS[Math.floor(Math.random() * WHEEL_OPTIONS.length)];
      setWheelResult(randomOption);
      count++;

      if (count > 15) {
        clearInterval(interval);
        setIsSpinning(false);
        setActiveRule(randomOption.type);
      }
    }, 100);
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
    // 💡 GÜNCELLEME: `gameMode === null` şartı eklenerek ana menüde sürenin akması engellendi.
    if (gameOver || !puzzle || isSpinning || gameMode === null || (gameMode === 'HARD' && !isRuleAccepted)) return;

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

    return () => {
      clearInterval(timer);
    };
  }, [gameOver, puzzle, enteredWords, activeRule, isSpinning, gameMode, isRuleAccepted]);

  const handleKeyClick = (key: string) => {
    if (gameOver || isSpinning || (gameMode === 'HARD' && !isRuleAccepted)) return;
    // 💡 Büyük İ harfi problemi için .normalize('NFC') eklendi
    const updatedWord = (currentWord + key).toLocaleUpperCase('tr-TR').normalize('NFC');
    setCurrentWord(updatedWord);

    if (inputRef.current) {
      inputRef.current.value = updatedWord;
      inputRef.current.focus();
    }
  };
  
  const handleDelete = () => {
    if (gameOver || isSpinning || (gameMode === 'HARD' && !isRuleAccepted)) return;
    
    const updatedWord = currentWord.slice(0, -1);
    setCurrentWord(updatedWord);

    if (inputRef.current) {
      inputRef.current.value = updatedWord;
      inputRef.current.focus();
    }
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!motor || !puzzle || isSpinning || (gameMode === 'HARD' && !isRuleAccepted)) return;

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

    if (nextMessages.length === 0 && gameMode === 'HARD') {
      const upperNextWord = nextWord.toLocaleUpperCase('tr-TR').normalize('NFC');

      if (activeRule === 'NO_CYCLE' && puzzle) {
        // 💡 GÜNCELLEME: İlk harf yerine başlangıç kelimesinin SON harfi yakalanıyor.
        const lastLetterOfStart = puzzle.start[puzzle.start.length - 1].toLocaleUpperCase('tr-TR').normalize('NFC');
        if (upperNextWord.endsWith(lastLetterOfStart)) {
          nextMessages.push(`Kural İhlali! Kelime, başlangıç kelimesinin son harfi olan '${lastLetterOfStart}' ile bitemez.`);
        }
      }
      else if (activeRule === 'BAN_VOWELS') {
        if (upperNextWord.includes('A') || upperNextWord.includes('E')) {
          nextMessages.push("Kural İhlali! Kelimede 'A' veya 'E' bulunamaz.");
        }
      }
      else if (activeRule === 'BAN_CONSONANTS') {
        if (upperNextWord.includes('K') || upperNextWord.includes('L') || upperNextWord.includes('M')) {
          nextMessages.push("Kural İhlali! 'K', 'L' veya 'M' harfleri yasak.");
        }
      }
      else if (activeRule === 'MIN_LENGTH') {
        if (nextWord.length < 5) {
          nextMessages.push('Kural İhlali! Kelime en az 5 harfli olmalı.');
        }
      }
    }

    if (nextMessages.length > 0) {
      setShakeInput(true);
      setTimeout(() => {
          setShakeInput(false);
      }, 450);
      
      setValidationMessages(nextMessages);
      setSuccessMessage('');
      setCurrentWord('');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    inputRef.current?.focus();
    const updatedWords = [...enteredWords, nextWord];
    setEnteredWords(updatedWords);
    setTimeLeft(currentMaxTime); // 💡 Dinamik olarak 12, 6 veya 7 saniyeye kuruyor.
    setValidationMessages([]);

    if (nextWord[nextWord.length - 1] === puzzle.target[0]) {
      setEnteredWords([...updatedWords, puzzle.target]);
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      setGameOver(true);
      setSuccessMessage("");
      return;
    }

    setSuccessMessage('');
    setCurrentWord('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  const handleWrapperClick = () => {
    if (!gameOver && (gameMode === 'NORMAL' || isRuleAccepted)) {
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

  if (gameMode === null) {
    return (
      <main className="game-shell">
        <div className="game-container mode-selection-container">
          <Header title="Kelime Zinciri" subtitle="Oyun Modunu Seç" />
          <div className="mode-buttons-wrapper">
            <button className="mode-btn normal" onClick={() => {
              setGameMode('NORMAL');
              setTimeLeft(7); // Normal mod süresi 7 saniye
            }}>
              🟢 Normal Mod
              <span>Klasik kurallarla sakin bir oyun.</span>
            </button>
            <button className="mode-btn hard" onClick={() => setGameMode('HARD')}>
              🔴 Zor Mod (Çarklı)
              <span>Çarkı çevir, değişen çılgın kurallarla yarış!</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (gameMode === 'HARD' && !isRuleAccepted) {
    return (
      <main className="game-shell">
        <div className="game-container wheel-container">
          <Header title="Zor Mod Çarkı" subtitle="Bu oyunun kaderini belirlemek için aşağıdaki çarka dokunun!" />
          
          <div 
            className={`wheel-display 
              ${isSpinning ? 'spinning' : ''} 
              ${activeRule !== 'NONE' ? 'rule-selected' : ''} 
              ${activeRule === 'NONE' && !isSpinning ? 'clickable-wheel' : ''}
            `}
            onClick={activeRule === 'NONE' && !isSpinning ? spinTheWheel : undefined}
          >
            {wheelResult ? (
              <div className="wheel-result-card">
                <h3>{wheelResult.label}</h3>
                <p className="rule-description">{wheelResult.description}</p>
              </div>
            ) : (
              <div className="wheel-placeholder"> Çarkı Döndürmek İçin Dokun!</div>
            )}
          </div>

          {!isSpinning && activeRule !== 'NONE' && (
            <button 
              className="start-game-btn animate-bounce" 
              onClick={() => {
                // 💡 GÜNCELLEME: Zor mod başlatılırken Zaman Baskısı kuralı varsa 6, yoksa yeni kuralınız olan 12 saniye atanıyor.
                const dynamicTime = activeRule === 'HALF_TIME' ? 6 : 12;
                setTimeLeft(dynamicTime);
                setIsRuleAccepted(true);
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 100);
              }}
            >
               Kuralı Anladım, Başla!
            </button>
          )}
          
          <button className="back-to-modes" onClick={() => {
            setGameMode(null);
            setActiveRule('NONE');
            setWheelResult(null);
            setIsRuleAccepted(false);
          }}>
            ⬅ Mod Seçimine Dön
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="game-shell" onClick={handleWrapperClick}>
      <div className={`game-container ${shakeInput ? 'shake' : ''}`}> 
        <Header 
          title="Kelime Zinciri" 
          subtitle={gameMode === 'HARD' && wheelResult ? `📢 Kural: ${wheelResult.label}` : ""}
        />
        
        {puzzle && !gameOver && (
          <GoalBar start={displayWord(puzzle.start)} target={displayWord(puzzle.target)}/>
        )}

        {!gameOver && (
          <CircularTimer timeLeft={timeLeft} totalTime={currentMaxTime} />
        )}

        {!isTimeOut && (
          <div className="chain-panel">
            {enteredWords.map((word, wordIndex) => {
              const formattedWord = displayWord(word);
              const isLastWord = wordIndex === enteredWords.length - 1;

              return (
                <div key={wordIndex} className="chain-item">
                  <div className={`wordle-row historical ${gameOver ? 'completed-card' : ''}`}>
                    {/* 💡 GÜNCELLEME: .split('') yerine spread operator [...formattedWord] kullanılarak İ harfinin bölünmesi engellendi */}
                    {([...formattedWord]).map((char, charIndex) => {
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

                  {wordIndex < enteredWords.length - 1 && (
                    <div className="chain-arrow">↓</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <form className="entry-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            autoFocus
            id="word-input"
            name="word-input"
            type="text"
            autoComplete="off"
            inputMode="none" 
            readOnly={false}
            onChange={(event) => {
              let upperValue = event.target.value.toLocaleUpperCase('tr-TR');
              upperValue = upperValue.normalize('NFC');
              setCurrentWord(upperValue);
            }}
          />

          {!gameOver && (
            <div className="wordle-row">
              {currentWord.length === 0 && (
                <div className="tile active-cursor"></div>
              )}
              
              {/* 💡 GÜNCELLEME: .split('') yerine spread operator ve normalize eklenerek aktif kelime alanındaki İ harfi sorunu çözüldü */}
              {([...currentWord.normalize('NFC')]).map((char, index) => (
                <div
                  key={index}
                  className={`tile ${index === currentWord.length - 1 ? 'active-cursor' : ''}`}
                >
                  {char}
                </div>
              ))}
            </div>
          )}
        </form>

        {!gameOver && (
          <MessageBox success={successMessage} errors={validationMessages} />
        )}

        {puzzle && (
          <Keyboard 
            onKeyClick={handleKeyClick}
            onDelete={handleDelete}
            onSubmit={() => {
              const mockEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
              handleSubmit(mockEvent);
            }}
          />
        )}

        {gameOver && motor && (
          <div className="game-over-overlay">
            <div className="game-over-card animate-popup">
              {isTimeOut ? (
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
              )}
              <button className="back-to-menu-btn" onClick={() => {
                setGameMode(null);
                setActiveRule('NONE');
                setWheelResult(null);
                setIsRuleAccepted(false);
              }}>
                 Ana Menüye Dön
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}