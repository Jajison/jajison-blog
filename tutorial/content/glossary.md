---
title: "术语白话表：遇到再查，不用背"
description: "从电脑与 GitHub 到数学、Transformer、RAG 和 Agent，按场景查定义、易混点与实践入口。"
tags: [查词, 入门]
---

# 术语白话表：遇到再查，不用背

一个术语如果不能帮助你做选择，可以暂时跳过。下面是本教程使用的简化解释。

## 电脑与环境

| 术语 | 含义与易混点 | 继续阅读 |
| --- | --- | --- |
| CPU / GPU | 通用处理器 / 适合某些大规模并行计算的处理器；程序需支持相应硬件 | [电脑与系统](guides/computer-and-os.md) |
| RAM / 硬盘 | 运行时工作空间 / 长期存储；硬盘空余不能直接当显存 | [电脑与系统](guides/computer-and-os.md) |
| x64 / ARM64 | 指令集架构类别；同为 64 位不代表安装包通用 | [电脑与系统](guides/computer-and-os.md) |
| 操作系统 / 应用 | 管理设备与进程的底层环境 / 在其上运行的软件 | [电脑与系统](guides/computer-and-os.md) |
| Windows Terminal / PowerShell | 终端应用 / 解释命令的 Shell，二者职责不同 | [终端](learn/05-terminal-and-linux.md) |
| WSL / Git Bash | Windows 上的 Linux 环境 / Git 随附的类 Unix 命令环境 | [电脑与系统](guides/computer-and-os.md) |
| 当前目录 | 相对路径解析的起点，不一定是编辑器里所见文件的目录 | [文件与格式](learn/03-files-and-formats.md) |
| 扩展名 / 编码 | 文件格式线索 / 字符与字节的转换规则，改名不能转换内容 | [文件与格式](learn/03-files-and-formats.md) |
| UTF-8 | Unicode 字符的一种编码方式；本教程文本约定 | [文件与格式](learn/03-files-and-formats.md) |
| 解释器 / 运行时 | 实际执行程序的软件；编辑器能显示代码不代表它已安装 | [环境指南](guides/editor-and-environment.md) |
| PATH | 系统查找可执行命令的目录列表 | [环境指南](guides/editor-and-environment.md) |
| .venv / .env | 项目 Python 环境目录 / 常见配置文件名 | [环境指南](guides/editor-and-environment.md) |
| 标准库 / 第三方库 | 随语言运行时提供的模块 / 另行安装的依赖 | [Python](learn/07-python.md) |
| 进程 / 退出码 | 正在运行的程序实例 / 结束后提供给调用者的状态码 | [终端](learn/05-terminal-and-linux.md) |

## 把 AI 用于工作

| 术语 | 白话解释 | 去哪里用 |
| --- | --- | --- |
| Prompt / 提示词 | 交给 AI 的任务说明 | [01](learn/01-first-result.md) |
| Context / 上下文 | 这次处理时模型可用的信息 | [02](learn/02-context-and-checks.md) |
| 验收标准 | 用什么现象判断任务完成 | [01](learn/01-first-result.md) |
| 幻觉 | 看似可信却不受事实支持的输出 | [15](learn/15-llm.md) |

## 操作电脑与开发

