from __future__ import annotations

from collections import Counter

from motor import Motor

DICTIONARY_FOLDER = "Turkce-Kelime-Listesi"


def main() -> None:
    motor = Motor(DICTIONARY_FOLDER)
    words = motor.all_words()

    print("=" * 60)
    print("WORD CHAIN DICTIONARY STATISTICS")
    print("=" * 60)

    print(f"Total words: {len(words)}")

    first_letter = Counter()
    last_letter = Counter()
    lengths = Counter()

    for word in words:
        if not word:
            continue

        first_letter[word[0].lower()] += 1
        last_letter[word[-1].lower()] += 1
        lengths[len(word)] += 1

    print("\nFirst letter distribution")
    print("-" * 60)
    for letter, count in sorted(first_letter.items()):
        print(f"{letter:>2} : {count:>6}")

    print("\nLast letter distribution")
    print("-" * 60)
    for letter, count in sorted(last_letter.items()):
        print(f"{letter:>2} : {count:>6}")

    print("\nWord length distribution")
    print("-" * 60)
    for length, count in sorted(lengths.items()):
        print(f"{length:>2} letters : {count:>6}")

    print("\nTop 10 most common first letters")
    print("-" * 60)
    for letter, count in first_letter.most_common(10):
        print(f"{letter} : {count}")

    print("\nTop 10 most common last letters")
    print("-" * 60)
    for letter, count in last_letter.most_common(10):
        print(f"{letter} : {count}")

    print("\nAverage branching factor")
    print("-" * 60)

    total_neighbors = 0

    for word in words:
        total_neighbors += len(motor.neighbors(word))

    average = total_neighbors / len(words)

    print(f"{average:.2f} neighbors per word")


if __name__ == "__main__":
    main()