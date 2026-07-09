
// // import { useEffect, useRef, useState, type FormEvent } from 'react';
// // import Keyboard from "../components/Keyboard";
// // import Header from "../components/Header";
// // import GoalBar from "../components/GoalBar";
// // import MessageBox from "../components/MessageBox";
// // import VictoryScreen from "../components/VictoryScreen";
// // import CircularTimer from "../components/CircularTimer";
// // import LandingPage from "../components/LandingPage";
// // import "./App.css";  
// // import "../styles/variables.css";
// // import { Motor } from '../domain/game/motor';
// // import { generatePuzzle, type Puzzle } from '../domain/game/puzzle';
// // import { loadDictionary } from '../infrastructure/dictionary/loadDictionary';

// // // ---  ZOR MOD / ÇARK TİPLERİ VE SEÇENEKLERİ ---
// // type GameRule = 
// //   | 'NONE' 
// //   | 'NO_CYCLE'        
// //   | 'BAN_VOWELS'      
// //   | 'BAN_CONSONANTS'  
// //   | 'MIN_LENGTH'      
// //   | 'HALF_TIME';      

// // interface WheelOption {
// //   type: GameRule;
// //   label: string;
// //   description: string;
// // }

// // const WHEEL_OPTIONS: WheelOption[] = [
// //   // 💡 Kısır Döngü açıklaması netleştirildi
// //   { type: 'NO_CYCLE', label: ' Kısır Döngü Yasağı', description: 'Başlangıç kelimesinin son harfiyle biten kelime kullanamazsın!' },
// //   { type: 'BAN_VOWELS', label: ' Sesli Ambargosu', description: "İçinde 'A' veya 'E' geçen kelimeler yasak!" },
// //   { type: 'BAN_CONSONANTS', label: ' Sessiz Ambargosu', description: "İçinde 'K', 'L' veya 'M' geçen kelimeler yasak!" },
// //   { type: 'MIN_LENGTH', label: ' Ağır Sıklet', description: 'En az 5 harfli kelimeler kullanmalısın!' },
// //   // 💡 Süre açıklaması 12 saniyeye göre güncellendi
// //   { type: 'HALF_TIME', label: ' Zaman Baskısı', description: 'Süre 12 saniyeden 6 saniyeye düşer! Elini çabuk tut!' },
// // ];

// // function displayWord(word: string): string {
// //   // 💡 Türkçe İ harfi ayrışmasını önlemek için .normalize('NFC') eklendi
// //   return word.toLocaleUpperCase('tr-TR').normalize('NFC');
// // }

// // export default function App() {
// //   const [motor, setMotor] = useState<Motor | null>(null);
// //   const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
// //   const [currentWord, setCurrentWord] = useState('');
// //   const [enteredWords, setEnteredWords] = useState<string[]>([]);
// //   const [validationMessages, setValidationMessages] = useState<string[]>([]);
// //   const [successMessage, setSuccessMessage] = useState('');
// //   const [gameOver, setGameOver] = useState(false);
// //   const inputRef = useRef<HTMLInputElement>(null);
// //   const [startTime, setStartTime] = useState(Date.now());
// //   const [elapsedSeconds, setElapsedSeconds] = useState(0);
// //   const [shakeInput, setShakeInput] = useState(false);
// //   const [gameStarted, setGameStarted] = useState(false);
  
// //   // --- 🛠️ MOD & ÇARK STATE YÖNETİMİ ---
// //   const [gameMode, setGameMode] = useState<'NORMAL' | 'HARD' | null>(null);
// //   const [activeRule, setActiveRule] = useState<GameRule>('NONE');
// //   const [isSpinning, setIsSpinning] = useState(false);
// //   const [wheelResult, setWheelResult] = useState<WheelOption | null>(null);
// //   const [isRuleAccepted, setIsRuleAccepted] = useState(false);

// //   // 💡 Zor mod 12, normal mod 7 saniye olacak şekilde dinamik max süre hesaplaması
// //   const currentMaxTime = gameMode === 'HARD' 
// //     ? (activeRule === 'HALF_TIME' ? 6 : 12) 
// //     : 7;

// //   const [timeLeft, setTimeLeft] = useState(7); 
// //   const [isTimeOut, setIsTimeOut] = useState(false);

// //   function createNewPuzzle(gameMotor: Motor, keepRule = false) {
// //     const nextPuzzle = generatePuzzle(gameMotor);

// //     setPuzzle({
// //         ...nextPuzzle,
// //         start: Motor.normalize(nextPuzzle.start),
// //         target: Motor.normalize(nextPuzzle.target),
// //         solution: nextPuzzle.solution.map(Motor.normalize),
// //     });

// //     setEnteredWords([
// //         Motor.normalize(nextPuzzle.start),
// //     ]);

// //     setCurrentWord("");
// //     setValidationMessages([]);
// //     setSuccessMessage("");
// //     setGameOver(false);
// //     setIsTimeOut(false);
// //     setStartTime(Date.now());
// //     setElapsedSeconds(0);
    
// //     if (gameMode === 'HARD' && !keepRule) {
// //       setActiveRule('NONE');
// //       setWheelResult(null);
// //       setIsRuleAccepted(false);
// //     } else {
// //       // 💡 Yeni el başlatılırken modun ve kuralın süre karşılığı atanıyor
// //       const dynamicDuration = gameMode === 'HARD' ? (activeRule === 'HALF_TIME' ? 6 : 12) : 7;
// //       setTimeLeft(dynamicDuration);
// //     }

// //     console.debug(nextPuzzle.solution);
// //     setTimeout(() => {
// //       if (inputRef.current && (gameMode === 'NORMAL' || keepRule)) {
// //         inputRef.current.value = "";
// //         inputRef.current.focus();
// //       }
// //     }, 100);
// //   }

// //   // ---  ÇARK DÖNDÜRME MOTORU ---
// //   function spinTheWheel() {
// //     if (isSpinning) return;
// //     setIsSpinning(true);
// //     setValidationMessages([]);
// //     setActiveRule('NONE'); 