| 术语 | 白话解释 | 去哪里用 |
| --- | --- | --- |
| 路径 | 文件或目录的地址 | [03](learn/03-files-and-formats.md) |
| 终端 | 输入命令、查看返回的窗口 | [05](learn/05-terminal-and-linux.md) |
| Shell / sh | 理解命令的程序；sh 是常见的一种接口 | [06](learn/06-shell.md) |
| Linux | 一类操作系统 | [05](learn/05-terminal-and-linux.md) |
| 脚本 | 保存成文件的一组程序指令 | [07](learn/07-python.md) |
| JSON | 用对象、列表和字段组织数据的格式 | [07](learn/07-python.md) |
| 依赖 | 程序需要的其他软件或库 | [08](learn/08-debugging.md) |
| 虚拟环境 | 某个项目自己的 Python 依赖环境 | [08](learn/08-debugging.md) |
| 前端 / 后端 | 用户操作的界面 / 服务器处理程序 | [09](learn/09-web-and-api.md) |
| API | 程序之间约定的调用接口 | [09](learn/09-web-and-api.md) |
| localhost / 端口 | 当前电脑 / 区分不同服务的号码 | [09](learn/09-web-and-api.md) |
| Git / commit | 版本记录工具 / 保存一次选定改动 | [10](learn/10-git-and-github.md) |
| GitHub / push | 远程仓库服务 / 发送本地提交到远程 | [10](learn/10-git-and-github.md) |
| localStorage | 某个浏览器站点来源下的本地键值存储 | [11](learn/11-build-with-ai.md) |

## GitHub、网络与数据

| 术语 | 含义与易混点 | 继续阅读 |
| --- | --- | --- |
| README / Release | 项目说明 / 某一发行版本及其说明或附件 | [GitHub](guides/github-from-zero.md) |
| Clone / Fork | 把仓库复制到本地 / 在账号下派生远程仓库 | [GitHub](guides/github-from-zero.md) |
| Branch / PR | 一条开发历史的分支指针 / 请求审查合并分支改动 | [GitHub](guides/github-from-zero.md) |
| 暂存区 | 为下一次提交选择的文件快照，不等于远程上传 | [Git](learn/10-git-and-github.md) |
| Fetch / Pull | 获取远端信息 / 获取后整合至当前分支 | [GitHub](guides/github-from-zero.md) |
| HTTPS / DNS | 加密传输与证书校验 / 域名解析；HTTPS 不证明内容真实 | [网络指南](guides/network-and-security.md) |
| HTTP method / status | 请求操作意图 / 服务响应状态，业务规则仍需检查 | [HTTP 实践](learn/09-web-and-api.md) |
| Origin / CORS | 协议、主机与端口组成的来源 / 浏览器跨源访问规则 | [网络指南](guides/network-and-security.md) |
| SQL / SQLite | 数据查询语言 / 可嵌入应用的数据库引擎 | [数据与 SQL](guides/data-and-sql.md) |
| 主键 / 事务 | 标识记录的唯一键 / 一组操作按约定整体提交或回滚 | [数据与 SQL](guides/data-and-sql.md) |
| 参数化查询 | SQL 结构与输入值分开绑定，避免输入被拼成 SQL 语法 | [数据与 SQL](guides/data-and-sql.md) |

## 模型与自动化

| 术语 | 白话解释 | 去哪里用 |
| --- | --- | --- |
| NLP | 让电脑分析和生成自然语言的领域 | [13](learn/13-nlp.md) |
| Token | 分词器切出的处理单位，不固定等于一个字 | [13](learn/13-nlp.md) |
| Embedding | 用一组数表示特征，可辅助相似度计算 | [13](learn/13-nlp.md) |
| Transformer | 利用注意力等结构处理序列的神经网络架构 | [14](learn/14-transformer.md) |
| Attention / 注意力 | 按计算得到的权重组合不同位置的信息 | [14](learn/14-transformer.md) |
| LLM | 能处理和生成语言等内容的大模型 | [15](learn/15-llm.md) |
| 推理 | 使用已训练模型处理输入、产生输出 | [15](learn/15-llm.md) |
| SFT / RL | 通过示例 / 奖励改进模型的训练方法 | [15](learn/15-llm.md) |
| RAG | 先检索资料，再据此生成答案 | [16](learn/16-rag.md) |
| Workflow | 按预先设计的路线串联步骤 | [17](learn/17-agent.md) |
| Agent | 模型依据目标与反馈决定下一步操作的系统 | [17](learn/17-agent.md) |
| MCP | AI 应用连接外部工具和数据的协议 | [18](learn/18-tools-and-mcp.md) |
| Skill | 可复用的操作说明与资源，形式依产品而定 | [18](learn/18-tools-and-mcp.md) |
| Harness | 管理模型运行、工具、权限、状态和验收的配套设施 | [19](learn/19-harness.md) |
| Eval | 按事先定义的样例和标准检查效果 | [20](learn/20-evaluation.md) |

