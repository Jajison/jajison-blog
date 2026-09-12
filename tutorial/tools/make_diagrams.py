"""生成本教程独立绘制的 SVG 解释图，无网络与第三方依赖。"""
from html import escape
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "content/assets"
INK, MUTED, BLUE, GREEN = "#1b2537", "#526078", "#315bd6", "#137a65"


def text(x, y, value, size=22, fill=INK, weight=400):
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" font-weight="{weight}">{escape(value)}</text>'


def box(x, y, w, h, label, lines, color=BLUE):
    out = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="18" fill="white" stroke="#dbe1ee"/>'
    out += f'<rect x="{x+18}" y="{y+22}" width="5" height="25" rx="2" fill="{color}"/>'
    out += text(x+36,y+44,label,23,color,700)
    for i, line in enumerate(lines):
        out += text(x+24,y+79+i*29,line,18,MUTED)
    return out


def arrow(x1,y1,x2,y2):
    return f'<path d="M{x1} {y1} L{x2} {y2}" fill="none" stroke="#7b8ba8" stroke-width="2.5" marker-end="url(#arrow)"/>'


def save(name,title,subtitle,body,height=500,caption="Jajison · 把 AI 用起来 / 原创示意图"):
    ROOT.mkdir(parents=True,exist_ok=True)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 {height}" role="img" aria-labelledby="title desc">
<title id="title">{escape(title)}</title><desc id="desc">{escape(subtitle.rstrip('。')+'。'+caption)}</desc>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#7b8ba8"/></marker></defs>
<rect width="860" height="{height}" rx="24" fill="#f7f8fc"/>
<g font-family="system-ui, -apple-system, PingFang SC, Microsoft YaHei, sans-serif">
{text(30,43,title,29,INK,700)}{text(30,78,subtitle,18,MUTED)}
{body}
{text(30,height-22,caption,15,MUTED)}
</g></svg>'''
    (ROOT/name).write_text(svg+'\n',encoding='utf-8')


body=''
tracks = json.loads((Path(__file__).resolve().parents[1] / 'curriculum.json').read_text(encoding='utf-8'))['tracks']
rows = [(f'{i+1:02d}', track['title'], track['description']) for i, track in enumerate(tracks)]
for i,(n,title,desc) in enumerate(rows):
    y=112+i*95
    body+=f'<rect x="30" y="{y}" width="800" height="80" rx="16" fill="white" stroke="#dbe1ee"/>'
    body+=f'<circle cx="72" cy="{y+40}" r="24" fill="#e8edfc"/>'
    body+=text(58,y+47,n,20,BLUE,700)+text(115,y+33,title,23,INK,700)+text(115,y+61,desc,18,MUTED)
save('learning-route.svg','从电脑基础到 AI 工程：八条学习路径','按前置知识逐步阅读，也可以按当前问题选择入口。',body,112+len(rows)*95+35)

body=box(30,115,385,130,'01 目标',['给谁用？要做什么决定？'])+box(445,115,385,130,'02 资料',['它能依据哪些事实？'])+box(30,270,385,130,'03 约束',['缺信息怎么处理？哪些事不能做？'],GREEN)+box(445,270,385,130,'04 验收',['怎样判断结果可用？'],GREEN)
save('task-card.svg','一张任务卡，交代四件事','任务说明越可检查，越容易得到可用成果。',body,460)

body=box(30,155,240,145,'浏览器 / 前端',['用户输入问题','展示返回结果'])+box(310,155,240,145,'后台',['验证请求与权限','在这里保管密钥'])+box(590,155,240,145,'外部 API',['接收约定格式','返回数据或结果'],GREEN)
body+=arrow(275,228,303,228)+arrow(555,228,583,228)+text(30,357,'纯本地待办只需浏览器；需要受保护服务时才增加后台。',21)
save('web-request.svg','网页发出请求，服务返回结果','API 是程序的调用接口；模型不需要直接拿到密钥。',body,430)

body=text(30,131,'处理“签字”附近的信息时，可以组合不同位置的表示。',21)
words=[('合同','#d8e2fc'),('发给','#edf1fb'),('小周','#c4d3fa'),('签字','#9bb4f4')]
for i,(word,color) in enumerate(words):
    x=30+i*205
    body+=f'<rect x="{x}" y="168" width="185" height="90" rx="16" fill="{color}"/>'+text(x+65,222,word,25,INK,700)
    body+=arrow(x+92,263,430,327)
body+=box(255,337,350,112,'组合后的表示',['继续进入后续网络层'],GREEN)
save('attention.svg','注意力：组合相关位置的信息','颜色深浅仅表示示意权重，不是真实模型测量。',body,515,'结构示意，不包含真实注意力数据；权重也不等于完整解释。')

body=box(30,130,240,125,'提出问题',['活动何时停止报名？'])+box(310,130,240,125,'检索资料',['找到规则与来源行号'])+box(590,130,240,125,'依据证据回答',['模型组织答案'],GREEN)
body+=arrow(275,192,303,192)+arrow(555,192,583,192)
body+=box(30,300,800,115,'最后仍要核对',['找到了候选 ≠ 证据充分；没写明、已过期或相互冲突时不能补造。'],GREEN)
save('rag.svg','RAG：先找，再答，再核对','资料可以在外部更新，通常不需要改变模型权重。',body,475)

body=box(30,125,380,125,'01 读取目标与状态',['现在要完成什么？'])+box(450,125,380,125,'02 选择下一步',['回答，还是调用工具？'])+box(450,300,380,125,'03 执行工具',['程序执行并返回真实结果'],GREEN)+box(30,300,380,125,'04 观察与更新',['完成就停止，否则依据反馈继续'],GREEN)
body+=arrow(415,187,442,187)+arrow(640,257,640,291)+arrow(442,360,415,360)+arrow(220,292,220,258)
save('agent-loop.svg','Agent：依据反馈决定下一步','循环需要停止条件；模型宣称完成，不等于真实执行完成。',body,485)

body=box(30,115,800,110,'核心运行：模型 ↔ 工具',['Harness 把这段运行过程组织成可观察、可约束、可恢复的任务。'])
items=[('目标与输入','要交付什么，依据什么'),('权限与预算','能做什么，何时停止'),('状态与记录','做到哪里，执行过什么'),('恢复与验收','失败怎么处理，结果怎么查')]
for i,(label,desc) in enumerate(items):
    body+=box(30+(i%2)*415,255+(i//2)*140,385,115,label,[desc],GREEN)
save('harness.svg','Harness：管理运行过程的配套设施','提示词表达规则；执行层负责真正落实相应限制。',body,570)
print('Generated 7 original SVG diagrams.')
