type Props = {
  onClose: () => void;
};

export default function HowToPlay({ onClose }: Props) {
  return (
    <div className="how-to-play">
      <h2>Nasıl Oynanır?</h2>

      <ol>
        <li>Başlangıç kelimesiyle başla.</li>
        <li>Her yeni kelime öncekinin son harfiyle başlamalı.</li>
        <li>Kelime sözlükte bulunmalı.</li>
        <li>Aynı kelimeyi tekrar kullanamazsın.</li>
        <li>Son kelimen hedef kelimenin ilk harfiyle bitmeli.</li>
      </ol>

      <button onClick={onClose}>
        Oyuna Başla
      </button>
    </div>
  );
}