// //     let count = 0;
// //     const interval = setInterval(() => {
// //       const randomOption = WHEEL_OPTIONS[Math.floor(Math.random() * WHEEL_OPTIONS.length)];
// //       setWheelResult(randomOption);
// //       count++;

// //       if (count > 15) {
// //         clearInterval(interval);
// //         setIsSpinning(false);
// //         setActiveRule(randomOption.type);
// //       }
// //     }, 100);
// //   }

// //   useEffect(() => {
// //     let active = true;

// //     loadDictionary().then(({ wideWords, narrowWords }) => {
// //       if (!active) return;
// //       const gameMotor = new Motor(wideWords, narrowWords);
// //       setMotor(gameMotor);
// //       createNewPuzzle(gameMotor);
// //       setIsTimeOut(false);
// //     });

// //     return () => {
// //       active = false;
// //     };
// //   }, []);

// //   useEffect(() => {
// //     // 💡 GÜNCELLEME: `gameMode === null` şartı eklenerek ana menüde sürenin akması engellendi.
// //     if (gameOver || !puzzle || isSpinning || gameMode === null || (gameMode === 'HARD' && !isRuleAccepted)) return;

// //     const timer = setInterval(() => {
// //       setTimeLeft((prev) => {
// //         if (prev <= 1) {
// //           clearInterval(timer);
// //           setIsTimeOut(true);
// //           setGameOver(true);
// //           setSuccessMessage("");
// //           setValidationMessages(["⏰ Süre doldu!"]);
// //           return 0;
// //         }
// //         return prev - 1;
// //       });
// //     }, 1000);

// //     return () => {
// //       clearInterval(timer);
// //     };
// //   }, [gameOver, puzzle, enteredWords, activeRule, isSpinning, gameMode, isRuleAccepted]);

// //   const handleKeyClick = (key: string) => {
// //     if (gameOver || isSpinning || (gameMode === 'HARD' && !isRuleAccepted)) return;
// //     // 💡 Büyük İ harfi problemi için .normalize('NFC') eklendi
// //     const updatedWord = (currentWord + key).toLocaleUpperCase('tr-TR').normalize('NFC');
// //     setCurrentWord(updatedWord);

// //     if (inputRef.current) {
// //       inputRef.current.value = updatedWord;
// //       inputRef.current.focus();
// //     }
// //   };
  
// //   const handleDelete = () => {
// //     if (gameOver || isSpinning || (gameMode === 'HARD' && !isRuleAccepted)) return;
    
// //     const updatedWord = currentWord.slice(0, -1);
// //     setCurrentWord(updatedWord);

// //     if (inputRef.current) {
// //       inputRef.current.value = updatedWord;
// //       inputRef.current.focus();
// //     }
// //   };

// //   function handleSubmit(event: FormEvent<HTMLFormElement>) {
// //     event.preventDefault();
// //     if (!motor || !puzzle || isSpinning || (gameMode === 'HARD' && !isRuleAccepted)) return;

// //     const nextWord = Motor.normalize(currentWord);
// //     const nextMessages: string[] = [];
// //     const previousWord = enteredWords[enteredWords.length - 1];

// //     if (!nextWord) {
// //       nextMessages.push('Kelime girin.');
// //     }
// //     else if (nextWord && !motor.contains(nextWord)) {
// //       nextMessages.push('Kelime sözlükte yok.');
// //     }
// //     else if (nextWord && enteredWords.some((word) => word === nextWord)) {
// //       nextMessages.push('Kelime zaten kullanıldı.');
// //     }
// //     else if (nextWord && previousWord && nextWord[0] !== previousWord[previousWord.length - 1]) {
// //       nextMessages.push(`Kelime '${previousWord[previousWord.length - 1]}' harfiyle başlamalı.`);
// //     }

// //     if (nextMessages.length === 0 && gameMode === 'HARD') {
// //       const upperNextWord = nextWord.toLocaleUpperCase('tr-TR').normalize('NFC');

// //       if (activeRule === 'NO_CYCLE' && puzzle) {
// //         // 💡 GÜNCELLEME: İlk harf yerine başlangıç kelimesinin SON harfi yakalanıyor.
// //         const lastLetterOfStart = puzzle.start[puzzle.start.length - 1].toLocaleUpperCase('tr-TR').normalize('NFC');
// //         if (upperNextWord.endsWith(lastLetterOfStart)) {
// //           nextMessages.push(`Kural İhlali! Kelime, başlangıç kelimesinin son harfi olan '${lastLetterOfStart}' ile bitemez.`);
// //         }
// //       }
// //       else if (activeRule === 'BAN_VOWELS') {
// //         if (upperNextWord.includes('A') || upperNextWord.includes('E')) {
// //           nextMessages.push("Kural İhlali! Kelimede 'A' veya 'E' bulunamaz.");
// //         }
// //       }
// //       else if (activeRule === 'BAN_CONSONANTS') {
// //         if (upperNextWord.includes('K') || upperNextWord.includes('L') || upperNextWord.includes('M')) {
// //           nextMessages.push("Kural İhlali! 'K', 'L' veya 'M' harfleri yasak.");
// //         }
// //       }
// //       else if (activeRule === 'MIN_LENGTH') {
// //         if (nextWord.length < 5) {
// //           nextMessages.push('Kural İhlali! Kelime en az 5 harfli olmalı.');
// //         }
// //       }
// //     }

// //     if (nextMessages.length > 0) {
// //       setShakeInput(true);
// //       setTimeout(() => {
// //           setShakeInput(false);
// //       }, 450);
      
// //       setValidationMessages(nextMessages);
// //       setSuccessMessage('');
// //       setCurrentWord('');
// //       if (inputRef.current) {
// //         inputRef.current.value = '';
// //       }
// //       return;
// //     }

// //     inputRef.current?.focus();
// //     const updatedWords = [...enteredWords, nextWord];
// //     setEnteredWords(updatedWords);
// //     setTimeLeft(currentMaxTime); // 💡 Dinamik olarak 12, 6 veya 7 saniyeye kuruyor.
// //     setValidationMessages([]);

