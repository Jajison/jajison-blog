import { test } from "node:test"
import assert from "node:assert/strict"
import curriculum from "../../tutorial/curriculum.json"
import { recommendRoute, type Profile, type Skill } from "./advisor"

const known = new Set(curriculum.tracks.flatMap((track) => track.pages))
const main = new Set(
  curriculum.tracks.filter((track) => !track.optional).flatMap((track) => track.pages),
)
const base: Profile = {
  level: "new",
  goal: "office",
  platform: "windows",
  pace: "short",
  skills: [],
}

test("all baseline, purpose and skill combinations have valid, nonduplicate links", () => {
  for (const level of ["new", "office", "code"] as const)
    for (const goal of ["office", "write", "learn", "research", "build"] as const)
      for (let mask = 0; mask < 8; mask++) {
        const skills = (["files", "uploads", "tables"] as Skill[]).filter((_, i) => mask & (1 << i))
        const route = recommendRoute({ ...base, level, goal, skills })
        const slugs = route.phases.flatMap((phase) => phase.slugs)
        assert.equal(route.phases.length, 3)
        assert.equal(new Set(slugs).size, slugs.length)
        assert.ok(slugs.every((slug) => known.has(slug)))
        assert.ok(slugs.every((slug) => main.has(slug)))
        assert.ok(route.phases.every((phase) => phase.slugs.length > 0))
        assert.ok(route.result.length > 10)
        assert.ok(
          !slugs.some((slug) =>
            /transformer|math-for-ai|neural-networks|rag-engineering/.test(slug),
          ),
        )
      }
})

test("reported operations affect prerequisites without requiring code for office tasks", () => {
  const beginner = recommendRoute(base)
  const familiar = recommendRoute({
    ...base,
    level: "office",
    skills: ["files", "uploads", "tables"],
  })
  assert.ok(beginner.phases[0].slugs.includes("guides/computer-and-os"))
  assert.ok(beginner.phases[0].slugs.includes("learn/03-files-and-formats"))
  assert.ok(!familiar.phases[0].slugs.includes("learn/03-files-and-formats"))
  assert.ok(
    !beginner.phases.flatMap((phase) => phase.slugs).some((slug) => /python|terminal/.test(slug)),
  )
  assert.match(familiar.note, /已熟悉表格/)
})

test("purpose, operating system and time produce relevant advice", () => {
  const writing = recommendRoute({ ...base, goal: "write" })
  const building = recommendRoute({ ...base, goal: "build", platform: "mac", pace: "deep" })
  assert.ok(writing.phases[1].slugs.includes("guides/writing-and-editing"))
  assert.ok(building.phases[1].slugs.includes("guides/codex-from-zero"))
  assert.match(building.note, /macOS/)
  assert.match(building.note, /换素材/)
})
