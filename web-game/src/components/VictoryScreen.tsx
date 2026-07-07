import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

type VictoryScreenProps = {
  wordsUsed: number;
  elapsedSeconds: number;
  onNewGame: () => void;
};

export default function VictoryScreen({
  wordsUsed,
  elapsedSeconds,
  onNewGame,
}: VictoryScreenProps) {

  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={350} />}

      <motion.section
        className="victory-card"
        initial={{
          opacity: 0,
          scale: .8,
          y: 40,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: .5,
        }}
      >

        {/* <div className="victory-emoji">
          🏆
        </div> */}

        <h2>
          Tebrikler!
        </h2>

        <p>
          Hedef kelimeye başarıyla ulaştın.
        </p>

        <div className="victory-stats">
             <h2>
           <span>{wordsUsed-1}</span>
            <small> Kelime</small>
        </h2>
          

            <h2>
            <span>{elapsedSeconds} s</span>
         </h2>

        </div>

        <button
          className="primary-btn"
          onClick={onNewGame}
        >
          Yeni Oyun
        </button>

      </motion.section>
    </>
  );
}