import { QuartzComponent, QuartzComponentProps } from "./types"
import { PageFrame } from "./frames/types"
import { pathToRoot } from "../util/path"
import type { QuartzPluginData } from "../plugins/vfile"
import curriculum from "../../tutorial/curriculum.json"
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  FlaskConical,
  Code2,
  Layers3,
  Check,
  Download,
  GitBranch,
  Monitor,
  Braces,
  Network,
  Cpu,
  Search,
  Route,
  ShieldCheck,
} from "lucide-preact"
import { LearningLabs } from "./LearningLabs"
// @ts-ignore bundled as a client script by Quartz
import learningScript from "./scripts/learning.inline"

const tracks = curriculum.tracks
const slugs = tracks.flatMap((track) => track.pages)
const icons = [Monitor, Code2, GitBranch, Braces, Cpu, Search, Network, ShieldCheck]
const title = (file?: QuartzPluginData) =>
  String(file?.frontmatter?.title ?? "").replace(/^\d+｜/, "")
const href = (props: QuartzComponentProps, slug = "") =>
  pathToRoot(props.fileData.slug!) + "/" + slug
const filesBySlug = (props: QuartzComponentProps) =>
  new Map(props.allFiles.map((file) => [String(file.slug), file]))
const prerequisiteSlug = (value: string) => (value.includes("/") ? value : "learn/" + value)

export const TutorialBrand: QuartzComponent = (props) => (
  <a class="brand internal" href={href(props)} aria-label="Jajison，把 AI 用起来，返回首页">
    <span class="brand-mark" aria-hidden="true">
      <Layers3 size={22} />
    </span>
    <span class="brand-copy">
      <strong>
        Jajison<span> / </span>把 AI 用起来
      </strong>
      <small>从零起步 · 理解原理 · 动手验证</small>
    </span>
  </a>
)
TutorialBrand.afterDOMLoaded = learningScript

export const TutorialNav: QuartzComponent = (props) => (
  <nav class="top-nav" aria-label="主导航">
    {[
      ["start", "从零开始"],
      ["#courses", "知识库"],
      ["labs", "原理实验室"],
      ["#projects", "实战"],
    ].map(([slug, label]) => (
      <a
        class="internal"
        href={href(props, slug)}
        aria-current={props.fileData.slug === slug ? "page" : undefined}
      >
        {label}
      </a>
    ))}
  </nav>
)

export const CourseNav: QuartzComponent = (props) => {
  const files = filesBySlug(props)
  const current = String(props.fileData.slug)
  return (
    <nav class="course-nav" aria-label="课程导航">
      <a class="course-home internal" href={href(props, "#courses")}>
        <BookOpen size={16} /> 全部学习路径 <span>{slugs.length} 篇</span>
      </a>
      <div class="sidebar-progress enhanced-only">
        <span data-progress-summary>尚未标记</span>
        <progress data-progress-bar max={slugs.length} value={0} aria-label="已读文章数量" />
      </div>
      {tracks.map((track, index) => (
        <details
          class="course-group"
          open={track.pages.includes(current) || (current === "start" && index === 0)}
        >
          <summary>
            <span class="stage-number">{String(index + 1).padStart(2, "0")}</span>
            {track.title}
          </summary>
          <ol>
            {track.pages.map((slug) => (
              <li data-page-slug={slug}>
                <a
                  class="internal"
                  href={href(props, slug)}
                  aria-current={current === slug ? "page" : undefined}
                >
                  <span class="nav-title">{title(files.get(slug)) || slug}</span>
                  <span data-read-marker class="read-marker" />
                </a>
              </li>
            ))}
          </ol>
        </details>
      ))}
      <div class="course-extras">
        <a class="internal" href={href(props, "labs")}>
          <FlaskConical size={15} /> 原理实验室
        </a>
        <a class="internal" href={href(props, "glossary")}>
          术语索引 <ArrowUpRight size={14} />
        </a>
        <a class="internal" href={href(props, "troubleshooting")}>
          遇到问题，从这里排查 <ArrowUpRight size={14} />
        </a>
        <a href={href(props, "downloads/ai-workshop.zip")} download>
          <Download size={15} /> 下载完整练习包
        </a>
      </div>
    </nav>
  )
}

export const CourseMeta: QuartzComponent = (props) => {
  const slug = String(props.fileData.slug)
  const track = tracks.find((item) => item.pages.includes(slug))
  const duration = props.fileData.frontmatter?.duration
  return (
    <div class="course-meta">
      <a class="internal" href={href(props)}>
        知识库
      </a>
      <span>/</span>
      <span>{track?.title ?? (slug === "labs" ? "原理实验室" : "学习资源")}</span>
      {typeof duration === "number" && <span class="duration">阅读与练习约 {duration} 分钟</span>}
    </div>
  )
}

