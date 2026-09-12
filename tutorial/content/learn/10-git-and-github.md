---
title: "10｜Git 与 GitHub：给改动留一条回来的路"
description: "认识改动、暂存、提交与推送，避免让 AI 改完后无法比较。"
lesson: 10
stage: "03 和 AI 一起开发"
duration: 25
prerequisites: [09-web-and-api]
outcome: "能保存一个可比较的版本，区分本地与远程"
tags: [Git, GitHub, 版本]
---

# Git 与 GitHub：给改动留一条回来的路

**这一课做成什么**：能保存一个可比较的版本，区分本地与远程。

让 AI 开发时，最实用的习惯之一是：开始改之前留一个版本，改完后看差异。这样即使新功能出了问题，也知道改动发生在哪里。

**Git**在本地记录文件的版本；**GitHub**托管远程仓库，方便同步和协作。没有 GitHub，Git 也能在本地工作。

如果你第一次打开 GitHub，还不认识仓库、README、Release 或 PR，先读 [GitHub 从零开始](../guides/github-from-zero.md)。那里先用浏览器完成协作，本课专门解释本地文件如何成为一个版本。

## 先理解四个动作

~~~text
编辑文件 → 查看差异 → 选择本次要保存的文件 → 提交一个版本
                                               ↓
                                      需要同步时再推送到 GitHub
~~~

提交 commit 类似给选中的改动拍一张有说明的快照。推送 push 才把本地提交发送到远程。仓库则是这些文件和版本记录的集合。

## 用练习副本保存第一个版本

从 [Git 官网](https://git-scm.com/downloads)安装 Git，重新打开终端，运行 git --version。以下命令只在独立解压的 ai-workshop 练习目录中执行，不要在整台电脑的文档根目录初始化。

~~~sh
git init
git status
git add README.md report.py input/records.json .gitignore
git commit -m "保存可运行的工作汇总脚本"
~~~

git add 是选择本次提交的文件，不是上传。git status 显示待处理状态。首次提交若提示身份未配置，在这个练习仓库设置你自己的名字和邮箱即可；它们是提交元数据，不是 GitHub 登录密码。公开仓库可使用 GitHub 提供的隐私邮箱。

### 工作区、暂存区与历史

工作区是你正在编辑的文件；暂存区记录“下一次提交选哪一版内容”；提交把这个快照写进历史。因此 add 之后继续修改同一个文件，新的修改不会自动进入刚才的暂存快照，需要重新检查和 add。

| 命令 | 比较或查看什么 |
| --- | --- |
| `git status` | 当前分支、已暂存、未暂存与未跟踪文件 |
| `git diff` | 工作区相对暂存区的修改 |
| `git diff --cached` | 暂存内容相对上次提交的修改 |
| `git log --oneline -5` | 最近五个提交的简短记录 |
| `git show HEAD` | 当前提交的信息与补丁 |

git diff 没有输出也可能是修改已经暂存，不代表从来没改过。git status 中 untracked 表示 Git 尚未记录该文件，modified 表示已跟踪文件发生变化；不同颜色只是界面提示，不是独立版本状态。

遇到身份提示时，把下面引号里的内容替换成你的署名和提交邮箱，逐行运行，再重试上一条 git commit：

~~~sh
git config user.name "你的署名"
git config user.email "你的提交邮箱"
~~~

这两条只设置当前练习仓库。GitHub 的隐私邮箱可在账号 Settings → Emails 找到；不要把登录密码填进命令。

使用 [GitHub Desktop](https://desktop.github.com/)的读者也可以通过界面查看改动、选择文件和提交，不必同时学习两种操作方式。

## AI 改完以后，先看差异

~~~sh
git diff
~~~

改动比较通常用加号显示新增、减号显示删除。即使看不懂每行代码，也能先看有没有意外删除文件、加入密钥或突然引入大量依赖。再让 AI 按需求逐项解释。

接着只选择本次确认的文件并提交。需要撤回已经提交的改动时，可先让 AI 解释使用 revert 生成一个撤销提交的方案；不要在不理解时执行强制重置或强制推送。

要在新功能上试验，先确认现有修改已妥善保存，再运行 `git switch -c practice-note` 创建并切换分支。分支不是另一个文件夹；同一个工作目录随检出的分支显示对应版本。命令因为未保存修改而拒绝切换时，先读提示，不能拿强制覆盖当常规流程。

`git restore --staged README.md` 可取消暂存而保留工作区编辑；不要与 `git restore README.md` 混淆，后者会用暂存版本覆盖工作区中该文件的未暂存修改。运行会丢弃内容的命令前，必须确认自己要舍弃的具体差异。

## 哪些东西不该跟着上传

练习包的 .gitignore 忽略 output、.venv、.env 等本地产物与配置。忽略规则只影响尚未被跟踪的文件；把已经提交的密钥写进 .gitignore，并不能从历史里移除它。

连接 GitHub 前，检查仓库可见性和提交文件清单。教程练习数据是虚构的，你自己的工作文件需要另行判断。

## 动手做

保存首个版本后，只修改 README.md 的说明，再运行 git diff。确认只有你修改的文字变化，然后保存第二个提交。用 git log --oneline 查看两次记录。

**完成标准**：能分清“文件已保存”“已提交”“已推送”三个状态，并能找到某次改动。

<details>
<summary>自测：GitHub 是不是自动把所有本地文件备份了？</summary>

不是。通常只有被 Git 跟踪、提交并成功推送的内容才会到远程。被忽略、未提交、未推送的文件不在其中。

</details>

参考：[Git 官方入门](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)、[GitHub 文档](https://docs.github.com/en/get-started)。

[上一课](09-web-and-api.md) · [下一课：和 AI 做小网页 →](11-build-with-ai.md)
