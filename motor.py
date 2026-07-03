from __future__ import annotations

from pathlib import Path


class Motor:
	def __init__(self, folder: str | Path, dar_folder: str |Path ) -> None:
		self.folder = Path(folder)
		self.dar_folder = Path(dar_folder)
		self._words_by_letter: dict[str, list[str]] = {}
		self._word_set: set[str] = set()
		self._load_dictionary()
		self._dar_words: list[str]=[]
		self._load_dar_dictionary()
	# motor.py içindeki sınıf metodu
	def _normalize(self, word: str) -> str:
		if not word:
			return ""
		_TURKISH_LOWER_MAP = str.maketrans({"I": "ı", "İ": "i", "Ş": "ş", "Ç": "ç", "Ğ": "ğ", "Ü": "ü", "Ö": "ö"})
		return word.strip().translate(_TURKISH_LOWER_MAP).lower()


	def _load_dictionary(self) -> None:
		for file_path in sorted(self.folder.glob("*.list")):
			letter = file_path.stem.lower()
			words: list[str] = []

			for line in file_path.read_text(encoding="utf-8").splitlines():
				clean_word = line.strip()
				if not clean_word:
					continue
				words.append(clean_word)
				self._word_set.add(self._normalize(clean_word))

			self._words_by_letter[letter] = words
	def _load_dar_dictionary(self) -> None:
		for file_path in sorted(self.dar_folder.glob("*.list")):
			for line in file_path.read_text(encoding="utf-8").splitlines():
				clean_word = line.strip()
				if not clean_word:
					continue
				if self.contains(clean_word):
					self._dar_words.append(clean_word)
				


	def contains(self, word: str) -> bool:
		return self._normalize(word) in self._word_set

	def all_words(self) -> list[str]:
		return self._dar_words

	def neighbors(self, word: str) -> list[str]:
		normalized = self._normalize(word)
		if not normalized:
			return []

		last_letter = normalized[-1]
		return list(self._words_by_letter.get(last_letter, []))

	def validate_chain(self, chain: list[str]) -> bool:
		if not chain:
			return False

		for index, current_word in enumerate(chain):
			if not self.contains(current_word):
				return False

			if index == len(chain) - 1:
				continue

			next_word = chain[index + 1]
			current_normalized = self._normalize(current_word)
			next_normalized = self._normalize(next_word)

			if not current_normalized or not next_normalized:
				return False

			if next_normalized[0] != current_normalized[-1]:
				return False

			if not self.contains(next_word):
				return False

		return True