// //     if (nextWord[nextWord.length - 1] === puzzle.target[0]) {
// //       setEnteredWords([...updatedWords, puzzle.target]);
// //       setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
// //       setGameOver(true);
// //       setSuccessMessage("");
// //       return;
// //     }

// //     setSuccessMessage('');
// //     setCurrentWord('');
// //     if (inputRef.current) {
// //       inputRef.current.value = '';
// //     }
// //   }

// //   const handleWrapperClick = () => {
// //     if (!gameOver && (gameMode === 'NORMAL' || isRuleAccepted)) {
// //       inputRef.current?.focus();
// //     }
// //   };

// //   if (!gameStarted) {
// //     return (
// //       <main className="game-shell">
// //         <LandingPage onStart={() => setGameStarted(true)}/>
// //       </main>
// //     );
// //   }

// //   if (gameMode === null) {
// //     return (
// //       <main className="game-shell">
// //         <div className="game-container mode-selection-container">
// //           <Header title="Kelime Zinciri" subtitle="Oyun Modunu Seç" />
// //           <div className="mode-buttons-wrapper">
// //             <button className="mode-btn normal" onClick={() => {
// //               setGameMode('NORMAL');
// //               setTimeLeft(7); // Normal mod süresi 7 saniye
// //             }}>
// //               🟢 Normal Mod
// //               <span>Klasik kurallarla bir oyun.</span>
// //             </button>
// //             <button className="mode-btn hard" onClick={() => setGameMode('HARD')}>
// //               🔴 Zor Mod (Çarklı)
// //               <span>Çarkı çevir, değişen kurallarla yarış!</span>
// //             </button>
// //           </div>
// //         </div>
// //       </main>
// //     );
// //   }

// //   if (gameMode === 'HARD' && !isRuleAccepted) {
// //     return (
// //       <main className="game-shell">
// //         <div className="game-container wheel-container">
// //           <Header title="Zor Mod Çarkı" subtitle="Bu oyunun kaderini belirlemek için aşağıdaki çarka dokunun!" />
          
// //           <div 
// //             className={`wheel-display 
// //               ${isSpinning ? 'spinning' : ''} 
// //               ${activeRule !== 'NONE' ? 'rule-selected' : ''} 
// //               ${activeRule === 'NONE' && !isSpinning ? 'clickable-wheel' : ''}
// //             `}
// //             onClick={activeRule === 'NONE' && !isSpinning ? spinTheWheel : undefined}
// //           >
// //             {wheelResult ? (
// //               <div className="wheel-result-card">
// //                 <h3>{wheelResult.label}</h3>
// //                 <p className="rule-description">{wheelResult.description}</p>
// //               </div>
// //             ) : (
// //               <div className="wheel-placeholder"> Dokunarak Çarkı Döndür!</div>
// //             )}
// //           </div>

// //           {!isSpinning && activeRule !== 'NONE' && (
// //             <button 
// //               className="start-game-btn animate-bounce" 
// //               onClick={() => {
// //                 // 💡 GÜNCELLEME: Zor mod başlatılırken Zaman Baskısı kuralı varsa 6, yoksa yeni kuralınız olan 12 saniye atanıyor.
// //                 const dynamicTime = activeRule === 'HALF_TIME' ? 6 : 12;
// //                 setTimeLeft(dynamicTime);
// //                 setIsRuleAccepted(true);
// //                 setTimeout(() => {
// //                   inputRef.current?.focus();
// //                 }, 100);
// //               }}
// //             >
// //                Kuralı Anladım, Başla!
// //             </button>
// //           )}
          
// //           <button className="back-to-modes" onClick={() => {
// //             setGameMode(null);
// //             setActiveRule('NONE');
// //             setWheelResult(null);
// //             setIsRuleAccepted(false);
// //           }}>
// //             ⬅ Mod Seçimine Dön
// //           </button>
// //         </div>
// //       </main>
// //     );
// //   }

// //   return (
// //     <main className="game-shell" onClick={handleWrapperClick}>
// //       <div className={`game-container ${shakeInput ? 'shake' : ''}`}> 
// //         <Header 
// //           title="Kelime Zinciri" 
// //           subtitle={gameMode === 'HARD' && wheelResult ? `📢 Kural: ${wheelResult.label}` : ""}
// //         />
        
// //         {puzzle && !gameOver && (
// //           <GoalBar start={displayWord(puzzle.start)} target={displayWord(puzzle.target)}/>
// //         )}

// //         {!gameOver && (
// //           <CircularTimer timeLeft={timeLeft} totalTime={currentMaxTime} />
// //         )}

// //         {!isTimeOut && (
// //           <div className="chain-panel">
// //             {enteredWords.map((word, wordIndex) => {
// //               const formattedWord = displayWord(word);
// //               const isLastWord = wordIndex === enteredWords.length - 1;

// //               return (
// //                 <div key={wordIndex} className="chain-item">
// //                   <div className={`wordle-row historical ${gameOver ? 'completed-card' : ''}`}>
// //                     {/* 💡 GÜNCELLEME: .split('') yerine spread operator [...formattedWord] kullanılarak İ harfinin bölünmesi engellendi */}
// //                     {([...formattedWord]).map((char, charIndex) => {
// //                       const isChainLink = isLastWord && charIndex === formattedWord.length - 1 && !gameOver;

// //                       return (
// //                         <div
// //                           key={charIndex}
// //                           className={`tile history-tile ${isChainLink ? 'chain-connector' : ''}`}
// //                         >
// //                           {char}
// //                         </div>
// //                       );
// //                     })}
// //                   </div>

// //                   {wordIndex < enteredWords.length - 1 && (
// //                     <div className="chain-arrow">↓</div>
// //                   )}
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         )}

// //         <form className="entry-form" onSubmit={handleSubmit}>
// //           <input
// //             ref={inputRef}
// //             autoFocus
// //             id="word-input"
// //             name="word-input"
// //             type="text"
// //             autoComplete="off"
// //             inputMode="none" 
// //             readOnly={false}
// //             onChange={(event) => {
// //               let upperValue = event.target.value.toLocaleUpperCase('tr-TR');
// //               upperValue = upperValue.normalize('NFC');
// //               setCurrentWord(upperValue);
// //             }}
// //           />

