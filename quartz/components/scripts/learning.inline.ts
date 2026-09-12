import {
  softmax,
  attentionRow,
  cacheBytes,
  parseProgress,
  LearningProgress,
  CacheInputs,
} from "../../util/learning"

const storageKey = "jajison-learning-v1"
let memory: LearningProgress | null = null
let storageBlocked = false

document.addEventListener("nav", () => {
  const root = document.getElementById("learning-data")
  if (!root) return
  const catalog = JSON.parse(root.dataset.catalog ?? "[]") as {
    slug: string
    title: string
    href: string
  }[]
  const known = catalog.map((item) => item.slug)
  const current = root.dataset.current ?? ""
  const controller = new AbortController()
  const signal = controller.signal
  const exportUrls = new Set<string>()
  const releaseExports = () => {
    for (const url of exportUrls) URL.revokeObjectURL(url)
    exportUrls.clear()
  }
  window.addCleanup(() => {
    controller.abort()
    releaseExports()
  })
  document.documentElement.classList.add("learning-ready")
  const text = (selector: string, value: string) =>
    document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      element.textContent = value
    })
  const notice = (value: string) => text("[data-progress-notice]", value)
  if (memory === null) {
    memory = { version: 1, read: [], last: null }
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored !== null) memory = parseProgress(JSON.parse(stored), known)
    } catch {
      storageBlocked = true
    }
  }
  let progress = parseProgress(memory, known)
  const refresh = () => {
    if (storageBlocked) return
    try {
      const raw = localStorage.getItem(storageKey)
      progress =
        raw === null ? { version: 1, read: [], last: null } : parseProgress(JSON.parse(raw), known)
      memory = progress
    } catch {
      storageBlocked = true
    }
  }
  const save = () => {
    memory = progress
    if (!storageBlocked) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(progress))
      } catch {
        storageBlocked = true
      }
    }
    if (storageBlocked)
      notice("浏览器存储不可用或原记录损坏。当前标记仅在本次浏览中保留，请导出进度。")
  }

  const applyFilters = () => {
    const query = (document.querySelector<HTMLInputElement>("#course-filter")?.value ?? "")
      .trim()
      .toLocaleLowerCase()
    const track = document.querySelector<HTMLSelectElement>("#track-filter")?.value ?? ""
    const onlyUnread = document.querySelector<HTMLInputElement>("#unread-filter")?.checked ?? false
    let visible = 0
    document.querySelectorAll<HTMLElement>("[data-course-entry]").forEach((entry) => {
      const show =
        (!query || (entry.dataset.search ?? "").toLocaleLowerCase().includes(query)) &&
        (!track || entry.dataset.track === track) &&
        (!onlyUnread || !progress.read.includes(entry.dataset.courseEntry!))
      entry.hidden = !show
      if (show) visible++
    })
    document.querySelectorAll<HTMLElement>("[data-track-entry]").forEach((group) => {
      group.hidden = !Array.from(group.querySelectorAll<HTMLElement>("[data-course-entry]")).some(
        (entry) => !entry.hidden,
      )
    })
    text("[data-filter-count]", "显示 " + visible + " / " + known.length + " 篇")
    const empty = document.querySelector<HTMLElement>("[data-filter-empty]")
    if (empty) empty.hidden = visible !== 0
  }
  const update = () => {
    text("[data-progress-summary]", "已读 " + progress.read.length + " / " + known.length + " 篇")
    document.querySelectorAll<HTMLProgressElement>("[data-progress-bar]").forEach((bar) => {
      bar.value = progress.read.length
    })
    document.querySelectorAll<HTMLElement>("[data-page-slug]").forEach((item) => {
      const read = progress.read.includes(item.dataset.pageSlug!)
      item.classList.toggle("is-read", read)
      const marker = item.querySelector<HTMLElement>("[data-read-marker]")
      if (marker) {
        marker.textContent = read ? "已读" : ""
        marker.setAttribute("aria-label", read ? "已读" : "未标记")
      }
    })
    document.querySelectorAll<HTMLButtonElement>("[data-mark-read]").forEach((button) => {
      const read = progress.read.includes(current)
      button.textContent = read ? "已读 · 点击取消" : "标记为已读"
      button.setAttribute("aria-pressed", String(read))
    })
    const last = catalog.find((item) => item.slug === progress.last)
    document.querySelectorAll<HTMLAnchorElement>("[data-resume-reading]").forEach((link) => {
      link.hidden = !last
      if (last) {
        link.href = last.href
        link.textContent = "继续阅读：" + last.title
      }
    })
    applyFilters()
  }
  refresh()
  if (known.includes(current)) {
    progress.last = current
    save()
  }
  if (storageBlocked) save()
  update()
  window.addEventListener(
    "storage",
    (event) => {
      if (event.key !== storageKey && event.key !== null) return
      refresh()
      if (storageBlocked) save()
      update()
    },
    { signal },
  )

  document.querySelectorAll<HTMLButtonElement>("[data-mark-read]").forEach((button) =>
    button.addEventListener(
      "click",
      () => {
        if (!known.includes(current)) return
        refresh()
        progress.read = progress.read.includes(current)
          ? progress.read.filter((slug) => slug !== current)
          : [...progress.read, current]
        save()
        update()
      },
      { signal },
    ),
  )
  document.querySelectorAll<HTMLButtonElement>("[data-progress-export]").forEach((button) =>
    button.addEventListener(
      "click",
      () => {
        notice("正在生成进度备份…")
        let hasBackup = false
        let link: HTMLAnchorElement | null = null
        try {
          refresh()
          update()
          const snapshot = JSON.stringify(progress, null, 2) + "\n"
          const backup = document.createElement("details")
          backup.dataset.progressBackup = ""
          backup.className = "progress-backup"
          const heading = document.createElement("summary")
          heading.textContent = "下载未开始？查看并复制 JSON 备份"
          const instruction = document.createElement("p")
          instruction.textContent =
            "以下内容与本次下载文件完全相同。可以选中复制，保存为 jajison-reading-progress.json；恢复时会合并已读标记。"
          const pre = document.createElement("pre")
          pre.tabIndex = 0
          pre.setAttribute("aria-label", "本次阅读进度 JSON 备份，可选中复制")
          pre.style.maxHeight = "18rem"
          pre.style.overflow = "auto"
          const code = document.createElement("code")
          code.textContent = snapshot
          pre.append(code)
          backup.append(heading, instruction, pre)
          document.querySelector("[data-progress-backup]")?.remove()
          const position = document.querySelector("[data-progress-notice]") ?? button.parentElement
          position?.after(backup)
          hasBackup = backup.isConnected
          releaseExports()
          const url = URL.createObjectURL(new Blob([snapshot], { type: "application/json" }))
          exportUrls.add(url)
          const retry = document.createElement("a")
          retry.href = url
          retry.download = "jajison-reading-progress.json"
          retry.dataset.routerIgnore = ""
          retry.textContent = "再次保存 JSON 文件"
          backup.append(retry)
          link = document.createElement("a")
          link.href = url
          link.download = retry.download
          link.dataset.routerIgnore = ""
          link.hidden = true
          document.body.append(link)
          link.click()
          notice("已请求下载进度文件，请在浏览器下载列表确认。若未开始，可展开下方备份复制 JSON。")
        } catch (error) {
          const reason = error instanceof Error ? error.message : "浏览器未能发起下载"
          notice(
            "未能自动下载进度：" +
              reason +
              (hasBackup ? "。可展开下方备份，复制同一份 JSON。" : "。已有进度未被修改。"),
          )
        } finally {
          link?.remove()
        }
      },
      { signal },
    ),
  )
  document.querySelectorAll<HTMLInputElement>("[data-progress-import]").forEach((input) =>
    input.addEventListener(
      "change",
      async () => {
        const file = input.files?.[0]
        if (!file) return
        try {
          if (file.size > 1024 * 1024) throw new Error("进度文件不应超过 1 MB。")
          const imported = parseProgress(JSON.parse(await file.text()), known)
          if (signal.aborted) return
          refresh()
          progress = {
            version: 1,
            read: [...new Set([...progress.read, ...imported.read])],
            last: imported.last ?? progress.last,
          }
          storageBlocked = false
          notice("已合并恢复 " + imported.read.length + " 篇已读标记，原有标记保留。")
          save()
          update()
        } catch (error) {
          if (signal.aborted) return
          notice("未修改已有进度：" + (error instanceof Error ? error.message : "无法读取文件。"))
        } finally {
          input.value = ""
        }
      },
      { signal },
    ),
  )
  for (const id of ["course-filter", "track-filter", "unread-filter"])
    document.getElementById(id)?.addEventListener("input", applyFilters, { signal })

  const temperature = document.querySelector<HTMLInputElement>("#temperature")
  const logits = document.querySelector<HTMLInputElement>("#logits")
  if (temperature && logits) {
    const compute = () => {
      try {
        const parts = logits.value.split(/[,，]/).map((value) => value.trim())
        const values = parts.map(Number)
        if (
          parts.length !== 3 ||
          parts.some((value) => !value) ||
          values.some((value) => !Number.isFinite(value) || Math.abs(value) > 1e6)
        )
          throw new Error("请输入 3 个有限数字，用逗号分隔，绝对值不超过 1,000,000。")
        const t = Number(temperature.value)
        const weights = softmax(values, t)
        text("#softmax-error", "")
        logits.removeAttribute("aria-invalid")
        text("#temperature-value", t.toFixed(2))
        weights.forEach((weight, i) => {
          const bar = document.querySelector<HTMLElement>('[data-probability-bar="' + i + '"]')
          if (bar) bar.style.width = weight * 100 + "%"
          text('[data-probability-value="' + i + '"]', (weight * 100).toFixed(2) + "%")
        })
        text(
          "#softmax-result",
          "概率总和 = " +
            weights.reduce((a, b) => a + b, 0).toFixed(4) +
            "；温度改变集中程度，不改变分数排序。",
        )
      } catch (error) {
        text("#softmax-error", (error as Error).message + " 图表保留上一次有效结果。")
        logits.setAttribute("aria-invalid", "true")
      }
    }
    temperature.addEventListener("input", compute, { signal })
    logits.addEventListener("input", compute, { signal })
    compute()
  }
  const query = document.querySelector<HTMLSelectElement>("#query-position")
  const mask = document.querySelector<HTMLInputElement>("#causal-mask")
  if (query && mask) {
    const compute = () => {
      const selected = Number(query.value)
      for (let row = 0; row < 3; row++) {
        document
          .querySelector('[data-attention-row="' + row + '"]')
          ?.classList.toggle("selected-query", row === selected)
        attentionRow(row, mask.checked).weights.forEach((weight, col) => {
          const cell = document.querySelector<HTMLElement>(
            '[data-attention-cell="' + row + "-" + col + '"]',
          )
          if (!cell) return
          cell.textContent = mask.checked && col > row ? "屏蔽 · 0" : weight.toFixed(4)
          cell.style.setProperty("--weight", String(weight))
        })
      }
      const result = attentionRow(selected, mask.checked)
      const vector = (values: number[]) =>
        "[" + values.map((value) => value.toFixed(4)).join(", ") + "]"
      text("#attention-scores", vector(result.scores))
      text("#attention-weights", vector(result.weights))
      text("#attention-output", vector(result.output))
    }
    query.addEventListener("change", compute, { signal })
    mask.addEventListener("change", compute, { signal })
    compute()
  }
  const cacheFields = Array.from(
    document.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-cache-field]"),
  )
  if (cacheFields.length) {
    const compute = () => {
      try {
        const input = {} as CacheInputs
        for (const field of cacheFields) {
          if (!field.value || !field.validity.valid)
            throw new Error("请在标注范围内填写完整的正整数参数。")
          input[field.dataset.cacheField as keyof CacheInputs] = Number(field.value)
        }
        const bytes = cacheBytes(input)
        const mha = cacheBytes({ ...input, kvHeads: input.queryHeads })
        text("#cache-error", "")
        text("#cache-gib", (bytes / 2 ** 30).toFixed(3) + " GiB")
        text("#cache-mha", (mha / 2 ** 30).toFixed(3) + " GiB")
        text(
          "#cache-detail",
          [
            2,
            input.layers,
            input.tokens,
            input.batch,
            input.kvHeads,
            input.headDimension,
            input.bytesPerElement,
          ].join(" × ") +
            " = " +
            bytes.toLocaleString("zh-CN") +
            " 字节（" +
            (bytes / 1e9).toFixed(3) +
            " GB）。",
        )
      } catch (error) {
        text("#cache-error", (error as Error).message)
        text("#cache-gib", "—")
        text("#cache-mha", "—")
        text("#cache-detail", "修正输入后重新计算。")
      }
    }
    cacheFields.forEach((field) => field.addEventListener("input", compute, { signal }))
    compute()
  }
})
