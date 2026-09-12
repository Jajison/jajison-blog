# Jajison · 把 AI 用起来

给零编程基础读者的 AI 实用教程：从第一份能核对的成果，到自己的小工具。20 篇短课，5 个阶段，3 个实战项目。

博客地址：**https://jajison.github.io/jajison-blog/**

## 在哪里改内容

- `tutorial/content/learn/`：20 篇课程正文。
- `tutorial/content/projects/`：3 个实战项目。
- `tutorial/content/start.md`：学习路线。
- `tutorial/content/assets/`：原创 SVG 解释图。
- `tutorial/content/downloads/`：练习源码与下载包。
- `quartz/components/Tutorial.tsx`：首页、课程导航和页面结构；课程列表读取正文元数据。
- `quartz/styles/custom.scss`：中文排版、浅深配色和手机布局。
- `quartz.config.yaml`：标题、站点地址与 Quartz 插件。
- `.github/workflows/deploy.yml`：推送 `v5` 后自动构建与发布。

本仓库是后续维护位置。无须再从旧的 ToFindWork 目录复制文件。

## 本地预览

使用 Node.js 24、npm 10.9.2 或更高版本。Python 检查脚本只使用标准库。

```sh
npm ci
npm run dev
```

打开终端显示的本地网址。按 Ctrl+C 停止预览。

要模拟 GitHub Pages 的 `/jajison-blog/` 路径：

```sh
npm run build
python3 scripts/preview_blog.py
```

打开 http://127.0.0.1:8765/jajison-blog/ 。这个预览只绑定本机地址。

## 检查与更新

```sh
python3 tutorial/tools/check_content.py
python3 tutorial/tools/check_examples.py
npm run build
npm run check:blog
```

修改练习源码后，先执行 `python3 tutorial/tools/package_workshop.py` 更新 ZIP。修改图示生成器后，先执行 `python3 tutorial/tools/make_diagrams.py`。

文章更新后：

```sh
git add tutorial
git diff --cached --stat
git commit -m "更新教程内容"
git push
```

在仓库 Actions 中查看 **Publish blog to GitHub Pages**。构建、检查与部署全部成功后，页面才会更新。修改样式或配置时，也要将对应文件加入提交。

文章和项目参与全文搜索。练习包内的源码和虚构资料按原文件提供下载，不作为博客文章编入搜索结果。没有登录、付费、评论或访问统计。

框架使用 [Quartz 5](https://quartz.jzhao.xyz/)，保留其 MIT 许可证。站点视觉参考 Walter's Tech Blog 的清晰导航与阅读层次；教程正文与解释图独立编写。
