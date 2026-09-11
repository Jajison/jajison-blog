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

## 6. 检查与记录

按 eval-cases.json 执行验收，其中事实题可运行检索；冲突、提示注入和预算用例按 setup 手动模拟。把实际观察保存到 output，未做的项目如实标“未验证”。

不要在本练习目录中放入真实密钥。不要把练习的本地静态服务器当作生产服务。
