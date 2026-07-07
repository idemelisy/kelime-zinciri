import "../styles/Keyboard.css";

type KeyboardProps = {
  onKeyClick: (key: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
};

export default function Keyboard({ onKeyClick, onDelete, onSubmit }: KeyboardProps) {
  // Türkçe Q Klavye satırları
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
    ["Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç"],
  ];

  return (
    <div className="keyboard-container">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {/* Sadece 3. satırın başına GÖNDER butonu ekleyelim */}
          {rowIndex === 2 && (
            <button className="keyboard-btn special-btn" onClick={onDelete}>
              SİL
            </button>
          )}

          {row.map((char) => (
            <button
              key={char}
              className="keyboard-btn"
              onClick={() => onKeyClick(char)}
            >
              {char}
            </button>
          ))}

          {/* Sadece 3. satırın sonuna SİL (Backspace) butonu ekleyelim */}
          {rowIndex === 2 && (
            <button className="keyboard-btn special-btn" onClick={onSubmit}>
              GÖNDER
            </button>
          )}
        </div>
      ))}
    </div>
  );
}