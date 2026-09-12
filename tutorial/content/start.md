---
title: "从这里开始：从电脑基础到 AI 工程的八条路线"
description: "按自己的起点阅读 36 篇课程与指南，做可运行练习、原理实验和三个完整项目。"
tags: [入门, 路线]
---

# 从这里开始：从电脑基础到 AI 工程的八条路线

这里不假设你认识文件扩展名、终端或 GitHub，也不把专业内容停在名词解释。**先完成一个可检查的结果，再逐层解释操作、代码、公式与工程取舍。** 全站以八条路线组织 20 篇课程和 16 篇专题指南；它们是同一张知识地图的不同入口，不是要求每个人从头读完的考试大纲。

## 先判断自己的起点

| 你现在的情况 | 建议入口 | 第一个可检查结果 |
| --- | --- | --- |
| 不知道自己用什么系统，文件也常找不到 | [电脑与操作系统](guides/computer-and-os.md) | 写出系统、芯片、终端与练习目录 |
| 会用电脑，想先整理工作资料 | [第一份 AI 成果](learn/01-first-result.md) → [项目一](projects/01-weekly-report.md) | 一份每行都能核对来源的周报 |
| 想运行代码，但安装总卡住 | [编辑器与环境](guides/editor-and-environment.md) → [工作台](learn/04-workspace.md) | 独立运行 hello.py，并找到解释器位置 |
| 想下载 GitHub 项目或参与修改 | [GitHub 从零开始](guides/github-from-zero.md) | 区分安装包与源码，完成自己的第一条 PR |
| 会 Python，想认真理解 LLM | [数学基础](guides/math-for-ai.md) → [神经网络](guides/neural-networks.md) | 手算一次参数更新，再读模型结构 |
| 已了解模型，想做可靠应用 | [RAG 工程](guides/rag-engineering.md)或[Agent 工程](guides/agent-engineering.md) | 带来源、指标、停止条件和失败记录的流程 |

## 八条完整路线

### 01 从零认识电脑与 AI

[电脑、Windows/macOS/Linux](guides/computer-and-os.md) → [第一次用 AI](learn/01-first-result.md) → [上下文与事实核查](learn/02-context-and-checks.md) → [文件、路径和格式](learn/03-files-and-formats.md) → [网络、账号与密钥](guides/network-and-security.md)。

你会知道文件在哪里、什么信息交给了远端服务，以及怎样分清事实、推断和未知。完成 [周报项目](projects/01-weekly-report.md)，只需浏览器和可以使用的 AI 对话工具。

### 02 搭好环境，运行代码

[编辑器与开发环境](guides/editor-and-environment.md) → [准备工作台](learn/04-workspace.md) → [终端与 Linux](learn/05-terminal-and-linux.md) → [Shell 脚本](learn/06-shell.md) → [Python 数据处理](learn/07-python.md) → [报错与恢复](learn/08-debugging.md)。

Windows 按 PowerShell 路线，Mac 按 zsh/sh 路线操作；不要求先安装 Linux。完成 [工作汇总项目](projects/02-work-tool.md)，用新数据重跑，检查异常输入和文件保存。

### 03 开发与 GitHub 协作

[网页与 HTTP/API](learn/09-web-and-api.md) → [GitHub 网页协作](guides/github-from-zero.md) → [Git 本地版本管理](learn/10-git-and-github.md) → [和 AI 开发](learn/11-build-with-ai.md) → [测试与发布](learn/12-test-and-publish.md) → [数据与 SQL](guides/data-and-sql.md)。

得到一个能新增、勾选、保存、导出待办的小网页，以及可追溯的代码版本。继续运行 HTTP 与 SQLite 练习，把浏览器请求、字段校验和数据查询连起来。公开发布是可选练习。

### 04 模型的数学与学习基础

[向量、概率与梯度](guides/math-for-ai.md) → [神经网络怎样学习](guides/neural-networks.md) → [NLP](learn/13-nlp.md) → [分词与 Embedding](guides/tokenization-and-embeddings.md)。

先看数值例子，再看符号；计算矩阵形状、softmax 和一次梯度下降。分清分词编号、模型表示和检索向量，也知道为什么训练集分数不能代替独立测试。

### 05 深入 Transformer 与 LLM

[Transformer 计算链路](learn/14-transformer.md) → [注意力与位置](guides/attention-and-position.md) → [LLM](learn/15-llm.md) → [训练与对齐](guides/training-and-alignment.md) → [推理与部署](guides/inference-and-deployment.md) → [模型选型](guides/model-selection.md) → [多模态](guides/multimodal.md)。

理解 Q/K/V、多头、因果掩码、RoPE、LoRA、DPO、KV Cache 等技术分别改变了什么。在 [原理实验室](labs.md)调整参数、预测变化，再对照实际计算。模型训练和本地模型下载都不是读懂这些内容的前提。

### 06 构建可靠的 RAG

[检索增强生成](learn/16-rag.md) → [RAG 工程](guides/rag-engineering.md)，结合 [资料助手项目](projects/03-document-assistant.md)。

从真实文件与行号开始，继续理解切分、稀疏/稠密检索、混合召回、重排、引用和权限。分别检查“有没有找对证据”和“答案是否受证据支持”。

### 07 Agent、工具与运行环境

[Workflow 与 Agent](learn/17-agent.md) → [工具与 MCP](learn/18-tools-and-mcp.md) → [Harness](learn/19-harness.md) → [Agent 工程](guides/agent-engineering.md)。

看清控制循环、工具参数、状态、权限、预算、幂等与恢复。先运行可检查的受控循环，区分程序执行的动作与模型提出的动作，遇到信息不足时能够停止。

### 08 评估、测试与持续交付

[评价 AI 系统](learn/20-evaluation.md) → [测试与交付](guides/testing-and-delivery.md)。

冻结基线和评估样例，保留失败案例，分别记录质量、成本、延迟与回归结果。用一次可重复的检查替代一句“看起来更好了”。这一路线也可提前用在前面的任何项目。

## 下载、运行与记录

[下载完整练习包](downloads/ai-workshop.zip)，先解压到独立目录，再按照 [环境指南](guides/editor-and-environment.md)运行。练习包内的 README 说明每个文件、命令、预期输出与限制。Python 示例使用标准库；原理实验可以直接在 [实验室](labs.md)打开。教学数值与虚构资料均有明确标识，不代表某个真实模型的测量结果。

每次练习留四行记录：**我运行了什么；预期是什么；实际是什么；哪里还没有验证。** 本地脚本成功不能代替模型回答正确，Mac 验证也不能写成 Windows 已实测。

## 一篇文章怎么读

1. 先看目标和前置知识；遇到陌生词打开 [术语表](glossary.md)。
2. 先照着做一次，确认输入文件、命令和输出的位置。
3. 修改一个条件，在运行前预测结果，再解释差异。
4. 对照完成标准，先回答自测，再展开参考答案。
5. 卡住时用 [排错入口](troubleshooting.md)和 [任务卡](prompt-cards.md)描述可复现的现场。

预计时间包含首次阅读与小练习，不是能力考核。软件安装、长文推导和异常排查可能更久。能解释一次失败为什么发生，同样是明确的学习成果。
