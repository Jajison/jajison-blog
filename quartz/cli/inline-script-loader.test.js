import test from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import vm from "node:vm"
import esbuild from "esbuild"
import { compileInlineScript, inlineScriptLoader } from "./inline-script-loader.js"

async function fixture(t, files) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "quartz-inline-test-"))
  t.after(() => rm(directory, { recursive: true, force: true }))
  for (const [name, contents] of Object.entries(files)) {
    const file = path.join(directory, name)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, contents)
  }
  return directory
}

test("compiled inline closures preserve identifiers containing export", async (t) => {
  const directory = await fixture(t, {
    "client.inline.ts": `const exportUrls = new Set<string>(["blob:one"])
      const release = () => { const snapshot = [...exportUrls]; exportUrls.clear(); return snapshot }
      exportUrls.add("blob:two")
      globalThis.actual = { released: release().join(","), remaining: exportUrls.size }`,
  })
  const compiled = await compileInlineScript(path.join(directory, "client.inline.ts"))
  const scope = {}
  vm.runInNewContext(compiled, scope)
  assert.equal(scope.actual.released, "blob:one,blob:two")
  assert.equal(scope.actual.remaining, 0)
})

test("inline loader preserves export selectors and literals through the actual outer build", async (t) => {
  const directory = await fixture(t, {
    "client.inline.ts": `globalThis.selector = "[data-progress-export]"
      globalThis.copy = "export default and export are ordinary text here"`,
    "entry.ts": `import client from "./client.inline.ts"; globalThis.clientSource = client`,
  })
  const result = await esbuild.build({
    entryPoints: [path.join(directory, "entry.ts")],
    bundle: true,
    write: false,
    minify: true,
    format: "iife",
    plugins: [inlineScriptLoader()],
  })
  const outer = {}
  vm.runInNewContext(result.outputFiles[0].text, outer)
  const browser = {}
  vm.runInNewContext(outer.clientSource, browser)
  assert.equal(browser.selector, "[data-progress-export]")
  assert.equal(browser.copy, "export default and export are ordinary text here")
})

test("compiled inline scripts support imports and real default/named exports without leaking scope", async (t) => {
  const directory = await fixture(t, {
    "with spaces/dependency.ts": `export const amount = 7; export default (n: number) => "value:" + n`,
    "with spaces/client.inline.ts": `import label, { amount } from "./dependency"
      export const exportedLabel: string = label(amount)
      export function readLabel() { return exportedLabel }
      export default readLabel
      globalThis.actual = readLabel()`,
  })
  const compiled = await compileInlineScript(path.join(directory, "with spaces/client.inline.ts"))
  const scope = {}
  vm.runInNewContext(compiled, scope)
  assert.equal(scope.actual, "value:7")
  assert.equal(scope.readLabel, undefined)
  // Serve mode wraps component scripts in a further IIFE; production executes each directly.
  const served = await esbuild.transform(`(function () {${compiled}})();`, { minify: true })
  const serveScope = {}
  vm.runInNewContext(served.code, serveScope)
  assert.equal(serveScope.actual, "value:7")
})
