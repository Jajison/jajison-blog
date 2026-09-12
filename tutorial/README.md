# Jajison · 把 AI 用起来

给零编程基础读者的 AI 实用教程。目标是让读者能把任务交代清楚、看懂少量代码、运行小工具，并判断 AI 是否真的完成了工作。

## 从哪里看

- [博客首页](content/index.md)：对外的定位、入口和课程导航。
- [从这里开始](content/start.md)：按目标选择阅读路线。
- [课程正文](content/learn/01-first-result.md)：20 篇完整短教程。
- [三个实战项目](content/projects/01-weekly-report.md)：从整理信息到开发工具、搭建资料助手。
- [练习包说明](content/downloads/workshop/README.md)：虚构数据、Shell/Python 示例和网页项目。
- [编辑与视觉方案](editorial/design.md)：网站落地时的排版和交互约定。
- [发布说明](editorial/publishing.md)：与 GitHub 仓库衔接的方法。
- [验证记录](editorial/validation.md)：已实测的内容与尚未验证的环境。

## 目录职责

```text
jajison-blog/
├── content/               将来博客对外发布的内容
│   ├── index.md           首页
│   ├── start.md           学习路线
│   ├── learn/             20 篇短教程
│   ├── projects/          3 个项目
│   ├── assets/            原创解释图
│   └── downloads/         可下载、可运行的练习包
├── editorial/             编辑规范、视觉方案、来源和发布说明
└── tools/                 内容与示例的校验工具
```

本教程已接入当前仓库的 Quartz 5 网站。后续内容直接在此目录编辑，以 `/Users/jajison/Documents/personal/jajison-blog-github` 为工作目录；原知识点整理没有接入。

博客地址：https://jajison.github.io/jajison-blog/ 。`v5` 分支推送后由 GitHub Actions 检查、构建和发布。

网站提供首页课程入口、全文搜索、课程导航、文章目录、代码复制、浅深主题和移动端阅读。自测通过 details 展开答案；七张 SVG 图可点击查看原图。

普通 Markdown 和相对链接保持可读。网站使用 `content` 作为内容根目录，`editorial` 与 `tools` 是维护资料。整个站点的运行方式见上级 README。

## 本地检查

在此目录打开终端，macOS / Linux 使用：

```sh
python3 tools/check_content.py
python3 tools/check_examples.py
```

Windows 使用 Python 官方启动器时，将 python3 换成 py -3。示例只依赖 Python 标准库；Shell 练习使用 POSIX sh。具体运行位置、输入和输出见练习包说明。

修改图示或练习素材后，先重新生成对应文件，再执行以上检查：

```sh
python3 tools/make_diagrams.py
python3 tools/package_workshop.py
```

内容制作日期：2026-09-11。教程不绑定最新模型榜单，不预设付费订阅或 API 额度。