// //           {!gameOver && (
// //             <div className="wordle-row">
// //               {currentWord.length === 0 && (
// //                 <div className="tile active-cursor"></div>
// //               )}
              
// //               {/* 💡 GÜNCELLEME: .split('') yerine spread operator ve normalize eklenerek aktif kelime alanındaki İ harfi sorunu çözüldü */}
// //               {([...currentWord.normalize('NFC')]).map((char, index) => (
// //                 <div
// //                   key={index}
// //                   className={`tile ${index === currentWord.length - 1 ? 'active-cursor' : ''}`}
// //                 >
// //                   {char}
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </form>

// //         {!gameOver && (
// //           <MessageBox success={successMessage} errors={validationMessages} />
// //         )}

// //         {puzzle && (
// //           <Keyboard 
// //             onKeyClick={handleKeyClick}
// //             onDelete={handleDelete}
// //             onSubmit={() => {
// //               const mockEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
// //               handleSubmit(mockEvent);
// //             }}
// //           />
// //         )}

// //         {gameOver && motor && (
// //           <div className="game-over-overlay">
// //             <div className="game-over-card animate-popup">
// //               {isTimeOut ? (
// //                 <div className="timeout-screen">
// //                   <h2>⏱️ Süre Doldu!</h2>
// //                   <p>Zamanında kelime üretemediğin için oyun bitti.</p>
// //                   <button className="new-game-btn" onClick={() => createNewPuzzle(motor)}>
// //                     Yeniden Dene
// //                   </button>
// //                 </div>
// //               ) : (
// //                 <VictoryScreen
// //                   wordsUsed={enteredWords.length}
// //                   elapsedSeconds={elapsedSeconds}
// //                   onNewGame={() => createNewPuzzle(motor)}
// //                 />
// //               )}
// //               <button className="back-to-menu-btn" onClick={() => {
// //                 setGameMode(null);
// //                 setActiveRule('NONE');
// //                 setWheelResult(null);
// //                 setIsRuleAccepted(false);
// //               }}>
// //                  Ana Menüye Dön
// //               </button>
// //             </div>
// //           </div>
// //         )}

// //       </div>
// //     </main>
// //   );
// // }

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

// // --- ZOR MOD / ÇARK TİPLERİ VE SEÇENEKLERİ ---
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
//   { type: 'NO_CYCLE', label: ' Kısır Döngü Yasağı', description: 'Başlangıç kelimesinin son harfiyle biten kelime kullanamazsın!' },
//   { type: 'BAN_VOWELS', label: ' Sesli Ambargosu', description: "İçinde 'A' veya 'E' geçen kelimeler yasak!" },
//   { type: 'BAN_CONSONANTS', label: ' Sessiz Ambargosu', description: "İçinde 'K', 'L' veya 'M' geçen kelimeler yasak!" },
//   { type: 'MIN_LENGTH', label: ' Ağır Sıklet', description: 'En az 5 harfli kelimeler kullanmalısın!' },
//   { type: 'HALF_TIME', label: ' Zaman Baskısı', description: 'Süre 12 saniyeden 6 saniyeye düşer! Elini çabuk tut!' },
// ];

// // --- 📅 GÜNLÜK SEED & GEÇİCİ RASTGELELİK MOTORU ---
// function getDailyDateStr(): string {
//   const d = new Date();
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
// }

// function getDailySeed(): number {
//   const d = new Date();
//   return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
// }

// // Güvenilir bir sözde rastgele sayı üretici (LCG)
// function createSeededRandom(seed: number) {
//   let s = seed;
//   return function() {
//     s = (s * 1664525 + 1013904223) % 4294967296;
//     return s / 4294967296;
//   };
// }

// function getDailyRule(seed: number): WheelOption {
//   const rng = createSeededRandom(seed);
//   const index = Math.floor(rng() * WHEEL_OPTIONS.length);
//   return WHEEL_OPTIONS[index];
// }

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
//   // MOD GÜNCELLEMESİ: 'DAILY' modu eklendi
//   const [gameMode, setGameMode] = useState<'NORMAL' | 'HARD' | 'DAILY' | null>(null);
//   const [activeRule, setActiveRule] = useState<GameRule>('NONE');
//   const [isSpinning, setIsSpinning] = useState(false);
//   const [wheelResult, setWheelResult] = useState<WheelOption | null>(null);
//   const [isRuleAccepted, setIsRuleAccepted] = useState(false);

//   // Dinamik max süre hesaplaması günlük modu da kapsayacak şekilde güncellendi
//   const currentMaxTime = (gameMode === 'HARD' || gameMode === 'DAILY')
//     ? (activeRule === 'HALF_TIME' ? 6 : 12) 
//     : 7;

//   const [timeLeft, setTimeLeft] = useState(7); 
//   const [isTimeOut, setIsTimeOut] = useState(false);

//   // Puzzle oluşturucu mod bağımsızlığı için forceMode parametresi alabilir hale getirildi
//   function createNewPuzzle(gameMotor: Motor, keepRule = false, forceMode?: 'NORMAL' | 'HARD' | 'DAILY') {
//     const activeMode = forceMode || gameMode;
//     let nextPuzzle;

//     // Eğer Günlük mod ise Math.random geçici olarak kilitlenip seed'li üretim yapılır
//     if (activeMode === 'DAILY') {
//       const seed = getDailySeed();
//       const seededRng = createSeededRandom(seed);
//       const originalRandom = Math.random;
      
//       Math.random = seededRng; 
//       nextPuzzle = generatePuzzle(gameMotor);
//       Math.random = originalRandom; // Eski haline geri yükle
//     } else {
//       nextPuzzle = generatePuzzle(gameMotor);
//     }

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
    
