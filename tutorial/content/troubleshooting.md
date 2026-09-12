---
title: "卡住了，从这里排查"
description: "按电脑环境、GitHub、数据、网络、模型和检索定位问题，记录最小可复现现场。"
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

## 安装、系统和终端

| 看见什么 | 先检查 | 详细说明 |
| --- | --- | --- |
| 下载有 x64、ARM64、Universal | 系统信息里的处理器/芯片，不靠电脑外形判断 | [电脑与系统](guides/computer-and-os.md) |
| 文件在云盘里但程序找不到 | 是否已经下载到本地、是否位于另一个副本 | [电脑与系统](guides/computer-and-os.md) |
| 输入命令出现 SyntaxError，提示符是 >>> | 进入了 Python 解释器；exit() 后回 Shell 运行文件 | [环境指南](guides/editor-and-environment.md) |
| 安装完成仍找不到命令 | 重新打开终端，核对 PATH 与实际解释器 | [环境指南](guides/editor-and-environment.md) |
| .venv 激活被策略拦截 | 直接调用环境中的 python.exe，无需全局放开策略 | [环境指南](guides/editor-and-environment.md) |
| 中文乱码 | 核对 UTF-8 与读取方式，先保留原件 | [文件与格式](learn/03-files-and-formats.md) |
| Permission denied | 目录是否可写、文件是否被占用、账号是否有权限 | [终端](learn/05-terminal-and-linux.md) |

## GitHub 与网页

| 看见什么 | 先检查 | 详细说明 |
| --- | --- | --- |
| 下载 ZIP 后没有安装按钮 | 下到源码了；回 README 和 Releases 确认使用方式 | [GitHub](guides/github-from-zero.md) |
| git diff 空白但明明改过 | 看 git status 和 git diff --cached，可能已暂存 | [Git](learn/10-git-and-github.md) |
| push 被拒绝 | 核对地址、认证与远程新提交，别直接 force push | [GitHub](guides/github-from-zero.md) |
| API 返回 401、403、429 | 身份、权限、速率/额度分别排查，保存响应正文 | [网络指南](guides/network-and-security.md) |
| API 返回 200 但数据不对 | 校验字段和计算规则，状态码不是事实判定 | [API](learn/09-web-and-api.md) |
| 网页发布后图片 404 | 检查子路径、大小写和实际构建产物 | [发布](learn/12-test-and-publish.md) |

## 模型、检索与工程

| 看见什么 | 先检查 | 详细说明 |
| --- | --- | --- |
| 模型加载 OOM | 权重、KV Cache、上下文、并发与临时开销分别估算 | [推理与部署](guides/inference-and-deployment.md) |
| 输出重复角色标记或乱码 | tokenizer、聊天模板、权重版本是否匹配 | [模型选型](guides/model-selection.md) |
| 训练 loss 降了，测试变差 | 数据泄漏、过拟合、分布变化与评价口径 | [神经网络](guides/neural-networks.md) |
| 相似度很高，内容却不支持答案 | 检查否定、版本、日期与来源，不把分数当概率 | [RAG 工程](guides/rag-engineering.md) |
| 工具超时后不知是否完成 | 查请求 ID 和副作用状态，再决定是否重试 | [Agent 工程](guides/agent-engineering.md) |
| 改进一个案例后其他问题退化 | 复跑冻结测试集，保留失败样例 | [测试与交付](guides/testing-and-delivery.md) |

## 保留一份复现记录

~~~text
系统/芯片/终端：
程序及版本：
当前目录：
完整命令：
最小输入：
预期结果：
实际结果与完整错误：
最近一次改动：
已经做过的排查与对应结果：
~~~

“已经重装过三次”不能定位错误；版本、路径与一条稳定复现的命令通常可以。给 AI 或维护者的记录先脱敏，但保留必要字段和错误结构。

**最小求助模板**：我在什么系统、什么目录，运行了什么，预期什么，实际得到什么，最近改了什么。相关文本中去掉密钥和不宜分享的实际工作数据。

[复制排错任务卡](prompt-cards.md) · [返回路线](start.md)
