---
title: "卡住了，从这里排查"
description: "先处理 AI 对话、资料、表格和结果文件的问题；需要编程时再查环境、GitHub 和模型排错。"
tags: [排错, 工具箱]
---

# 卡住了，从这里排查

先记录你用的工具、提供的材料、做了什么和实际结果。只需要解决当前问题，按下面的现象进入对应说明。

## 日常使用先看这里

| 看见什么 | 先做什么 | 详细说明 |
| --- | --- | --- |
| 不知道从哪里开始 | 选一件想改善的小事，说明已有基础 | [选择起点](guides/stack-and-goals.md) |
| 回答太空、太难懂 | 给具体读者与例子，指明哪段需要改 | [表达与修改](guides/asking-and-iterating.md) |
| AI 没读到文件 | 核对上传状态、目录和文件名 | [文件基础](learn/03-files-and-formats.md) |
| 找不到上传或下载入口 | 核对产品、账号与实际功能 | [工具地图](guides/ai-tool-types.md) |
| 通知写错时间，周报夸大进展 | 回原材料逐项核对，区分计划与事实 | [写作](guides/writing-and-editing.md) |
| 回答附了链接仍不可靠 | 打开原文，看是否真的支持结论 | [查资料](guides/research-and-fact-checking.md) |
| 表格总数不对 | 列出参与统计的行、状态与单位 | [表格](guides/data-workflows.md) |
| 文档打不开或版面遮挡 | 核对实际文件格式，指出页码与现象 | [文档与 PPT](guides/slides-and-documents.md) |
| 图片内文字或数字识别错 | 提供更清晰截图，先校对提取结果 | [截图与图片](guides/images-and-multimodal.md) |
| Codex 说完成，网页仍不能用 | 给打开方式、具体操作、预期与实际结果 | [Codex 上手](guides/codex-from-zero.md) |
| WorkBuddy 生成了文件但找不到 | 核对任务工作目录和结果文件入口 | [WorkBuddy 上手](guides/workbuddy-from-zero.md) |
| 反复修改越来越乱 | 汇总最后确认的要求和材料，重新起一轮 | [对话用法](guides/asking-and-iterating.md) |

<details>
<summary>遇到编程、网站或模型问题时，再展开这些说明</summary>

涉及命令时，另外记录系统、目录、完整命令与输出。不要连续尝试不理解的修复命令。

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

</details>

## 保留一份求助记录

~~~text
使用的工具与系统：
提供的材料或文件：
做了什么动作：
预期结果：
实际结果与完整错误：
已经尝试的修改：
需要时附相关截图或错误文字：
~~~

“不好用”还需要具体说明。记录哪个动作出了什么问题；涉及运行代码时，再补目录、版本和命令。给 AI 或维护者的材料去掉个人信息，保留定位问题需要的内容。

**最小求助模板**：我在什么系统、什么目录，运行了什么，预期什么，实际得到什么，最近改了什么。相关文本中去掉密钥和不宜分享的实际工作数据。

[复制排错任务卡](prompt-cards.md) · [返回路线](start.md)