//     if (activeMode === 'DAILY') {
//       const seed = getDailySeed();
//       const dailyRule = getDailyRule(seed);
//       setActiveRule(dailyRule.type);
//       setWheelResult(dailyRule);
//       setIsRuleAccepted(true);
//       setTimeLeft(dailyRule.type === 'HALF_TIME' ? 6 : 12);
//     } else if (activeMode === 'HARD' && !keepRule) {
//       setActiveRule('NONE');
//       setWheelResult(null);
//       setIsRuleAccepted(false);
//     } else {
//       const dynamicDuration = activeMode === 'HARD' ? (activeRule === 'HALF_TIME' ? 6 : 12) : 7;
//       setTimeLeft(dynamicDuration);
//     }

//     setTimeout(() => {
//       if (inputRef.current && (activeMode === 'NORMAL' || activeMode === 'DAILY' || keepRule)) {
//         inputRef.current.value = "";
//         inputRef.current.focus();
//       }
//     }, 100);
//   }

//   // Günlük mücadeleye giriş kontrolü (LocalStorage entegrasyonu)
//   function handleSelectDaily(gameMotor: Motor) {
//     const dateStr = getDailyDateStr();
//     const savedDaily = localStorage.getItem(`kelime_zinciri_daily_${dateStr}`);
    
//     setGameMode('DAILY');
    
//     if (savedDaily) {
//       // Eğer kullanıcı bugün zaten oynadıysa eski skor yüklenir ve doğrudan bitiş ekranı açılır
//       const parsed = JSON.parse(savedDaily);
//       setPuzzle(parsed.puzzle);
//       setEnteredWords(parsed.enteredWords);
//       setElapsedSeconds(parsed.elapsedSeconds);
//       setIsTimeOut(parsed.isTimeOut);
//       setGameOver(true);
      
//       const seed = getDailySeed();
//       const dailyRule = getDailyRule(seed);
//       setActiveRule(dailyRule.type);
//       setWheelResult(dailyRule);
//       setIsRuleAccepted(true);
//     } else {
//       createNewPuzzle(gameMotor, false, 'DAILY');
//     }
//   }

//   // --- 🟩 WORDLE TARZI PAYLAŞMA MEKANİĞİ ---
//   function handleShare() {
//     if (!puzzle || !wheelResult) return;
    
//     const dateStr = getDailyDateStr();
//     const ruleLabel = wheelResult.label;
    
//     // Emojilerden oluşan ilerleme zinciri şablonu
//     let emojiChain = enteredWords.map(() => '🟩').join(' ');
//     if (isTimeOut) {
//       emojiChain += ' 🟥';
//     }

//     const shareText = `🔗 Kelime Zinciri - Günün Mücadelesi (${dateStr})\n` +
//                       `🚫 Kural:${ruleLabel}\n` +
//                       `⏱️ Süre: ${elapsedSeconds || currentMaxTime} saniye\n` +
//                       `🔤 Kullanılan Kelimeler: ${enteredWords.length} Kelime\n` +
//                       `${emojiChain}\n\n` +
//                       `Sen de dene: https://kelimezinciri.com`; // Kendi linkinizle güncelleyebilirsiniz

//     navigator.clipboard.writeText(shareText)
//       .then(() => alert('Sonuçlar başarıyla panoya kopyalandı! 🚀'))
//       .catch(() => alert('Kopyalama başarısız oldu, lütfen manuel kopyalayın.'));
//   }

//   function spinTheWheel() {
//     if (isSpinning) return;
//     setIsSpinning(true);
//     setValidationMessages([]);
//     setActiveRule('NONE'); 

//     let count = 0;
//     const interval = setInterval(() => {
//       const randomOption = WHEEL_OPTIONS[Math.floor(Math.random() * WHEEL_OPTIONS.length)];
//       setWheelResult(randomOption);
//       count++;

//       if (count > 15) {
//         clearInterval(interval);
//         setIsSpinning(false);
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
//     if (gameOver || !puzzle || isSpinning || gameMode === null || (gameMode === 'HARD' && !isRuleAccepted)) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           setIsTimeOut(true);
//           setGameOver(true);
//           setSuccessMessage("");
//           setValidationMessages(["⏰ Süre doldu!"]);
          
//           // Günlük modda süre biterse LocalStorage'a kaydet
//           if (gameMode === 'DAILY') {
//             const dateStr = getDailyDateStr();
//             localStorage.setItem(`kelime_zinciri_daily_${dateStr}`, JSON.stringify({
//               puzzle,
//               enteredWords,
//               elapsedSeconds: currentMaxTime,
//               isTimeOut: true
//             }));
//           }
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
//     const updatedWord = (currentWord + key).toLocaleUpperCase('tr-TR').normalize('NFC');
//     setCurrentWord(updatedWord);

//     if (inputRef.current) {
//       inputRef.current.value = updatedWord;
//       inputRef.current.focus();
//     }
//   };
  
//   const handleDelete = () => {
//     if (gameOver || isSpinning || (gameMode === 'HARD' && !isRuleAccepted)) return;
    
//     const updatedWord = currentWord.slice(0, -1);
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

//     if (nextMessages.length === 0 && (gameMode === 'HARD' || gameMode === 'DAILY')) {
//       const upperNextWord = nextWord.toLocaleUpperCase('tr-TR').normalize('NFC');

//       if (activeRule === 'NO_CYCLE' && puzzle) {
//         const lastLetterOfStart = puzzle.start[puzzle.start.length - 1].toLocaleUpperCase('tr-TR').normalize('NFC');
//         if (upperNextWord.endsWith(lastLetterOfStart)) {
//           nextMessages.push(`Kural İhlali! Kelime, başlangıç kelimesinin son harfi olan '${lastLetterOfStart}' ile bitemez.`);
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
//       const finalWords = [...updatedWords, puzzle.target];
//       setEnteredWords(finalWords);
//       const finalElapsed = Math.floor((Date.now() - startTime) / 1000);
//       setElapsedSeconds(finalElapsed);
//       setGameOver(true);
//       setSuccessMessage("");

