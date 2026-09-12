export function softmax(logits: number[], temperature = 1): number[] {
  if (!logits.length || logits.some((value) => !Number.isFinite(value)))
    throw new Error("分数必须是有限数字，且至少包含一个候选。")
  if (!Number.isFinite(temperature) || temperature <= 0) throw new Error("温度必须大于 0。")
  const maximum = Math.max(...logits)
  const weights = logits.map((value) => Math.exp((value - maximum) / temperature))
  const total = weights.reduce((a, b) => a + b, 0)
  return weights.map((value) => value / total)
}

// Deliberately specified numbers, not vectors obtained from a trained model.
export const attentionExample = {
  queries: [
    [1, 0],
    [0, 1],
    [1, 1],
  ],
  keys: [
    [1, 0],
    [0, 1],
    [1, 1],
  ],
  values: [
    [1, 0],
    [0, 2],
    [3, 1],
  ],
}

export function attentionRow(queryIndex: number, causal: boolean) {
  if (!Number.isInteger(queryIndex) || queryIndex < 0 || queryIndex > 2)
    throw new Error("查询位置必须是 1、2、3 之一。")
  const { queries, keys, values } = attentionExample
  const query = queries[queryIndex]
  const scores = keys.map((key) => key.reduce((sum, n, i) => sum + n * query[i], 0) / Math.sqrt(2))
  const visible = causal ? scores.slice(0, queryIndex + 1) : scores
  const weights = softmax(visible)
  while (weights.length < keys.length) weights.push(0)
  const output = [0, 1].map((d) => values.reduce((sum, value, i) => sum + weights[i] * value[d], 0))
  return { scores, weights, output }
}

export type CacheInputs = {
  layers: number
  tokens: number
  batch: number
  queryHeads: number
  kvHeads: number
  headDimension: number
  bytesPerElement: number
}

export function cacheBytes(input: CacheInputs): number {
  if (Object.values(input).some((value) => !Number.isSafeInteger(value) || value <= 0))
    throw new Error("所有参数必须是正整数。")
  if (input.kvHeads > input.queryHeads || input.queryHeads % input.kvHeads !== 0)
    throw new Error("查询头数必须能被 KV 头数整除。")
  const result =
    2 *
    input.layers *
    input.tokens *
    input.batch *
    input.kvHeads *
    input.headDimension *
    input.bytesPerElement
  if (!Number.isSafeInteger(result)) throw new Error("输入过大，无法准确计算。")
  return result
}

export type LearningProgress = { version: 1; read: string[]; last: string | null }

export function parseProgress(input: unknown, knownSlugs: readonly string[]): LearningProgress {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("进度文件必须是 JSON 对象。")
  const data = input as Record<string, unknown>
  if (
    data.version !== 1 ||
    !Array.isArray(data.read) ||
    data.read.some((slug) => typeof slug !== "string") ||
    !(data.last === null || typeof data.last === "string")
  )
    throw new Error("进度文件格式或版本不正确。")
  const known = new Set(knownSlugs)
  return {
    version: 1,
    read: [...new Set(data.read as string[])].filter((slug) => known.has(slug)),
    last: typeof data.last === "string" && known.has(data.last) ? data.last : null,
  }
}
