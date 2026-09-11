---
title: "07｜Python 最小集合：读数据、做判断、写结果"
description: "围绕一份工作记录，只认识变量、列表、字典、循环和条件。"
lesson: 7
stage: "02 让电脑重复做事"
duration: 25
prerequisites: [04-workspace, 05-terminal-and-linux]
outcome: "能预览、保存并核对一份自动汇总报告"
tags: [Python, 数据处理]
---

# Python 最小集合：读数据、做判断、写结果

**这一课做成什么**：能预览、保存并核对一份自动汇总报告。

Shell 擅长串起命令。需要读取字段、检查数据、计算结果时，Python 往往更清楚。这一课用四条虚构工作记录，生成一份汇总。

## 先看输入与结果

input/records.json 里有四条记录，每条都有任务编号 id、名称 task、状态 status 和分钟数 minutes。done 表示完成，pending 表示待办。

在 ai-workshop 根目录运行，Windows 把 python3 换成 py -3：

~~~sh
python3 report.py
~~~

默认只预览报告。你应看到：**4 条记录、3 条已完成、1 条待办，总耗时 120 分钟，已完成任务耗时 90 分钟**。

确认后保存：

~~~sh
python3 report.py --output output/report.md
~~~

打开 output/report.md 看结果。再次使用同一路径保存时，脚本应拒绝覆盖；可以改为 output/report-v2.md。原始 JSON 始终保留。

## 看懂这些就能开始

下面是核心计算的独立小例子，可以另存为 mini.py 运行：

~~~python
records = [
    {"task": "页面初稿", "status": "done", "minutes": 45},
    {"task": "确认场地", "status": "pending", "minutes": 30},
]

done_minutes = 0
for record in records:
    if record["status"] == "done":
        done_minutes = done_minutes + record["minutes"]

print(done_minutes)
~~~

输出应为 45。这段中的方括号装着一个**列表**；每条花括号记录是**字典**，用字段名取值。for 逐条处理，if 判断条件，print 显示结果。Python 用缩进表示“哪些语句属于这一层”，不要随意顶格。

完整脚本额外处理读取 JSON、检查字段和保存文件。这些步骤由程序重复完成，人负责确认规则正确。

## 让 AI 改一个需求

~~~text
请阅读 report.py，新增“待办任务耗时”的统计。
先说明计算规则；保留默认预览、拒绝覆盖已有输出的行为。
用 input/records.json 验证，预期待办耗时为 30 分钟。
给出运行命令和实际结果，再列出改了哪些位置。
~~~

把“预期多少”交代清楚，便于发现“程序运行成功，但计算口径错了”的情况。

## 动手做

复制 records.json 为 records-practice.json，把待办任务的 30 分钟改成 40，再运行：

~~~sh
python3 report.py --input input/records-practice.json
~~~

总耗时应变成 130，已完成耗时仍为 90。只改一个字段，其他指标不应跟着漂移。

**完成标准**：能定位输入、修改一个值、解释结果变化；不需要从零默写整个脚本。

<details>
<summary>自测：AI 生成的代码没报错，就等于报告正确吗？</summary>

不等于。把 pending 也计入已完成耗时，程序照样能运行。需要用你能手算的小样本确认计算规则。

</details>

参考：[Python 官方教程](https://docs.python.org/3/tutorial/)。

[上一课](06-shell.md) · [下一课：读懂报错 →](08-debugging.md)