//       // Günlük modda zafer durumunda LocalStorage'a kaydet
//       if (gameMode === 'DAILY') {
//         const dateStr = getDailyDateStr();
//         localStorage.setItem(`kelime_zinciri_daily_${dateStr}`, JSON.stringify({
//           puzzle,
//           enteredWords: finalWords,
//           elapsedSeconds: finalElapsed,
//           isTimeOut: false
//         }));
//       }
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

//   if (!gameStarted) {
//     return (
//       <main className="game-shell">
//         <LandingPage onStart={() => setGameStarted(true)}/>
//       </main>
//     );
//   }

//   if (gameMode === null) {
//     return (
//       <main className="game-shell">
//         <div className="game-container mode-selection-container">
//           <Header title="Kelime Zinciri" subtitle="Oyun Modunu Seç" />
//           <div className="mode-buttons-wrapper">
//             {/* GÜNCELLEME: Günlük mücadele butonu eklendi */}
//             <button className="mode-btn daily" onClick={() => motor && handleSelectDaily(motor)}>
//               📅 Günün Mücadelesi
//               <span>Günde tek hak! Herkesle aynı kelime ve kuralda yarış.</span>
//             </button>
//             <button className="mode-btn normal" onClick={() => {
//               setGameMode('NORMAL');
//               setTimeLeft(7);
//             }}>
//               🟢 Pratik Modu (Normal)
//               <span>Klasik kurallarla antrenman yap.</span>
//             </button>
//             <button className="mode-btn hard" onClick={() => setGameMode('HARD')}>
//               🔴 Pratik Modu (Kaos)
//               <span>Çarkı çevir, değişen kurallarla yarış!</span>
//             </button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (gameMode === 'HARD' && !isRuleAccepted) {
//     return (
//       <main className="game-shell">
//         <div className="game-container wheel-container">
//           <Header title="Zor Mod Çarkı" subtitle="Bu oyunun kaderini belirlemek için aşağıdaki çarka dokunun!" />
          
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
//               <div className="wheel-placeholder"> Dokunarak Çarkı Döndür!</div>
//             )}
//           </div>

//           {!isSpinning && activeRule !== 'NONE' && (
//             <button 
//               className="start-game-btn animate-bounce" 
//               onClick={() => {
//                 const dynamicTime = activeRule === 'HALF_TIME' ? 6 : 12;
//                 setTimeLeft(dynamicTime);
//                 setIsRuleAccepted(true);
//                 setTimeout(() => {
//                   inputRef.current?.focus();
//                 }, 100);
//               }}
//             >
//                Kuralı Anladım, Başla!
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

//   return (
//     <main className="game-shell" onClick={handleWrapperClick}>
//       <div className={`game-container ${shakeInput ? 'shake' : ''}`}> 
//         <Header 
//           title="Kelime Zinciri" 
//           subtitle={(gameMode === 'HARD' || gameMode === 'DAILY') && wheelResult ? `📢 Kural: ${wheelResult.label}` : ""}
//         />
        
//         {puzzle && !gameOver && (
//           <GoalBar start={displayWord(puzzle.start)} target={displayWord(puzzle.target)}/>
//         )}

//         {!gameOver && (
//           <CircularTimer timeLeft={timeLeft} totalTime={currentMaxTime} />
//         )}

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

//         {gameOver && motor && (
//           <div className="game-over-overlay">
//             <div className="game-over-card animate-popup">
              
//               {/* GÜNCELLEME: Günlük Mod için Paylaşım Odaklı Özel Skor Paneli */}
//               {gameMode === 'DAILY' ? (
//                 <div className="daily-finish-card">
//                   <h2>{isTimeOut ? "⏱️ Süre Doldu!" : "🎉 Harika Bir Skor!"}</h2>
//                   <p className="daily-subtitle">Günün mücadelesini tamamladın. Yarın yeni kelimelerle görüşmek üzere!</p>
                  
//                   <div className="daily-stats-summary" style={{ margin: '20px 0', padding: '15px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
//                     <p style={{ margin: '5px 0' }}>🔤 Toplam Kelime: <strong>{enteredWords.length}</strong></p>
//                     <p style={{ margin: '5px 0' }}>⏱️ Harcanan Süre: <strong>{elapsedSeconds || currentMaxTime} saniye</strong></p>
//                     <p style={{ margin: '5px 0' }}>📢 Günün Engeli: <strong>{wheelResult?.label}</strong></p>
//                   </div>

//                   <button className="share-btn-main" onClick={handleShare} style={{ width: '100%', padding: '12px', background: '#22c55e', color: 'white', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', border: 'none', fontSize: '16px', marginBottom: '10px' }}>
//                     📊 Sonucu Paylaş (Wordle Tarzı)
//                   </button>
//                 </div>
//               ) : (
//                 // Klasik Pratik Modu Bitiş Ekranları
//                 isTimeOut ? (
//                   <div className="timeout-screen">
//                     <h2>⏱️ Süre Doldu!</h2>
//                     <p>Zamanında kelime üretemediğin için oyun bitti.</p>
//                     <button className="new-game-btn" onClick={() => createNewPuzzle(motor)}>
//                       Yeniden Dene
//                     </button>
//                   </div>
//                 ) : (
//                   <VictoryScreen
//                     wordsUsed={enteredWords.length}
//                     elapsedSeconds={elapsedSeconds}
//                     onNewGame={() => createNewPuzzle(motor)}
//                   />
//                 )
//               )}

//               <button className="back-to-menu-btn" onClick={() => {
//                 setGameMode(null);
//                 setActiveRule('NONE');
//                 setWheelResult(null);
//                 setIsRuleAccepted(false);
//               }}>
//                  Ana Menüye Dön
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

// --- ZOR MOD / ÇARK TİPLERİ VE SEÇENEKLERİ ---
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
  { type: 'NO_CYCLE', label: ' Kısır Döngü Yasağı', description: 'Başlangıç kelimesinin son harfiyle biten kelime kullanamazsın!' },
  { type: 'BAN_VOWELS', label: ' Sesli Ambargosu', description: "İçinde 'A' veya 'E' geçen kelimeler yasak!" },
  { type: 'BAN_CONSONANTS', label: ' Sessiz Ambargosu', description: "İçinde 'K', 'L' veya 'M' geçen kelimeler yasak!" },
  { type: 'MIN_LENGTH', label: ' Ağır Sıklet', description: 'En az 5 harfli kelimeler kullanmalısın!' },
  { type: 'HALF_TIME', label: ' Zaman Baskısı', description: 'Süre 12 saniyeden 6 saniyeye düşer! Elini çabuk tut!' },
];

