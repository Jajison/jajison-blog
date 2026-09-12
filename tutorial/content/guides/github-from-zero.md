---
title: "GitHub 零基础：从看懂仓库到提交第一个改动"
description: "逐个认识仓库、README、Issue、PR、Fork、Clone、Release、Actions 与 Pages，完成一次浏览器协作。"
duration: 50
level: 零基础
prerequisites: [guides/computer-and-os]
outcome: "看懂一个项目的入口，在自己的练习仓库完成分支、提交与合并"
tags: [GitHub, Git, 协作, 入门]
---

# GitHub 零基础：从看懂仓库到提交第一个改动

**这一课做成什么**：读懂别人发来的 GitHub 链接，并在自己的练习仓库完成一次可比较的改动。第一遍只用浏览器，不要求先会 Git 命令。

## GitHub 到底是什么

GitHub 是托管代码和协作开发的平台。项目不仅有代码，还可以有说明、文档、图片、测试和历史记录。**Git 是版本控制工具，GitHub 是提供仓库托管等能力的网站和服务**。Git 可以离线使用，GitHub 也支持直接在网页编辑文件。

`https://github.com/OWNER/REPOSITORY` 中，OWNER 是个人或组织，REPOSITORY 是仓库名。后面出现 `/blob/main/README.md` 时，你看的是某个分支上的具体文件，不是软件安装入口。

## 打开仓库先看这七处

| 页面入口 | 看什么 | 新手容易误会什么 |
| --- | --- | --- |
| Code | 文件、分支、最近提交 | 绿色 Code 按钮不是“运行程序” |
| README | 用途、安装、运行和限制 | 项目名相同不代表是官网仓库 |
| Releases | 作者打包的发行版本与附件 | 源码 ZIP 不一定是可安装应用 |
| Issues | 问题报告、缺陷、需求讨论 | Issue 不是私密客服工单 |
| Pull requests | 提议合并的改动及代码审查 | PR 不是下载请求 |
| Actions | 自动测试、构建、部署任务 | 绿色对勾不证明业务结果一定正确 |
| Settings | 自己有权限管理的配置 | 没有权限时不会显示全部选项 |

再检查最近维护时间、许可证 LICENSE、支持的系统和版本要求。Star 表示收藏或关注兴趣，不代表安全审计；开源也不等于可以无视许可证随意复制分发。

**判断该下载什么**：想使用成品软件先读 README 的安装说明及 Releases；想修改代码才考虑 Clone；Code → Download ZIP 是某个版本的源码快照，不带完整 Git 历史。

## 最容易混的几个词

| 词 | 一句话定义 | 会发生在哪里 |
| --- | --- | --- |
| Repository / repo | 文件与版本历史组成的项目仓库 | 本地或 GitHub |
| Commit | 一组被保存并命名的改动 | Git 历史 |
| Branch | 指向一条开发历史的分支指针 | 不会复制一整台电脑 |
| Clone | 把仓库与历史复制到本地 | 你的电脑 |
| Fork | 在自己的账号下派生一个远程仓库 | GitHub |
| Push | 把本地提交发送到远程 | 本地 → 远程 |
| Pull | 获取远程改动并整合到当前分支 | 远程 → 本地 |
| PR | 请求审查并合并一组分支改动 | GitHub 协作流程 |

Fork 不会自动让你改到原作者仓库；Clone 不会自动得到推送权限；Commit 不等于已经上传。收藏仓库更不等于备份了你的本地文件。

## 浏览器实战：自己的第一条 PR

下面会创建真实远程仓库。只使用无敏感信息的练习文字；不要上传公司资料、真实密钥、身份证明或私人通信。暂时不想注册账号，可以先读完整流程，不影响本地练习。

