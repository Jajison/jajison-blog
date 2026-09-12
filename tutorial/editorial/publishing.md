# 博客维护与发布

工作目录：`/Users/jajison/Documents/personal/jajison-blog-github`。

仓库：https://github.com/Jajison/jajison-blog 。主分支：`v5`。网页地址：https://jajison.github.io/jajison-blog/ 。使用 Quartz 5 与 GitHub Pages，发布来源为 GitHub Actions。

## 日常更新

直接修改本仓库的 `tutorial/content/`。文章标题、描述、课程编号、阶段、预计时间与前置要求保留在 Markdown frontmatter 中。首页课程列表和侧栏从这些信息生成，排序依据 lesson。

```sh
cd "/Users/jajison/Documents/personal/jajison-blog-github"
python3 tutorial/tools/check_content.py
npm run build
npm run check:blog
git add tutorial
git diff --cached --stat
git commit -m "更新教程内容"
git push
```

更新练习源码时，先运行 `python3 tutorial/tools/package_workshop.py` 重新生成压缩包，再检查。不要把自己的运行输出放进练习包。

## 发布机制

`.github/workflows/deploy.yml` 在 `v5` 收到推送时运行。它安装锁定依赖，检查教程和示例，使用 `tutorial/content` 构建页面，再核对输出中的标题、链接、锚点、下载和搜索索引。全部通过后部署到 GitHub Pages。

网站不从仓库根目录生成，因此 `editorial`、工具脚本和 Quartz 自带文档不会成为公开网页。它们作为源代码仍可在公开的 GitHub 仓库中阅读。

练习包源码被排除在文章解析之外，再由 `TutorialDownloads` 按原路径复制到网站输出。这样 JSON、Python、Shell 和素材 Markdown 可以作为原文件取得，而不会混进文章搜索。`ai-workshop.zip` 是读者的主要入口。

## 页面与样式

- `quartz.config.yaml`：中文界面、本地字体、相对链接、网站地址和必要插件。
- `quartz/components/Tutorial.tsx`：首页、头部导航、课程侧栏和文章框架。
- `quartz/styles/custom.scss`：正文宽度、中文行距、表格与代码滚动、移动端布局和两种主题。
- `quartz/plugins/tutorial.ts`：学习目标与验收提示样式、图示放大入口、原始练习文件导出。

使用 `npm run dev` 快速预览；使用 `npm run build` 与 `python3 scripts/preview_blog.py` 检查实际 `/jajison-blog/` 路径。预览按 Ctrl+C 停止。

## 发布失败时

打开仓库 Actions → Publish blog to GitHub Pages，查看失败的步骤。构建失败先在本地重复同一命令；部署失败查看 Pages 设置是否仍为 GitHub Actions，以及 `github-pages` 环境是否允许 `v5` 部署。不要用强制推送或删除环境来绕过不明失败。

官方参考：[GitHub Pages](https://docs.github.com/en/pages)、[Quartz](https://quartz.jzhao.xyz/)。
