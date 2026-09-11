---
title: "卡住了，从这里排查"
description: "把错误分成环境、路径、数据、保存和联网五类。"
tags: [排错, 工具箱]
---

# 卡住了，从这里排查

先记录所用系统、运行目录、完整命令和实际输出，再按症状找入口。不要连续尝试不理解的修复命令。

| 看见什么 | 先做什么 | 详细说明 |
| --- | --- | --- |
| 找不到 python3 或 py | 确认系统对应命令，检查安装并重开终端 | [准备工作台](learn/04-workspace.md) |
| 无法打开 hello.py | 列出当前目录，确认解压层级 | [文件与路径](learn/03-files-and-formats.md) |
| 脚本文件名是 .py.txt | 显示扩展名，用纯文本编辑器正确保存 | [准备工作台](learn/04-workspace.md) |
| PowerShell 不认识 sh | 没在 POSIX Shell 中；先做 Python 或使用已配置的 WSL | [Shell](learn/06-shell.md) |
| minutes 字段报错 | 使用非负整数，不加“分钟”文字 | [Python](learn/07-python.md) |
| JSON 报错 | 检查双引号、逗号、括号和文件编码 | [读报错](learn/08-debugging.md) |
| 输出已存在 | 换一个新文件名，保留旧结果比较 | [项目二](projects/02-work-tool.md) |
| 本地网址打不开 | 确认终端服务在运行、端口一致 | [开发小网页](learn/11-build-with-ai.md) |
| 换浏览器后待办不见了 | 本地保存不跨浏览器同步，检查导出文件 | [发布](learn/12-test-and-publish.md) |
| 检索没有结果 | 换成资料中的明确关键词；别默认资料不存在 | [项目三](projects/03-document-assistant.md) |
| 有引用但答案不对 | 打开引用段落，检查是否真的支持结论 | [上下文与核对](learn/02-context-and-checks.md) |
| AI 一直重复尝试 | 定义最多轮数，保留已完成与失败状态 | [Harness](learn/19-harness.md) |

**最小求助模板**：我在什么系统、什么目录，运行了什么，预期什么，实际得到什么，最近改了什么。相关文本中去掉密钥和不宜分享的实际工作数据。

[复制排错任务卡](prompt-cards.md) · [返回路线](start.md)

