import { readFile } from "node:fs/promises"
import path from "node:path"
import esbuild from "esbuild"

export async function compileInlineScript(filePath) {
  const sourcefile = path.relative(process.cwd(), filePath)
  const compiled = await esbuild.build({
    stdin: {
      contents: await readFile(filePath, "utf8"),
      loader: "ts",
      resolveDir: path.dirname(filePath),
      sourcefile,
    },
    write: false,
    bundle: true,
    minify: true,
    platform: "browser",
    // Let the parser handle real import/export declarations. Text replacement
    // also damages identifiers such as exportUrls and data-progress-export.
    // Each component is a standalone script in both production and serve mode.
    format: "iife",
  })
  return compiled.outputFiles[0].text
}

export function inlineScriptLoader() {
  return {
    name: "inline-script-loader",
    setup(build) {
      build.onLoad({ filter: /\.inline\.(ts|js)$/ }, async (args) => ({
        contents: await compileInlineScript(args.path),
        loader: "text",
      }))
    },
  }
}