function ProgressTools() {
  return (
    <div class="progress-tools enhanced-only">
      <span class="progress-status">
        <Check size={15} />
        <span data-progress-summary>尚未标记</span>
      </span>
      <button type="button" data-progress-export>
        导出进度
      </button>
      <label class="file-control">
        恢复进度
        <input
          type="file"
          accept=".json,application/json"
          data-progress-import
          aria-label="从 JSON 文件恢复阅读进度"
        />
      </label>
      <small>仅保存在此浏览器</small>
    </div>
  )
}

export const TutorialFooter: QuartzComponent = (props) => (
  <footer class="tutorial-footer">
    <div>
      <strong>把 AI 用起来，也把它弄明白。</strong>
      <p>Jajison · 持续整理的 AI 学习与实践笔记</p>
    </div>
    <nav aria-label="页脚导航">
      <a class="internal" href={href(props, "about")}>
        关于与来源
      </a>
      <a href="https://github.com/Jajison/jajison-blog">
        GitHub <ArrowUpRight size={13} />
      </a>
      <a href={href(props, "index.xml")}>RSS</a>
    </nav>
  </footer>
)

export const TutorialHome: QuartzComponent = (props) => {
  const files = filesBySlug(props)
  const questions = slugs.reduce(
    (sum, slug) => sum + (Number(files.get(slug)?.frontmatter?.selfCheckCount) || 0),
    0,
  )
  return (
    <div class="tutorial-home">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">
            <span class="status-dot" /> JAJISON / LEARNING NOTES
          </p>
          <h1 id="hero-title">
            从认识电脑，
            <br />
            到理解 <em>AI 的每一步。</em>
          </h1>
          <p class="hero-description">
            Windows 和 Mac 怎么用，GitHub 从哪开始，
            <br class="desktop-break" />
            大模型如何工作，以及怎样亲手做出可靠的工具。
          </p>
          <div class="hero-actions">
            <a class="button primary internal" href={href(props, "start")}>
              找到我的起点 <ArrowRight size={16} />
            </a>
            <a class="button secondary internal" href={href(props, "labs")}>
              <FlaskConical size={17} /> 打开原理实验室
            </a>
          </div>
          <a
            class="resume-link internal enhanced-only"
            href={href(props, "start")}
            data-resume-reading
            hidden
          />
        </div>
        <div class="hero-map" aria-label="从计算机基础到模型与工程的学习地图">
          <div class="map-heading">
            <span>
              <Route size={16} /> 一张能走通的学习地图
            </span>
            <span>LEARN → BUILD</span>
          </div>
          <a class="map-step internal" href={href(props, "guides/computer-and-os")}>
            <span class="map-number">01</span>
            <div>
              <strong>先把基础接起来</strong>
              <span>电脑 · 文件 · 终端 · GitHub</span>
            </div>
            <Monitor size={21} />
          </a>
          <span class="map-connector" aria-hidden="true" />
          <a class="map-step internal" href={href(props, "learn/14-transformer")}>
            <span class="map-number">02</span>
            <div>
              <strong>看懂模型怎样计算</strong>
              <span>数学 · Transformer · 训练与推理</span>
            </div>
            <Cpu size={21} />
          </a>
          <span class="map-connector" aria-hidden="true" />
          <a class="map-step internal" href={href(props, "guides/rag-engineering")}>
            <span class="map-number">03</span>
            <div>
              <strong>做出来，再验证</strong>
              <span>RAG · Agent · 测试与交付</span>
            </div>
            <ShieldCheck size={21} />
          </a>
          <p>每个概念都有来路，每次练习都有验收标准。</p>
        </div>
      </section>
      <div class="knowledge-stats" aria-label="知识库内容">
        <span>
          <strong>{slugs.length}</strong> 篇系统文章
        </span>
        <span>
          <strong>{tracks.length}</strong> 条学习路径
        </span>
        <span>
          <strong>3</strong> 个交互实验
        </span>
        <span>
          <strong>{questions}</strong> 道文内自测
        </span>
      </div>
      <section class="entry-section" aria-label="按经验选择起点">
        <a class="entry-link internal" href={href(props, "guides/computer-and-os")}>
          <Monitor size={22} />
          <div>
            <h2>第一次接触这些？</h2>
            <p>从文件、操作系统和第一条命令开始。</p>
          </div>
          <ArrowUpRight size={20} />
        </a>
        <a class="entry-link internal" href={href(props, "guides/math-for-ai")}>
          <Braces size={22} />
          <div>
            <h2>想把原理真正弄懂？</h2>
            <p>沿着向量、注意力、训练与推理深入。</p>
          </div>
          <ArrowUpRight size={20} />
        </a>
      </section>
      <section class="home-section" id="courses" aria-labelledby="courses-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">THE KNOWLEDGE MAP</p>
            <h2 id="courses-title">知识库 · 选一条路径，逐步深入</h2>
          </div>
          <a class="text-link internal" href={href(props, "start")}>
            阅读路线说明 <ArrowRight size={16} />
          </a>
        </div>
        <p class="section-intro">
          同一知识点，从直觉解释走到公式、代码和失败案例。可以顺序学习，也可以从正在遇到的问题进入。
        </p>
        <div class="course-toolbar enhanced-only">
          <label class="filter-search">
            <Search size={17} />
            <input
              id="course-filter"
              type="search"
              placeholder="筛选文章：Windows、GitHub、注意力…"
              aria-label="筛选课程文章"
            />
          </label>
          <select id="track-filter" aria-label="筛选学习路径">
            <option value="">全部路径</option>
            {tracks.map((track) => (
              <option value={track.id}>{track.title}</option>
            ))}
          </select>
          <label class="check-control">
            <input id="unread-filter" type="checkbox" />
            只看未读
          </label>
          <span data-filter-count aria-live="polite">
            显示 {slugs.length} / {slugs.length} 篇
          </span>
        </div>
        <ProgressTools />
        <p class="progress-notice" data-progress-notice role="status" />
        <div class="curriculum">
          {tracks.map((track, index) => {
            const Icon = icons[index]
            return (
              <section
                class="track-section"
                id={"track-" + track.id}
                data-track-entry={track.id}
                aria-labelledby={"track-title-" + track.id}
              >
                <div class="track-intro">
                  <span class="track-icon">
                    <Icon size={21} />
                  </span>
                  <div>
                    <p class="micro-label">
                      {"0" + (index + 1)} / {track.level} · {track.pages.length} 篇
                    </p>
                    <h3 id={"track-title-" + track.id}>{track.title}</h3>
                    <p>{track.description}</p>
                  </div>
                </div>
                <ol class="track-articles">
                  {track.pages.map((slug, pageIndex) => {
                    const file = files.get(slug)
                    const description = String(file?.frontmatter?.description ?? "")
                    return (
                      <li
                        data-course-entry={slug}
                        data-page-slug={slug}
                        data-track={track.id}
                        data-search={[
                          title(file),
                          description,
                          track.title,
                          ...(file?.frontmatter?.tags ?? []),
                        ].join(" ")}
                      >
                        <a class="internal course-link" href={href(props, slug)}>
                          <span class="article-index">
                            {String(pageIndex + 1).padStart(2, "0")}
                          </span>
                          <span class="article-info">
                            <strong>{title(file) || slug}</strong>
                            <span>{description}</span>
                            <small>
                              <span data-read-marker class="read-marker" />
                              {Number(file?.frontmatter?.duration) || "—"} 分钟 ·{" "}
                              {slug.startsWith("guides/") ? "专题指南" : "核心课程"}
                            </small>
                          </span>
                          <ArrowUpRight class="article-arrow" size={17} />
                        </a>
                      </li>
                    )
                  })}
                </ol>
              </section>
            )
          })}
        </div>
        <p class="empty-results" data-filter-empty hidden>
          没有匹配文章。试试更短的关键词，或切回“全部路径”。
        </p>
      </section>
      <section class="home-section" id="projects" aria-labelledby="projects-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">PUT IT INTO PRACTICE</p>
            <h2 id="projects-title">带着一个结果离开</h2>
          </div>
          <a class="text-link" href={href(props, "downloads/ai-workshop.zip")} download>
            <Download size={16} /> 下载完整练习包
          </a>
        </div>
        <div class="project-grid">
          {[
            [
              "01",
              "projects/01-weekly-report",
              "把工作记录变成可核对的周报",
              "整理事实、标记来源，再让 AI 起草。用原始记录逐项验收。",
              "浏览器 + AI 对话工具",
            ],
            [
              "02",
              "projects/02-work-tool",
              "从脚本到自己的工作工具",
              "运行 Python、查询 SQLite、调用本地 HTTP 接口，把输入真正变成输出。",
              "Python 标准库 · 本地运行",
            ],
            [
              "03",
              "projects/03-document-assistant",
              "搭建有证据的资料问答流程",
              "亲手检索、测量召回、观察预算与超时，再核对 AI 回答。",
              "检索评估 · 受控执行",
            ],
          ].map(([num, slug, heading, description, label]) => (
            <a class="project-card internal" href={href(props, slug)}>
              <span class="project-number">
                {num} <ArrowUpRight size={18} />
              </span>
              <h3>{heading}</h3>
              <p>{description}</p>
              <span class="project-foot">{label}</span>
            </a>
          ))}
        </div>
      </section>
      <section class="resource-strip" aria-label="辅助资源">
        <div>
          <h2>不用一次记住所有东西。</h2>
          <p>查一个词、复制一份任务卡，或者从错误现象开始排查。</p>
        </div>
        {[
          ["glossary", "术语白话索引"],
          ["prompt-cards", "任务与验收卡"],
          ["troubleshooting", "排错手册"],
        ].map(([slug, label]) => (
          <a class="internal" href={href(props, slug)}>
            {label}
            <ArrowUpRight size={16} />
          </a>
        ))}
      </section>
    </div>
  )
}

