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
  MessageCircle,
  PenLine,
  Sparkles,
  FileText,
  GraduationCap,
  Table2,
} from "lucide-preact"
import { LearningLabs } from "./LearningLabs"
// @ts-ignore bundled as a client script by Quartz
import learningScript from "./scripts/learning.inline"

const tracks = curriculum.tracks
const slugs = tracks.flatMap((track) => track.pages)
const icons: Record<string, typeof Monitor> = {
  start: Monitor,
  orientation: Route,
  daily: BookOpen,
  office: Layers3,
  "harness-practice": Check,
  workspace: Code2,
  build: GitBranch,
  foundations: Braces,
  models: Cpu,
  retrieval: Search,
  agents: Network,
  quality: ShieldCheck,
}
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
      <small>写给每一个想把 AI 用好的人</small>
    </span>
  </a>
)
TutorialBrand.afterDOMLoaded = learningScript

export const TutorialNav: QuartzComponent = (props) => (
  <nav class="top-nav" aria-label="主导航">
    {[
      ["guides/choose-an-ai-agent", "认识 AI 工具"],
      ["#courses", "学点实用的"],
      ["#track-harness-practice", "工具实战"],
      ["troubleshooting", "遇到问题"],
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
            {track.optional && <small class="optional-label">按需</small>}
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
        首页
      </a>
      <span>/</span>
      <span>{track?.title ?? (slug === "labs" ? "原理实验室" : "学习资源")}</span>
      {track?.optional && <span class="optional-label">按需拓展 · 不必先学</span>}
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
      <strong>慢慢学，一起把 AI 用起来。</strong>
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
            <span class="status-dot" /> 从好奇开始，从一件小事上手
          </p>
          <h1 id="hero-title">
            AI 很新，
            <br />
            <em>你可以慢慢学。</em>
          </h1>
          <p class="hero-description">
            不需要懂代码，也不用先记一堆术语。
            <br class="desktop-break" />
            从写一封邮件、看懂一份材料开始， 把 AI 变成生活和工作里用得上的帮手。
          </p>
          <div class="hero-actions">
            <a class="button primary internal" href={href(props, "guides/choose-an-ai-agent")}>
              先认识常用 AI 工具 <ArrowRight size={16} />
            </a>
            <a class="button secondary internal" href={href(props, "#learning-advisor")}>
              <Route size={17} /> 找到适合我的用法
            </a>
          </div>
          <a
            class="resume-link internal enhanced-only"
            href={href(props, "start")}
            data-resume-reading
            hidden
          />
        </div>
        <div class="hero-story" aria-label="一封邮件的使用示例">
          <div class="story-top">
            <span>
              <Sparkles size={16} /> 一个日常小例子
            </span>
            <span>01 / 写邮件</span>
          </div>
          <div class="story-note">
            <span class="story-avatar">
              <PenLine size={18} />
            </span>
            <p>
              想请同事周五前交材料，
              <br />
              怎么说得清楚，又不生硬？
            </p>
          </div>
          <div class="story-reply">
            <span class="micro-label">先说清楚，再一起修改</span>
            <p>
              给 AI 背景、时间和收件人，
              <br />
              请它先写一版；再把不自然的句子改掉。
            </p>
            <div class="story-paper">
              <span>主题：请于周五前补充活动材料</span>
              <p>大家好，为了整理本次活动……</p>
              <span class="paper-line" />
              <span class="paper-line short" />
            </div>
          </div>
          <a class="internal story-link" href={href(props, "guides/writing-and-editing")}>
            跟着把这封邮件写好 <ArrowRight size={16} />
          </a>
          <span class="story-stamp">
            从“听说过”
            <br />
            到“我会用”
          </span>
        </div>
      </section>
      <section class="home-section everyday-section" aria-labelledby="everyday-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">先从你关心的事开始</p>
            <h2 id="everyday-title">今天，想让 AI 帮你做什么？</h2>
          </div>
          <a class="text-link internal" href={href(props, "start")}>
            第一次来？读这份指引 <ArrowRight size={16} />
          </a>
        </div>
        <div class="everyday-grid">
          {[
            [
              PenLine,
              "guides/writing-and-editing",
              "写得更清楚",
              "邮件、总结、简历，先写一版，再改成自己的话。",
            ],
            [
              Search,
              "guides/research-and-fact-checking",
              "查明白一件事",
              "找资料、比选择，学会顺着出处核对。",
            ],
            [
              GraduationCap,
              "guides/learning-with-ai",
              "学会新东西",
              "从听懂解释到自己做一遍，让 AI 陪你练。",
            ],
            [
              Table2,
              "guides/data-workflows",
              "理顺表格和数据",
              "从四条记录开始，把数字、单位和结论弄清楚。",
            ],
            [
              FileText,
              "guides/slides-and-documents",
              "做好文档和演示",
              "从零散材料到一份别人看得懂的报告。",
            ],
            [
              Code2,
              "guides/codex-from-zero",
              "做一个自己的工具",
              "说清想法，用 Codex 做出可以打开的小网页。",
            ],
          ].map(([Icon, slug, heading, description]) => {
            const TaskIcon = Icon as typeof PenLine
            return (
              <a class="everyday-card internal" href={href(props, String(slug))}>
                <span class="everyday-icon">
                  <TaskIcon size={23} />
                </span>
                <h3>{heading}</h3>
                <p>{description}</p>
                <ArrowUpRight class="everyday-arrow" size={17} />
              </a>
            )
          })}
        </div>
        <a class="tools-feature internal" href={href(props, "guides/choose-an-ai-agent")}>
          <span class="tools-feature-icon">
            <MessageCircle size={27} />
          </span>
          <div>
            <span class="micro-label">不知道这些工具有什么区别？</span>
            <h3>带你了解常用 AI 工具</h3>
            <p>
              豆包、DeepSeek、ChatGPT、Gemini、Claude，还有会处理文件的助手。先认识，再选，再用。
            </p>
          </div>
          <ArrowRight size={22} />
        </a>
      </section>
      <details class="advisor home-section" id="learning-advisor">
        <summary class="advisor-invitation">
          <span class="advisor-invitation-icon">
            <Route size={24} />
          </span>
          <span>
            <strong id="advisor-title">还不确定从哪开始？为自己选一条路线</strong>
            <small>告诉我你的基础、目的和时间，几项选择就好。</small>
          </span>
          <span class="advisor-toggle">
            选择路线 <span aria-hidden="true">＋</span>
          </span>
        </summary>
        <div class="advisor-body">
          <div class="section-heading">
            <div>
              <h2>按自己的节奏来</h2>
            </div>
          </div>
          <p class="section-intro">
            按你熟悉的操作和想做的事推荐，不要求会编程。这些选择只在浏览器中处理；建议是起点参考，可以随时改选。
          </p>
          <form id="learning-profile" class="advisor-form enhanced-only">
            <label>
              目前最接近你的基础
              <select name="level" required>
                <option value="new">刚接触电脑文件、安装和 AI</option>
                <option value="office">熟悉电脑和办公软件，没写过代码</option>
                <option value="code">会一些开发工具，可以跳过电脑基础</option>
              </select>
            </label>
            <label>
              最想实现的目标
              <select name="goal" required>
                <option value="office">整理资料、表格、报告与 PPT</option>
                <option value="write">写邮件、总结、文章或简历</option>
                <option value="learn">学新知识、练语言与复习</option>
                <option value="research">查资料、比较选择与核对事实</option>
                <option value="build">做自己的小网页或工作工具</option>
              </select>
            </label>
            <label>
              主要使用的系统
              <select name="platform" required>
                <option value="windows">Windows</option>
                <option value="mac">macOS</option>
                <option value="other">Linux / 暂不确定</option>
              </select>
            </label>
            <label>
              每周可投入的时间
              <select name="pace" required>
                <option value="short">不到 2 小时</option>
                <option value="steady">2–5 小时</option>
                <option value="deep">5 小时以上</option>
              </select>
            </label>
            <fieldset class="advisor-skills">
              <legend>哪些操作已经熟悉？（可多选，也可以不选）</legend>
              <label>
                <input type="checkbox" name="skills" value="files" />
                找到下载文件，建立文件夹
              </label>
              <label>
                <input type="checkbox" name="skills" value="uploads" />给 AI 上传或粘贴相关资料
              </label>
              <label>
                <input type="checkbox" name="skills" value="tables" />
                查看表格，核对行列和金额
              </label>
            </fieldset>
            <button type="submit" class="button primary">
              生成我的学习路线 <ArrowRight size={16} />
            </button>
          </form>
          <noscript>
            <p>
              当前浏览器未运行页面脚本，可以直接用
              <a class="internal" href={href(props, "start")}>
                用途与学习起点表
              </a>
              选择路线。
            </p>
          </noscript>
          <div id="advisor-result" class="advisor-result" role="status" aria-live="polite" hidden />
        </div>
      </details>
      <section class="home-section" id="courses" aria-labelledby="courses-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">慢慢展开你的用法</p>
            <h2 id="courses-title">一本可以按需翻阅的 AI 使用手册</h2>
          </div>
          <a class="text-link internal" href={href(props, "start")}>
            阅读路线说明 <ArrowRight size={16} />
          </a>
        </div>
        <p class="section-intro">
          从认识工具，到聊清楚需求，再到真正完成工作。前五章不要求编程；每篇都有例子和练习，读完一篇，用一次就好。
        </p>
        <div class="course-toolbar enhanced-only">
          <label class="filter-search">
            <Search size={17} />
            <input
              id="course-filter"
              type="search"
              placeholder="找用法：写作、表格、Codex、WorkBuddy…"
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
            匹配 {slugs.length} / {slugs.length} 篇
          </span>
        </div>
        <ProgressTools />
        <p class="progress-notice" data-progress-notice role="status" />
        <div class="curriculum">
          {tracks.map((track, index) => {
            const Icon = icons[track.id] ?? BookOpen
            const section = (
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
                      {String(index + 1).padStart(2, "0")} / {track.level} · {track.pages.length} 篇
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
                              {track.optional ? "按需阅读" : "含动手练习"}
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
            return track.optional ? (
              <details class="optional-track" data-optional-track>
                <summary>
                  <span>按需拓展</span>
                  {track.title}
                  <small>{track.pages.length} 篇 · 想做工具或了解原理时再读</small>
                </summary>
                {section}
              </details>
            ) : (
              section
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
            <p class="eyebrow">读过之后，亲手试试</p>
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
              "guides/data-workflows",
              "把一份小表格变成可核对的报告",
              "说明统计范围，整理四条费用，再检查金额、状态与结果文件。",
              "表格软件 + 可用的 AI 工具",
            ],
            [
              "03",
              "guides/codex-from-zero",
              "做一个自己能用的待办小网页",
              "说清需求，让 Codex 帮你做出来，再亲手检查新增、完成与导出。",
              "Codex · 独立练习文件夹",
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
      <div class="knowledge-stats" aria-label="手册内容">
        <span>
          <strong>{slugs.length}</strong> 篇文章
        </span>
        <span>
          <strong>{tracks.length}</strong> 条路线
        </span>
        <span>
          <strong>{questions}</strong> 道自测
        </span>
        <span>持续补充 · 一起慢慢学</span>
      </div>
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
              <small>
                {i === 0
                  ? "← 路线上一篇"
                  : tracks.find((track) => track.pages.includes(slugs[next]))?.optional
                    ? "按需拓展：路线下一篇 →"
                    : "路线下一篇 →"}
              </small>
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
                <ReadingContext {...props} />
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
