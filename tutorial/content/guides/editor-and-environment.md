---
title: "编辑器与开发环境：从安装到第一次独立运行"
description: "分清 VS Code、解释器、终端、包管理器、PATH、.venv 和 .env，按 Windows 与 Mac 各自跑通。"
duration: 45
level: 零基础
prerequisites: [guides/computer-and-os]
outcome: "在自己的项目目录运行 Python，并定位当前使用的解释器"
tags: [环境, VSCode, Python, Windows, macOS]
---

# 编辑器与开发环境：从安装到第一次独立运行

**这一课做成什么**：让一个写在文件里的程序真正执行，并知道编辑器、解释器和终端各负责什么。

## 不要把所有东西都叫环境

| 名称 | 作用 | 不负责什么 |
| --- | --- | --- |
| VS Code | 编辑文件、看目录、集成终端 | 安装它不会自动安装所有语言 |
| Python 解释器 | 执行 `.py` 文件 | 不负责显示网页样式 |
| 终端与 Shell | 接收命令、启动程序、展示结果 | 不会自动理解所有语言代码 |
| pip | 为指定 Python 安装库 | 不是 Python 的替代品 |
| Node.js 与 npm | 执行 JavaScript 工具、管理其依赖 | 跑普通 Python 练习不需要 |
| Git | 记录文件版本 | 不替你安装项目所需依赖 |

“装环境”应该拆成：这个项目需要什么运行时？版本多少？依赖列在哪？命令在什么目录执行？先回答这四件事。

## 先学会在终端输入一条命令

命令块的 powershell、sh、python 是语言标签，不是要输入的第一行。只复制框内命令；不要连教程里的行号、提示符或预期输出一起粘贴。一行输入完按 Enter/Return，等它结束，再输入下一行。

例如 PowerShell 提示符常以 PS 开头，zsh 提示符常以 % 结尾，它们说明 Shell 正等你输入。看到 `>>>` 通常已进入 Python 交互解释器，此时输入 `python3 hello.py` 会得到语法错误：先输入 `exit()` 返回 Shell，再运行文件。看到 Shell 的续行提示，可能是引号没闭合，按 Control+C 取消后重新输入完整命令。

从开始菜单搜索 PowerShell 可打开 Windows 终端会话；Mac 可用 Command+空格搜索“终端”。VS Code 的集成终端也能完成同样任务，但新终端的目录应通过命令核对，不能只看编辑器标题。

## Windows 路线

