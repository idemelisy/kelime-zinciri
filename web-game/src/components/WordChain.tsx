import { AnimatePresence, motion } from "framer-motion";

type WordChainProps = {
  words: string[];
};

export default function WordChain({ words }: WordChainProps) {
  return (
    <section className="chain-panel">
      <AnimatePresence>
        {words.map((word, index) => (
          <motion.div
            key={`${word}-${index}`}
            className="chain-item"
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            <div className="chain-card">
              {word}
            </div>

            {index !== words.length - 1 && (
              <div className="chain-arrow">
                ↓
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  );
}