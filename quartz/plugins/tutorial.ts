import type { QuartzEmitterPlugin, QuartzTransformerPlugin } from "./types"
import { visit } from "unist-util-visit"
import { toString } from "hast-util-to-string"
import type { Element, Root } from "hast"
import type { FilePath } from "../util/path"
import path from "node:path"
import fs from "node:fs/promises"

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
  htmlPlugins() {
    return [
      () => (tree: Root) => {
        visit(tree, "element", (node: Element) => {
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
      },
    ]
  },
})
