---
title: "电脑与操作系统：Windows、macOS、Linux 从哪里不同"
description: "从查看系统版本、芯片、文件扩展名开始，分清电脑、操作系统、应用、终端与云服务。"
duration: 35
level: 零基础
prerequisites: []
outcome: "确认自己的系统与芯片，建立练习目录，能选对下载包和命令"
tags: [入门, Windows, macOS, Linux]
---

# 电脑与操作系统：Windows、macOS、Linux 从哪里不同

**这一课做成什么**：写出自己的系统、芯片、终端名称；建立一个找得到的练习文件夹。无需安装 Linux，也无需先购买新电脑。

## 先分清五层东西

| 层次 | 它负责什么 | 你会看到的例子 |
| --- | --- | --- |
| 硬件 | 执行计算、保存数据 | CPU、内存、硬盘、GPU |
| 操作系统 | 管理文件、程序、用户与设备 | Windows 11、macOS、Ubuntu Linux |
| 应用程序 | 完成某类工作 | 浏览器、Word、VS Code |
| 文件 | 保存文字、数据或程序 | notes.txt、report.py、照片 |
| 网络服务 | 在另一台电脑上处理请求 | GitHub、在线聊天工具、云盘 |

浏览器能打开一个 AI 网站，不代表模型已经装在你的电脑里。多数在线产品把请求交给远端服务器；本地模型则要把模型文件下载到本机，由本机资源执行推理。这两种方式的成本、隐私和硬件要求不同。

## 第一步：知道自己在用什么

**Windows 11**：开始菜单 → 设置 → 系统 → 系统信息（部分版本叫“关于”）。记录 Windows 版本、处理器、系统类型和已安装 RAM。“x64”通常表示 Intel/AMD 的 64 位架构；“ARM64”是另一种架构，下载软件时不要仅因为它也写着 64 位就随便选。

**macOS**：左上角苹果菜单 → 关于本机。记录 macOS 版本、芯片或处理器和内存。显示 Apple M 系列的是 Apple silicon，通常选 Apple silicon / ARM64；显示 Intel 的选 Intel / x64；Universal 通常同时包含两种 Mac 架构。

菜单名字会随系统语言与版本变化。找不到时搜索设置里的“系统信息”或“关于”，不要照着不认识的命令修改系统配置。

**RAM 与硬盘不是一回事**：内存是运行时工作空间，硬盘是长期保存文件的地方。硬盘还有 200 GB，不等于可以加载需要 32 GB 内存的模型。入门脚本不需要独立 GPU；训练大型模型不是本课程的硬件前提。

## 第二步：找到文件管理器

| 动作 | Windows | macOS |
| --- | --- | --- |
| 找文件 | 文件资源管理器，常用 Win+E | Finder，Dock 中的笑脸图标 |
| 显示扩展名 | 查看 → 显示 → 文件扩展名 | Finder → 设置 → 高级 → 显示所有文件扩展名 |
| 常见用户目录 | `C:\Users\你的用户名` | `/Users/你的用户名` |
| 复制、粘贴、保存 | Ctrl+C、Ctrl+V、Ctrl+S | Command+C、Command+V、Command+S |
| 文件地址示例 | `C:\Users\Lin\ai-workshop` | `/Users/lin/ai-workshop` |
| 回收站 | 回收站 | 废纸篓 |

终端里的 Ctrl+C 通常是中断程序，不是复制。Mac 上终止前台程序也通常按 **Control+C**，不是 Command+C。

在个人文档目录里新建 `ai-learning`，把练习 ZIP 解压进去。先右键 ZIP 选择解压，不能一直在压缩包预览窗口里运行。确认你打开的是包含 `hello.py` 的那一层，不是外面同名的空壳目录。

### 不熟悉文件操作时，照这张表走

| 操作 | Windows 11 | macOS |
| --- | --- | --- |
| 新建文件夹 | 目标目录空白处右键 → 新建 → 文件夹；也可 Ctrl+Shift+N | Finder 中选择文件 → 新建文件夹；也可 Shift+Command+N |
| 重命名文件 | 选中文件，F2，保留正确扩展名 | 选中文件，Return，输入新名字后确认 |
| 进入完整路径 | 点击资源管理器地址栏，粘贴路径后回车 | Finder 中 Shift+Command+G，输入路径 |
| 找到文件真实位置 | 地址栏看目录；右键文件 → 复制文件地址或复制为路径 | 显示 → 显示路径栏；在路径栏右键目录复制路径名称 |
| 解压 ZIP | 右键 → 全部解压，选择目标目录 | 双击 ZIP，在旁边找到解压出的文件夹 |
| 撤销刚才的编辑 | 编辑器中 Ctrl+Z | 编辑器中 Command+Z |

右键指鼠标右键；Mac 触控板通常可用双指点按，也可按住 Control 再点击。表里的“+”表示同时按住几个键，不是输入加号。不同应用的快捷键可能不同；保存之后的错误需要版本或备份来恢复，不能假定关闭再打开就会撤销。