## 数学、训练与推理

| 术语 | 含义与易混点 | 继续阅读 |
| --- | --- | --- |
| 张量 / 形状 | 多维数组 / 每一维长度及其含义 | [数学基础](guides/math-for-ai.md) |
| Logits / softmax | 未归一化分数 / 将分数归一化为概率分布 | [数学基础](guides/math-for-ai.md) |
| Loss / 梯度 | 训练目标的数值代价 / 参数改变对损失的局部影响 | [神经网络](guides/neural-networks.md) |
| 参数 / 超参数 | 可学习权重 / 学习率等训练配置 | [神经网络](guides/neural-networks.md) |
| Batch / step / epoch | 一批样本 / 一次更新 / 一遍训练数据，梯度累积会改变对应关系 | [神经网络](guides/neural-networks.md) |
| BPE / Tokenizer | 一类子词合并算法 / 将文本与 token ID 转换的工具 | [分词](guides/tokenization-and-embeddings.md) |
| Q / K / V | 查询、键和值投影，打分后组合 V | [Transformer](learn/14-transformer.md) |
| Causal mask | 限制当前位置只看允许的历史位置 | [Transformer](learn/14-transformer.md) |
| GQA / RoPE | 查询分组共享 KV / 用旋转引入位置信息 | [注意力与位置](guides/attention-and-position.md) |
| FFN / Norm | 每个位置上的前馈变换 / 归一化特征尺度 | [注意力与位置](guides/attention-and-position.md) |
| LoRA / QLoRA | 低秩参数更新 / 在量化冻结基座上训练适配器 | [训练与对齐](guides/training-and-alignment.md) |
| DPO / RLVR | 利用偏好对优化策略 / 用可验证奖励训练 | [训练与对齐](guides/training-and-alignment.md) |
| KV Cache / Prefill / Decode | 历史键值缓存 / 处理已有输入 / 逐步生成 | [推理与部署](guides/inference-and-deployment.md) |
| TTFT / TPOT | 首 token 延迟 / 输出 token 间隔的度量，须说明计时口径 | [推理与部署](guides/inference-and-deployment.md) |
| 量化 / MoE | 低精度数值表示 / 每次只激活部分专家的结构 | [推理与部署](guides/inference-and-deployment.md) |
| 开放权重 / 开源 | 能取得权重 / 需结合许可及完整开放定义判断 | [模型选型](guides/model-selection.md) |

## 检索、控制与评价

| 术语 | 含义与易混点 | 继续阅读 |
| --- | --- | --- |
| Chunk / metadata | 文档片段 / 其来源、版本和权限等信息 | [RAG 工程](guides/rag-engineering.md) |
| BM25 / 向量检索 | 基于词项的相关性评分 / 在表示空间寻找候选 | [RAG 工程](guides/rag-engineering.md) |
| RRF / reranker | 融合排名 / 对召回候选重新评分排序 | [RAG 工程](guides/rag-engineering.md) |
| Recall / Precision / MRR | 找回比例 / 返回候选的相关比例 / 首个相关排名倒数均值 | [评估](learn/20-evaluation.md) |
| Schema / 幂等 | 参数与数据结构约定 / 重复操作不重复产生预期之外副作用 | [Agent 工程](guides/agent-engineering.md) |
| 提示注入 | 外部资料试图被当作控制指令；工具边界须独立执行 | [Agent 工程](guides/agent-engineering.md) |
| 回归测试 / CI | 修改后检查旧行为 / 持续集成时自动运行约定检查 | [测试与交付](guides/testing-and-delivery.md) |
| 基线 / 数据泄漏 | 用来比较的固定方案 / 评价信息进入训练或调参造成高估 | [测试与交付](guides/testing-and-delivery.md) |

[返回首页](index.md)
