from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from collections import deque
from random import choice

from motor import Motor


DEFAULT_DICTIONARY_FOLDER = "Turkce-Kelime-Listesi"


@dataclass
class SearchStats:
	path: list[str]
	nodes_visited: int
	branches_tried: int

	@property
	def intermediate_moves(self) -> int:
		return max(0, len(self.path) - 2)


def normalize(word: str) -> str:
	return word.strip().lower()


def _search_any_solution(
	motor: Motor,
	start: str,
	target: str,
	max_moves: int,
) -> SearchStats | None:
	start_word = start.strip()
	target_word = target.strip()
	start_normalized = normalize(start_word)
	target_normalized = normalize(target_word)

	if not start_word or not target_word:
		return None

	if not motor.contains(start_word) or not motor.contains(target_word):
		return None

	if start_normalized == target_normalized:
		return SearchStats(path=[start_word], nodes_visited=1, branches_tried=0)

	stats = SearchStats(path=[], nodes_visited=0, branches_tried=0)
	used_words = {start_normalized}

	def depth_first_search(current_word: str, remaining_moves: int, path: list[str]) -> list[str] | None:
		nonlocal stats
		stats.nodes_visited += 1

		if current_word[-1].lower() == target_word[0].lower():
			return path + [target_word]

		if remaining_moves == 0:
			return None

		for neighbor in motor.neighbors(current_word):
			normalized_neighbor = normalize(neighbor)
			if normalized_neighbor in used_words:
				continue
			if normalized_neighbor == target_normalized:
				continue

			stats.branches_tried += 1
			used_words.add(normalized_neighbor)
			solution = depth_first_search(neighbor, remaining_moves - 1, path + [neighbor])
			if solution is not None:
				return solution
			used_words.remove(normalized_neighbor)

		return None

	path = depth_first_search(start_word, max_moves, [start_word])
	if path is None:
		return None

	stats.path = path
	return stats


def _search_shortest_solution(
	motor: Motor,
	start: str,
	target: str,
	max_moves: int,
) -> SearchStats | None:
	start_word = start.strip()
	target_word = target.strip()
	start_normalized = normalize(start_word)
	target_normalized = normalize(target_word)
	target_first_letter = target_word[0].lower() if target_word else ""

	if not start_word or not target_word:
		return None

	if not motor.contains(start_word) or not motor.contains(target_word):
		return None

	if start_normalized == target_normalized:
		return SearchStats(path=[start_word], nodes_visited=1, branches_tried=0)

	queue: deque[tuple[str, list[str], int]] = deque([(start_word, [start_word], 0)])
	visited = {start_normalized}
	stats = SearchStats(path=[], nodes_visited=0, branches_tried=0)

	while queue:
		current_word, path, moves_used = queue.popleft()
		stats.nodes_visited += 1

		if current_word[-1].lower() == target_first_letter:
			stats.path = path + [target_word]
			return stats

		if moves_used >= max_moves:
			continue

		for neighbor in motor.neighbors(current_word):
			normalized_neighbor = normalize(neighbor)
			if normalized_neighbor in visited:
				continue
			if normalized_neighbor == target_normalized:
				continue

			stats.branches_tried += 1
			visited.add(normalized_neighbor)
			queue.append((neighbor, path + [neighbor], moves_used + 1))

	return None


def find_any_solution(
	start: str,
	target: str,
	max_moves: int,
	dictionary_folder: str | Path = DEFAULT_DICTIONARY_FOLDER,
	verbose: bool = False,
) -> list[str] | None:
	motor = Motor(dictionary_folder)
	result = _search_any_solution(motor, start, target, max_moves)

	if result is None:
		if verbose:
			print("No solution found.")
		return None

	if verbose:
		print(f"Solution path length: {len(result.path)} words")
		print(f"Intermediate moves: {result.intermediate_moves}")
		print(f"Visited nodes: {result.nodes_visited}")
		print(f"Branches tried: {result.branches_tried}")
		print("Path:")
		for word in result.path:
			print(word)

	return result.path


def find_shortest_solution(
	start: str,
	target: str,
	max_moves: int,
	dictionary_folder: str | Path = DEFAULT_DICTIONARY_FOLDER,
	verbose: bool = False,
) -> list[str] | None:
	motor = Motor(dictionary_folder)
	result = _search_shortest_solution(motor, start, target, max_moves)

	if result is None:
		if verbose:
			print("No solution found.")
		return None

	if verbose:
		print(f"Shortest solution path length: {len(result.path)} words")
		print(f"Intermediate moves: {result.intermediate_moves}")
		print(f"Visited nodes: {result.nodes_visited}")
		print(f"Branches tried: {result.branches_tried}")
		print("Path:")
		for word in result.path:
			print(word)

	return result.path


def has_solution(
	start: str,
	target: str,
	max_moves: int,
	dictionary_folder: str | Path = DEFAULT_DICTIONARY_FOLDER,
) -> bool:
	return find_shortest_solution(start, target, max_moves, dictionary_folder) is not None


def random_word(motor: Motor) -> str:
	words = motor.all_words()
	if not words:
		raise ValueError("Dictionary is empty")
	return choice(words)


def generate_puzzle(
	max_moves: int,
	dictionary_folder: str | Path = DEFAULT_DICTIONARY_FOLDER,
	max_attempts: int = 1000,
) -> tuple[str, str]:
	motor = Motor(dictionary_folder)
	words = motor.all_words()
	if not words:
		raise ValueError("Dictionary is empty")

	for _ in range(max_attempts):
		start = choice(words)
		target = choice(words)
		if normalize(start) == normalize(target):
			continue
		if _search_shortest_solution(motor, start, target, max_moves) is not None:
			return start, target

	raise RuntimeError("Could not generate a puzzle with a valid solution")


if __name__ == "__main__":
	solution = find_any_solution("elma", "meyve", 3, verbose=True)
	if solution is None:
		print("None")
