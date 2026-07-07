type LandingPageProps = {
    onStart: () => void;
};

export default function LandingPage({
    onStart,
}: LandingPageProps) {
    
    // Örnek kelimeleri harflerine ayırarak tile şeklinde basacak yardımcı fonksiyon
    const renderTutorialWord = (word: string) => {
        const chars = word.split('');
        return (
            <div className="wordle-row historical">
                {chars.map((char, index) => {
                    const isLastChar = index === chars.length - 1;
                    return (
                        <div 
                            key={index} 
                            className={`tile history-tile ${isLastChar ? 'chain-connector' : ''}`}
                        >
                            {char}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="landing">
            <h1>Kelime Zinciri</h1>

            <p className="landing-subtitle">
               Kelimenin son harfiyle başlayan
               yeni kelimeler üret ve hedefe ulaş.
            </p>

            <div className="landing-divider" />

            {/* 🎯 Yeni Tile Görünümlü Öğretici Alanı */}
            <div className="tutorial-chain" style={{ gap: '12px', margin: '20px 0' }}>
                
                {renderTutorialWord("ELMA")}

                <div className="chain-arrow" style={{ transform: 'rotate(90deg)', margin: '4px 0' }}>
                    →
                </div>

                {renderTutorialWord("ANAHTAR")}

                <div className="chain-arrow" style={{ transform: 'rotate(90deg)', margin: '4px 0' }}>
                    →
                </div>

                {renderTutorialWord("RAKET")}

            </div>

            <button
                className="primary-btn"
                onClick={onStart}
            >
                Oyuna Başla
            </button>
        </div>
    );
}