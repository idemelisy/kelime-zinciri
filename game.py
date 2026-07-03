from __future__ import annotations

from argparse import ArgumentParser
from dataclasses import dataclass
from random import choice

from motor import Motor

DEFAULT_FOLDER = "Turkce-Kelime-Listesi"
DEFAULT_DAR_FOLDER = "dar_list"

@dataclass
class Puzzle:
    start: str
    target: str
    solution: list[str]  # [start, w1, w2, w3, target]

_TURKISH_LOWER_MAP = str.maketrans({
    "I": "ı", "İ": "i", "Ş": "ş", "Ç": "ç", "Ğ": "ğ", "Ü": "ü", "Ö": "ö"
})

def normalize(word: str) -> str:
    if not word:
        return ""
    # Önce Türkçe büyük harfleri küçük harfe çevir, sonra kalanları standart lower yap
    return word.strip().translate(_TURKISH_LOWER_MAP).lower()

def random_neighbor(motor: Motor, word: str, used: set[str]) -> str | None:
    candidates = [
        w
        for w in motor.neighbors(word)
        if normalize(w) not in used
    ]

    if not candidates:
        return None

    return choice(candidates)


def generate_puzzle(motor: Motor) -> Puzzle:
    words = motor.all_words()
    # Performans için dar kelimeleri önceden normalize edilmiş bir SET (küme) haline getiriyoruz.
    # Böylece arama işlemi anında (O(1)) yapılacak.
    dar_words_set = {normalize(w) for w in words}

    while True:
        start = choice(words)
        used = {normalize(start)}

        w1 = random_neighbor(motor, start, used)
        if w1 is None:
            continue
        used.add(normalize(w1))

        w2 = random_neighbor(motor, w1, used)
        if w2 is None:
            continue
        used.add(normalize(w2))

        w3 = random_neighbor(motor, w2, used)
        if w3 is None:
            continue
        used.add(normalize(w3))

        # DÜZELTİLDİ: w3'ün komşularından (hedef adaylarından) dar listede olanları hızlıca seçiyoruz
        target_candidates = [
            w
            for w in motor.neighbors(w3)
            if normalize(w) not in used and normalize(w) in dar_words_set
        ]

        if not target_candidates:
            continue

        target = choice(target_candidates)

        return Puzzle(
            start=start,
            target=target,
            solution=[start, w1, w2, w3, target],
        )


def main() -> None:
    parser = ArgumentParser(description="Word Chain MVP")
    parser.add_argument("--folder", default=DEFAULT_FOLDER)
    parser.add_argument("--dar-folder", default=DEFAULT_DAR_FOLDER)
    args = parser.parse_args()

    motor = Motor(args.folder, args.dar_folder)

    puzzle = generate_puzzle(motor)

    print("=" * 40)
    print("WORD CHAIN MVP")
    print("=" * 40)
    print(f"Start : {puzzle.start}")
    print(f"Target: {puzzle.target}")
    print()
    print("Keep entering words until your word's last letter matches the target's first letter.")
    print("Type 'q' to quit.\n")

    # DEBUG
    print("DEBUG SOLUTION:")
    print(" -> ".join(puzzle.solution))
    print()

    current = puzzle.start
    used = {normalize(current)}
    moves = 0

    while True:
        expected = current[-1]

        while True:
            word = input(f"Word {moves + 1} (starts with '{expected}'): ").strip()

            if normalize(word) in {"q", "quit", "exit"}:
                return

            if not motor.contains(word):
                print("Not in dictionary.")
                continue

            if normalize(word) in used:
                print("Already used.")
                continue

            if word[0].lower() != expected.lower():
                print(f"Must start with '{expected}'.")
                continue

            used.add(normalize(word))
            current = word
            moves += 1
            break

        # Terminaldeki kontrolü de Streamlit mantığıyla eşitledim: 
        # Girdiğin kelimenin son harfi, hedefin ilk harfiyle eşleşirse kazanıyorsun.
        if current[-1].lower() == puzzle.target[0].lower():
            print()
            print("🎉 Success!")
            print(f"Solved in {moves} moves.")
            return


if __name__ == "__main__":
    main()