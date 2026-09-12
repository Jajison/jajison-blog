import test from "node:test"
import assert from "node:assert/strict"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { Latex } from "@quartz-community/latex"
import { VFile } from "vfile"
import { visit } from "unist-util-visit"
import type { Element, Root } from "hast"
import type { BuildCtx } from "../util/ctx"
import { annotateTutorialMath, TutorialReading } from "./tutorial"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import { Fragment, jsx, jsxs } from "preact/jsx-runtime"
import { render } from "preact-render-to-string"

test("MathJax labels retain inline/display order and source blocks cannot inject markup", async () => {
  const source = String.raw`An inline $x<y$ formula.

$$
\begin{matrix}1&2\\3&4\end{matrix} \quad x>0 \quad \text{<script>}
$$

The paragraph after the equation must remain ordinary prose.
`
  const ctx = {} as BuildCtx
  const latex = Latex({ renderEngine: "mathjax" })
  const reading = TutorialReading()
  const processor = unified()
    .use(remarkParse)
    .use(latex.markdownPlugins!(ctx))
    .use(reading.markdownPlugins!(ctx))
    .use(remarkRehype)
    .use(latex.htmlPlugins!(ctx))
    .use(reading.htmlPlugins!(ctx))
  const file = new VFile(source)
  const tree = (await processor.run(processor.parse(file), file)) as Root
  const images: Element[] = [],
    blocks: Element[] = [],
    scripts: Element[] = []
  visit(tree, "element", (node) => {
    if (node.tagName === "svg") images.push(node)
    if (node.tagName === "details") blocks.push(node)
    if (node.tagName === "script") scripts.push(node)
    assert.notEqual(node.properties["data-mml-node"], "merror")
  })
  assert.equal(images.length, 2)
  assert.equal(images[0].properties.ariaLabel, "公式，LaTeX 原式：x<y")
  assert.match(String(images[1].properties.ariaLabel), /1&2/)
  assert.equal(blocks.length, 1)
  const equationPosition = tree.children.findIndex(
    (node) => node.type === "element" && node.tagName === "mjx-container",
  )
  assert.equal(tree.children[equationPosition + 1], blocks[0])
  assert.equal(scripts.length, 0)
  const markup = render(toJsxRuntime(tree, { Fragment, jsx, jsxs }))
  assert.match(markup, /&lt;script(?:>|&gt;)/)
  assert.match(markup, /1&amp;2/)
  assert.match(markup, /x(?:>|&gt;)0/)
  assert.match(markup, /<p>The paragraph after the equation must remain ordinary prose\.<\/p>/)
})

test("MathJax source/render count mismatches fail instead of assigning the wrong formula name", () => {
  const file = new VFile()
  file.data.tutorialMathSources = [{ value: "x", display: false }]
  const tree: Root = { type: "root", children: [] }
  assert.throws(() => annotateTutorialMath(tree, file), /数量不一致/)
})
