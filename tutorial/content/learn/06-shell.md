---
title: "06｜Shell 脚本：把重复命令装进一个文件"
description: "运行一个只读文件、统计行数的小脚本，认识变量、循环和参数。"
lesson: 6
stage: "02 让电脑重复做事"
duration: 20
prerequisites: [05-terminal-and-linux]
outcome: "能运行并解释一个简单 .sh 脚本"
tags: [Shell, 自动化]
---

# Shell 脚本：把重复命令装进一个文件

**这一课做成什么**：能运行并解释一个简单 .sh 脚本。

每次检查资料，你都要打开文件夹、逐个数行。Shell 脚本可以把这类固定步骤保存下来。文件扩展名通常是 .sh，运行一次，就按顺序执行里面的命令。

**适用环境**：macOS / Linux / 已配置的 WSL Ubuntu。Windows PowerShell 用户可以读懂这课后进入 Python，不必为了这个练习额外安装环境。

## 先运行成品

在 ai-workshop 根目录输入：

~~~sh
sh list_notes.sh input
~~~

它会列出 input 里每个 .txt 文件的行数。练习包里的 monday.txt、tuesday.txt 各有两行，所以应看到两个文件、各两行。脚本只读取文件，不修改它们。

## 四个最小概念

脚本中的核心逻辑是：

~~~sh
folder="input"
for file in "$folder"/*.txt; do
  [ -f "$file" ] || continue
  lines=$(wc -l < "$file")
  printf '%s: %s 行\n' "$file" "$lines"
done
~~~

- folder 是**变量**，给一个值起名字；等号两边不要加空格。
- for 是**循环**，对匹配到的每个文件做同样的事。
- wc -l 数换行符；本练习每条记录以换行结束，因此等于记录行数。
- printf 输出信息；它没有保存或修改原文件。

双引号让含空格的路径作为一个整体传入。方括号里的 -f 检查是不是普通文件；如果没有匹配到文件，continue 跳过这次处理。

完整脚本还检查目录是否存在，并把第一个命令行参数当作文件夹。暂时不必背参数写法，能改输入路径并验证就足够。

## 把读懂代码交给 AI 辅助

~~~text
请逐段解释 list_notes.sh：它读取哪些路径，是否写文件，
目录不存在和目录为空时分别怎样处理。
我使用 macOS 的终端；请保持 POSIX sh 兼容。
不要重写整个脚本，先解释现有逻辑。
~~~

理解后再要求加一个小功能，例如“最后显示一共找到多少文件”。让 AI 列出改动，并用空目录验证。

## 动手做

新建一个空文件夹 empty-notes，运行：

~~~sh
sh list_notes.sh empty-notes
sh list_notes.sh missing-notes
~~~

前者应该提示没有 .txt 文件；后者应该报目录不存在并退出。二者的含义不同。

**完成标准**：正常目录、空目录、不存在目录的行为都符合预期。需要处理复杂结构化数据时，进入下一课的 Python，不必继续扩展 Shell 技巧。

<details>
<summary>自测：为什么先用 sh list_notes.sh，而不是直接点文件？</summary>

这明确指定了执行程序，也能在终端看到输出和错误。直接双击文件的行为由系统决定，可能只是打开编辑器。

</details>

[上一课](05-terminal-and-linux.md) · [下一课：一点 Python →](07-python.md)
