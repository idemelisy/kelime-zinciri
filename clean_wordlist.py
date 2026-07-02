from __future__ import annotations

from argparse import ArgumentParser
from pathlib import Path


SUFFIXES = ("ist","ma", "me", "mak", "mek","lik","lık","luk","lük","izm","cı","cu","ci","ce","ca","çı","çi","çu","iş","ış","cesine","casına","çesine","çasına","lı","li","sız","siz","suz","süz","lu","lü","esi","ası")


def should_remove(word: str) -> bool:
	stripped = word.strip()
	if not stripped:
		return False
	if stripped[0].isupper():
		return True
	normalized = stripped.lower()
	if not normalized:
		return False
	if len(normalized.split()) > 1:
		return True
	if len(normalized) == 1:
		return True
	return normalized.endswith(SUFFIXES)


def filter_file(file_path: Path, apply_changes: bool) -> tuple[int, int]:
	original_lines = file_path.read_text(encoding="utf-8").splitlines()
	kept_lines = [line for line in original_lines if not should_remove(line)]

	removed_count = len(original_lines) - len(kept_lines)
	if apply_changes and removed_count > 0:
		file_path.write_text("\n".join(kept_lines) + "\n", encoding="utf-8")

	return len(original_lines), removed_count



def main() -> None:
	parser = ArgumentParser(
		description=(
			"Remove words by rules: one-letter words, multi-word phrases, or "
			"words ending with ma/me/mak/mek"
		)
	)
	parser.add_argument(
		"--folder",
		default="Turkce-Kelime-Listesi",
		help="Folder containing .list files (default: Turkce-Kelime-Listesi)",
	)
	parser.add_argument(
		"--pattern",
		default="*.list",
		help="Glob pattern for files (default: *.list)",
	)
	parser.add_argument(
		"--apply",
		action="store_true",
		help="Write changes to files. If omitted, only preview counts.",
	)
	args = parser.parse_args()

	folder = Path(args.folder)
	files = sorted(folder.glob(args.pattern))

	if not files:
		print(f"No files found: {folder / args.pattern}")
		return

	total_lines = 0
	total_removed = 0

	for file_path in files:
		line_count, removed_count = filter_file(file_path, apply_changes=args.apply)
		total_lines += line_count
		total_removed += removed_count
		print(f"{file_path.name}: removed {removed_count}/{line_count}")

	mode = "APPLIED" if args.apply else "PREVIEW"
	print(f"\n{mode} - total removed: {total_removed}/{total_lines}")


if __name__ == "__main__":
	main()
