# 从内容包到 GitHub 博客

目标仓库：https://github.com/Jajison/jajison-blog 。本轮只准备本地文档，没有推送或部署。2026-09-11 通过公开 API 读取目录时收到 403，未据此判断仓库是空仓库或某一框架。

## 接入顺序

1. 单独克隆远程仓库，检查实际默认分支、README、构建命令与已有工作流。
2. 保留现有框架。若采用 Quartz，将本包 content 内的文件映射到其内容目录；若采用 Astro，为同一 Markdown 元数据添加内容集合与页面渲染。
3. 设置站点地址为 https://jajison.github.io/jajison-blog/ ，处理 /jajison-blog/ 子路径下的内部链接、图片与下载。
4. Markdown 渲染器把指向 .md 的相对链接转换成对应页面；SVG 保留为静态资源，downloads 作为原样下载资产。文章标题由模板或正文其中一方渲染，避免双 H1。
5. 只打包对外内容和站点必需代码。editorial 与 tools 是维护资料，不自动生成文章列表。
6. 本地构建，验证首页、两篇文章、图片、练习 ZIP、下一篇链接和移动端排版。
7. 按已选择的框架生成 GitHub Actions；触发分支取仓库实际值，不照搬某个模板的 v5 或 main。
8. 在仓库 Settings → Pages 选择匹配的部署来源；公开发布后再核对真实网址、下载与站内链接。

## 元数据

文章使用 title、description、tags；课程额外使用 lesson、stage、duration、prerequisites、outcome。duration 是阅读加初次练习的估计分钟数。现有正文没有要求框架自动实现这些字段；模板应读取它们或有选择地展示。

代码块使用 Markdown 的三波浪号围栏，标准 CommonMark 渲染器可识别。自测答案使用 details/summary，站点需允许这两个安全 HTML 元素。

## 发布前必须验证的内容

下载包由 tools/package_workshop.py 生成到 content/downloads/ai-workshop.zip，输出目录里的个人运行结果不进入包。部署后检查 .py、.sh 和 .json 下载类型；若平台把它们当页面解析，统一引导下载 ZIP。

仅复制本博客目录，不能把上级 ToFindWork 仓库直接作为博客的发布根目录。不要对尚未检查的远程仓库执行覆盖式初始化或强制推送。

官方参考：[GitHub Pages 文档](https://docs.github.com/en/pages)、[Quartz 文档](https://quartz.jzhao.xyz/)。实际框架版本确定后，再填写与之匹配的构建配置。

