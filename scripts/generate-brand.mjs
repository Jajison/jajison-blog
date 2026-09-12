import sharp from "sharp"
import { writeFile } from "node:fs/promises"
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="34" fill="#315bd6"/><text x="20" y="90" font-family="Arial,sans-serif" font-weight="700" font-size="75" fill="white" letter-spacing="-6">ai</text><path d="M82 30h22v22M103 31L79 55" fill="none" stroke="#b7f0d8" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#11151d"/><g font-family="PingFang SC,Microsoft YaHei,sans-serif"><text x="80" y="95" font-size="18" letter-spacing="3" fill="#8baeff">JAJISON / LEARN BY DOING</text><text x="76" y="248" font-weight="700" font-size="80" fill="#edf2fa">不懂代码，</text><text x="76" y="353" font-weight="700" font-size="80" fill="#8baeff">也能把 AI 用起来。</text><text x="80" y="430" font-size="27" fill="#a2aec3">从一份清楚的任务，到自己的小工具。</text><path d="M80 486h1040" stroke="#2b3647"/><text x="80" y="547" font-size="24" fill="#c4cede">20 篇短教程　 /　 3 个实战项目　 /　 零编程基础</text><circle cx="1090" cy="88" r="8" fill="#77d8bf"/></g></svg>`
await writeFile("quartz/static/icon.svg", icon)
await sharp(Buffer.from(icon)).png().toFile("quartz/static/icon.png")
await sharp(Buffer.from(social)).png().toFile("quartz/static/og-image.png")
console.log("Generated blog icon and social preview.")
