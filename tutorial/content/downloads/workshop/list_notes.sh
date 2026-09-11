#!/bin/sh
# 只读指定目录中的 txt 文件，不修改输入。
set -eu
folder=input
if [ "$#" -gt 0 ]; then
  folder=$1
fi
if [ ! -d "$folder" ]; then
  printf '错误：目录不存在：%s\n' "$folder" >&2
  exit 1
fi
found=0
for file in "$folder"/*.txt; do
  [ -f "$file" ] || continue
  lines=$(wc -l < "$file")
  printf '%s: %s 行\n' "$file" "$lines"
  found=1
done
if [ "$found" -eq 0 ]; then
  printf '没有找到 .txt 文件\n'
fi

