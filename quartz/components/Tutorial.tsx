import { QuartzComponent, QuartzComponentProps } from "./types"
import { PageFrame } from "./frames/types"
import { pathToRoot } from "../util/path"
import type { QuartzPluginData } from "../plugins/vfile"

export const stages = [
  {
    title: "先用起来",
    note: "一份清楚的任务，一份可核对的结果。",
    scope: "日常办公",
    range: "01—04",
  },
  {
    title: "让电脑重复做事",
    note: "认识终端，运行脚本，读懂报错。",
    scope: "脚本入门",
    range: "05—08",
  },
  {
    title: "和 AI 一起开发",
    note: "从一个小需求，到能打开的小工具。",
    scope: "动手开发",
    range: "09—12",
  },
  {
    title: "理解模型，做好选择",
    note: "NLP、Transformer、LLM、RAG，够用就好。",
    scope: "按需进阶",
    range: "13—16",
  },
  {
    title: "让 AI 可靠地做事",
    note: "工具、Agent、Harness，以及怎么验收。",
    scope: "按需进阶",
    range: "17—20",
  },
]

const lessons = (files: QuartzPluginData[]) =>
  files
    .filter((file) => typeof file.frontmatter?.lesson === "number")
    .sort((a, b) => Number(a.frontmatter!.lesson) - Number(b.frontmatter!.lesson))
const lessonTitle = (file: QuartzPluginData) =>
  String(file.frontmatter?.title ?? "").replace(/^\d+｜/, "")
const href = (props: QuartzComponentProps, path = "") =>
  `${pathToRoot(props.fileData.slug!)}/${path}`

export const TutorialBrand: QuartzComponent = (props) => (
  <a class="brand internal" href={href(props)} aria-label="Jajison，把 AI 用起来，返回首页">
    <span class="brand-mark" aria-hidden="true">
      ai<span>↗</span>
    </span>
    <span class="brand-copy">
      <span>JAJISON / LEARN BY DOING</span>
      <strong>把 AI 用起来</strong>
    </span>
  </a>
)

export const TutorialNav: QuartzComponent = (props) => (
  <nav class="top-nav" aria-label="主导航">
    <a class="internal" href={href(props, "start")}>
      从这里开始
    </a>
    <a class="internal" href={href(props, "#courses")}>
      课程路线
    </a>
    <a class="internal" href={href(props, "#projects")}>
      实战项目
    </a>
    <a class="internal" href={href(props, "glossary")}>
      查词
    </a>
  </nav>
)

export const CourseNav: QuartzComponent = (props) => {
  const all = lessons(props.allFiles)
  const current = Number(props.fileData.frontmatter?.lesson ?? 0)
  return (
    <nav class="course-nav" aria-label="课程导航">
      <a class="course-home internal" href={href(props, "start")}>
        学习路线 <span>20 篇短课</span>
      </a>
      {stages.map((stage, index) => (
        <details
          class="course-group"
          open={(current > index * 4 && current <= index * 4 + 4) || (current === 0 && index === 0)}
        >
          <summary>
            <span class="stage-number">0{index + 1}</span>
            {stage.title}
          </summary>
          <ol>
            {all.slice(index * 4, index * 4 + 4).map((file) => (
              <li>
                <a
                  class="internal"
                  aria-current={file.slug === props.fileData.slug ? "page" : undefined}
                  href={href(props, file.slug)}
                >
                  <span>{String(file.frontmatter!.lesson).padStart(2, "0")}</span>
                  {lessonTitle(file)}
                </a>
              </li>
            ))}
          </ol>
        </details>
      ))}
      <div class="course-extras">
        <a class="internal" href={href(props, "prompt-cards")}>
          可直接用的任务卡 <span>↗</span>
        </a>
        <a class="internal" href={href(props, "troubleshooting")}>
          卡住了，看这里 <span>↗</span>
        </a>
        <a href={href(props, "downloads/ai-workshop.zip")} download>
          下载完整练习包 <span>↓</span>
        </a>
      </div>
    </nav>
  )
}