function ReadingContext(props: QuartzComponentProps) {
  const files = filesBySlug(props)
  const prerequisites = props.fileData.frontmatter?.prerequisites
  const outcome = props.fileData.frontmatter?.outcome
  if (!outcome && !Array.isArray(prerequisites)) return null
  return (
    <details class="reading-context">
      <summary>阅读准备与本篇目标</summary>
      {outcome && (
        <p>
          <strong>读完能做什么：</strong>
          {String(outcome)}
        </p>
      )}
      {Array.isArray(prerequisites) && prerequisites.length > 0 ? (
        <p class="prerequisite-links">
          <strong>先修知识：</strong>
          {prerequisites.map((value) => {
            const slug = prerequisiteSlug(String(value))
            return (
              <a class="internal" href={href(props, slug)}>
                {title(files.get(slug)) || String(value)}
              </a>
            )
          })}
        </p>
      ) : (
        <p>本篇可直接开始，不要求编程经验。</p>
      )}
    </details>
  )
}

function ReadingNext(props: QuartzComponentProps) {
  const slug = String(props.fileData.slug)
  const index = slugs.indexOf(slug)
  const files = filesBySlug(props)
  if (index < 0) return null
  return (
    <div class="reading-next">
      <div class="completion-row enhanced-only">
        <span>完成练习后，再给自己一个标记。</span>
        <button data-mark-read type="button" aria-pressed="false">
          标记为已读
        </button>
      </div>
      <nav aria-label="按学习路径继续阅读">
        {[index - 1, index + 1].map((next, i) =>
          next >= 0 && next < slugs.length ? (
            <a class="internal" href={href(props, slugs[next])}>
              <small>{i === 0 ? "← 路线上一篇" : "路线下一篇 →"}</small>
              <strong>{title(files.get(slugs[next]))}</strong>
            </a>
          ) : (
            <span />
          ),
        )}
      </nav>
      <ProgressTools />
      <p data-progress-notice class="progress-notice" role="status" />
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
    const slug = String(props.fileData.slug)
    const isHome = slug === "index"
    const isLabs = slug === "labs"
    const files = filesBySlug(props)
    const folderTitle =
      (
        {
          "learn/index": "核心课程",
          "guides/index": "专题指南",
          "projects/index": "实战项目",
          "tags/index": "按主题阅读",
        } as Record<string, string>
      )[slug] ??
      (slug.startsWith("tags/")
        ? String(props.fileData.frontmatter?.title ?? "相关内容")
        : undefined)
    return (
      <>
        <div
          id="learning-data"
          hidden
          data-current={slug}
          data-catalog={JSON.stringify(
            slugs.map((page) => ({
              slug: page,
              title: title(files.get(page)),
              href: href(props, page),
            })),
          )}
        />
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
          <div class={"reading-layout" + (isLabs ? " labs-layout" : "")}>
            <aside class="course-sidebar">
              <div class="desktop-courses">
                {left.map((Component) => (
                  <Component {...props} />
                ))}
              </div>
              <details class="mobile-courses">
                <summary>
                  <BookOpen size={16} /> 学习路径与阅读进度
                </summary>
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
              <ReadingContext {...props} />
              {!isLabs && Array.isArray(props.fileData.toc) && props.fileData.toc.length > 0 && (
                <details class="mobile-toc">
                  <summary>本页目录</summary>
                  <nav aria-label="展开后的本页目录">
                    {props.fileData.toc.map((entry: { slug: string; text: string }) => (
                      <a href={"#" + entry.slug}>{entry.text}</a>
                    ))}
                  </nav>
                </details>
              )}
              <div class="popover-hint">
                {folderTitle && <h1 class="resource-title">{folderTitle}</h1>}
                <Content {...props} />
              </div>
              {isLabs && <LearningLabs />}
              <div class="page-footer">
                {afterBody.map((Component) => (
                  <Component {...props} />
                ))}
              </div>
              <ReadingNext {...props} />
            </main>
            <aside class="reading-toc" aria-label="本页目录">
              {isLabs ? (
                <nav class="lab-toc">
                  <strong>本页实验</strong>
                  <a href="#softmax">温度与概率</a>
                  <a href="#attention">注意力与掩码</a>
                  <a href="#kv-cache">KV Cache 容量</a>
                </nav>
              ) : (
                right.map((Component) => <Component {...props} />)
              )}
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
