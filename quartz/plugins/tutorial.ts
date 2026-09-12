import type { QuartzEmitterPlugin, QuartzTransformerPlugin } from "./types"
import { visit } from "unist-util-visit"
import { toString } from "hast-util-to-string"
import type { Element, Root } from "hast"
import type { FilePath } from "../util/path"
import path from "node:path"
import fs from "node:fs/promises"
import type { VFile } from "vfile"
import type { Root as MarkdownRoot } from "mdast"

type MathSource = { value: string; display: boolean }

export function collectTutorialMath(tree: MarkdownRoot, file: VFile) {
  const sources: MathSource[] = []
  visit(tree, ["math", "inlineMath", "code"], (node) => {
    const math = node as unknown as { type: string; value: string; lang?: string }
    if (math.type === "code" && math.lang !== "math") return
    sources.push({ value: math.value, display: math.type !== "inlineMath" })
  })
  file.data.tutorialMathSources = sources
}

export function annotateTutorialMath(tree: Root, file: VFile) {
  const sources = (file.data.tutorialMathSources ?? []) as MathSource[]
  const rendered: { node: Element; parent: Root | Element }[] = []
  visit(tree, "element", (node, _index, parent) => {
    if (
      node.tagName === "mjx-container" &&
      parent &&
      (parent.type === "root" || parent.type === "element")
    )
      rendered.push({ node, parent })
  })
  if (!rendered.length && !sources.length) return
  if (rendered.length !== sources.length)
    file.fail(
      `公式源码与 MathJax 数量不一致：${sources.length} 段源码 / ${rendered.length} 个公式，不能错误标注替代文本。`,
    )
  // Collect first, then insert siblings. Newly added source blocks must not be revisited as formulas.
  rendered.forEach(({ node, parent }, index) => {
    const source = sources[index]
    const svg = node.children.find(
      (child): child is Element => child.type === "element" && child.tagName === "svg",
    )
    if (!svg) file.fail("MathJax 公式缺少 SVG，无法提供可访问名称。")
    svg.properties.ariaLabel = "公式，LaTeX 原式：" + source.value.replace(/\s+/g, " ").trim()
    svg.properties.role = "img"
    if (source.display) {
      node.properties.tabIndex = 0
      node.properties.role = "region"
      node.properties.ariaLabel = "公式，可横向滚动查看"
      const details: Element = {
        type: "element",
        tagName: "details",
        properties: { className: ["math-source"] },
        children: [
          {
            type: "element",
            tagName: "summary",
            properties: {},
            children: [{ type: "text", value: "查看与复制 LaTeX 原式" }],
          },
          {
            type: "element",
            tagName: "p",
            properties: {},
            children: [
              {
                type: "text",
                value: "以下保留公式源码，可选中复制。这是 LaTeX 表达式，不是自然语言数学朗读。",
              },
            ],
          },
          {
            type: "element",
            tagName: "pre",
            properties: {},
            children: [
              {
                type: "element",
                tagName: "code",
                properties: {},
                children: [{ type: "text", value: source.value }],
              },
            ],
          },
        ],
      }
      parent.children.splice(parent.children.indexOf(node) + 1, 0, details)
    }
  })
}

// Keep learning materials in search, while exercise source files remain raw downloads.
export const TutorialDownloads: QuartzEmitterPlugin = () => ({
  name: "TutorialDownloads",
  async *emit(ctx) {
    const source = path.join(ctx.argv.directory, "downloads/workshop")
    const target = path.join(ctx.argv.output, "downloads/workshop")
    async function* copy(directory: string): AsyncGenerator<FilePath> {
      for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
        if (
          [".git", ".venv", "__pycache__", ".DS_Store"].includes(entry.name) ||
          entry.name.startsWith(".env")
        )
          continue
        const from = path.join(directory, entry.name)
        const relative = path.relative(source, from)
        if (relative.startsWith(`output${path.sep}`) && entry.name !== ".gitkeep") continue
        if (entry.isDirectory()) yield* copy(from)
        else if (entry.isFile()) {
          const to = path.join(target, relative)
          await fs.mkdir(path.dirname(to), { recursive: true })
          await fs.copyFile(from, to)
          yield to as FilePath
        }
      }
    }
    yield* copy(source)
    const noJekyll = path.join(ctx.argv.output, ".nojekyll")
    await fs.writeFile(noJekyll, "")
    yield noJekyll as FilePath
  },
})

export const TutorialReading: QuartzTransformerPlugin = () => ({
  name: "TutorialReading",
  markdownPlugins() {
    return [() => collectTutorialMath]
  },
  htmlPlugins() {
    return [
      () => (tree: Root, file: VFile) => {
        annotateTutorialMath(tree, file)
        let selfCheckCount = 0
        visit(tree, "element", (node: Element) => {
          if (node.tagName === "summary" && toString(node).includes("自测")) selfCheckCount++
          if (node.tagName !== "p") return
          const text = toString(node)
          if (text.startsWith("这一课做成什么")) node.properties.className = ["learning-outcome"]
          if (text.startsWith("完成标准")) node.properties.className = ["completion-check"]
          if (
            node.children.length === 1 &&
            node.children[0].type === "element" &&
            node.children[0].tagName === "img"
          ) {
            const image = node.children[0]
            node.tagName = "figure"
            node.properties.className = ["lesson-figure"]
            image.properties.loading = "lazy"
            node.children = [
              {
                type: "element",
                tagName: "a",
                properties: {
                  href: image.properties.src,
                  target: "_blank",
                  rel: ["noopener"],
                  className: ["diagram-link"],
                  "data-no-popover": true,
                },
                children: [image],
              },
              {
                type: "element",
                tagName: "figcaption",
                properties: {},
                children: [{ type: "text", value: "点击图示可放大查看 ↗" }],
              },
            ]
          }
        })
        if (file.data.frontmatter) file.data.frontmatter.selfCheckCount = selfCheckCount
      },
    ]
  },
})