export const CourseMeta: QuartzComponent = (props) => {
  const number = Number(props.fileData.frontmatter?.lesson ?? 0)
  const duration = props.fileData.frontmatter?.duration
  return (
    <div class="course-meta">
      <a class="internal" href={href(props)}>
        首页
      </a>
      <span aria-hidden="true">/</span>
      {number ? (
        <>
          <span>第 {String(number).padStart(2, "0")} 课 / 20</span>
          <span class="meta-stage">{stages[Math.floor((number - 1) / 4)]?.scope}</span>
        </>
      ) : (
        <span>学习资源</span>
      )}
      {typeof duration === "number" && <span class="duration">阅读与练习约 {duration} 分钟</span>}
    </div>
  )
}

export const TutorialFooter: QuartzComponent = (props) => (
  <footer class="tutorial-footer">
    <div>
      <strong>Jajison · 把 AI 用起来</strong>
      <p>少一点术语，多一点做成的事。</p>
    </div>
    <nav aria-label="页脚导航">
      <a class="internal" href={href(props, "about")}>
        关于教程
      </a>
      <a href="https://github.com/Jajison/jajison-blog">GitHub ↗</a>
      <a href={href(props, "index.xml")}>RSS</a>
    </nav>
  </footer>
)

export const TutorialHome: QuartzComponent = (props) => {
  const all = lessons(props.allFiles)
  return (
    <div class="tutorial-home">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">
            <span class="status-dot" />
            给零编程基础的你
          </p>
          <h1 id="hero-title">
            不懂代码，
            <br />
            也能把 <em>AI 用起来。</em>
          </h1>
          <p class="hero-description">
            从整理一份周报，到做出自己的小工具。
            <br class="desktop-break" />
            先完成眼前的工作，再学需要的那一点技术。
          </p>
          <div class="hero-actions">
            <a class="button primary internal" href={href(props, "learn/01-first-result")}>
              从第一课开始 <span>→</span>
            </a>
            <a class="button secondary internal" href={href(props, "start")}>
              选一条适合我的路线
            </a>
          </div>
          <div class="hero-stats">
            <span>
              <strong>20</strong> 篇短教程
            </span>
            <span>
              <strong>3</strong> 个实战项目
            </span>
            <span>
              <strong>0</strong> 编程基础也能开始
            </span>
          </div>
        </div>
        <div class="hero-demo" aria-label="第一课的输入和输出示例">
          <div class="demo-heading">
            <span class="demo-dot" />
            第一课，你就能做成这件事<span class="demo-index">01 / 20</span>
          </div>
          <div class="demo-input">
            <span class="micro-label">交代任务</span>
            <p>
              “把会议记录整理成行动清单。
              <br />
              保留负责人和日期，缺的信息写未确定。”
            </p>
          </div>
          <div class="demo-connector">
            <span>↓</span> 给资料 · 定格式 · 查结果
          </div>
          <div class="demo-output">
            <div class="output-heading">
              <span>行动清单</span>
              <span>可回到原文核对</span>
            </div>
            <div class="output-row">
              <span class="task-state">待办</span>
              <span>
                活动页面初稿<small>小林 · 9 月 12 日前</small>
              </span>
              <span class="source-label">[M2]</span>
            </div>
            <div class="output-row">
              <span class="task-state">待办</span>
              <span>
                确认场地<small>小周 · 时间未确定</small>
              </span>
              <span class="source-label">[M3]</span>
            </div>
            <div class="demo-check">✓ 缺失的日期，不凭空补出来。</div>
          </div>
          <p class="demo-caption">教程中的虚构示例 · 你来交代，AI 来协助，你来验收。</p>
        </div>
      </section>
      <section class="home-section projects-section" id="projects" aria-labelledby="projects-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">START WITH A REAL TASK</p>
            <h2 id="projects-title">你想先做成什么？</h2>
          </div>
          <p>选一个眼下用得上的，直接动手。</p>
        </div>
        <div class="project-grid">
          {[
            {
              num: "01",
              label: "不用写代码",
              title: "把散乱记录，变成清楚周报",
              desc: "先整理事实，再生成文字。每个日期、状态和数字都有依据。",
              href: "projects/01-weekly-report",
              foot: "带走一份可核对的周报",
            },
            {
              num: "02",
              label: "少量 Python",
              title: "让重复整理，交给小脚本",
              desc: "把工作记录自动汇总。先预览，再保存，输入变了也能重复用。",
              href: "projects/02-work-tool",
              foot: "带走一个自己的工作工具",
            },
            {
              num: "03",
              label: "按需进阶",
              title: "让 AI 查资料，再给你答案",
              desc: "检索原文、标明出处。资料没有写的，能明确说不知道。",
              href: "projects/03-document-assistant",
              foot: "带走一条带出处的问答流程",
            },
          ].map((project) => (
            <a class="project-card internal" href={href(props, project.href)}>
              <div class="project-top">
                <span class="project-number">{project.num}</span>
                <span class="chip">{project.label}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.desc}</p>
              <div class="project-foot">
                <span>{project.foot}</span>
                <span>↗</span>
              </div>
            </a>
          ))}
        </div>
      </section>
      <section class="home-section" id="courses" aria-labelledby="courses-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">THE MINIMUM YOU NEED</p>
            <h2 id="courses-title">五个阶段，只学够用的部分。</h2>
          </div>
          <a class="text-link internal" href={href(props, "start")}>
            查看阅读建议 →
          </a>
        </div>
        <p class="section-intro">
          前 3 课就能用于日常工作。脚本、开发和模型原理，按你需要的顺序继续。
        </p>
        <div class="curriculum">
          {stages.map((stage, index) => (
            <section class="stage-row" aria-labelledby={`stage-${index}`}>
              <div class="stage-badge">0{index + 1}</div>
              <div class="stage-description">
                <span class="micro-label">
                  {stage.scope} · {stage.range}
                </span>
                <h3 id={`stage-${index}`}>{stage.title}</h3>
                <p>{stage.note}</p>
              </div>
              <ol class="stage-lessons">
                {all.slice(index * 4, index * 4 + 4).map((file) => (
                  <li>
                    <a class="internal" href={href(props, file.slug)}>
                      <span>{String(file.frontmatter!.lesson).padStart(2, "0")}</span>
                      {lessonTitle(file)}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </section>
      <section class="resource-strip" aria-label="学习辅助资源">
        <div>
          <p class="eyebrow">KEEP THESE CLOSE</p>
          <h2>遇到问题，有地方查。</h2>
        </div>
        <a class="internal" href={href(props, "glossary")}>
          <strong>术语白话表 ↗</strong>
          <span>遇到再查，不用背。</span>
        </a>
        <a class="internal" href={href(props, "prompt-cards")}>
          <strong>可复制的任务卡 ↗</strong>
          <span>交代任务有个起点。</span>
        </a>
        <a class="internal" href={href(props, "troubleshooting")}>
          <strong>排错入口 ↗</strong>
          <span>把问题缩小一步。</span>
        </a>
      </section>
    </div>
  )
}

export const TutorialFrame: PageFrame = {
  name: "tutorial",
  render({
    componentData: props,
    header,
    beforeBody,
    pageBody: Content,
    afterBody,
    left,
    right,
    footer,
  }) {
    const isHome = props.fileData.slug === "index"
    const folderTitle =
      (
        {
          "learn/index": "全部课程",
          "projects/index": "三个实战项目",
          "tags/index": "按主题阅读",
        } as Record<string, string>
      )[props.fileData.slug ?? ""] ??
      (props.fileData.slug?.startsWith("tags/")
        ? String(props.fileData.frontmatter?.title ?? "相关课程")
        : undefined)
    return (
      <>
        <a class="skip-link" href="#main-content">
          跳到正文
        </a>
        <header class="site-header">
          {header.map((Component) => (
            <Component {...props} />
          ))}
        </header>
        {isHome ? (
          <main id="main-content" class="home-main">
            <TutorialHome {...props} />
          </main>
        ) : (
          <div class="reading-layout">
            <aside class="course-sidebar">
              <div class="desktop-courses">
                {left.map((Component) => (
                  <Component {...props} />
                ))}
              </div>
              <details class="mobile-courses">
                <summary>展开课程导航</summary>
                {left.map((Component) => (
                  <Component {...props} />
                ))}
              </details>
            </aside>
            <main id="main-content" class="reading-main">
              <div class="page-header">
                {beforeBody.map((Component) => (
                  <Component {...props} />
                ))}
              </div>
              <div class="popover-hint">
                {folderTitle && <h1 class="resource-title">{folderTitle}</h1>}
                <Content {...props} />
              </div>
              <div class="page-footer">
                {afterBody.map((Component) => (
                  <Component {...props} />
                ))}
              </div>
            </main>
            <aside class="reading-toc" aria-label="本页目录">
              {right.map((Component) => (
                <Component {...props} />
              ))}
            </aside>
          </div>
        )}
        {footer.map((Component) => (
          <Component {...props} />
        ))}
      </>
    )
  },
}