// --- 📅 GÜNLÜK SEED & GEÇİCİ RASTGELELİK MOTORU ---
function getDailyDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDailySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function createSeededRandom(seed: number) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function getDailyRule(seed: number): WheelOption {
  const rng = createSeededRandom(seed);
  const index = Math.floor(rng() * WHEEL_OPTIONS.length);
  return WHEEL_OPTIONS[index];
}

function displayWord(word: string): string {
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
  const [gameMode, setGameMode] = useState<'NORMAL' | 'HARD' | 'DAILY' | null>(null);
  const [activeRule, setActiveRule] = useState<GameRule>('NONE');
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<WheelOption | null>(null);
  const [isRuleAccepted, setIsRuleAccepted] = useState(false);

  const currentMaxTime = (gameMode === 'HARD' || gameMode === 'DAILY')
    ? (activeRule === 'HALF_TIME' ? 6 : 12) 
    : 7;

  const [timeLeft, setTimeLeft] = useState(7); 
  const [isTimeOut, setIsTimeOut] = useState(false);

  function createNewPuzzle(gameMotor: Motor, keepRule = false, forceMode?: 'NORMAL' | 'HARD' | 'DAILY') {
    const activeMode = forceMode || gameMode;
    let nextPuzzle;

    if (activeMode === 'DAILY') {
      const seed = getDailySeed();
      const seededRng = createSeededRandom(seed);
      const originalRandom = Math.random;
      
      Math.random = seededRng; 
      nextPuzzle = generatePuzzle(gameMotor);
      Math.random = originalRandom; 
    } else {
      nextPuzzle = generatePuzzle(gameMotor);
    }

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
    
    if (activeMode === 'DAILY') {
      const seed = getDailySeed();
      const dailyRule = getDailyRule(seed);
      setActiveRule(dailyRule.type);
      setWheelResult(dailyRule);
      setIsRuleAccepted(true);
      setTimeLeft(dailyRule.type === 'HALF_TIME' ? 6 : 12);
    } else if (activeMode === 'HARD' && !keepRule) {
      setActiveRule('NONE');
      setWheelResult(null);
      setIsRuleAccepted(false);
    } else {
      const dynamicDuration = activeMode === 'HARD' ? (activeRule === 'HALF_TIME' ? 6 : 12) : 7;
      setTimeLeft(dynamicDuration);
    }

    setTimeout(() => {
      if (inputRef.current && (activeMode === 'NORMAL' || activeMode === 'DAILY' || keepRule)) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
    }, 100);
  }

  function handleSelectDaily(gameMotor: Motor) {
    const dateStr = getDailyDateStr();
    const savedDaily = localStorage.getItem(`kelime_zinciri_daily_${dateStr}`);
    
    setGameMode('DAILY');
    
    if (savedDaily) {
      const parsed = JSON.parse(savedDaily);
      setPuzzle(parsed.puzzle);
      setEnteredWords(parsed.enteredWords);
      setElapsedSeconds(parsed.elapsedSeconds);
      setIsTimeOut(parsed.isTimeOut);
      setGameOver(true);
      
      const seed = getDailySeed();
      const dailyRule = getDailyRule(seed);
      setActiveRule(dailyRule.type);
      setWheelResult(dailyRule);
      setIsRuleAccepted(true);
    } else {
      createNewPuzzle(gameMotor, false, 'DAILY');
    }
  }

  // --- 🟩 WORDLE TARZI PAYLAŞMA MEKANİĞİ ---
  function handleShare() {
    if (!puzzle || !wheelResult) return;
    
    const dateStr = getDailyDateStr();
    const ruleLabel = wheelResult.label;
    
    let emojiChain = enteredWords.map(() => '🟩').join(' ');
    if (isTimeOut) {
      emojiChain += ' 🟥';
    }

    const progressText = isTimeOut 
      ? `📈 İlerleme: Zinciri ${enteredWords.length - 1} kelime uzattım!` 
      : `🏆 Durum: Başarıyla tamamladım! (${enteredWords.length} Kelime)`;

    const shareText = `🔗 Kelime Zinciri - Günün Mücadelesi (${dateStr})\n` +
                      `🚫 Kural:${ruleLabel}\n` +
                      `⏱️ Süre: ${elapsedSeconds || currentMaxTime} saniye\n` +
                      `🔤 ${progressText}\n` +
                      `${emojiChain}\n\n` +
                      `Sen de dene: https://kelimezinciri.com`;

    navigator.clipboard.writeText(shareText)
      .then(() => alert('Sonuçlar başarıyla panoya kopyalandı! 🚀'))
      .catch(() => alert('Kopyalama başarısız oldu.'));
  }

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
// 🎯 Kaos Modu çark ekranında "Kuralı Anladım, Başla!" butonunu Space ve Enter ile tetikler
useEffect(() => {
  const handleStartGameKeyDown = (event: KeyboardEvent) => {
    // Oyuncu Kaos modundaysa, çark dönmeyi bitirdiyse ve kural henüz onaylanmadıysa aktifleştir
    if (gameMode === 'HARD' && !isRuleAccepted && !isSpinning && activeRule !== 'NONE') {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault(); // Varsayılan tarayıcı hareketlerini engelle
        
        const dynamicTime = activeRule === 'HALF_TIME' ? 6 : 12;
        setTimeLeft(dynamicTime);
        setIsRuleAccepted(true);
        
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }
  };

  window.addEventListener('keydown', handleStartGameKeyDown);
  return () => {
    window.removeEventListener('keydown', handleStartGameKeyDown);
  };
}, [gameMode, isRuleAccepted, isSpinning, activeRule]);
  useEffect(() => {
    if (gameOver || !puzzle || isSpinning || gameMode === null || (gameMode === 'HARD' && !isRuleAccepted)) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeOut(true);
          setGameOver(true);
          setSuccessMessage("");
          setValidationMessages(["⏰ Süre doldu!"]);
          
          if (gameMode === 'DAILY') {
            const dateStr = getDailyDateStr();
            localStorage.setItem(`kelime_zinciri_daily_${dateStr}`, JSON.stringify({
              puzzle,
              enteredWords,
              elapsedSeconds: currentMaxTime,
              isTimeOut: true
            }));
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [gameOver, puzzle, enteredWords, activeRule, isSpinning, gameMode, isRuleAccepted]);

  // --- ⌨️ YENİDEN DENE İÇİN KISAYOL TUŞLARI (SPACE & ENTER) ---
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // Eğer oyun bittiyse, motor hazırsa ve günlük modda değilsek kısayolları aktifleştir
      if (gameOver && motor && gameMode !== 'DAILY') {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault(); // Sayfanın kaymasını veya form aksiyonlarını engelle
          createNewPuzzle(motor);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [gameOver, motor, gameMode]);

  const handleKeyClick = (key: string) => {
    if (gameOver || isSpinning || (gameMode === 'HARD' && !isRuleAccepted)) return;
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

    if (nextMessages.length === 0 && (gameMode === 'HARD' || gameMode === 'DAILY')) {
      const upperNextWord = nextWord.toLocaleUpperCase('tr-TR').normalize('NFC');

      if (activeRule === 'NO_CYCLE' && puzzle) {
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
    setTimeLeft(currentMaxTime); 
    setValidationMessages([]);

    if (nextWord[nextWord.length - 1] === puzzle.target[0]) {
      const finalWords = [...updatedWords, puzzle.target];
      setEnteredWords(finalWords);
      const finalElapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSeconds(finalElapsed);
      setGameOver(true);
      setSuccessMessage("");

      if (gameMode === 'DAILY') {
        const dateStr = getDailyDateStr();
        localStorage.setItem(`kelime_zinciri_daily_${dateStr}`, JSON.stringify({
          puzzle,
          enteredWords: finalWords,
          elapsedSeconds: finalElapsed,
          isTimeOut: false
        }));
      }
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
            <button className="mode-btn daily" onClick={() => motor && handleSelectDaily(motor)}>
              📅 Günün Oyunu
              <span>Günde tek hak! Herkesle aynı kelime ve kuralda yarış.</span>
            </button>
            <button className="mode-btn normal" onClick={() => {
              if (motor) {
                setGameMode('NORMAL');
                createNewPuzzle(motor, false, 'NORMAL');
              }
            }}>
              🟢 Klasik Mod
              <span>Klasik kurallarla antrenman yap.</span>
            </button>
            <button className="mode-btn hard" onClick={() => {
              if (motor) {
                setGameMode('HARD');
                createNewPuzzle(motor, false, 'HARD');
              }
            }}>
              🔴 Mücadele Modu
              <span>Çarkı çevir, değişen kurallarla yarış!</span>
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
              <div className="wheel-placeholder"> Dokunarak Çarkı Döndür!</div>
            )}
          </div>

          {!isSpinning && activeRule !== 'NONE' && (
            <button 
              className="start-game-btn animate-bounce" 
              onClick={() => {
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
          subtitle={(gameMode === 'HARD' || gameMode === 'DAILY') && wheelResult ? `📢 Kural: ${wheelResult.label}` : ""}
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
              
              {/* Günlük Mod Bitiş Paneli */}
              {gameMode === 'DAILY' ? (
                <div className="daily-finish-card">
                  {isTimeOut ? (
                    <>
                      <h2>⏱️ Süre Doldu!</h2>
                      <p className="daily-subtitle" style={{ fontSize: '15px', color: 'var(--text-muted, #666)' }}>
                        Bugün zinciri <strong>{enteredWords.length - 1}</strong> kelime ilerletebildin, tebrikler! Yarın daha fazlasını yapabilirsin! 💪
                      </p>
                    </>
                  ) : (
                    <>
                      <h2>🎉 Başardın!</h2>
                      <p className="daily-subtitle" style={{ fontSize: '15px', color: 'var(--text-muted, #666)' }}>
                        Harika! Günün mücadelesini başarıyla tamamlayarak hedef kelimeye ulaştın! 🏆
                      </p>
                    </>
                  )}
                  
                  <div className="daily-stats-summary" style={{ margin: '20px 0', padding: '15px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', textAlign: 'left' }}>
                    <p style={{ margin: '5px 0' }}>🔤 {isTimeOut ? "Yazabildiğin Kelime" : "Toplam Kelime"}: <strong>{isTimeOut ? enteredWords.length - 1 : enteredWords.length}</strong></p>
                    <p style={{ margin: '5px 0' }}>⏱️ Harcanan Süre: <strong>{elapsedSeconds || currentMaxTime} saniye</strong></p>
                    <p style={{ margin: '5px 0' }}>📢 Günün Engeli: <strong>{wheelResult?.label}</strong></p>
                  </div>

                  <button className="share-btn-main" onClick={handleShare} style={{ width: '100%', padding: '12px', background: '#22c55e', color: 'white', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', border: 'none', fontSize: '16px', marginBottom: '10px' }}>
                    📊 Sonucu Paylaş (Wordle Tarzı)
                  </button>
                </div>
              ) : (
                // Klasik Pratik Modu Bitiş Ekranları (Burada da kısayollar aktif)
                isTimeOut ? (
                  <div className="timeout-screen">
                    <h2>⏱️ Süre Doldu!</h2>
                    <p>Zamanında kelime üretemediğin için oyun bitti.</p>
                    <button className="new-game-btn" onClick={() => createNewPuzzle(motor)}>
                      Yeniden Dene (Space/Enter)
                    </button>
                  </div>
                ) : (
                  <VictoryScreen
                    wordsUsed={enteredWords.length}
                    elapsedSeconds={elapsedSeconds}
                    onNewGame={() => createNewPuzzle(motor)}
                  />
                )
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