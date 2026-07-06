type LandingPageProps = {
    onStart: () => void;
};

export default function LandingPage({
    onStart,
}: LandingPageProps) {
    return (
        <div className="landing">

            <div className="landing-logo">
                🔗
            </div>

            <h1>Kelime Zinciri</h1>

            <p className="landing-subtitle">
                Önceki kelimenin son harfiyle başlayan
                yeni kelimeler üret ve hedefe ulaş.
            </p>

            <div className="landing-divider" />

            <h2>Nasıl Oynanır?</h2>

            <div className="tutorial-chain">

                <div className="tutorial-card">
                    ELMA
                </div>

                <div className="tutorial-arrow">
                    ↓
                </div>

                <div className="tutorial-card">
                    ANAHTAR
                </div>

                <div className="tutorial-arrow">
                    ↓
                </div>

                <div className="tutorial-card target-card">
                    RAKET
                </div>

            </div>

            <ul className="tutorial-rules">

                <li>✓ Kelime sözlükte bulunmalıdır.</li>

                <li>✓ Aynı kelime iki kez kullanılamaz.</li>

                <li>✓ Her kelime öncekinin son harfiyle başlamalıdır.</li>

                <li>✓ Her tur için 7 saniyen vardır.</li>

            </ul>

            <button
                className="primary-btn"
                onClick={onStart}
            >
                Oyuna Başla
            </button>

        </div>
    );
}