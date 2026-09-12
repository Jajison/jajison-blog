import { test } from "node:test"
import assert from "node:assert/strict"
import { softmax, attentionRow, cacheBytes, parseProgress } from "./learning"

const close = (actual: number, expected: number) =>
  assert.ok(Math.abs(actual - expected) < 1e-9, actual + " != " + expected)

test("softmax is stable, normalized and invariant to a common shift", () => {
  const ordinary = softmax([2, 1, 0])
  const shifted = softmax([10002, 10001, 10000])
  ordinary.forEach((n, i) => close(n, shifted[i]))
  close(
    ordinary.reduce((a, b) => a + b, 0),
    1,
  )
  close(softmax([3, 3, 3])[0], 1 / 3)
  assert.ok(softmax([2, 1, 0], 0.2)[0] > ordinary[0])
  assert.ok(softmax([2, 1, 0], 2)[0] < ordinary[0])
  assert.throws(() => softmax([1], 0))
  assert.throws(() => softmax([NaN]))
})

test("attention masks future positions and mixes V using normalized weights", () => {
  assert.deepEqual(attentionRow(0, true).weights, [1, 0, 0])
  assert.deepEqual(attentionRow(0, true).output, [1, 0])
  assert.equal(attentionRow(1, true).weights[2], 0)
  const row = attentionRow(0, false)
  const a = Math.exp(1 / Math.sqrt(2)) / (2 * Math.exp(1 / Math.sqrt(2)) + 1)
  close(row.weights[0], a)
  close(row.output[0], 4 * a)
  close(row.output[1], 2 * (1 - 2 * a) + a)
  for (const causal of [true, false])
    for (let i = 0; i < 3; i++)
      close(
        attentionRow(i, causal).weights.reduce((a, b) => a + b, 0),
        1,
      )
  assert.deepEqual(attentionRow(2, true), attentionRow(2, false))
  assert.throws(() => attentionRow(3, true))
})

test("KV estimate accounts for both K/V, grouped heads, batch, tokens and precision", () => {
  const input = {
    layers: 32,
    tokens: 4096,
    batch: 1,
    queryHeads: 32,
    kvHeads: 8,
    headDimension: 128,
    bytesPerElement: 2,
  }
  assert.equal(cacheBytes(input), 536870912)
  assert.equal(cacheBytes({ ...input, kvHeads: 32 }), 2147483648)
  assert.equal(cacheBytes({ ...input, tokens: 8192, batch: 2 }), cacheBytes(input) * 4)
  assert.equal(cacheBytes({ ...input, bytesPerElement: 1 }), cacheBytes(input) / 2)
  assert.throws(() => cacheBytes({ ...input, kvHeads: 3 }))
  assert.throws(() => cacheBytes({ ...input, tokens: -1 }))
})

test("progress restore validates its format, deduplicates and removes stale pages", () => {
  const known = ["learn/a", "guides/b"]
  assert.deepEqual(
    parseProgress({ version: 1, read: ["learn/a", "learn/a", "old"], last: "old" }, known),
    { version: 1, read: ["learn/a"], last: null },
  )
  assert.deepEqual(parseProgress({ version: 1, read: ["guides/b"], last: "guides/b" }, known), {
    version: 1,
    read: ["guides/b"],
    last: "guides/b",
  })
  for (const invalid of [
    null,
    [],
    { version: 2, read: [], last: null },
    { version: 1, read: [7], last: null },
  ])
    assert.throws(() => parseProgress(invalid, known))
})
