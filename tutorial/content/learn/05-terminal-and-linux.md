---
title: "05｜终端与 Linux：看懂 AI 给你的命令"
description: "只学位置、命令、输入输出和停止程序，足够开始运行小工具。"
lesson: 5
stage: "02 让电脑重复做事"
duration: 20
prerequisites: [04-workspace]
outcome: "执行前知道命令在哪运行、会读取什么和改变什么"
tags: [终端, Linux, Shell]
---

# 终端与 Linux：看懂 AI 给你的命令

**这一课做成什么**：执行前知道命令在哪运行、会读取什么和改变什么。

终端是用文字操作电脑的窗口；Shell 是理解命令的程序；Linux 是操作系统的一类。它们不是同一个东西。macOS 自带终端与 Shell，常用命令和 Linux 相似；Windows 默认的 PowerShell 使用另一套规则。

这一课不要求安装 Linux。要练下面的命令，请使用 macOS、Linux 或已经配置好的 WSL Ubuntu 终端。

## 一条命令怎么读

~~~sh
python3 report.py --input input/records.json
~~~

从左到右：运行 Python；执行 report.py；把 --input 后的路径作为输入。--input 是这个脚本自己定义的参数，不是所有程序共有的语法。

执行前问三个问题：**我在哪个目录？这条命令读什么？它会写入或改变什么？**

## 暂时只用五个动作

在 ai-workshop 根目录运行：

~~~sh
pwd
ls
cat input/monday.txt
cd input
ls
cd ..
~~~

pwd 显示当前位置；ls 列出文件；cat 显示短文本；cd 进入目录；.. 表示上一层。最后一条让你回到 ai-workshop。

~~~sh
grep "完成" input/monday.txt
~~~

grep 筛出包含“完成”的行。没有输出可能代表没有匹配，不一定是程序坏了。

## 读懂两个连接符

竖线 | 把前一个程序的输出交给后一个，例如 cat input/monday.txt | grep "完成"。这个例子也能直接用上一段的 grep；竖线只是演示“接力”。

大于号 > 会把输出写进文件，**同名文件存在时通常会先被清空**。所以本教程保存重要结果会使用带检查的脚本，而不是让你随手重定向到原始文件。

## Linux 只需要这张小地图

| 概念 | 现在怎样理解 | 何时会遇到 |
| --- | --- | --- |
| 文件系统 | 按目录组织文件，从 / 开始 | 找输入、输出 |
| 用户与权限 | 谁可以读、写、执行 | Permission denied |
| 进程 | 正在运行的程序 | 服务一直占着终端 |
| 环境变量 | 进程可读取的配置值 | 配置服务地址或密钥 |

sudo 会请求更高权限，不是万能修复按钮；chmod 改权限，也不能解决路径写错。遇到权限问题，先让 AI 解释涉及哪个文件和为什么需要修改。

## 停止和排错

前台程序长时间没有结束时，Ctrl+C 通常会请求中断它。关闭网页不会自动停止终端里的服务器。终端又出现输入提示符，通常意味着上一条命令已经结束，仍需检查输出与退出状态。

**动手做**：进入 input，查看 monday.txt，再回到根目录。执行每步前预测 pwd 会显示什么。

**完成标准**：能解释上面的 Python 命令，并在运行前确认目录。现在不需要学习服务器运维。

<details>
<summary>自测：AI 给了 Linux 命令，能直接粘进 PowerShell 吗？</summary>

不能默认兼容。先说明系统和终端，让 AI 给对应命令。Python 脚本可能跨平台，但启动它的 Shell 语法仍可能不同。

</details>

参考：[Ubuntu 命令行入门](https://ubuntu.com/tutorials/command-line-for-beginners)。

[上一课](04-workspace.md) · [下一课：第一个 Shell 脚本 →](06-shell.md)

