export type Skill = "files" | "uploads" | "tables"
export type Profile = {
  level: "new" | "office" | "code"
  goal: "office" | "write" | "learn" | "research" | "build"
  platform: "windows" | "mac" | "other"
  pace: "short" | "steady" | "deep"
  skills: Skill[]
}

export type RoutePhase = { title: string; reason: string; slugs: string[] }

const goals: Record<
  Profile["goal"],
  { title: string; focus: string[]; practice: string[]; result: string }
> = {
  office: {
    title: "整理资料、表格与办公文件",
    focus: [
      "guides/asking-and-iterating",
      "guides/data-workflows",
      "guides/slides-and-documents",
      "guides/workbuddy-from-zero",
    ],
    practice: ["guides/workbuddy-workflows", "guides/personal-ai-workflow"],
    result: "用练习会议记录或费用表做一份报告，核对数字、状态和结果文件。",
  },
  write: {
    title: "写得清楚，改到能用",
    focus: [
      "guides/asking-and-iterating",
      "guides/writing-and-editing",
      "guides/research-and-fact-checking",
    ],
    practice: ["guides/slides-and-documents", "guides/personal-ai-workflow"],
    result: "把一份通知或总结改到事实准确、读者看得懂，并保存最终稿。",
  },
  learn: {
    title: "让 AI 帮自己学会",
    focus: [
      "guides/asking-and-iterating",
      "guides/learning-with-ai",
      "guides/research-and-fact-checking",
    ],
    practice: ["guides/images-and-multimodal", "guides/personal-ai-workflow"],
    result: "解释一个陌生概念，做一次新练习，留下自己的错误与修正。",
  },
  research: {
    title: "查资料与比较选择",
    focus: [
      "guides/ai-tool-types",
      "guides/asking-and-iterating",
      "guides/research-and-fact-checking",
    ],
    practice: ["guides/writing-and-editing", "guides/personal-ai-workflow"],
    result: "做一张有原文出处的比较表，明确资料日期、适用条件和未知项。",
  },
  build: {
    title: "做自己的小工具",
    focus: ["guides/asking-and-iterating", "guides/choose-an-ai-agent", "guides/codex-from-zero"],
    practice: ["guides/codex-workflows", "guides/personal-ai-workflow"],
    result: "打开一个能新增、完成和导出待办的小网页，亲手核对功能与保存位置。",
  },
}

export function recommendRoute(profile: Profile): {
  heading: string
  phases: RoutePhase[]
  result: string
  note: string
} {
  const goal = goals[profile.goal]
  const foundation = ["guides/stack-and-goals"]
  if (profile.level === "new") foundation.push("guides/computer-and-os")
  if (!profile.skills.includes("files")) foundation.push("learn/03-files-and-formats")
  if (!profile.skills.includes("uploads")) foundation.push("learn/01-first-result")
  foundation.push("guides/privacy-and-cost")
  const seen = new Set<string>()
  const unique = (slugs: string[]) =>
    slugs.filter((slug) => {
      if (seen.has(slug)) return false
      seen.add(slug)
      return true
    })
  const phases = [
    {
      title: "① 先补需要的操作",
      reason: "按你选的文件与资料基础安排。熟悉的文章可做完自测后跳过，不用从头学计算机。",
      slugs: unique(foundation),
    },
    {
      title: "② 学这个任务的用法",
      reason: "从具体材料开始，照着完成第一版，再按问题修改。",
      slugs: unique(goal.focus),
    },
    {
      title: "③ 再做一次并检查",
      reason: "换一份材料重复使用，核对事实与文件，留下自己的任务卡。",
      slugs: unique(goal.practice),
    },
  ]
  const system =
    profile.platform === "windows"
      ? "操作时优先看 Windows 一栏。"
      : profile.platform === "mac"
        ? "操作时优先看 macOS 一栏。"
        : "先确认系统；纯对话与资料练习可以从浏览器开始。"
  const pace =
    profile.pace === "short"
      ? "每周不到 2 小时：这周先做第二阶段的第一项小练习，遇到操作问题再补基础。"
      : profile.pace === "steady"
        ? "每周 2–5 小时：每次做一篇的练习，再用自己的材料试一次。"
        : "每周 5 小时以上：完成第一版后，换素材、试异常，再把有效方法保存下来。"
  const tables =
    profile.goal === "office"
      ? profile.skills.includes("tables")
        ? " 你已熟悉表格，可直接练统计口径和数字核对。"
        : " 表格还不熟悉时，先用四条记录学习行、列和单位。"
      : ""
  return {
    heading: "你的路线：" + goal.title,
    phases,
    result: goal.result,
    note: system + " " + pace + tables,
  }
}
