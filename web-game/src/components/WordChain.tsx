type WordChainProps = {
  words: string[];
};

export default function WordChain({ words }: WordChainProps) {
  return (
    <section className="chain-panel">
      {words.map((word, index) => (
        <div className="chain-item" key={`${word}-${index}`}>
          <div className="chain-card">
            {word}
          </div>

          {index !== words.length - 1 && (
            <div className="chain-arrow">
              ↓
            </div>
          )}
        </div>
      ))}
    </section>
  );
}