1. 在 [GitHub](https://github.com/)按页面提示创建或登录账号。妥善保存恢复信息，按安全设置启用双因素认证。教程不需要知道你的密码或验证码。
2. 右上角新建菜单 → New repository，命名 `ai-learning-notes`。初练习可选 Private。勾选添加 README，创建仓库。
3. 在 Code 页确认当前默认分支名称，通常是 `main`，但以实际页面为准。
4. 从分支下拉框创建 `add-learning-note`。确认页面分支已经切换，再打开 README，点击编辑。
5. 添加一句“我能区分 Git 和 GitHub”，预览后 Commit changes。提交说明写“补充第一条学习记录”，提交到练习分支。
6. 打开 Pull requests → New pull request：base 选默认分支，compare 选练习分支。在 Files changed 查看差异，确认只有这一句话，再创建 PR。
7. 这是你自己的练习仓库，确认后合并。回 Code 页切回默认分支，检查 README 是否出现新文字。

若页面名称略有变化，找对应含义的入口，不要对陌生项目执行同样的写入操作。你应看到一次提交、一条 PR 和合并后的文字，这是实际结果，而不是“已点击按钮”的记录。

## 再把它放到电脑里

安装 Git 后，从仓库 Code → HTTPS 复制真实地址。进入专用练习父目录，执行：

~~~sh
git clone https://github.com/OWNER/ai-learning-notes.git
cd ai-learning-notes
git status
git log --oneline -5
~~~

把 OWNER 替换成自己的账号名。私有仓库会要求身份认证；优先按 GitHub 文档使用受支持的凭据管理器或 [GitHub Desktop](https://desktop.github.com/)。不要把账号密码写进命令、URL 或 README。现代 GitHub 的 Git HTTPS 认证不能简单拿网页登录密码替代令牌流程。

GitHub Desktop 的基础对应关系是：Clone repository 下载仓库；Changes 查看修改；Commit to 当前分支保存本地版本；Push origin 推送。Fetch origin 只是取回远端信息，并不总是把你当前文件更新到新版本。

## 从本地修改，再回到网页核对

完成前面的 Clone 后，在这个**自己的练习仓库**中继续。确认 `git status` 没有尚未处理的修改，先新建分支：

~~~sh
git switch -c add-local-note
~~~

在 README 添加一行“我在本地也能保存版本”，保存，再检查、提交和推送：

~~~sh
git diff
git add README.md
git diff --cached
git commit -m "补充本地学习记录"
git push -u origin add-local-note
~~~

`origin` 是 Clone 时通常建立的远程别名，不是 GitHub 的另一个名字；`-u` 为这个本地分支设置上游关联。首次提交需要署名时，参照 [Git 本地课](../learn/10-git-and-github.md)。推送若请求认证，按凭据管理器或 Desktop 的交互完成；不要把令牌写进命令。

回到仓库 Pull requests，base 选默认分支，compare 选 add-local-note；查看差异、创建并合并自己的 PR。回本地先切回实际默认分支，例如 `git switch main`，再执行 `git pull --ff-only`。它只接受快进更新；如果本地与远程分别产生了不同提交，会停下来让你处理分叉，而不是自动改写历史。

### 这些提示不代表同一个问题

| 提示 | 先检查 |
| --- | --- |
| repository not found | 地址是否正确，是否有私有仓库访问权限 |
| authentication failed | 凭据是否过期，是否使用受支持认证方式 |
| nothing to commit | 文件是否保存、是否已提交、是否在正确仓库 |
| rejected / non-fast-forward | 远程是否已有你本地没有的提交 |
| merge conflict | 对照两侧真实内容决定保留什么，再测试 |

发生冲突不要机械删除所有 `<<<<<<<` 等标记就算完成；标记只是提醒，两侧内容的业务含义需要判断。使用 `git status` 查看冲突文件，完成整合后重新验证再提交。

## 合作时怎样描述问题

提 Issue 写清系统、版本、复现步骤、预期、实际、完整错误和最小样例。先搜已有问题；日志要去掉令牌、Cookie 和私人路径中的敏感部分。

提 PR 写清改动目的、变更范围、实测内容和未验证项。一个 PR 聚焦一个问题，方便审查与回滚。看到合并冲突时先保存本地工作，对照两侧改动理解差异；不要把“不报冲突”当成内容一定正确。

## GitHub Pages 与仓库不是同一个网页

仓库页面给开发者看文件；Pages 把静态文件作为网站提供访问。公开仓库不自动产生一个可用网站；私有仓库也不能默认意味着 Pages 网站私有，具体能力取决于计划和设置。发布前单独核对访问边界。

Pages 能托管 HTML/CSS/JavaScript，但不能替你运行 Python 后端。发布详见 [测试与发布](../learn/12-test-and-publish.md)。Actions 可以在部署前构建网站；生成出来的浏览器文件仍不能藏住 API 密钥。

**完成标准**：你能在自己的仓库找到 README、提交、分支差异和 PR；说清源码 ZIP、发行包、Clone、Fork 分别适合什么用途。

<details>
<summary>自测：把秘密写入仓库后删除最新文件，再加入 .gitignore，就安全了吗？</summary>

不安全。秘密可能仍在历史、日志、缓存或他人的副本里。先撤销或轮换泄露的凭据，再按官方指南处理历史和相关副本；不要只依赖“当前页面看不见”。

</details>

继续：[Git 的本地版本管理](../learn/10-git-and-github.md)

参考：[GitHub Hello World](https://docs.github.com/en/get-started/start-your-journey/hello-world)、[认证说明](https://docs.github.com/en/authentication)、[敏感数据处理](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)。
