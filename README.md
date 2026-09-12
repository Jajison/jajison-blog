# Jajison · 把 AI 用起来

从 Windows/macOS、GitHub 与编程基础，到 Transformer、LLM、RAG、Agent 和质量交付的中文学习知识库。八条路线、20 篇课程与 16 篇指南，配套三个完整项目、原理实验和可运行代码。

博客目标地址：[jajison.github.io/jajison-blog](https://jajison.github.io/jajison-blog/)。本地修改、构建成功与线上已更新是不同状态，实际验证见 [记录](tutorial/editorial/validation.md)。

## 维护入口

- [路线配置](tutorial/curriculum.json)：页面归属、阅读顺序与导航计数。
- [学习路线](tutorial/content/start.md)：按读者起点组织入口。
- [课程](tutorial/content/learn/)与[指南](tutorial/content/guides/)：内容正文；保留已有 slug。
- [项目](tutorial/content/projects/)与[练习包](tutorial/content/downloads/workshop/README.md)：可运行的端到端任务。
- [Tutorial.tsx](quartz/components/Tutorial.tsx)：首页、路线、导航和文章框架。
- [custom.scss](quartz/styles/custom.scss)：中文排版、主题、移动端布局。
- [定位与标准](tutorial/editorial/positioning.md)、[发布说明](tutorial/editorial/publishing.md)：持续维护要求。

实际构建目录是 tutorial/content。根目录 content 与 docs 来自 Quartz，不是此博客的发布入口。用户指定的本地知识笔记仅作参考，不会自动复制或发布。

## 本地运行

建议使用与 CI 一致的 Node.js 24 和 npm 10.9.2 或更高版本；项目 engines 的最低 Node 版本为 22。Python 检查与练习使用标准库。

```sh
npm ci
npm run dev
```

打开终端显示的预览地址。按 Control+C 停止。检查正式子路径时：

```sh
npm run build
python3 scripts/preview_blog.py
```

打开 [本机预览](http://127.0.0.1:8765/jajison-blog/)。Windows 按已安装解释器，将 python3 换为 py -3 或 python。

## 检查与发布

```sh
python3 tutorial/tools/package_workshop.py
python3 tutorial/tools/check_content.py
python3 tutorial/tools/check_examples.py
npm test
npm run build
npm run check:blog
```

修改练习源码需重建 ZIP；修改图示生成器需重新生成图示。内容检查核对课程清单、前置关系与链接，示例检查核对真实输出与失败行为，构建产物检查核对页面、资源、子路径、搜索和下载。交互变化还须在桌面与手机尺寸做浏览器验收。

确认差异、验证记录与待发布范围后再提交推送。推送 v5 会触发 [部署工作流](.github/workflows/deploy.yml)，检查通过后发布 GitHub Pages。不要仅凭本地构建成功就宣称已经上线。

文章参与全文搜索；练习源码按原文件提供下载。阅读进度在本浏览器保存，不同步账号。站点无登录、付费、评论或访问统计。框架使用 [Quartz 5](https://quartz.jzhao.xyz/)，保留其 MIT 许可证；内容与交互遵循本站教学定位。
