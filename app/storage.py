from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"

UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)


def clear_storage():
    """Delete all uploaded + output images."""
    for folder in [UPLOAD_DIR, OUTPUT_DIR]:
        for file in folder.glob("*"):
            if file.is_file():
                file.unlink()