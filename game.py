from __future__ import annotations

from argparse import ArgumentParser
from dataclasses import dataclass
from random import choice

from motor import Motor


DEFAULT_FOLDER = "Turkce-Kelime-Listesi"


@dataclass
class Puzzle:
    start: str
    target: str
    solution: list[str]  # [start, w1, w2, w3, target]


def normalize(word: str) -> str:
    return word.strip().lower()


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

        target_candidates = [
            w
            for w in motor.neighbors(w3)
            if normalize(w) not in used
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
    args = parser.parse_args()

    motor = Motor(args.folder)

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

        if current[-1].lower() == puzzle.target[0].lower():
            print()
            print("🎉 Success!")
            print(f"Solved in {moves} moves.")
            return


if __name__ == "__main__":
    main()