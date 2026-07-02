from __future__ import annotations

from argparse import ArgumentParser

from motor import Motor


DEFAULT_START = "elma"
DEFAULT_TARGET = "meyve"


def normalize(word: str) -> str:
	return word.strip().lower()


def main() -> None:
	parser = ArgumentParser(description="Start-target word chain demo")
	parser.add_argument("--start", default=DEFAULT_START, help="Starting word")
	parser.add_argument("--target", default=DEFAULT_TARGET, help="Target word")
	args = parser.parse_args()

	motor = Motor("Turkce-Kelime-Listesi")
	start_word = args.start.strip()
	target_word = args.target.strip()

	if not start_word or not target_word:
		print("Start and target words must not be empty.")
		return

	if not motor.contains(start_word):
		print(f"Start word not found in dictionary: {start_word}")
		return

	if not motor.contains(target_word):
		print(f"Target word not found in dictionary: {target_word}")
		return

	current_word = start_word
	used_words = {normalize(start_word)}
	moves = 0

	print("Word Chain Demo")
	print("Type q to quit.")
	print(f"Start: {start_word}")
	print(f"Target: {target_word}")
	print("Rule: each next word must start with the last letter of the previous word.")
	print("You win when the last letter of your word matches the first letter of the target word.")

	while True:
		expected_letter = current_word[-1]
		user_word = input(f"Next word starting with '{expected_letter}': ").strip()
		if normalize(user_word) in {"q", "quit", "exit"}:
			print(f"Stopped. Moves: {moves}")
			break

		if not user_word:
			print("Empty input. Game over.")
			print(f"Moves: {moves}")
			break

		if not motor.contains(user_word):
			print("Not in dictionary. Try again.")
			continue

		if normalize(user_word) in used_words:
			print("Already used. Game over.")
			print(f"Moves: {moves}")
			break

		if user_word[0].lower() != expected_letter.lower():
			print(f"Wrong start letter. It must start with '{expected_letter}'.")
			print(f"Moves: {moves}")
			break

		used_words.add(normalize(user_word))
		current_word = user_word
		moves += 1
		print(f"Accepted: {user_word}")

		if user_word[-1].lower() == target_word[0].lower():
			print(f"Success! You connected to the target word '{target_word}' in {moves} moves.")
			break


if __name__ == "__main__":
	main()
