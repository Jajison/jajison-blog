"""只打包公开练习素材，不带运行结果、环境或缓存。"""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

def workshop_files(source):
    """打包与校验共享同一份公开文件集合；返回相对路径到源文件的映射。"""
    files = {}
    for path in sorted(source.rglob("*")):
        rel = path.relative_to(source)
        if any(part in ("__pycache__", ".venv", ".git") for part in rel.parts):
            continue
        if any(part == ".DS_Store" or part.startswith(".env") for part in rel.parts):
            continue
        if rel.parts[0] == "output" and rel.as_posix() != "output/.gitkeep":
            continue
        if path.is_symlink():
            raise ValueError(f"练习包不允许符号链接：{rel}")
        if path.is_file():
            files[rel.as_posix()] = path
    return files


def main():
    root = Path(__file__).resolve().parents[1]
    source = root / "content/downloads/workshop"
    target = root / "content/downloads/ai-workshop.zip"
    files = workshop_files(source)
    with ZipFile(target, "w", compression=ZIP_DEFLATED) as archive:
        for relative, path in files.items():
            # 固定元数据，让相同源码生成相同 ZIP，减少无内容变化的二进制差异。
            info = ZipInfo("ai-workshop/" + relative, date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, path.read_bytes())
    print(f"Created {target.name}: {len(files)} files ({target.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
