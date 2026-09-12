---
title: "数据与 SQL：从一份 JSON 到能核对的数据库查询"
description: "用工作记录理解编码、字段、主键、筛选、分组、参数化查询与事务，运行标准库 SQLite 练习。"
duration: 55
level: 基础实践
prerequisites: [learn/07-python, learn/09-web-and-api]
outcome: "把四条记录放进 SQLite，查出 90 分钟已完成工作，并解释约束与事务的作用"
tags: [数据, SQL, SQLite, Python]
---

# 数据与 SQL：从一份 JSON 到能核对的数据库查询

**这一课做成什么**：用同一份工作记录完成“读文件 → 检查字段 → 放入表 → 查询”，并知道为什么得到一个数字还不够，必须能解释它的计算口径。

前面的 Python 把 JSON 读成列表后循环统计。数据变多、需要按负责人或日期反复筛选时，可以把它存进**数据库**：由专门程序组织、查询和维护数据。**SQL** 是描述查询与修改规则的语言；**SQLite** 是一个嵌入应用的数据库引擎，常把数据库放在一个文件中，不要求启动独立服务器。[SQLite 与 Python 接口](https://docs.python.org/3/library/sqlite3.html)

## 文件格式决定什么

| 格式 | 适合表达 | 读入时仍要确认 |
| --- | --- | --- |
| CSV | 行列整齐的一张表 | 分隔符、引号、编码、日期和数字类型 |
| JSON | 列表、对象、嵌套结构 | 必需字段、允许值、空值、重复编号 |
| SQLite | 多张有关联的表和查询规则 | 表结构、约束、事务、访问方式 |

**编码**规定文字怎样变成字节；UTF-8 是一种编码，JSON 是数据格式，两者不是同一层。把文件后缀从 .txt 改成 .json 不会自动修好内容。CSV 中的 0012 可能是编号，不能见到数字就转为整数；2026-09-18 18:00 也需要说明时区。

先写一份**数据契约**，即生产者与使用者共同遵守的字段规则。本练习沿用四个字段：id 与 task 为非空文字，id 唯一；status 只允许 done、pending；minutes 为非负整数，单位是分钟。缺失分钟应报错，不能悄悄补 0。JSON 的 true 是布尔值，也不应该作为“1 分钟”通过。

## 一张表是什么

**行**是一条记录，**列**是一个字段，**主键**标识每条记录。任务名称会重复或修改，所以本练习用稳定编号 W01、W02 当主键。

~~~sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY NOT NULL,
  task TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('done', 'pending')),
  minutes INTEGER NOT NULL CHECK (
    typeof(minutes) = 'integer' AND minutes >= 0
  )
);
~~~

