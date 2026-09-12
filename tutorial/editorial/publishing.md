# 博客维护与发布

本文命令均在仓库根目录执行。仓库：[Jajison/jajison-blog](https://github.com/Jajison/jajison-blog)，发布分支 v5，目标网址：[博客](https://jajison.github.io/jajison-blog/)。本站用 Quartz 5 构建，由 GitHub Actions 发布到 GitHub Pages。

## 更新内容与导航

正文在 tutorial/content。保留 title、description、duration、prerequisites、outcome 等 frontmatter；原 learn 课保留 lesson 编号以兼容旧链接。统一路线来自 tutorial/curriculum.json，新文章加入清单时同时补齐前置关系、内容、练习、交叉链接与来源。

首页和侧栏读取统一课程配置；index.md 是语义内容和元数据入口，首页具体布局由 Tutorial.tsx 渲染。不要只修改 index 正文就认为所有首页文案都已更新。

## 发布前的完整检查

从仓库根目录逐项运行：

```sh
python3 tutorial/tools/package_workshop.py
python3 tutorial/tools/check_content.py
python3 tutorial/tools/check_examples.py
npm test
npm run build
npm run check:blog
```

ZIP 更新只包含允许的练习文件，不能加入 .env、.venv、个人输出、缓存或运行生成的数据库。Windows 按已安装 Python 使用 py -3 或 python。PowerShell、不同浏览器、模型和硬件的实测范围单独记录，不以 macOS 检查代替。

用 npm run dev 做快速预览；用构建后的 scripts/preview_blog.py 检查实际 /jajison-blog/ 子路径。桌面和手机检查首页、长文、公式、表格、搜索、阅读记录与实验室；SPA 再导航后重复关键动作，避免只验证第一次加载。通过后更新 validation.md，写明命令、环境、观察结果与未验证项。

## 提交与部署

先查看 git status、git diff，选择本次实际需要发布的文件，审阅暂存差异后提交。v5 推送会触发 Publish blog to GitHub Pages：安装依赖 → 内容/示例检查 → 计算与渲染测试 → 构建 → 页面检查 → 部署。公开发布前还需确认没有真实资料、凭据或意外文件进入提交。

editorial、tools 和 Quartz 文档不作为博客文章构建；源仓库公开时，仍可在 GitHub 中阅读。downloads/workshop 被排除在文章解析之外，由 TutorialDownloads 原样复制，以便 Python、JSON、Shell 和素材 Markdown 正常下载。

## 发布失败与回滚

在 Actions 定位具体失败步骤，再在本地重复同一命令。部署配置失败时核对 Pages 发布源、github-pages 环境和分支权限；不要通过强制推送、删除检查或修改验收阈值隐藏失败。

记录每次发布的提交编号和构建结果。回滚前比较目标版本与当前数据/配置兼容性，使用可审查的撤销提交或明确的恢复变更；重新运行检查并复验真实网址。页面变更不会自动迁移读者浏览器里的数据，存储键或结构变化要单独设计兼容与恢复。

官方参考：[GitHub Pages](https://docs.github.com/en/pages)、[Quartz](https://quartz.jzhao.xyz/)。
