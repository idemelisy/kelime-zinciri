import { motion } from "framer-motion";

type WordChainProps = {
  words: string[];
  completed: boolean;
};

export default function WordChain({
  words,
  completed,
}: WordChainProps) {

  return (
    <section className="chain-panel">

      {words.map((word, index) => {

        const isLast = index === words.length - 1;

        return (

          <div
            className="chain-item"
            key={`${word}-${index}`}
          >

            <motion.div

              className={
                completed && isLast
                  ? "chain-card completed-card"
                  : "chain-card"
              }

              initial={{
                opacity: 0,
                y: 20,
                scale: .9,
              }}

              animate={{
                opacity: 1,
                y: 0,
                scale:
                  completed && isLast
                    ? [1, 1.12, 1]
                    : 1,
              }}

              transition={{
                duration: .35,
              }}

            >

              {word}

            </motion.div>

            {!isLast && (

              <motion.div

                className="chain-arrow"

                initial={{
                  opacity: 0,
                }}

                animate={{
                  opacity: .7,
                }}

              >

                ↓

              </motion.div>

            )}

          </div>

        );

      })}

    </section>
  );
}