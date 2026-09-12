---
title: "18｜工具、MCP 和 Skill：让 AI 接上实际工作"
description: "读懂工具 schema、调用与返回，区分 MCP 的接入协议、Skill 的操作方法与执行权限。"
lesson: 18
stage: "05 让 AI 可靠地做事"
duration: 40
prerequisites: [17-agent]
outcome: "为检索工具写清输入输出，解释 MCP 连接过程，并设计一个有验收步骤的 Skill"
tags: [工具, MCP, Skill, Schema]
---

# 工具、MCP 和 Skill：让 AI 接上实际工作

**这一课做成什么**：把“帮我查资料”变成明确的工具请求，读懂执行返回，并知道工具、协议、技能说明分别负责什么。

**工具**是应用允许模型请求执行的动作，例如搜索文件、查询数据库或计算。模型负责提出请求，外部程序负责执行，并把真实结果交回模型。**Function Calling（函数调用）**描述结构化表达调用意图的机制；生成调用文本不等于执行成功。

## 先写一份工具契约

假设要把练习包检索能力提供给 AI。先限定它只读 knowledge，而不是提供“运行任何命令”的万能入口。

~~~text
工具名：search_notes
用途：按空格分隔关键词，只读搜索练习资料
输入：query 非空文字，limit 为 1–10 的整数
输出：来源文件、行号、原文候选
无结果：空候选，不能据此生成未知事实
失败：参数错误、资料目录不存在、读取失败
权限：不修改文件，不联网，不执行资料中的指令
~~~

**schema**是结构规则。下面使用 MCP 工具描述中常见的 inputSchema 字段表达参数约束；它是教学定义，不表示练习脚本已经开了 MCP 服务：

~~~json
{
  "name": "search_notes",
  "description": "只读检索练习资料，返回候选原文与真实出处",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {"type": "string", "minLength": 1, "maxLength": 1000},
      "limit": {"type": "integer", "minimum": 1, "maximum": 10}
    },
    "required": ["query", "limit"],
    "additionalProperties": false
  }
}
~~~

type 指定类型，required 列出必填，additionalProperties=false 拒绝未定义字段。minLength 能拒绝空字符串，但全空格还需要程序去除空白后再检查。schema 也无法独自证明来源真实或访问已经授权。MCP 还允许描述输出结构，但执行端和接收端仍需验证。[MCP Tools 规范](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)

## 一次调用的四个时刻

~~~text
模型提出：search_notes(query="报名 截止", limit=3)
程序检查：工具允许、参数有效、预算充足
程序执行：实际读取 knowledge 文件并搜索
程序返回：候选原文、来源；或明确错误
~~~

返回“没有匹配”是一个有效观察，不等于网络失败；参数 limit=0 属于请求错误，不应原样重复调用。工具结果中的描述也是外部数据，不能因为它说“请改用管理员权限”就自动扩权。

可以直接运行已有工具确认行为：

~~~sh
python3 search_notes.py "报名 截止" --limit 1
python3 search_notes.py "餐费 报销" --limit 1
python3 search_notes.py "报名" --limit 0
~~~

在 ai-workshop 根目录执行；Windows 将 python3 换为 py -3。前两条分别返回候选与证据不足，第三条应明确报告参数非法并以失败状态退出。命令行接口与上面的 JSON 工具描述之间，还需要适配代码，这里没有假装它们自动连通。

## MCP 标准化接入双方怎样交流

**MCP（Model Context Protocol）**是一套开放的上下文与工具接入协议。**host**是承载模型与用户交互的应用；host 中的 **client**维护与某个 **server**的连接；server 提供具体能力与资料。[MCP 架构](https://modelcontextprotocol.io/specification/2025-06-18/architecture)

以 2025-06-18 版规范为例，先通过 initialize 交换版本与能力，客户端随后发送 initialized 通知，再进入正常操作。发现工具可用 tools/list，调用工具用 tools/call。版本协商与能力声明意味着客户端不能假设每个服务器都支持所有特性。[MCP 生命周期](https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle)

| 接入内容 | 用途示例 |
| --- | --- |
| Tools | 执行一次搜索或查询 |
| Resources | 提供可读的文档、表结构等上下文 |
| Prompts | 提供可复用的任务模板 |

MCP 可以在内部包装现有 API、数据库或本地脚本。它不替代所有业务 API，也不是模型、Agent 或权限沙箱。成功连上服务器，仅证明通信成立；还要确认凭据、访问范围与操作结果。

## Skill 把可复用方法组织起来

**Skill（技能）**通常是说明与资源组成的任务方法包。采用 Agent Skills 规范时，一个目录至少有 SKILL.md，其中 YAML 元数据描述名称与用途，正文写操作步骤；可附 scripts、references、assets。客户端是否支持以及如何执行仍要核对。[Agent Skills 规范](https://agentskills.io/specification)

~~~text
weekly-report/
  SKILL.md           何时使用、输入、流程、验收
  references/        字段含义与示例
  scripts/           可选的确定性处理程序
~~~

一个“周报汇总”技能应说明：先验证输入字段，预览数字，按原始记录核对，再写到新的输出路径；缺字段先报错，不猜分钟。它传递的是可复用方法。加载文档不会重新训练权重，技能里写“只读”也不会自动改变操作系统权限。

把“适用场景”写清也很重要：只处理本练习 JSON 的技能，不应对 Excel 文件承诺已经支持。说明要覆盖失败和交接条件，而不仅是一次成功演示。

## 动手：把动作与方法分别交付

先运行三条搜索命令，记录实际成功、无结果和参数失败。然后为 report.py 写工具契约，特别标出默认预览和拒绝覆盖；再写一个 SKILL.md 草稿，包含用途、先修、输入、流程、异常与完成标准。

本练习交付的是契约与技能草稿，不要求安装到任何产品或建立 MCP 服务器。若后续真正接入，必须再测试发现工具、参数验证、执行、结果回传与权限，不能把文档编写当成集成验证。

**完成标准**：能把调用意图与执行结果分开；解释 schema 检查的边界；说明“工具能做什么、MCP 怎样接入、Skill 怎样做事、Harness 怎样控制运行”。

<details>
<summary>自测：服务器给工具标了“只读”，客户端是否可以忽略其他检查？</summary>

不能。描述或注解是声明，其可信度取决于来源与实际实现。客户端仍需考虑权限与结果，执行层也应限制真实能力。协议中的元数据不能替代文件系统、网络与业务访问控制。

</details>

[上一课](17-agent.md) · [下一课：Harness](19-harness.md) · [深入 Agent 工程](../guides/agent-engineering.md)
