---
title: "03｜文件、路径和格式：先找得到，再让 AI 处理"
description: "只认识脚本练习里需要的文件常识，避免卡在找不到文件。"
lesson: 3
stage: "01 先用起来"
duration: 15
prerequisites: [02-context-and-checks]
outcome: "能找到输入文件、识别格式并保留原始资料"
tags: [文件, 路径, 入门]
---

# 文件、路径和格式：先找得到，再让 AI 处理

**这一课做成什么**：能找到输入文件、识别格式并保留原始资料。

程序说“找不到文件”，常常不是文件消失了，而是它在另一个文件夹里寻找。先把桌面上的文件关系想清楚，后面的命令就容易理解。

## 一个文件有三个关键信息

以 input/records.json 为例：input 是文件夹，records 是文件名主体，.json 是扩展名。**路径**是找到它的地址。

绝对路径从电脑的根位置开始，例如 Windows 的 C:/ai-workshop/input/records.json。相对路径从“当前所在文件夹”开始，例如 input/records.json。后者更便于把整套练习搬到另一台电脑。

把 .txt 改名为 .pdf，不会把文本变成 PDF；扩展名是线索，真正的格式还取决于文件内容。打开系统的“显示文件扩展名”，能避免 hello.py.txt 这样的误会。

## 先认识这几种

| 格式 | 用来装什么 | 本教程中的例子 |
| --- | --- | --- |
| .txt | 普通文字 | 原始工作记录 |
| .md | 带简单排版标记的文字 | 周报、教程 |
| .json | 按字段组织的数据 | 任务名、状态、耗时 |
| .csv | 按行列组织的数据 | 表格导出的记录 |
| .py / .sh | 要执行的指令 | Python / Shell 脚本 |
| .html | 网页内容与结构 | 待办小工具 |

Markdown 的 # 表示标题，- 表示列表。JSON 的字段名通常放在双引号里，字段之间用逗号分隔。现在只需要认得它们，不必背完整语法。

## 给每个小项目一个家

~~~text
ai-workshop/
├── input/       原始资料
├── output/      程序生成的结果
├── report.py    处理资料的脚本
└── README.md    如何使用这套文件
~~~

把原始资料和结果分开，便于重新运行、比较和恢复。给 AI 的路径尽量写完整，例如“读取 input/records.json，把报告保存到 output/report.md”。

以后教程说“在练习根目录运行”，就是指打开这一层 ai-workshop，能直接看到 report.py 的位置。

## 动手做

新建一个 ai-playground 文件夹，再建 input 与 output 两个子文件夹。用纯文本编辑器在 input 里保存 notes.txt，写三行虚构工作记录。用文件管理器确认实际文件名和位置。

macOS 的富文本编辑器可能默认保存富文本；如果保存后扩展名是 .rtf，改用纯文本模式或下一课的代码编辑器。

**完成标准**：能说出 notes.txt 的位置，知道将来生成的结果应该放到 output，而不是覆盖 input。

<details>
<summary>自测：两个不同文件夹里的 report.md 是同一个文件吗？</summary>

通常不是。文件名相同，完整路径不同，就是两个独立文件。排错时要提供路径，而不仅是名字。

</details>

[上一课](02-context-and-checks.md) · [下一课：准备工作台 →](04-workspace.md)