1. 从 [VS Code 官网](https://code.visualstudio.com/Download)下载与你的系统架构匹配的稳定版并安装。
2. 从 [Python 官网](https://www.python.org/downloads/windows/)选择受支持的 Python 3。教程标准库练习以 Python 3.10+ 为目标。官方安装方式可能是安装管理器或传统安装包；跟随对应页面，不需要同时装两套。
3. 关闭旧终端，重新打开 VS Code。文件 → 打开文件夹，选解压后的 `ai-workshop`。
4. 终端 → 新建终端，确认当前会话是 PowerShell，再输入下面命令。

~~~powershell
Get-Location
Get-ChildItem
py -3 --version
py -3 -c "import sys; print(sys.executable)"
py -3 hello.py
~~~

如果 `py` 不存在而 `python --version` 显示正确的 Python 3，就用 `python`。若输入 `python` 打开商店而没有版本，先检查官方安装是否完成、应用执行别名和 PATH 配置；不要反复安装随机版本。`Get-Command python` 能查看命令实际指向哪里。

传统安装包可能提供“Add Python to PATH”。PATH 是系统寻找命令所在目录的列表；官方启动器 `py` 又是另一条定位 Python 的途径。两者不要混为一谈。

**安装管理器与解释器也要分清**：当前 Python Windows 官方文档同时解释安装管理器和旧版安装方式。管理器负责安装、选择 Python 运行时，本身不等于所有版本都已下载。新管理器提供 `py list` 等管理命令；旧启动器的命令可能不同。先用版本和 `sys.executable` 验证实际运行时，遇到版本选择问题再按 [Python Windows 官方说明](https://docs.python.org/3/using/windows.html)处理。不要同时叠加两种安装方式，再猜哪个接管了 `py`。

## macOS 路线

1. 从 [VS Code 官网](https://code.visualstudio.com/Download)选 Apple silicon、Intel 或 Universal 包，解压后把应用放入“应用程序”。
2. 从 [Python 官网](https://www.python.org/downloads/macos/)安装支持当前系统的 Python 3。如果你已经通过可信包管理器管理 Python，先确认现有版本，不必叠加第二种安装方式。
3. VS Code → 文件 → 打开文件夹 → `ai-workshop`，再选终端 → 新建终端。

~~~sh
pwd
ls
python3 --version
python3 -c "import sys; print(sys.executable)"
python3 hello.py
~~~

`which python3` 显示 Shell 解析到的命令位置；`sys.executable` 显示正在执行的 Python。Mac 上系统组件、开发工具和用户安装可能各自带有解释器。不要删除系统 Python，也不要用 `sudo pip install` 试图让所有项目共用一套库。

## 编辑、保存、运行是三个动作

在左侧目录点击 `hello.py`，只改引号里的问候语。Windows 按 Ctrl+S，Mac 按 Command+S 保存。回到终端，再运行上面最后一条命令。

你应看到自己的问候句。编辑器里文字变了、终端输出没变时，依次检查：保存了吗？运行的是这个目录里的文件吗？是不是另一个终端在执行旧副本？先不改代码。

Python 扩展可以提供语法提示、调试和解释器选择，安装并启用扩展仍不等于安装 Python。VS Code 的“Python: Select Interpreter”应选到当前项目要用的解释器。第一次先用明确命令运行，减少“运行按钮到底做了什么”的不确定性。

## 第三方库需要隔离

本练习包仅用标准库，不必安装依赖。后来遇到有 `requirements.txt` 的可信 Python 项目，在项目根目录创建专属环境：

**macOS / Linux：**

~~~sh
python3 -m venv .venv
.venv/bin/python -m pip --version
.venv/bin/python -m pip install -r requirements.txt
~~~

**Windows PowerShell：**

~~~powershell
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip --version
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
~~~

最后一行只在项目确实有这个文件、且已检查来源时运行。安装包可能执行代码，依赖不是没有风险的资料。不要把网上随便一段 `pip install` 当作必须步骤。

这里直接调用 `.venv` 中的解释器，不依赖激活脚本，因此 Windows 遇到激活策略限制时也无需全局放开执行策略。若选择激活，激活只是调整当前 Shell 的命令查找环境，不是创建新 Python 语言。

如果把整个项目移到另一台电脑、另一个操作系统或不同绝对路径，重新创建虚拟环境并按依赖文件安装；不要复制 .venv 当作可移植软件包。VS Code 选择的解释器与终端命令也可能不一致，排错时比较二者的路径。

## PATH 与环境变量怎样生效

启动一个程序时，它通常继承启动它的进程环境。安装器更改 PATH 后，已经打开的终端可能还拿着旧值，所以要新建终端；有时还要退出并重开编辑器。PATH 解决“从哪里找到 python 命令”，当前目录解决“去哪里找 hello.py”，两种问题不能互相代替。

环境变量可以只影响当前会话，也可以保存在用户或系统配置中。练习服务地址用当前会话即可；不要为了一个项目改动所有项目共享的系统设置。不要把真实密钥贴进命令历史或截图，配置边界见 [网络与密钥](network-and-security.md)。

`.venv` 是可重建的依赖目录，不提交到 Git；`.env` 是常见配置文本命名，可能含密钥，也不提交。Python 不会自动读取所有 `.env`，只有明确实现加载的应用或库才会这样做。

## 拿到陌生项目，先检查四个文件

`README.md` 解释用途与启动步骤；`requirements.txt` 或 `pyproject.toml` 描述 Python 依赖；`package.json` 描述 JavaScript 依赖与脚本；锁文件记录具体依赖解析结果。没有看到 Python 文件，就不要机械地给网页项目安装 Python 包。

Node 项目的 `npm ci` 依据锁文件进行一致安装，通常用于有有效 lockfile 的项目；`npm install` 也可能更新依赖解析和锁文件。二者不是在所有仓库中随意互换的同义词。先看项目文档，勿在上一级总文件夹里执行。

## 动手排错

故意在 `input` 目录执行 `python3 hello.py`（Windows 对应 `py -3 hello.py`），观察找不到文件的错误，再 `cd ..` 回到根目录重试。接着记录版本、解释器路径、当前目录、完整命令和输出。这个记录比一句“环境坏了”更有用。

**完成标准**：重开终端后仍能独立进入项目并运行；你知道依赖装到哪个解释器，而不是只知道曾经按过安装按钮。

<details>
<summary>自测：提示 No module named requests，是否一定要重新安装 Python？</summary>

不是。先确认项目是否需要该依赖、你正在使用哪个解释器，再用同一个解释器执行 `-m pip` 检查或安装项目声明的依赖。常见问题是包安装到了另一个环境。

</details>

继续：[准备工作台](../learn/04-workspace.md) · [报错与恢复](../learn/08-debugging.md)

参考：[VS Code Python 入门](https://code.visualstudio.com/docs/python/python-tutorial)、[Python venv](https://docs.python.org/3/library/venv.html)、[pip 用户指南](https://pip.pypa.io/en/stable/user_guide/)。
