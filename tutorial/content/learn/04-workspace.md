---
title: "04｜准备工作台：一次跑通 Python"
description: "按 macOS 和 Windows 分开操作，下载练习包并确认运行位置。"
lesson: 4
stage: "01 先用起来"
duration: 25
prerequisites: [03-files-and-formats]
outcome: "在自己的电脑上成功运行 hello.py"
tags: [环境, Python, 入门]
---

# 准备工作台：一次跑通 Python

**这一课做成什么**：在自己的电脑上成功运行 hello.py。

前面的练习只需浏览器。从这一课开始，我们让电脑执行一个文件。暂时只准备两样东西：Python 和能编辑纯文本的工具。

## 下载练习包

[下载 ai-workshop.zip](../downloads/ai-workshop.zip)，解压后找到里面的 ai-workshop 文件夹。确认能看到 hello.py、report.py、input 和 README.md。保留压缩包，需要重来时可重新解压到新的位置。

推荐使用 [VS Code](https://code.visualstudio.com/Download) 打开整个 ai-workshop 文件夹。它是写代码和查看文件的编辑器，不是 Python 本身。也可以使用已有的代码编辑器。

## 安装并确认 Python

从 [Python 官网](https://www.python.org/downloads/)安装适合系统的 Python 3。示例需要 Python 3.10 或更新版本，使用当前受支持的稳定版本即可。

在编辑器菜单打开 Terminal → New Terminal（终端 → 新建终端）。选对下面自己的系统，一次输入一行，按回车执行。

**macOS / Linux：**

~~~sh
python3 --version
python3 hello.py
~~~

**Windows PowerShell，已安装官方 Python 启动器：**

~~~powershell
py -3 --version
py -3 hello.py
~~~

第一行显示版本，第二行应出现：

~~~text
你好，AI 工作台已准备好。
下一步：运行 report.py，先预览再保存。
~~~

若 Windows 找不到 py，但 python --version 已显示 Python 3，可以使用 python hello.py。若两者都找不到，先完成官方安装并重新打开终端，不要继续叠加安装其他工具。

## 运行前，先确认位置

编辑器打开的文件夹应当是 ai-workshop 这一层。macOS / Linux 输入 pwd 查看当前位置，ls 查看文件；PowerShell 输入 Get-Location、Get-ChildItem。列表里应该有 hello.py。

如果显示“无法打开 hello.py”，通常应先修正目录，不需要重新安装 Python。

本教程后面统一写 python3；Windows 使用上述启动器时，把这一段换为 py -3。例如 python3 report.py 对应 py -3 report.py。不要改脚本内容。

## 暂时不用安装的东西

练习脚本只用 Python 自带模块，不需要 pip 安装第三方包，也不需要显卡、数据库或模型下载。等某个项目确实需要额外依赖时，再看 [报错与虚拟环境](08-debugging.md)。

Shell 练习使用 macOS / Linux 的 sh。Windows 可以先读懂第 06 课，直接动手做 Python；如果希望实际运行 Linux 命令，再按 [微软 WSL 安装文档](https://learn.microsoft.com/en-us/windows/wsl/install)配置 Ubuntu 环境。PowerShell 与 sh 不能直接混用。

## 动手做

在 hello.py 中只修改问候句，保存文件后重新运行。关闭再打开终端，确认自己仍能找到正确文件夹。

**完成标准**：看到自己的问候句，并能分清“编辑文件”“保存文件”“运行文件”是三个动作。

<details>
<summary>自测：编辑器能显示 Python 代码，代表 Python 已经装好了吗？</summary>

不代表。编辑器负责展示文字，Python 负责执行程序。以版本命令和实际运行结果为准。

</details>

[上一课](03-files-and-formats.md) · [下一课：终端与 Linux →](05-terminal-and-linux.md)