下载通常进入“下载”目录；浏览器下载列表可以选择“在文件夹中显示”。安装程序、下载的 ZIP 和解压后的工作目录是三个不同对象。把安装包删掉通常不会卸载已安装应用；把唯一的工作目录删掉却可能丢掉自己的修改。

## 路径：电脑怎样定位文件

`input/records.json` 表示当前目录下 input 文件夹里的 records.json。`..` 表示上一级；`.` 表示当前位置；在常见 Unix Shell 中 `~` 表示当前用户的主目录，不是整个硬盘。

绝对路径不依赖当前目录；相对路径依赖。下面两条命令只有在练习目录中，才会找到同一个文件：

~~~sh
python3 hello.py
python3 ./hello.py
~~~

Windows PowerShell 使用：

~~~powershell
py -3 hello.py
py -3 .\hello.py
~~~

本课先认识写法，安装后再运行。路径有空格时用英文双引号包住，例如 `cd "C:\Users\Lin\AI Learning"`。教程中“你的用户名”“某个文件夹”都是需要替换的文字，不要原样复制。

Windows 和常见 Mac 文件系统往往不区分文件名大小写，Linux 常常区分。`Logo.png` 和 `logo.png` 在部署后可能不是同一个地址。项目文件尽量统一用小写英文和连字符，避免本地可用、上线找不到。

## 三种系统怎样选

**Windows**：可以直接做 Python、网页和 Git 练习。PowerShell 是命令解释环境；Windows Terminal 是容纳不同终端会话的应用。Git Bash 提供部分类 Unix 命令，但不是完整 Linux。WSL 让你在 Windows 下运行 Linux 环境，只有项目确实需要 Linux 工具链时再装。

**macOS**：基于 Unix 的操作环境，自带 Terminal，默认交互 Shell 常为 zsh；不是 Linux。许多命令类似，但 GNU/Linux 与 macOS 的 `sed`、`date` 等选项存在差异。Python 与 Git 仍应分别检查，不能因为有终端就认为都有。

**Linux**：Ubuntu 是一个 Linux 发行版，常见于服务器和开发环境。桌面版也可以像普通电脑一样操作。课程后半讨论服务器时会遇到它，但不要为了入门先换系统。

WSL 与 Windows 可以访问部分彼此文件，但解释器、虚拟环境和路径并不自动通用。不要在 Windows 创建 `.venv` 后直接拿到 WSL 激活；应在实际运行环境重新创建。

## 下载软件时检查什么

电脑上的账号决定当前程序能访问什么。管理员账号并不意味着每个程序都应以管理员运行。练习目录放在自己可写的用户文件夹；不要放进 Windows 的 Program Files、系统目录或 Mac 的 /System。遇到组织管理的设备限制，应遵循设备管理流程。

1. 从项目官网进入下载，避免搜索广告里的同名安装器。
2. 看操作系统：`.exe` / `.msi` 常用于 Windows；`.dmg` / `.pkg` 常用于 Mac；Linux 安装方式取决于发行版。
3. 看芯片架构：x64、ARM64、Universal 是否匹配。
4. 看是否稳定版、系统最低版本是否支持。不要为了“最新”盲目选测试版。
5. 安装完成后重新打开终端，用版本命令确认。安装窗口消失不是验证结果。

安全拦截不是应该一律关闭的障碍。先核对来源、签名和官方说明；不要照着陌生教程关闭全系统安全保护。

## 实操与排错

在 `ai-learning` 里创建 `input` 和 `output`，用纯文本编辑器创建 `input/notes.txt`，写下三行计划。确认文件不是 `notes.txt.txt` 或 `notes.rtf`。Mac 的“文本编辑”可通过“格式 → 制作纯文本”切换；使用代码编辑器会更直观。

| 症状 | 最可能的误会 | 下一步 |
| --- | --- | --- |
| 双击 .py 只闪一下 | 程序结束后窗口关闭了 | 在终端中运行以保留输出 |
| 软件无法安装 | 架构或系统版本不匹配 | 回到系统信息核对下载项 |
| 同名文件内容不同 | 文件在两个不同目录 | 比较完整路径 |
| 文件夹图标带云朵 | 文件可能尚未下载到本机 | 确认本地可用后再运行 |

**完成标准**：你能写出“Windows 11 / ARM64 / PowerShell”或“macOS / Apple silicon / zsh”这样的环境说明，并指出 `notes.txt` 的完整位置。

<details>
<summary>自测：Mac 能运行 Linux 命令，所以 Mac 就是 Linux 吗？</summary>

不是。二者共享不少 Unix 风格工具与概念，但系统内核、程序格式、包管理和部分命令选项不同。应按系统选择安装包，并按 Shell 选择命令语法。

</details>

继续：[文件与格式](../learn/03-files-and-formats.md) · [编辑器与环境](editor-and-environment.md)

参考：[Microsoft：显示文件扩展名](https://support.microsoft.com/en-us/windows/experience/storage-filemanagement/common-file-name-extensions-in-windows)、[Apple：显示文件扩展名](https://support.apple.com/guide/mac-help/mchlp2304/mac)、[Apple：查看文件路径](https://support.apple.com/guide/mac-help/mchlp1774/mac)、[WSL 官方文档](https://learn.microsoft.com/windows/wsl/)。
