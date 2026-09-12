# Jajison · 把 AI 用起来

从电脑基础到 AI 原理与工程应用的中文知识库。八条路线组织 20 篇课程与 16 篇专题指南，并提供三个完整项目、原理实验室和可运行练习。

## 内容入口

- [学习路线](content/start.md)：按起点选择，也可展开八条完整路线。
- [电脑与操作系统](content/guides/computer-and-os.md)：Windows/macOS/Linux、文件与软件安装。
- [GitHub 从零开始](content/guides/github-from-zero.md)：看仓库、选下载、浏览器 PR 与本地协作。
- [Transformer](content/learn/14-transformer.md)：模型计算链路与数学形状。
- [原理实验室](content/labs.md)：softmax、注意力掩码与 KV Cache 估算。
- [练习包说明](content/downloads/workshop/README.md)：Python、Shell、网页、HTTP、SQLite、检索评价与受控循环。
- [定位](editorial/positioning.md)、[设计](editorial/design.md)、[发布](editorial/publishing.md)、[验证记录](editorial/validation.md)：维护资料。

## 目录职责

```text
tutorial/
├── curriculum.json       路径、顺序和文章清单
├── content/              Quartz 实际发布入口
│   ├── learn/            20 篇课程
│   ├── guides/           16 篇专题指南
│   ├── projects/         3 个完整项目
│   ├── labs.md           原理实验入口
│   ├── assets/           解释图
│   └── downloads/        原始练习源码与 ZIP
├── editorial/            编辑标准、来源与验证记录
└── tools/                内容/示例检查与打包工具
```

仓库根目录的 content 和 docs 是 Quartz 原工程内容，博客构建明确使用 tutorial/content。editorial 与 tools 不进入公开文章搜索；如果源仓库公开，它们仍可在 GitHub 阅读。

## 本地验证

从仓库根目录运行：

```sh
python3 tutorial/tools/package_workshop.py
python3 tutorial/tools/check_content.py
python3 tutorial/tools/check_examples.py
npm test
npm run build
npm run check:blog
```

Windows 使用可用的 Python 3 启动命令，例如把 python3 换成 py -3。Shell 成品需要 POSIX sh，第 06 课也提供 PowerShell 对照。修改解释图生成器后，运行 make_diagrams.py；不要把个人输出、密钥、虚拟环境或数据库运行产物打进 ZIP。

当前验证范围以 [验证记录](editorial/validation.md)为准，不以文中预期输出冒充实测。受控循环没有接 LLM；HTTP 在本机运行；专业数学例使用教学数据，未预设付费订阅、API 或独立 GPU。
