import sharp from "sharp"
import { writeFile } from "node:fs/promises"
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="34" fill="#356653"/><text x="20" y="90" font-family="Arial,sans-serif" font-weight="700" font-size="75" fill="white" letter-spacing="-6">ai</text><path d="M82 30h22v22M103 31L79 55" fill="none" stroke="#e4b98a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f7f7f0"/><g font-family="PingFang SC,Microsoft YaHei,sans-serif"><text x="80" y="95" font-size="18" letter-spacing="3" fill="#356653">JAJISON / LEARN BY DOING</text><text x="76" y="248" font-weight="700" font-size="80" fill="#25352a">不懂计算机，</text><text x="76" y="353" font-weight="700" font-size="80" fill="#356653">也能把 AI 用起来。</text><text x="80" y="430" font-size="27" fill="#697164">写作 · 查资料 · 表格 · 学习 · 文件与小工具。</text><path d="M80 486h1040" stroke="#e1e2d9"/><text x="80" y="547" font-size="24" fill="#424c40">从零操作　 /　 日常用法　 /　 Codex · WorkBuddy</text><circle cx="1090" cy="88" r="8" fill="#a97845"/></g></svg>`
await writeFile("quartz/static/icon.svg", icon)
await sharp(Buffer.from(icon)).png().toFile("quartz/static/icon.png")
await sharp(Buffer.from(social)).png().toFile("quartz/static/og-image.png")
console.log("Generated blog icon and social preview.")
