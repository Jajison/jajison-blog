"""只打包公开练习素材，不带运行结果、环境或缓存。"""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
source = root / "content/downloads/workshop"
target = root / "content/downloads/ai-workshop.zip"
with ZipFile(target, "w", compression=ZIP_DEFLATED) as archive:
    for path in sorted(source.rglob("*")):
        if not path.is_file():
            continue
        rel = path.relative_to(source)
        if any(part in ("__pycache__", ".venv", ".git") for part in rel.parts):
            continue
        if path.name == ".DS_Store" or path.name.startswith(".env"):
            continue
        if rel.parts[0] == "output" and path.name != ".gitkeep":
            continue
        archive.write(path, str(Path("ai-workshop")/rel))
print(f"Created {target.name} ({target.stat().st_size} bytes)")

