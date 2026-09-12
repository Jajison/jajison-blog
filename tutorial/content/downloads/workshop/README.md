# AI 工作台练习包

全部资料均为虚构。Python 示例只使用标准库，需 Python 3.10+。所有命令从解压后的 ai-workshop 根目录执行，那里应能直接看到 hello.py。

## 1. 确认可以运行

macOS / Linux：

~~~sh
python3 hello.py
~~~

Windows PowerShell（官方 Python 启动器）：

~~~powershell
py -3 hello.py
~~~

下面命令统一写 python3；Windows 按同样规则替换为 py -3。

## 2. 预览和保存报告

~~~sh
python3 report.py
python3 report.py --output output/report.md
~~~

预期：4 条任务，3 条完成，1 条待办，总耗时 120 分钟，已完成任务耗时 90 分钟。程序只读取输入；默认不保存；指定输出时拒绝覆盖已有文件。

换数据：复制 input/records.json，再使用 --input input/新文件.json。字段 id、task 是非空文本；status 是 done 或 pending；minutes 是非负整数；id 唯一。文件使用 UTF-8，支持 UTF-8 BOM。

## 3. Shell 练习

仅适用于 macOS / Linux / 已配置的 WSL Ubuntu：

~~~sh
sh list_notes.sh input
~~~

两个 txt 文件各有两行。Windows PowerShell 不直接支持这套 sh 语法，可以先完成 Python 练习。

## 4. 运行待办网页

~~~sh
python3 -m http.server 8000 --bind 127.0.0.1
~~~

打开 http://127.0.0.1:8000/todo.html ，保持终端运行，按 Ctrl+C 停止。只在本机访问，无第三方网络请求。待办保存在当前浏览器对应来源中；换端口、清理站点数据、换浏览器可能无法找回，应按需导出。

初版支持新增、勾选、导出；没有删除、导入、登录和云同步。保存失败或已有存储无法解析时，页面会提示，不会宣称已成功保存。

## 5. 检索练习资料

~~~sh
python3 search_notes.py "报名 截止"
python3 search_notes.py "餐费 报销"
~~~

第一条应找到 2026 年 9 月 18 日 18:00 的报名截止信息；第二条应提示证据不足。这是关键词匹配，不是向量检索。脚本不会调用模型，也不会生成最终答案；把返回原文与任务卡交给可用的 AI 工具，完成项目三。

## 6. 用 SQLite 保存和查询结构化数据

~~~sh
python3 sqlite_lab.py
python3 sqlite_lab.py --status done
python3 sqlite_lab.py --database output/workshop.db
~~~

默认把 input/records.json 导入内存数据库，关闭程序后数据库消失；第二条查询完成任务，预期 count 为 3、total_minutes 为 90。第三条才创建真实 SQLite 文件，包含全部 4 条任务，总计 120 分钟。再次用同一数据库文件名会失败，原文件不被打开修改。此练习每次从 JSON 导入新库，不是对已有库的增量更新工具。

程序演示主键、CHECK 约束、事务和参数化查询。更换输入可用 --input input/新文件.json；空列表是有效输入，缺字段、重复编号、无效状态或无法存入 SQLite 整数的耗时会失败。数据库查询结果与新建路径以 JSON 打印到终端。

## 7. 发出真正的本机 HTTP 请求

第一个终端从本练习包目录启动服务：

~~~sh
python3 api_lab.py --port 8001
~~~

第二个终端也进入本练习包目录，再运行：

~~~sh
python3 api_client.py --port 8001 --status done
python3 api_client.py --port 8001 --input input/records.json
~~~

第一条通过 GET /api/tasks?status=done 查询，返回 3 条完成任务；第二条通过 POST /api/summarize 发送 JSON 文件，返回 count=4、done=3、pending=1、total_minutes=120、done_minutes=90。也可以在浏览器打开 http://127.0.0.1:8001/api/health 观察健康响应。

服务只绑定 127.0.0.1，不联网调用其他服务，不写数据。Ctrl+C 停止。端口冲突时换成 8002，客户端也要使用相同端口；--port 0 可让系统分配空闲端口，读取终端 READY 后面的实际地址再访问。GET 查询的是启动时读入的快照，POST 只计算本次请求；修改输入文件不会自动刷新该快照，需要重启服务。

接口对无效字段或 JSON 返回 400、未知路径返回 404、超过 65536 字节返回 413、非 application/json 正文返回 415。读取请求正文最多等待 3 秒，客户端也有 --timeout。这里没有生产服务所需的登录、权限系统、TLS 或部署管理；练习重点是观察请求、响应和失败状态。

## 8. 用标注数据评价检索

~~~sh
python3 evaluate_retrieval.py --limit 3
python3 evaluate_retrieval.py --limit 1
python3 evaluate_retrieval.py --output output/retrieval-eval.json
~~~

默认 input/retrieval-cases.json 有 5 个正例、2 个资料不存在的负例，relevant 标注实际文件和行号。k=3 时，正例宏平均 Recall@k=0.8、Precision@k=0.4、MRR=0.8；k=1 时 Recall@k=0.6、Precision@k=0.8、MRR=0.8。Precision@k 分母固定为 k，少于 k 条也不变。两个负例都返回空候选，无答案准确率为 1。正例 R07 使用完整问句而不是分开的关键词，暴露此检索器不会理解语义的失败。

这些数字只评价这个小型人工标注集里的行级检索；不能代表模型回答正确率或生产数据表现。评估集没有某类样本时，相应指标显示 null，不伪造零分或满分。可用 --cases 指定自己的标注集；来源不存在、编号重复或空评估集会失败。--output 保存逐例证据与汇总，已有文件拒绝覆盖。

## 9. 观察有预算的工具循环

~~~sh
python3 controlled_loop.py "报名 截止"
python3 controlled_loop.py "什么时候停止报名？"
python3 controlled_loop.py "什么时候停止报名？" --max-calls 1
python3 controlled_loop.py "餐费 报销" --output output/loop.json
~~~

第一条一轮找到证据。第二条原句检索无结果，固定策略提取“报名”，第二轮找到候选；第三条只有一次调用预算，在再次尝试前返回 budget_exhausted。第四条返回 no_result，并保存实际日志。--timeout 限制整个循环的墙钟秒数，超时会终止正在运行的检索子进程并记录 timeout；例如 --timeout 0.000001 用于观察超时分支。max-calls 支持 1–5，当前策略最多两轮。

这是**确定性策略示范**：没有 LLM，不生成最终答案，也没有让模型自行决定工具。控制器只允许启动固定的 search_notes.py，不使用 shell；资料中的命令只能作为文本返回。日志包括 calls_used、stop_reason、每次真实调用 events 和候选 evidence。找到候选不等于证据充分，仍需核对问题和来源。它展示执行层如何落实工具白名单、预算、超时和记录，不能当作完整 Agent 验证。

## 10. 检查与记录

按 eval-cases.json 执行验收，其中事实题可运行检索；冲突、提示注入和预算用例按 setup 手动模拟。把实际观察保存到 output，未做的项目如实标“未验证”。

所有新工具可添加 --help 查看参数；Windows 的 python3 同样换成 py -3。工具只依赖 Python 标准库，没有付费 API、模型下载或 GPU 要求。仓库维护者可运行 tutorial/tools/check_examples.py，自动检查临时副本中的 SQL 事务、真实本机 HTTP 请求、检索指标和工具预算等行为。

不要在本练习目录中放入真实密钥。不要把练习的本地静态服务器当作生产服务。
