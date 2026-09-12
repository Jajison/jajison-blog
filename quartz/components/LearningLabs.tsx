import { softmax, attentionRow, cacheBytes } from "../util/learning"

export function LearningLabs() {
  const weights = softmax([2, 1, 0])
  const cache = {
    layers: 32,
    tokens: 4096,
    batch: 1,
    queryHeads: 32,
    kvHeads: 8,
    headDimension: 128,
    bytesPerElement: 2,
  }
  return (
    <div class="learning-labs">
      <nav class="lab-jump" aria-label="实验导航">
        <a href="#softmax">01 · 温度与概率</a>
        <a href="#attention">02 · 注意力</a>
        <a href="#kv-cache">03 · KV Cache</a>
      </nav>
      <section class="lab-panel" id="softmax" aria-labelledby="softmax-title" data-lab="softmax">
        <p class="eyebrow">EXPERIMENT 01 / 概率分布</p>
        <h2 id="softmax-title">温度改变什么，又不改变什么？</h2>
        <p>
          三个候选的原始分数（logits）设为 [2, 1, 0]。先猜：温度变大后，最高分候选的概率会怎样变化？
        </p>
        <div class="lab-controls">
          <label for="temperature">
            温度 T <output id="temperature-value">1.00</output>
          </label>
          <input id="temperature" type="range" min="0.1" max="3" step="0.05" value="1" />
          <label for="logits">候选分数（英文逗号分隔，3 个数字）</label>
          <input
            id="logits"
            type="text"
            value="2, 1, 0"
            inputMode="text"
            aria-describedby="softmax-error"
          />
          <p class="input-error" id="softmax-error" role="status" />
        </div>
        <div class="probability-chart" aria-label="候选概率">
          {weights.map((weight, i) => (
            <div class="probability-row">
              <span>{"候选 " + String.fromCharCode(65 + i)}</span>
              <div class="probability-track">
                <div data-probability-bar={i} style={{ width: weight * 100 + "%" }} />
              </div>
              <output data-probability-value={i}>{(weight * 100).toFixed(2) + "%"}</output>
            </div>
          ))}
        </div>
        <p class="lab-result" id="softmax-result" aria-live="polite">
          概率总和 = 1.0000；温度不会改变最高分候选的排序。
        </p>
        <details>
          <summary>计算方法与观察任务</summary>
          <p>
            pᵢ = exp((zᵢ − max(z)) / T) / Σⱼ exp((zⱼ − max(z)) /
            T)。减去最大值用来避免指数溢出，不改变结果。
          </p>
          <ol>
            <li>把温度调到 0.1，观察最高分候选接近确定。</li>
            <li>把温度调到 3，观察分布更平缓。</li>
            <li>把分数改成 2, 2, 2，观察任何温度下都为 1/3。</li>
          </ol>
          <p>
            这里计算完整 softmax，未加入 top-k、top-p 或实际随机采样。T = 0
            不在公式定义域；实际接口可能把它解释为贪心解码。概率高不等于事实正确。
          </p>
        </details>
      </section>
      <section
        class="lab-panel"
        id="attention"
        aria-labelledby="attention-title"
        data-lab="attention"
      >
        <p class="eyebrow">EXPERIMENT 02 / 信息组合</p>
        <h2 id="attention-title">逐行看懂注意力与因果掩码</h2>
        <p>
          教学设定：Q = K = [[1, 0], [0, 1], [1, 1]]，V = [[1, 0], [0, 2], [3, 1]]，单头维度 dₖ =
          2。数字由我们指定，没有对应真实词语，也不是从模型中提取的权重。
        </p>
        <div class="lab-controls inline-controls">
          <label for="query-position">
            查询位置
            <select id="query-position">
              <option value="0">位置 1 · [1, 0]</option>
              <option value="1">位置 2 · [0, 1]</option>
              <option value="2">位置 3 · [1, 1]</option>
            </select>
          </label>
          <label class="check-control">
            <input id="causal-mask" type="checkbox" checked />
            启用因果掩码
          </label>
        </div>
        <div
          class="table-scroll"
          tabIndex={0}
          role="region"
          aria-label="注意力权重矩阵，可横向滚动"
        >
          <table class="attention-matrix">
            <caption>行是查询 Q，列是键 K；每行权重之和为 1。</caption>
            <thead>
              <tr>
                <th scope="col">查询 → 键</th>
                <th scope="col">位置 1</th>
                <th scope="col">位置 2</th>
                <th scope="col">位置 3</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2].map((row) => (
                <tr data-attention-row={row} class={row === 0 ? "selected-query" : ""}>
                  <th scope="row">{"位置 " + (row + 1)}</th>
                  {attentionRow(row, true).weights.map((w, col) => (
                    <td data-attention-cell={row + "-" + col} style={{ "--weight": w }}>
                      {col > row ? "屏蔽 · 0" : w.toFixed(4)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div class="calculation-steps" aria-live="polite">
          <p>
            <strong>① 缩放后的分数</strong>
            <output id="attention-scores">[0.7071, 0.0000, 0.7071]</output>
          </p>
          <p>
            <strong>② 掩码后 softmax</strong>
            <output id="attention-weights">[1.0000, 0.0000, 0.0000]</output>
          </p>
          <p>
            <strong>③ 按权重组合 V</strong>
            <output id="attention-output">[1.0000, 0.0000]</output>
          </p>
        </div>
        <details>
          <summary>自己验证一次</summary>
          <p>
            关闭掩码、选择位置 1：权重约为 [0.4011, 0.1978, 0.4011]；输出约为 [1.6044,
            0.7967]。第一维是 0.4011 × 1 + 0.1978 × 0 + 0.4011 × 3。
          </p>
          <p>
            再打开掩码：位置 1 只能看到自己，因此输出等于第一个 V，即 [1, 0]。位置 3
            已能看到全部三个位置，开关掩码不会改变这一行。
          </p>
          <p>
            本实验省略了可训练投影、位置编码、多头、残差与前馈层。高注意力权重只说明该层这一行的信息组合，不能直接当作事实证据或完整因果解释。
          </p>
        </details>
      </section>
      <section class="lab-panel" id="kv-cache" aria-labelledby="kv-title" data-lab="cache">
        <p class="eyebrow">EXPERIMENT 03 / 推理资源</p>
        <h2 id="kv-title">上下文变长，KV Cache 增长多少？</h2>
        <p>
          计算常规全注意力 MHA / GQA / MQA 的 K、V
          张量理论容量。默认参数为教学设定，不对应某个型号或真实显存测量。
        </p>
        <div class="cache-grid">
          {[
            ["layers", "层数 L", 32, 1, 256],
            ["tokens", "缓存 token 数 T", 4096, 1, 1048576],
            ["batch", "同时运行的序列数 B", 1, 1, 1024],
            ["queryHeads", "查询头数 hq", 32, 1, 256],
            ["kvHeads", "KV 头数 hkv", 8, 1, 256],
            ["headDimension", "每个头的维度 dh", 128, 1, 1024],
          ].map(([key, label, value, min, max]) => (
            <label for={"cache-" + key}>
              {label}
              <input
                id={"cache-" + key}
                data-cache-field={key}
                type="number"
                min={min}
                max={max}
                step="1"
                value={value}
              />
            </label>
          ))}
          <label for="cache-bytesPerElement">
            每个元素的字节数 s
            <select id="cache-bytesPerElement" data-cache-field="bytesPerElement">
              <option value="2">2 字节 · FP16 / BF16</option>
              <option value="4">4 字节 · FP32</option>
              <option value="1">1 字节 · 理想化 8-bit 存储</option>
            </select>
          </label>
        </div>
        <p class="input-error" id="cache-error" role="status" />
        <div class="cache-result" aria-live="polite">
          <div>
            <span>KV 张量容量</span>
            <output id="cache-gib">{(cacheBytes(cache) / 2 ** 30).toFixed(3) + " GiB"}</output>
          </div>
          <div>
            <span>同参数改用 MHA（hkv = hq）</span>
            <output id="cache-mha">2.000 GiB</output>
          </div>
        </div>
        <p class="lab-formula">字节数 = 2 × L × T × B × hkv × dh × s</p>
        <p class="lab-result" id="cache-detail">
          2 × 32 × 4096 × 1 × 8 × 128 × 2 = 536,870,912 字节。
        </p>
        <details>
          <summary>公式假设与不可据此推断的内容</summary>
          <p>
            2 表示 K 和 V 各一份；每个序列按相同长度缓存；各层使用相同头数与维度。1 GiB = 2³⁰
            字节，1 GB = 10⁹ 字节。
          </p>
          <p>
            此数值不含模型权重、激活、临时缓冲、分配器碎片、量化尺度及运行时开销；没有模拟前缀共享、滑动窗口、卸载、张量并行或
            MLA 特殊缓存。不能用它承诺某台电脑一定能运行模型。
          </p>
          <p>
            先将 T 翻倍，再将 B 翻倍，结果应分别翻倍。固定其余参数，将 hkv 从 32 改成 8，再改成
            1，比较 MHA / GQA / MQA 的理论缓存比例。
          </p>
        </details>
      </section>
      <noscript>
        <p class="input-error">
          当前未启用 JavaScript，显示的是默认参数的计算结果。开启后可调节控件。
        </p>
      </noscript>
    </div>
  )
}