NOT NULL 拒绝缺失值，CHECK 检查允许条件，PRIMARY KEY 保证标识唯一。SQLite 普通表具有灵活类型规则，写 INTEGER 不等于所有不合要求的输入都会被拒绝；本例额外检查实际存储类型，Python 仍在入库前按原始字段校验。数据库约束是第二层保护，不能替代对输入含义的判断。[SQLite 类型规则](https://www.sqlite.org/datatype3.html)

假设以后增加负责人表 people(person_id, name)，任务里只保存 person_id，就能避免每处重复写姓名。通过 JOIN 把两个表关联；但如果一条任务对应多条标签，连接后会出现多行，直接求和可能重复统计。查询结果的“每一行代表什么”始终要先说清。

## 用一条查询解释 90 分钟

~~~sql
SELECT COUNT(*) AS task_count,
       COALESCE(SUM(minutes), 0) AS total_minutes
FROM tasks
WHERE status = 'done';
~~~

FROM 指定表，WHERE 筛选行，COUNT(*) 数留下的行，SUM 加分钟，AS 给结果起名。原始四条记录里只有 45、20、25 分钟属于 done，所以结果应是 **3 条、90 分钟**。COALESCE 在求和结果为空值时选 0，让空集合也有明确输出。

**NULL** 表示缺失或未知，不等于 0，也不等于空字符串。判断它用 IS NULL；COUNT(列名) 不计 NULL，COUNT(*) 计行。SQLite 在没有输入行时 SUM 返回 NULL，因此上面特意处理。[SQLite 聚合函数](https://www.sqlite.org/lang_aggfunc.html)

按状态分别汇总，可以写：

~~~sql
SELECT status, COUNT(*) AS task_count, SUM(minutes) AS total_minutes
FROM tasks
GROUP BY status
ORDER BY status;
~~~

预期是 done / 3 / 90 和 pending / 1 / 30。GROUP BY 把同类行放在一起计算；ORDER BY 规定展示次序。没有排序的查询不要依赖偶然返回顺序。

## 参数是数据

让用户选择状态时，用**参数化查询**把 SQL 结构与输入值分开：

~~~python
status = "done"
rows = connection.execute(
    "SELECT id, minutes FROM tasks WHERE status = ? ORDER BY id",
    (status,),
).fetchall()
~~~

问号是值的占位符，(status,) 是只有一个元素的元组，逗号不能省。不要用字符串拼接把用户输入塞进 SQL。参数化解决“输入被当作 SQL”的问题；状态是否属于业务允许值仍需单独检查。表名、列名一般不能像值一样用问号替换，需要从程序定义的允许列表中选。[参数绑定](https://docs.python.org/3/library/sqlite3.html#how-to-use-placeholders-to-bind-values-in-sql-queries)

## 事务让一组改动一起成立

**事务**把多步数据库操作组成一个整体：成功时 COMMIT 提交，失败时 ROLLBACK 回滚。比如导入四条记录，第三条主键重复，目标通常是整批不进入数据库，避免“报告只统计了前两条却没有提醒”。程序应捕获失败并显式回滚；不能假设任何错误都会自动撤销之前全部语句。[SQLite 事务](https://www.sqlite.org/lang_transaction.html)

事务并不包含数据库外的所有动作。先发出邮件、再回滚数据库，邮件不会被撤回。备份也不是事务：事务解决一次修改的一致性，备份用于恢复丢失或误改的数据。

## 动手：在内存里建库，再保存一份副本

下载[练习包](../downloads/ai-workshop.zip)，解压后在 ai-workshop 根目录运行；Windows 把 python3 换为 py -3：

~~~sh
python3 sqlite_lab.py
python3 sqlite_lab.py --status done
python3 sqlite_lab.py --database output/workshop.db
~~~

默认在内存中建库，不创建数据库文件。第一条应汇总 4 条记录、120 分钟；第二条只选择 done 任务，应为 3 条、90 分钟；第三条显式创建新的数据库文件。已有同名数据库会被拒绝，避免练习覆盖。

复制 input/records.json 为 input/records-sql.json，只把待办任务的 30 改为 40：

~~~sh
python3 sqlite_lab.py --input input/records-sql.json --status done
python3 sqlite_lab.py --input input/records-sql.json
~~~

done 仍应为 90，总分钟变为 130。再在副本中制造重复 id，观察程序拒绝输入。遇到 No module named sqlite3，说明所用 Python 发行版未包含该可选模块；先核对解释器和发行版，不要安装名字相似的第三方包来碰运气。

**完成标准**：能解释 120 与 90 的区别，定位输入与数据库文件，说明主键、参数和事务分别阻止哪类错误；能保留源 JSON 并复现一次非法输入失败。

<details>
<summary>自测：SQL 结果能执行成功，是否证明报表正确？</summary>

不能。忘记 WHERE 会把待办计入已完成；连接到多条标签可能重复求和；把 NULL 当作 0 可能掩盖缺失。先核对行的含义与筛选规则，再检查小样本结果，最后才考虑性能。

</details>

[回到 Python](../learn/07-python.md) · [继续：测试与交付](testing-and-delivery.md)
