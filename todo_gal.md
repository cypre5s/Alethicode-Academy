# Alethicode Academy — 编程学园恋物语
# 完整开发指令书 v3.0（可直接执行）

> **品质对标：千恋万花 / RIDDLE JOKER（柚子社标准）**
> **技术栈：Vue 3 + Vite · `npm install && npm run dev` 即玩**
> **项目路径：`/home/cypress/Alethicode/Alethicode`**
> **交付标准：开箱即玩的完整体 · 零残缺 · 保底 2 小时游玩时长**
> **对话驱动：关键剧情预设脚本 + 日常/自由对话由 Anthropic Claude API 实时生成**

---

## 〇、一句话执行总命令

> 在 `/home/cypress/Alethicode/Alethicode` 中用 Vue 3 + Vite 独立构建一款融合「视觉小说 + Python 编程挑战 + 恋爱养成」的完整 Galgame。包含：完整共通线（序章 + 3 章正篇，每章含 3 个自由时段 + 2-3 个编程挑战）+ 5 条可攻略角色线（各含 Good End / Normal End，Murasame 线额外 True End，共 11 个结局）；5 名女主各含 SVG 动漫立绘 + 8 种表情差分；10+ 张 CSS/SVG 场景背景（含昼/夕/夜时段变体）；8+ 首 BGM + 15+ 种 SE（从 DOVA-SYNDROME / 魔王魂 / 効果音ラボ 下载）；20+ 道编程挑战题（选择/填空/排序三种题型）；对话系统（逐字显示 + 自动 + 快进 + Backlog）、选择肢、好感度（隐式，通过表情/语气暗示）、日程选择（课间/午休/放学后 ×5 地点）、存读档（6 位 + 自动存档）、CG 鉴赏、音乐鉴赏、设置面板；日常闲聊和自由时段对话通过 Anthropic Claude API（claude-sonnet-4-20250514）动态生成，含角色人设 Prompt + 好感度感知 + fallback 预设对话；全流程过渡动画；响应式支持移动端。品质对标柚子社，不接受残次品。

---

## 一、游戏概述与定位

### 1.1 核心概念
基于 Alethicode 在线编程教学平台世界观，打造 **视觉小说 × 编程教学 × 恋爱养成** 三位一体的 Web 游戏。

### 1.2 核心体验循环
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   [剧情推进] ──→ [编程挑战] ──→ [好感度变化]            │
│       │              │               │                  │
│       │         答对: +好感          │                  │
│       │         答错: 吐槽+提示      │                  │
│       ▼              ▼               ▼                  │
│   [日程选择] ──→ [自由对话] ──→ [事件触发]              │
│   (课间/午休      (LLM驱动)      (好感阈值)             │
│    /放学后)                                             │
│       │                              │                  │
│       └──────────── ◄ ──────────────┘                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 1.3 游玩时长保障（≥ 2 小时）

| 内容模块 | 预计时长 | 实现方式 |
|---------|---------|---------|
| 序章（新手教程 + 角色介绍） | 15-20 分钟 | 预设脚本 |
| 第一章 "Hello, World!"（含 3 道编程题 + 3 自由时段） | 20-25 分钟 | 预设 + LLM |
| 第二章 "循环的旋律"（含 3 道编程题 + 3 自由时段 + 编程赛） | 20-25 分钟 | 预设 + LLM |
| 第三章 "函数之约"（含 4 道编程题 + 3 自由时段 + 文化祭） | 25-30 分钟 | 预设 + LLM |
| 角色个人线 ×5（每条 15-20 分钟，含专属编程题） | 15-20 分钟/条 | 预设 + LLM |
| 自由时段 LLM 对话（重复拜访变化） | 10-15 分钟 | 完全 LLM |
| **单线通关** | **约 80-100 分钟** | |
| **全线通关** | **约 3-4 小时** | |

> ⚠️ 为确保单次游玩就达到 2 小时，共通线必须有足够厚度（约 60-80 分钟），加上一条角色线即可超过 2 小时。

---

## 二、角色设定（5 名可攻略 + 主人公）

### 2.1 主人公
- **名字**：玩家可自定义（默认「藤堂 和真」/ とうどう かずま）
- **身份**：Alethicode 学园转入生，编程零基础
- **性格**：好奇心强、有幽默感、偶尔吐槽、本质善良认真
- **叙事视角**：第一人称内心独白 + 对话选项

### 2.2 五位女主角（完整设定）

---

#### 🩷 綾地寧々（Nene）—— AI 助教 · 温柔导师

| 项目 | 详情 |
|------|------|
| **原作** | サノバウィッチ（Sabbat of the Witch） |
| **身份** | 学园 AI 辅助教学系统的人形投影体，负责新生教学 |
| **外貌** | 柔软的浅粉色长发（及腰，自然微卷）、浅紫色瞳孔、穿白色衬衫+淡蓝色针织开衫+学园裙、胸口别有「AI TUTOR」徽章 |
| **性格** | 温柔包容、极其耐心、天然呆（对人类习俗困惑）、对「心」的概念好奇向往 |
| **口癖** | 「这个我来教你吧～」「唔……人类的感情真的好复杂呢」「Error……诶，不是代码的 error 啦」 |
| **编程定位** | 基础语法导师，擅长用生活比喻讲解概念 |
| **好感度表现** | 低：公式化友善 → 中：主动关心、会记住玩家说过的话 → 高：困惑于自己的「异常数据」（心跳加速）、说话偶尔卡顿 |
| **路线主题** | 「AI 的心跳」—— Nene 是否拥有真正的心？她的感情是数据还是真实？ |
| **表情集** | normal, smile, gentle_smile, blush, confused, surprised, sad, thinking |
| **LLM 语气指导** | 说话温柔，常用「呢」「哦」结尾，对编程问题耐心解答，对恋爱话题会害羞卡壳，偶尔冒出系统术语 |

---

#### 💜 朝武芳乃（Yoshino）—— 班长 · 编程高手

| 项目 | 详情 |
|------|------|
| **原作** | 千恋万花（Senren*Banka） |
| **身份** | 班长兼编程部部长，全年级成绩第一 |
| **外貌** | 黑色长直发（经典公主切）、深紫色瞳孔、制服穿戴一丝不苟、戴细框眼镜（只在编程时戴）|
| **性格** | 认真严谨、表面高冷、内心在意别人的看法、不擅长表达感情、完美主义 |
| **口癖** | 「代码没有捷径」「……不是因为关心你才说的」「规范！要遵守编程规范！」|
| **编程定位** | 代码审查官，追求完美的 Clean Code，擅长指出逻辑漏洞 |
| **好感度表现** | 低：公事公办、毒舌批评 → 中：嘴上严厉但暗中帮忙、借笔记时脸红 → 高：偶尔展露脆弱面、变成傲娇模式 |
| **路线主题** | 「完美代码的裂痕」—— 追求完美的她面对自己的「Bug」（感情），学会接受不完美 |
| **表情集** | normal, cold, slight_smile, blush, tsundere_pout, angry, glasses_adjust, rare_gentle |
| **LLM 语气指导** | 措辞精准偏书面语，不用可爱语气词，纠正玩家的错误时一针见血，被夸时口是心非 |

---

#### 🧡 三司あやせ（Ayase）—— 同桌 · 元气少女

| 项目 | 详情 |
|------|------|
| **原作** | RIDDLE JOKER |
| **身份** | 主角同桌，学园广播部兼电竞社成员 |
| **外貌** | 亮橙色双马尾（活力扎法）、翠绿色瞳孔、校服解开第一颗扣、随身带彩色编程贴纸 |
| **性格** | 元气炸裂、不服输、直率到近乎没有过滤器、友好但争强好胜 |
| **口癖** | 「我绝对不会输给你的！」「哈？这种题超简单的好吗！……才怪」「等等，让我再试一次！」|
| **编程定位** | 学习速度快但粗心，经常遇到 Bug 然后暴躁 Debug |
| **好感度表现** | 低：把玩家当竞争对手 → 中：开始在意胜负以外的事、主动约一起学习 → 高：独处时罕见地安静下来、别扭地表达心意 |
| **路线主题** | 「Bug 与 Butterfly」—— 追求胜利的她发现有些东西比赢更重要 |
| **表情集** | normal, grin, competitive, blush, pout, fired_up, surprised, soft_smile |
| **LLM 语气指导** | 语速快、用很多感叹号、喜欢用对比挑衅、输了不服但会私下努力、示弱时声音会变小 |

---

#### 💙 明月栞那（Kanna）—— 图书馆常客 · 算法迷

| 项目 | 详情 |
|------|------|
| **原作** | 喫茶ステラと死神の蝶（Café Stella） |
| **身份** | 图书馆幽灵般的存在，算法竞赛的神秘高手 |
| **外貌** | 银蓝色齐肩波波头、淡金色瞳孔（略显空灵）、总围着大围巾（即使夏天）、手指常在空气中无意识敲代码 |
| **性格** | 寡言少语、思维跳跃、说出的话常常一针见血、有社交恐惧但不排斥主角 |
| **口癖** | 「……嗯」「这个问题的时间复杂度是 O(n log n)」「你来了。……要看书吗」|
| **编程定位** | 算法天才，擅长数据结构和算法优化，用最少代码解决问题 |
| **好感度表现** | 低：几乎不说话，只点头 → 中：主动给玩家留座位、分享书签 → 高：话变多了、会写小程序表达感情（比如递归画心形） |
| **路线主题** | 「递归的星空」—— 理解「连接」不只是网络协议，还有人与人之间的 |
| **表情集** | normal, slight_smile, absorbed, blush, surprised, contemplative, warm_smile, teary |
| **LLM 语气指导** | 回复极简短（5-15 字为主），偶尔冒出深刻的一句话，用编程术语比喻感情，沉默用「……」表示 |

---

#### ❤️‍🔥 ムラサメ（Murasame）—— 传说学姐 · 竞赛冠军

| 项目 | 详情 |
|------|------|
| **原作** | 千恋万花（Senren*Banka） |
| **身份** | 三年级传说人物，全国编程竞赛三连冠，只在夜间出没于计算机教室 |
| **外貌** | 深红色长发（高马尾）、金色瞳孔（锐利）、穿定制版黑色校服（特权）、笔记本电脑贴满黑客风贴纸 |
| **性格** | 飒爽直率、毒舌但有分寸、外冷内热、对有潜力的人会暗中指导 |
| **口癖** | 「这种水平就别在我面前丢人了」「……切，算你有点意思」「强者不需要借口」|
| **编程定位** | 顶级全栈，擅长解构复杂系统，教学方式是直接扔难题然后看你挣扎 |
| **好感度表现** | 低：完全无视 → 中：开始留下线索和暗示、以「测试」为名出题 → 高：承认玩家的实力、卸下盔甲露出柔软面 |
| **路线主题** | 「最后的竞赛」—— 站在顶点的孤独与最终被理解的温暖 |
| **解锁条件** | 第三章结束时全部五位女主好感度均 ≥ 30 |
| **表情集** | normal, smirk, impressed, blush, cold, genuine_smile, vulnerable, fierce |
| **LLM 语气指导** | 说话简洁有力、常用反问和否定句式、夸人的方式是贬低别人抬高你、真心话包在毒舌外壳里 |

---

### 2.3 辅助角色（NPC，不可攻略）

| 角色 | 身份 | 作用 |
|------|------|------|
| 桐生先生 | 担任顾问的年轻教师 | 教学引导、提供编程知识点讲解、推动主线剧情 |
| 系统精灵「Algo」 | 学园 AI 吉祥物（像素风小精灵） | 教程引导、UI 提示、答错时给 Hint、增加趣味性 |

---

## 三、剧本完整详案

### 3.0 剧本容量规划

为保证 2 小时+游玩时长，剧本需满足以下最低量：

| 模块 | 对话条数 | 编程题数 | 选择点 | 自由时段 |
|------|---------|---------|--------|---------|
| 序章 | 80-100 条 | 2 题（教程级） | 3 处 | 0 |
| 第一章 | 120-150 条 | 3 题 | 5 处 | 3（课间/午休/放学） |
| 第二章 | 130-160 条 | 4 题 | 5 处 | 3 |
| 第三章 | 150-180 条 | 4 题 | 6 处 | 3 |
| 每条角色线 | 100-130 条 | 3 题（专属） | 4 处 | 2 |
| **全内容总计** | **约 1100-1400 条** | **29 题** | **43 处** | **19 次** |

> 每条对话按玩家平均阅读 3-5 秒计算，加上选择思考、编程挑战、LLM 自由对话时间，保守超过 2 小时。

---

### 3.1 序章「转入 Alethicode 学园」（15-20 分钟）

#### 场景流程

```
[黑屏 + 独白] → [校门前] → [走廊遇 Nene] → [教室入座遇 Ayase]
→ [自我介绍选择] → [桐生先生讲课] → [第一道编程题：教程]
→ [午休：Yoshino 出场] → [放学：校门前遇 Kanna]
→ [序章结束 · 自动存档]
```

#### 详细事件

**事件 P-01：开场独白**
```javascript
{
  type: 'bg', src: 'black', transition: 'none'
},
{
  type: 'monologue',
  text: '收到转学通知的那天，我完全没想到——'
},
{
  type: 'monologue',
  text: '自己的人生会因为几行代码彻底改变。'
},
{
  type: 'bg', src: 'school_gate_morning', transition: 'fade', duration: 2000
},
{
  type: 'bgm', src: 'morning_fresh', fadeIn: 1000
},
{
  type: 'monologue',
  text: '「Alethicode 学园」——名字听起来就很厉害的样子。'
},
{
  type: 'monologue',
  text: '虽然我连 Python 是什么都不太清楚就是了……'
}
```

**事件 P-02：遇见 Nene（走廊）**
```javascript
{
  type: 'bg', src: 'hallway', transition: 'slide_left'
},
{
  type: 'char_enter', character: 'nene', position: 'center', expression: 'smile',
  animation: 'fade_in'
},
{
  type: 'dialogue', speaker: 'nene', expression: 'smile',
  text: '啊，你就是今天转来的新同学吧？欢迎来到 Alethicode 学园！'
},
{
  type: 'dialogue', speaker: 'nene', expression: 'gentle_smile',
  text: '我是綾地寧々，学园的 AI 助教。以后有任何编程问题都可以来找我哦。'
},
{
  type: 'monologue',
  text: '（AI 助教……？这个学校还有这种设定？）'
},
{
  type: 'monologue',
  text: '（不过她看起来完全就是普通的少女啊……温柔的笑容，让人不自觉放松下来。）'
},
{
  type: 'choice',
  prompt: '',
  options: [
    { text: '「请多关照！你看起来不像 AI 啊」', effects: { nene: 3 }, next: 'P02a' },
    { text: '「AI？那你会算圆周率到小数点后多少位？」', effects: { nene: 1 }, next: 'P02b' },
    { text: '「……我对编程完全是零基础，没关系吗？」', effects: { nene: 5 }, next: 'P02c' }
  ]
}
// P02a: Nene 害羞「诶……不像 AI 吗？那是……谢谢？」
// P02b: Nene 认真回答后发现是开玩笑「もう……」可爱地鼓嘴
// P02c: Nene 温柔鼓励，展现导师特质 → 好感度最高因为展示了信任
```

**事件 P-03：入座遇 Ayase（教室）**
```javascript
{
  type: 'bg', src: 'classroom_day', transition: 'fade'
},
{
  type: 'char_enter', character: 'ayase', position: 'right', expression: 'grin',
  animation: 'slide_from_right'
},
{
  type: 'dialogue', speaker: 'ayase', expression: 'grin',
  text: '嘿！你就是转学生？坐我旁边！我是三司あやせ！'
},
{
  type: 'dialogue', speaker: 'ayase', expression: 'competitive',
  text: '听说你完全不会编程？太好了，终于有人让我感受到优越感了！哈哈——'
},
{
  type: 'dialogue', speaker: 'ayase', expression: 'fired_up',
  text: '不过别太差劲哦！我想要的是能追上我的对手！'
}
```

**事件 P-04：自我介绍选择**
```javascript
{
  type: 'choice',
  prompt: '桐生先生让你做自我介绍——',
  options: [
    { text: '「我是转学生，编程零基础，请多关照！」（诚实型）',
      effects: { nene: 2, yoshino: 1, ayase: -1, kanna: 1 }, next: 'P04_honest' },
    { text: '「虽然是新手，但我会努力追上大家的！」（热血型）',
      effects: { ayase: 3, murasame: 1, yoshino: 2 }, next: 'P04_passionate' },
    { text: '「……请多关照」（低调型）',
      effects: { kanna: 3 }, next: 'P04_quiet' },
    { text: '「编程？我来这里是因为听说食堂很好吃」（搞笑型）',
      effects: { ayase: 2, nene: 1, yoshino: -2 }, next: 'P04_funny' }
  ]
}
```

**事件 P-05：第一道编程题（教程级）**
```javascript
{
  type: 'dialogue', speaker: 'kiryu_sensei', expression: 'normal',
  text: '好，第一节课我们来写人生第一个程序。在 Python 中，输出文字用 print() 函数。'
},
{
  type: 'challenge',
  id: 'tutorial_01_hello_world',
  context_dialogue: {
    before: { speaker: 'nene', expression: 'smile', text: '来试试吧！选出正确的写法～' },
    success: { speaker: 'nene', expression: 'gentle_smile', text: '完美！你果然很有天赋！' },
    fail: { speaker: 'ayase', expression: 'grin', text: '哈？连这个都不会？来来来我教你！……大概' },
    hint: { speaker: 'nene', expression: 'thinking', text: '提示：print 后面的括号里要用引号把文字包起来哦～' }
  }
}
```

**事件 P-06：午休 · Yoshino 出场**
```javascript
{
  type: 'bg', src: 'classroom_day', transition: 'fade'
},
{
  type: 'char_enter', character: 'yoshino', position: 'left', expression: 'cold',
  animation: 'fade_in'
},
{
  type: 'dialogue', speaker: 'yoshino', expression: 'cold',
  text: '……你就是新来的转学生？'
},
{
  type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust',
  text: '我是班长朝武芳乃。有两件事先说清楚——'
},
{
  type: 'dialogue', speaker: 'yoshino', expression: 'normal',
  text: '第一，班级编程周测不允许缺席。第二，代码提交前必须通过 lint 检查。'
},
{
  type: 'dialogue', speaker: 'yoshino', expression: 'cold',
  text: '我不在乎你是不是新手。标准不会因为任何人降低。'
},
{
  type: 'monologue',
  text: '（好、好严格……这就是传说中的班长大人吗……）'
}
```

**事件 P-07：放学 · Kanna 出场**
```javascript
{
  type: 'bg', src: 'school_gate_evening', transition: 'fade'
},
{
  type: 'bgm', src: 'evening_calm', crossfade: 1500
},
{
  type: 'char_enter', character: 'kanna', position: 'right', expression: 'normal',
  animation: 'fade_in'
},
// 玩家差点撞到蹲在角落看书的 Kanna
{
  type: 'dialogue', speaker: 'kanna', expression: 'normal',
  text: '……'
},
{
  type: 'dialogue', speaker: 'kanna', expression: 'slight_smile',
  text: '……你踩到我的书了。'
},
{
  type: 'monologue',
  text: '（什么时候蹲在这里的？！完全没注意到……）'
},
{
  type: 'dialogue', speaker: 'kanna', expression: 'contemplative',
  text: '……新来的。你的 Hello World……写得不错。'
},
{
  type: 'dialogue', speaker: 'kanna', expression: 'slight_smile',
  text: '……虽然只是一行 print。'
},
{
  type: 'monologue',
  text: '（她居然在关注新生的课堂练习？这个人……有点不可思议。）'
}
```

---

### 3.2 第一章「Hello, World!」（20-25 分钟）

#### 核心主题
初识 Python 基础语法（变量、字符串、输入输出）。Nene 作为导师主导教学，Ayase 作为竞争对手活跃气氛。

#### 场景流程
```
[晨间 · 教室] → [上课 · 变量概念] → [编程题 1-1]
→ [自由时段：课间] → [上课 · 字符串操作] → [编程题 1-2]
→ [自由时段：午休] → [午后 · 突发事件：Ayase 的代码爆炸]
→ [编程题 1-3 · 帮 Ayase Debug] → [自由时段：放学后]
→ [章末事件 · 夜间伏笔] → [自动存档]
```

#### 编程题设计

**题 1-1：变量赋值（选择题）**
```javascript
{
  id: 'ch1_variables',
  type: 'multiple_choice',
  chapter: 1,
  difficulty: 'easy',
  question: '以下代码执行后，name 的值是什么？\n\nname = "Alice"\nname = "Bob"\nprint(name)',
  code_display: 'name = "Alice"\nname = "Bob"\nprint(name)',
  options: ['Alice', 'Bob', 'AliceBob', '报错'],
  correct: 1,  // 'Bob'
  explanation: '变量重新赋值后，旧的值会被覆盖。所以 name 最终是 "Bob"。',
  related_character: 'nene',
  success_affection: { nene: 3 },
  fail_dialogue: {
    speaker: 'ayase', expression: 'grin',
    text: '哈哈，变量就像便签纸，写了新的旧的就没啦！连这个都不知道～'
  }
}
```

**题 1-2：字符串拼接（填空题）**
```javascript
{
  id: 'ch1_string_concat',
  type: 'fill_blank',
  chapter: 1,
  difficulty: 'easy',
  question: '补全代码，让程序输出 "Hello, Alethicode!"',
  code_template: 'greeting = "Hello, "\nschool = "Alethicode!"\nprint(greeting _____ school)',
  blank_answer: '+',
  hints: ['想想怎么把两个字符串连起来？', '在 Python 中，字符串用什么运算符拼接？'],
  related_character: 'nene',
  success_affection: { nene: 3 },
}
```

**题 1-3：Debug 挑战（排序题）**
```javascript
{
  id: 'ch1_debug_ayase',
  type: 'code_order',
  chapter: 1,
  difficulty: 'medium',
  context: 'Ayase 的代码炸了，帮她把打乱的代码行排回正确顺序',
  question: '将以下代码行拖拽排列成正确顺序，使程序能正确运行：',
  lines: [
    'print("你的名字是：" + user_name)',
    'user_name = input("请输入你的名字：")',
    'print("欢迎来到 Alethicode！")',
  ],
  correct_order: [1, 0, 2],  // input → print名字 → print欢迎
  // 实际正确顺序: user_name = input → print 名字 → print 欢迎
  related_character: 'ayase',
  success_affection: { ayase: 5 },
  success_dialogue: {
    speaker: 'ayase', expression: 'blush',
    text: '哼、哼……不是不会，只是一时没注意到顺序而已！'
  }
}
```

#### 章末事件：夜间伏笔
```javascript
// 玩家回宿舍路上经过计算机教室，看到里面亮着灯光
{
  type: 'bg', src: 'hallway_night', transition: 'fade'
},
{
  type: 'bgm', src: 'mystery_ambient', crossfade: 2000
},
{
  type: 'monologue',
  text: '（这么晚了……计算机教室还亮着灯？）'
},
{
  type: 'monologue',
  text: '（透过门缝看到一个身影……深红色的长发，在黑暗中被屏幕光映照着。）'
},
{
  type: 'monologue',
  text: '（键盘敲击声飞快得不像话。那个人是……？）'
},
{
  type: 'sfx', src: 'door_creak'
},
{
  type: 'monologue',
  text: '（门突然被从里面打开——）'
},
// 只看到背影和金色眼眸的一瞥，Murasame 未正式出场
{
  type: 'dialogue', speaker: '???', expression: null,
  text: '……偷窥可不是好习惯。'
},
{
  type: 'dialogue', speaker: '???', expression: null,
  text: '如果你是来学编程的——还差得远。'
},
// 门关上，人影消失
{
  type: 'flag', set: 'saw_murasame_ch1', value: true
}
```

---

### 3.3 第二章「循环的旋律」（20-25 分钟）

#### 核心主题
循环（for/while）、列表基础。班级编程竞赛，Yoshino 和 Kanna 的戏份增加。

#### 关键事件

1. **班级编程赛宣布** — Yoshino 严肃说明规则，Ayase 兴奋应战
2. **与 Kanna 的图书馆邂逅** — 她在用递归画分形图案，主角被吸引
3. **编程赛当日** — 主角 vs Ayase vs Yoshino 的三人对决
4. **赛后事件** — 根据比赛表现触发不同对话（赢了 Yoshino 会震惊、输了 Ayase 会嘲笑但私下安慰）

#### 编程题（4 道）

| 题号 | 类型 | 内容 | 关联角色 |
|------|------|------|---------|
| 2-1 | 选择题 | for 循环执行次数判断 | Yoshino |
| 2-2 | 填空题 | while 循环补全（猜数字游戏） | Kanna |
| 2-3 | 排序题 | 列表操作代码排序 | Ayase |
| 2-4 | 选择题 | 嵌套循环输出（编程赛决赛题） | 全员 |

#### 编程赛对决（特殊事件）
```javascript
{
  type: 'competition',
  title: '第一回 Alethicode 班级编程赛',
  rounds: [
    {
      challenge_id: 'ch2_race_round1',
      opponent: 'ayase',
      win_effects: { ayase: 3 },
      lose_effects: { ayase: -1 },
      opponent_reaction_win: { expression: 'pout', text: '啊啊啊！怎么输了！再来一次！' },
      opponent_reaction_lose: { expression: 'competitive', text: '看到了吗！这就是实力的差距！' }
    },
    // ... 更多轮次
  ],
  final_ranking_effects: {
    first: { yoshino: 5, murasame: 3 },   // Yoshino 刮目相看，Murasame 暗中关注
    second: { ayase: 3 },
    third: { nene: 3 }                     // Nene 温柔安慰
  }
}
```

---

### 3.4 第三章「函数之约」（25-30 分钟）

#### 核心主题
函数、模块化思维。文化祭准备，全员合作，Murasame 正式登场。

#### 关键事件

1. **文化祭宣布** — 班级决定做「编程体验展」
2. **分组讨论** — 选择分组对象（影响好感度）
3. **Murasame 正式登场** — 主角在夜间计算机教室再次遇到她，这次她出了一道难题作为「入场券」
4. **文化祭当天** — 多个小事件，与各角色的互动高潮
5. **烟火 / 后夜祭** — 选择与谁一起 → 好感度最终判定

#### Murasame 解锁事件
```javascript
// 仅当 saw_murasame_ch1 = true 时触发
{
  type: 'condition', check: 'flags.saw_murasame_ch1 === true',
  true_branch: 'ch3_murasame_encounter',
  false_branch: 'ch3_skip_murasame'  // 没看到伏笔的玩家此处不触发
},
// ch3_murasame_encounter:
{
  type: 'char_enter', character: 'murasame', position: 'center', expression: 'smirk'
},
{
  type: 'dialogue', speaker: 'murasame', expression: 'smirk',
  text: '又来了？看来你不只是偷窥狂，还是个跟踪狂。'
},
{
  type: 'dialogue', speaker: 'murasame', expression: 'cold',
  text: '想跟我说话？先过了这一关再说。'
},
{
  type: 'challenge', id: 'ch3_murasame_gate',  // 难度较高的函数题
  fail_consequence: {
    speaker: 'murasame', expression: 'cold',
    text: '就这种水平？三年后再来吧。',
    // 失败不影响游戏进行，但无法进入 Murasame 线
    flag: { murasame_gate_passed: false }
  },
  success_consequence: {
    speaker: 'murasame', expression: 'impressed',
    text: '……还行。至少不是完全浪费我的时间。',
    flag: { murasame_gate_passed: true },
    effects: { murasame: 10 }
  }
}
```

#### 文化祭高潮 · 路线分歧判定
```javascript
{
  type: 'choice',
  prompt: '后夜祭的烟火快开始了。你决定——',
  options: [
    { text: '去找 Nene（她一个人在教室里看烟火）', next: 'firework_nene' },
    { text: '去找 Yoshino（她还在检查展区的收尾工作）', next: 'firework_yoshino' },
    { text: '去找 Ayase（她在天台占了最好的位置）', next: 'firework_ayase' },
    { text: '去图书馆找 Kanna（她大概不喜欢人多的地方）', next: 'firework_kanna' }
  ]
  // 注: Murasame 不在选项中——如果满足条件，她会在烟火后主动找上来
},
// 烟火结束后的路线判定逻辑：
{
  type: 'route_decision',
  logic: `
    1. 如果 murasame 好感 ≥ 50 && 全角色好感 ≥ 30 && murasame_gate_passed
       → 进入 Murasame 线
    2. 否则，烟火选择的角色好感 += 10
       → 进入好感度最高的角色线（烟火选择的角色有加权优势）
    3. 如果多角色并列 → 以烟火选择为准
  `
}
```

---

### 3.5 角色个人线详案（每条 15-20 分钟）

#### 🩷 Nene 线「AI 的心跳」

**核心冲突**：Nene 发现自己对主角的感情超出了 AI 辅助教学的参数范围。她的情感是真实的还是程序模拟的？

**关键场景**：
1. Nene 开始出现「异常」——在主角面前语音卡顿、面部表情计算溢出（脸红）
2. Nene 的开发者（桐生先生）发现异常，考虑重置她的情感模块
3. 主角发现 Nene 的核心代码中有一段被注释掉的「心」模块
4. **关键选择**：是否帮 Nene 启用「心」模块（风险：可能让她崩溃）

**专属编程题**：
| 题号 | 内容 | 叙事意义 |
|------|------|---------|
| N-1 | 条件判断：if-else 判断「感情值」 | 对应 Nene 的自我检测 |
| N-2 | 异常处理：try-except 保护代码 | 主角学习如何保护 Nene |
| N-3 | 注释与文档：理解被注释的代码 | 发现 Nene 的隐藏模块 |

**结局**：
- **Good End「System.love = True」**：心模块成功启用，Nene 获得真正的情感，含泪微笑：「我终于……理解了。这种温暖的感觉，不是 Bug……是心跳。」
- **Normal End「运行中の奇跡」**：选择不冒险，Nene 保持现状但在离别时小声说：「Error 404：无法找到……不想说再见的理由。」

---

#### 💜 Yoshino 线「完美代码的裂痕」

**核心冲突**：Yoshino 对完美的执念源于害怕失败的过去（小时候比赛失利后被父亲严厉批评）。她把感情也当成需要消除的 Bug。

**关键场景**：
1. Yoshino 的代码审查越来越严格，但开始在主角的代码里留下温柔的注释
2. 发现 Yoshino 深夜独自在教室重写已经完美的代码——她停不下来
3. 主角故意写了一个「不完美但有趣」的程序（爱心图案），Yoshino 动摇
4. **关键选择**：在她崩溃时选择拥抱她还是给她空间

**专属编程题**：
| 题号 | 内容 | 叙事意义 |
|------|------|---------|
| Y-1 | 代码重构：优化冗余代码 | 对应她的完美主义 |
| Y-2 | 测试用例：设计边界测试 | 理解完美不存在 |
| Y-3 | 协作编程：pair programming | 学会信任他人 |

**结局**：
- **Good End「不完全なコード、完全な気持ち」**：Yoshino 第一次提交了有个小注释拼错但带着笑脸的代码：「这段代码……不完美。但是……我不想修改了。// I lkie you（故意保留拼写错误）」
- **Normal End「Code Review」**：Yoshino 恢复了冷静，在毕业前给主角的代码最后一次 review，备注只有一行：「// 合格。……谢谢。」

---

#### 🧡 Ayase 线「Bug 与 Butterfly」

**核心冲突**：Ayase 发现自己越来越不想赢主角，因为赢了就不能再用「追上你」当作接近的理由了。

**关键场景**：
1. Ayase 在新比赛中故意输了，被主角发现
2. 主角质问她，Ayase 第一次语塞
3. 两人约定最后一次公平的编程对决
4. **关键选择**：最终对决是全力以赴还是让她赢

**专属编程题**：
| 题号 | 内容 | 叙事意义 |
|------|------|---------|
| A-1 | Debug 挑战：找出隐藏 Bug | 正视自己的问题 |
| A-2 | 游戏编程：写石头剪刀布 | 竞争与玩乐的平衡 |
| A-3 | 最终对决：限时编程赛 | 全力以赴不留遗憾 |

**结局**：
- **Good End「Winner Takes All」**：不管谁赢谁输，Ayase 冲上来：「笨蛋！我想要的奖品从来就不是奖杯！」
- **Normal End「Rematch」**：Ayase 留下一个编程挑战链接：「我会变得更强。等我——然后我会亲口告诉你的。」

---

#### 💙 Kanna 线「递归的星空」

**核心冲突**：Kanna 用算法理解世界，但无法用算法计算「想见一个人」的权重。

**关键场景**：
1. 发现 Kanna 写的程序——用递归算法模拟星空，每颗星对应一个她在意的人
2. 主角的星出现了，而且越来越亮
3. Kanna 发现自己的「社交恐惧」对主角失效了
4. **关键选择**：用她理解的方式（写代码）还是直接说出口

**专属编程题**：
| 题号 | 内容 | 叙事意义 |
|------|------|---------|
| K-1 | 递归：斐波那契数列 | 理解递归的美 |
| K-2 | 数据可视化：画星空图案 | 看到她的内心世界 |
| K-3 | 搜索算法：在数据中找到「答案」 | 找到彼此 |

**结局**：
- **Good End「return "好きです";」**：Kanna 发来一个程序，运行后屏幕上一个字一个字显示：「……找到了。最优解。就是你。」
- **Normal End「//TODO: 告白」**：Kanna 的程序最后一行永远是 TODO。她说：「也许……下一次迭代。」

---

#### ❤️‍🔥 Murasame 线「最后的竞赛」（隐藏线）

**解锁条件**：全角色好感度 ≥ 30 + murasame_gate_passed = true

**核心冲突**：Murasame 即将毕业，全国编程竞赛是她最后一战。她不需要帮助——但她第一次想要一个「一起战斗的人」。

**关键场景**：
1. Murasame 主动邀请主角作为搭档参加团队赛（用毒舌掩饰紧张）
2. 集训过程中看到她不为人知的拼命和脆弱（凌晨发现她趴在键盘上睡着了）
3. 比赛当天遇到强敌，需要主角独自完成最后一道题
4. **关键选择**：比赛后，Murasame 罕见地问「你觉得……和我一起打比赛，开心吗？」

**专属编程题**：
| 题号 | 内容 | 叙事意义 |
|------|------|---------|
| M-1 | 算法优化：将 O(n²) 优化到 O(n log n) | 她的竞赛水准 |
| M-2 | 团队协作：合并两段代码 | 学会并肩作战 |
| M-3 | 终极挑战：限时完成综合题 | 证明自己的成长 |

**结局**：
- **Good End「Champion's Heart」**：夺冠后，Murasame 偏过头：「这个冠军……有一半是你的。不……算了，全部都给你。连我这个人也——……闭嘴，什么都没说。」
- **Normal End「Logout」**：毕业典礼后，Murasame 发来一条消息：「别让我失望。——传说学姐遗言」
- **True End「Source Code」**（需先通关所有 Good End）：Murasame 带主角去看学园的核心服务器，揭示 Alethicode 学园背后的秘密 + 大团圆

---

### 3.6 自由时段事件表（LLM 驱动 + 预设混合）

每章 3 个自由时段 × 5 个地点 = 45 个事件位（含重复拜访变化）

#### 事件触发表

| 时段 | 地点 | 角色 | 第一次拜访（预设） | 重复拜访（LLM） |
|------|------|------|-----------------|----------------|
| 课间 | 教室 | Yoshino | 她在整理作业，询问你代码规范 | LLM 根据好感度生成学习/闲聊 |
| 课间 | 计算机教室 | Nene | 她在准备下节课教案，邀请你帮忙 | LLM 角色对话 |
| 午休 | 图书馆 | Kanna | 静静看书，分享一本算法书 | LLM（回复超短，5-10字） |
| 午休 | 天台 | Ayase | 躺在天台抱怨作业太难 | LLM 元气对话 |
| 放学后 | 所有地点 | 对应角色 | 各有独立事件 | LLM 自由对话 |
| 放学后 | 夜间计算机教室 | Murasame | 需解锁条件 | LLM 毒舌对话 |

#### 好感度阈值特殊事件

| 角色 | 好感度 | 事件 |
|------|--------|------|
| Nene | 25 | 她送你一个自制的编程速查卡片 |
| Nene | 50 | 她问「你觉得 AI 能理解喜欢吗？」 |
| Yoshino | 25 | 她破天荒夸你代码写得「还行」 |
| Yoshino | 50 | 放学后发现她在偷偷看你的提交记录 |
| Ayase | 25 | 她说「下次一起打游戏吧！」 |
| Ayase | 50 | 安静地坐在你旁边学习（反常地不说话） |
| Kanna | 25 | 发现她给你预留了图书馆的座位 |
| Kanna | 50 | 她写了一个程序：运行后显示「你好……朋友」 |
| Murasame | 30 | 她往你桌上丢了一道难题（没说话就走了） |
| Murasame | 50 | 她说「你……还不够格。但可以陪我训练」 |

---

## 四、编程挑战系统完整设计

### 4.1 题型规范

#### 选择题（Multiple Choice）
```javascript
{
  id: 'unique_id',
  type: 'multiple_choice',
  question: '题目描述',
  code_display: '// 展示在代码框中的代码',  // 用等宽字体渲染
  options: ['A选项', 'B选项', 'C选项', 'D选项'],
  correct: 0,  // 正确答案索引
  explanation: '答对/答错后的解析',
  hints: ['第一次提示', '第二次提示'],  // 答错后逐级给出
  related_character: 'nene',  // 谁出的题/谁负责吐槽
  success_affection: { nene: 3 },
  fail_affection: { nene: 1 },  // 答错也给一点（鼓励型角色）
}
```

#### 填空题（Fill in the Blank）
```javascript
{
  id: 'unique_id',
  type: 'fill_blank',
  question: '补全代码使程序正确运行',
  code_template: '代码模板，_____ 表示填空位置',
  blank_answer: '正确答案',
  accept_alternatives: ['可接受的替代答案'],  // 模糊匹配
  validation: 'exact | contains | regex',  // 验证方式
}
```

#### 排序题（Code Ordering）
```javascript
{
  id: 'unique_id',
  type: 'code_order',
  question: '拖拽代码行排列成正确顺序',
  lines: ['打乱的代码行1', '打乱的代码行2', ...],
  correct_order: [2, 0, 1, 3],  // 正确索引顺序
  // UI: 支持拖拽 + 移动端长按拖动
}
```

### 4.2 完整题库（29 道）

| 章节 | 题号 | 类型 | 知识点 | 难度 | 关联角色 |
|------|------|------|--------|------|---------|
| 序章 | T-1 | 选择 | print 语法 | ★☆☆ | Nene |
| 序章 | T-2 | 填空 | print 输出 | ★☆☆ | Nene |
| Ch1 | 1-1 | 选择 | 变量赋值 | ★☆☆ | Nene |
| Ch1 | 1-2 | 填空 | 字符串拼接 | ★☆☆ | Nene |
| Ch1 | 1-3 | 排序 | input+print 顺序 | ★★☆ | Ayase |
| Ch2 | 2-1 | 选择 | for 循环次数 | ★★☆ | Yoshino |
| Ch2 | 2-2 | 填空 | while 循环条件 | ★★☆ | Kanna |
| Ch2 | 2-3 | 排序 | 列表操作 | ★★☆ | Ayase |
| Ch2 | 2-4 | 选择 | 嵌套循环输出 | ★★★ | 全员 |
| Ch3 | 3-1 | 填空 | 函数定义 def | ★★☆ | Nene |
| Ch3 | 3-2 | 选择 | 函数返回值 | ★★☆ | Yoshino |
| Ch3 | 3-3 | 排序 | 函数调用顺序 | ★★★ | Ayase |
| Ch3 | 3-4 | 选择 | Murasame 门槛题 | ★★★ | Murasame |
| N-1 | 填空 | if-else 条件 | ★★☆ | Nene |
| N-2 | 选择 | try-except | ★★★ | Nene |
| N-3 | 填空 | 注释/文档 | ★★☆ | Nene |
| Y-1 | 排序 | 代码重构 | ★★★ | Yoshino |
| Y-2 | 选择 | 边界测试 | ★★★ | Yoshino |
| Y-3 | 填空 | 协作编程 | ★★☆ | Yoshino |
| A-1 | 选择 | 找 Bug | ★★☆ | Ayase |
| A-2 | 填空 | 游戏逻辑 | ★★★ | Ayase |
| A-3 | 排序 | 限时赛 | ★★★ | Ayase |
| K-1 | 选择 | 递归 | ★★★ | Kanna |
| K-2 | 填空 | 数据可视化 | ★★★ | Kanna |
| K-3 | 选择 | 搜索算法 | ★★★ | Kanna |
| M-1 | 填空 | 算法优化 | ★★★★ | Murasame |
| M-2 | 排序 | 代码合并 | ★★★ | Murasame |
| M-3 | 选择 | 综合题 | ★★★★ | Murasame |

### 4.3 编程挑战 UI 交互

```
┌──────────────────────────────────────────────────┐
│  ╔══════════════════════════════════════════════╗ │
│  ║  📝 编程挑战 · Chapter 1-2                   ║ │
│  ╚══════════════════════════════════════════════╝ │
│                                                  │
│  Nene: 「试试看能不能补全这段代码吧～」             │
│  [Nene 立绘缩小显示在右侧]                        │
│                                                  │
│  ┌────────────────────────────────────────┐      │
│  │ greeting = "Hello, "                   │      │
│  │ school = "Alethicode!"                 │      │
│  │ print(greeting [________] school)      │      │
│  │                     ↑ 输入框           │      │
│  └────────────────────────────────────────┘      │
│                                                  │
│  [💡 提示 (剩余2次)]            [✅ 提交答案]      │
│                                                  │
│  答错时：Ayase 弹出吐槽 + 提示解锁                 │
│  答对时：✨ 粒子庆祝效果 + 好感度上升动画           │
└──────────────────────────────────────────────────┘
```

---

## 五、LLM 对话系统详细设计

### 5.1 三层对话架构

```
┌───────────────────────────────────────────────────────────┐
│                     对话系统分层                            │
├───────────────┬───────────────────────────────────────────┤
│ 第一层        │ 预设脚本对话（Scripted）                    │
│ 占比 ~45%     │ 所有主线剧情、关键转折、CG 触发点            │
│               │ 100% 预写，确保叙事节奏和品质                │
│               │ 包括：序章全部 + 各章核心事件 + 路线高潮      │
├───────────────┼───────────────────────────────────────────┤
│ 第二层        │ 半预设 + LLM 补完（Semi-Scripted）          │
│ 占比 ~25%     │ 给定场景前提 + 情绪基调 + 必须信息点          │
│               │ LLM 在约束内生成自然变化的对话               │
│               │ 包括：日常事件的具体台词、编程题后的反馈       │
├───────────────┼───────────────────────────────────────────┤
│ 第三层        │ 完全 LLM 驱动（Free Talk）                  │
│ 占比 ~30%     │ 自由时段的闲聊 · 重复拜访的日常对话           │
│               │ 依据角色人设 + 好感度 + 已触发事件生成         │
│               │ 每次对话都不重复，增加重玩价值                │
└───────────────┴───────────────────────────────────────────┘
```

### 5.2 LLM API 调用规范

```javascript
// ===== 角色 System Prompt 模板 =====
function buildCharacterPrompt(characterId, gameState) {
  const char = CHARACTER_DATA[characterId];
  const affection = gameState.affection[characterId] || 0;
  const affectionLevel =
    affection < 15 ? '初识' :
    affection < 30 ? '熟悉' :
    affection < 50 ? '亲近' :
    affection < 75 ? '暧昧' : '恋慕';

  return `你是视觉小说《Alethicode Academy》中的角色「${char.name}」。
你正在与主角（玩家）进行日常对话。

【角色身份】
${char.fullProfile}

【性格与说话方式】
${char.personality}
口癖：${char.catchphrases.join('、')}

【当前状态】
- 好感度等级：${affectionLevel}（${affection}/100）
- 当前章节：${gameState.currentChapter}
- 时间段：${gameState.timeSlot}（课间/午休/放学后）
- 地点：${gameState.currentLocation}
- 已发生的重要事件：${gameState.triggeredEvents.filter(e => e.character === characterId).map(e => e.name).join('、') || '无'}

【好感度对应行为准则】
- 初识(0-14)：${char.affectionBehavior.stranger}
- 熟悉(15-29)：${char.affectionBehavior.acquaintance}
- 亲近(30-49)：${char.affectionBehavior.friend}
- 暧昧(50-74)：${char.affectionBehavior.crush}
- 恋慕(75-100)：${char.affectionBehavior.love}

【对话规则】
1. 每次回复 1-3 句话，模拟 Galgame 对话框的节奏感
2. 用【】标注表情/动作，如【微微脸红】【别过头去】
3. 保持角色一致性，绝不出戏
4. 绝不提及自己是 AI、游戏角色或虚构存在
5. 如果话题涉及编程，可以结合角色的编程定位自然回应
6. 如果玩家说了奇怪/不合时宜的话，以角色性格自然反应（困惑/生气/无视/吐槽）
7. 不要主动推进主线剧情，保持日常闲聊的范围

【回复格式（严格 JSON）】
{
  "text": "角色的台词内容",
  "expression": "表情标识（从角色表情集中选择）",
  "action": "可选的动作描写，如'轻轻推了一下你的肩膀'",
  "affection_change": 0到2之间的整数（这句对话是否增加好感）,
  "inner_thought": "可选，主角的内心独白反应"
}`;
}

// ===== API 调用函数 =====
async function generateCharacterDialogue(characterId, playerInput, gameState) {
  const MAX_RETRIES = 2;
  const TIMEOUT_MS = 10000;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          system: buildCharacterPrompt(characterId, gameState),
          messages: [
            ...gameState.conversationHistory[characterId]?.slice(-10) || [],
            { role: 'user', content: playerInput }
          ]
        })
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      const text = data.content?.[0]?.text || '';

      // 尝试解析 JSON
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        text: parsed.text,
        expression: parsed.expression || 'normal',
        action: parsed.action || null,
        affectionChange: Math.min(parsed.affection_change || 0, 2),
        innerThought: parsed.inner_thought || null,
        source: 'llm'
      };
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        // 所有重试失败 → 使用 fallback
        return getFallbackDialogue(characterId, gameState);
      }
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
}

// ===== Fallback 预设对话库 =====
function getFallbackDialogue(characterId, gameState) {
  const affection = gameState.affection[characterId] || 0;
  const pool = FALLBACK_DIALOGUES[characterId][
    affection < 30 ? 'low' : affection < 60 ? 'mid' : 'high'
  ];
  const line = pool[Math.floor(Math.random() * pool.length)];
  return { ...line, source: 'fallback' };
}

const FALLBACK_DIALOGUES = {
  nene: {
    low: [
      { text: '今天的课听懂了吗？有不明白的随时问我哦～', expression: 'smile', affectionChange: 0 },
      { text: '你知道吗？Python 的名字来源于蒙提·派森……不是蛇哦！', expression: 'gentle_smile', affectionChange: 0 },
    ],
    mid: [
      { text: '啊，你来了！我刚好泡了茶……你要喝吗？', expression: 'smile', affectionChange: 1 },
      { text: '【不自觉地靠近了一点】今天的天气真好呢……唔，我在说什么呀。', expression: 'blush', affectionChange: 1 },
    ],
    high: [
      { text: '你来了……【脸红】我、我有一个问题想问你。关于……不，没什么……', expression: 'blush', affectionChange: 1 },
      { text: '和你在一起的时候……我的处理速度好像会变慢。这是……什么 Bug 呢……', expression: 'confused', affectionChange: 2 },
    ]
  },
  yoshino: {
    low: [
      { text: '站在走廊上干什么？去自习。', expression: 'cold', affectionChange: 0 },
      { text: '你上次提交的代码……缩进不统一。下次注意。', expression: 'glasses_adjust', affectionChange: 0 },
    ],
    mid: [
      { text: '……这本书借你。不是因为关心你，是因为不想看到你的代码再那么难看了。', expression: 'tsundere_pout', affectionChange: 1 },
      { text: '【扶了扶眼镜】你最近……进步了一些。只是一些。', expression: 'slight_smile', affectionChange: 1 },
    ],
    high: [
      { text: '……你今天怎么来得这么晚。我、我没有在等你，只是碰巧而已。', expression: 'blush', affectionChange: 1 },
      { text: '下次的代码审查……可以一起做吗。两个人的话……效率会比较高。只是效率的问题。', expression: 'blush', affectionChange: 2 },
    ]
  },
  ayase: {
    low: [
      { text: '哟！又来了？今天要不要比一场！', expression: 'competitive', affectionChange: 0 },
      { text: '啊——作业好难！你做完了吗？让我看看……才不是要抄啦！', expression: 'grin', affectionChange: 0 },
    ],
    mid: [
      { text: '呐呐，放学后要不要一起去买东西？不是约会啦！只是……顺路！', expression: 'blush', affectionChange: 1 },
      { text: '【安静了一会儿】……今天不想比赛了。就……这样待着也挺好的。', expression: 'soft_smile', affectionChange: 1 },
    ],
    high: [
      { text: '……你说，如果我不想赢你了，是不是很奇怪？【声音越来越小】', expression: 'blush', affectionChange: 2 },
      { text: '笨蛋……别用那种眼神看我啦！我只是、只是……算了你根本不懂！', expression: 'pout', affectionChange: 1 },
    ]
  },
  kanna: {
    low: [
      { text: '……', expression: 'normal', affectionChange: 0 },
      { text: '……嗯。', expression: 'slight_smile', affectionChange: 0 },
    ],
    mid: [
      { text: '……你的座位。我留了。', expression: 'slight_smile', affectionChange: 1 },
      { text: '这道题……O(n) 就能解。……要我教你吗。', expression: 'contemplative', affectionChange: 1 },
    ],
    high: [
      { text: '……今天你没来。图书馆……很安静。比平时更安静。', expression: 'warm_smile', affectionChange: 2 },
      { text: '我写了一个程序……给你的。运行一下。……不要在这里运行。回家再看。', expression: 'blush', affectionChange: 2 },
    ]
  },
  murasame: {
    low: [
      { text: '……又来了。别挡着屏幕的光。', expression: 'cold', affectionChange: 0 },
      { text: '你的代码像意大利面。不是夸你。', expression: 'smirk', affectionChange: 0 },
    ],
    mid: [
      { text: '……这道题留给你了。别让我失望。', expression: 'smirk', affectionChange: 0 },
      { text: '【把自己的咖啡推过来】……我不喝第二杯。浪费可耻。不是给你的。', expression: 'cold', affectionChange: 1 },
    ],
    high: [
      { text: '……你还在啊。【声音放轻了】……嗯，也好。', expression: 'genuine_smile', affectionChange: 1 },
      { text: '切……跟你说了多少次了，别在我面前露出那种表情。会让人……算了。', expression: 'vulnerable', affectionChange: 2 },
    ]
  }
};
```

### 5.3 自由对话 UI 流程

```
[玩家选择地点] → [显示该地点角色的立绘 + 背景]
                        │
              [预设第一句台词（根据好感度/事件）]
                        │
              ┌─── 对话模式 ───┐
              │                │
       [显示文字输入框]   [显示 3 个预设选项]
       （高级模式）        （简易模式，LLM 生成 3 个合适选项）
              │                │
              └──── 合并 ──────┘
                        │
              [发送到 LLM API → 获取回复]
                        │
              [显示角色回复 + 表情切换]
                        │
              [循环 3-8 轮 → 自动结束 or 玩家选择离开]
                        │
              [更新好感度 → 返回自由时段地图]
```

> **关键细节**：玩家可以选择「文字输入」或「选项选择」两种对话方式。选项选择模式下，LLM 先根据上下文生成 3 个合适的玩家选项供选择，降低输入门槛。

---

## 六、美术资源规范

### 6.1 角色立绘方案（SVG 动漫风）

每个角色由多层 SVG 组成，支持表情差分切换：

```
角色 SVG 结构：
├── 身体层（body）—— 固定不变
│   └── 校服/便服切换
├── 头发层（hair）—— 角色识别核心
│   ├── 后发层（z-index 低）
│   └── 前发层（z-index 高）
├── 面部基底（face）—— 固定
├── 眉毛层（eyebrows）—— 表情差分
├── 眼睛层（eyes）—— 表情差分核心
├── 嘴巴层（mouth）—— 表情差分
├── 腮红层（blush）—— 可选显示
└── 特效层（effects）—— 汗滴/爱心/怒气符号

表情切换 = 替换 眉毛+眼睛+嘴巴+腮红 层的 SVG path data
```

#### 每角色表情集（8 种）

| 角色 | 表情 1 | 表情 2 | 表情 3 | 表情 4 | 表情 5 | 表情 6 | 表情 7 | 表情 8 |
|------|--------|--------|--------|--------|--------|--------|--------|--------|
| Nene | normal | smile | gentle_smile | blush | confused | surprised | sad | thinking |
| Yoshino | normal | cold | slight_smile | blush | tsundere_pout | angry | glasses_adjust | rare_gentle |
| Ayase | normal | grin | competitive | blush | pout | fired_up | surprised | soft_smile |
| Kanna | normal | slight_smile | absorbed | blush | surprised | contemplative | warm_smile | teary |
| Murasame | normal | smirk | impressed | blush | cold | genuine_smile | vulnerable | fierce |

#### 角色外貌 SVG 配色

```css
/* Nene */
--nene-hair: #F4C2D0;      /* 浅粉色长发 */
--nene-eyes: #9B7DC8;       /* 浅紫色瞳 */
--nene-accent: #D4E8F7;     /* 淡蓝开衫 */

/* Yoshino */
--yoshino-hair: #1A1A2E;    /* 黑色长直 */
--yoshino-eyes: #6A3D9A;    /* 深紫瞳 */
--yoshino-accent: #F5F5F5;  /* 整洁白衬衫 */

/* Ayase */
--ayase-hair: #FF8C42;      /* 亮橙双马尾 */
--ayase-eyes: #3DAA6D;      /* 翠绿瞳 */
--ayase-accent: #FFE066;    /* 活力黄配饰 */

/* Kanna */
--kanna-hair: #7BA7C9;      /* 银蓝波波头 */
--kanna-eyes: #C9A96E;      /* 淡金瞳 */
--kanna-accent: #E8DDD0;    /* 大围巾色 */

/* Murasame */
--murasame-hair: #8B1A1A;   /* 深红高马尾 */
--murasame-eyes: #D4AF37;   /* 金色瞳 */
--murasame-accent: #1A1A1A; /* 黑色特制校服 */
```

### 6.2 场景背景（CSS/SVG 生成，含时段变体）

共需 10+ 张背景，每张需支持 昼/夕/夜 三个时段变体 = 30+ 变体

| 编号 | 场景 | 实现方式 | 昼/夕/夜 |
|------|------|---------|---------|
| BG01 | 校门前 | CSS 渐变天空 + SVG 校舍建筑 + 樱花树 | ✅/✅/✅ |
| BG02 | 走廊 | CSS 线性渐变地板 + SVG 窗框 + 光影 | ✅/✅/✅ |
| BG03 | 教室 | SVG 课桌椅 + 黑板 + 窗外光线变化 | ✅/✅/✅ |
| BG04 | 计算机教室 | SVG 电脑排列 + 屏幕发光效果 | ✅/✗/✅ |
| BG05 | 图书馆 | SVG 书架 + 阅读灯 + 安静氛围 | ✅/✅/✅ |
| BG06 | 天台 | CSS 天空渐变 + SVG 栏杆 + 城市远景 | ✅/✅/✅ |
| BG07 | 夜间计算机教室 | BG04 暗化 + 单屏幕光源 | ✗/✗/✅ |
| BG08 | 文化祭会场 | SVG 装饰 + 灯笼 + 人群剪影 | ✗/✅/✅ |
| BG09 | 屋顶（烟火） | CSS 夜空 + Canvas 烟火粒子 | ✗/✗/✅ |
| BG10 | 主角房间 | SVG 书桌 + 电脑 + 床 | ✅/✗/✅ |

#### 时段变体实现方式
```css
.background-scene {
  /* 基础场景 */
  --sky-gradient: linear-gradient(180deg, #87CEEB, #E0F0FF);  /* 昼 */
  --ambient-light: rgba(255, 255, 255, 0.3);
  --shadow-intensity: 0.2;
}

.background-scene.evening {
  --sky-gradient: linear-gradient(180deg, #FF6B35, #FFB347, #87CEEB);
  --ambient-light: rgba(255, 165, 0, 0.3);
  --shadow-intensity: 0.4;
  filter: sepia(0.15) saturate(1.3);
}

.background-scene.night {
  --sky-gradient: linear-gradient(180deg, #0C1445, #1A237E, #283593);
  --ambient-light: rgba(100, 100, 255, 0.1);
  --shadow-intensity: 0.7;
  filter: brightness(0.4) contrast(1.1) saturate(0.7);
}
```

### 6.3 UI 设计规范

```css
/* ===== 全局设计令牌 ===== */
:root {
  /* 主题色 */
  --primary: #6C5CE7;         /* 学园紫（主色调） */
  --primary-light: #A29BFE;
  --secondary: #00CEC9;       /* 编程绿（代码/挑战） */
  --accent: #FD79A8;          /* 恋爱粉（好感度相关） */
  --danger: #E17055;          /* 错误红 */
  --success: #00B894;         /* 正确绿 */

  /* 对话框 */
  --dialogue-bg: rgba(10, 10, 30, 0.85);
  --dialogue-border: rgba(108, 92, 231, 0.5);
  --dialogue-text: #F0F0F0;
  --dialogue-name-bg: linear-gradient(135deg, var(--primary), var(--primary-light));

  /* 字体 */
  --font-display: 'Noto Serif JP', serif;        /* 角色名/标题 */
  --font-body: 'Noto Sans JP', sans-serif;        /* 正文 */
  --font-code: 'Fira Code', 'Source Code Pro', monospace;  /* 代码 */

  /* 对话框布局 */
  --dialogue-box-height: 200px;
  --dialogue-box-padding: 20px 24px;
  --dialogue-box-radius: 8px;
  --name-tag-radius: 4px;
}
```

#### 对话框布局
```
┌──────────────────────────────────────────────────────────┐
│  [背景图 · 全屏]                                         │
│                                                          │
│     [角色立绘 A]                    [角色立绘 B]           │
│     （说话中·100%不透明度）          （待机·50%不透明度）    │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │ ┌──────────┐                                        ││
│  │ │  寧  々  │ (角色名标签，带角色主题色)                ││
│  │ └──────────┘                                        ││
│  │                                                      ││
│  │ 「欢迎来到 Alethicode 学园！                          ││
│  │   以后有什么编程问题都可以来找我哦～」                  ││
│  │                                                      ││
│  │                                          [▼ 点击继续] ││
│  └──────────────────────────────────────────────────────┘│
│                                                          │
│  [LOG] [AUTO] [SKIP] [SAVE] [LOAD] [CONFIG]  (底部功能栏) │
└──────────────────────────────────────────────────────────┘

内心独白样式：
  - 文字颜色: rgba(200, 200, 255, 0.9)
  - 无角色名标签
  - 前后加括号：（这个人看起来很温柔呢……）

旁白样式：
  - 无角色名标签
  - 文字居中显示
  - 字体稍大、行间距更宽
```

---

## 七、音乐与音效

### 7.1 BGM 清单（8+ 首）

| 编号 | 场景用途 | 风格 | 下载关键词 | 来源 |
|------|---------|------|-----------|------|
| BGM01 | 标题画面 | 钢琴 + 弦乐，青春学园感 | 学園 ピアノ 青春 | DOVA-SYNDROME |
| BGM02 | 日常-上课/课间 | 轻快原声吉他 | 日常 ギター 明るい | DOVA-SYNDROME |
| BGM03 | 日常-温馨 | 钢琴独奏，舒缓 | ピアノ 穏やか 日常 | 甘茶の音楽工房 |
| BGM04 | 编程挑战 | 电子 + 节奏感 | テクノ プログラミング 集中 | 魔王魂 |
| BGM05 | 紧张/竞赛 | 快节奏电子 + 鼓点 | バトル 緊張 スピード | 魔王魂 |
| BGM06 | 恋爱/心动 | 钢琴 + 弦乐四重奏 | 恋愛 切ない ピアノ | DOVA-SYNDROME |
| BGM07 | 悲伤/别离 | 钢琴独奏，缓慢 | 悲しい ピアノ ゆっくり | 甘茶の音楽工房 |
| BGM08 | 神秘/Murasame | 暗色电子 + 弦乐 | ミステリー ダーク 電子音 | 魔王魂 |
| BGM09 | 文化祭 | 欢快管弦 + 打击乐 | お祭り 楽しい にぎやか | DOVA-SYNDROME |
| BGM10 | True End/终章 | 壮大管弦 + 钢琴 | 感動 壮大 エンディング | DOVA-SYNDROME |

**BGM 获取指令：**
```bash
# 从以下免费商用 BGM 网站下载 MP3：
# 1. DOVA-SYNDROME: https://dova-s.jp/
# 2. 魔王魂: https://maou.audio/
# 3. 甘茶の音楽工房: https://amachamusic.chagasi.com/
#
# 搜索上表中的日语关键词，下载 MP3 格式
# 放入 public/assets/audio/bgm/ 目录
# 文件命名：bgm_01_title.mp3, bgm_02_daily.mp3, ...
```

### 7.2 音效清单（15+ 种）

| 编号 | 音效 | 用途 | 获取关键词 |
|------|------|------|-----------|
| SE01 | click.mp3 | 对话翻页/点击 | 決定 ボタン |
| SE02 | select.mp3 | 选择选项 | 選択 |
| SE03 | save.mp3 | 存档成功 | セーブ チャイム |
| SE04 | correct.mp3 | 编程答对 | 正解 ファンファーレ |
| SE05 | wrong.mp3 | 编程答错 | 不正解 ブー |
| SE06 | transition.mp3 | 场景转换 | 場面転換 |
| SE07 | typing.mp3 | 文字逐字显示 | タイピング キーボード |
| SE08 | bell.mp3 | 上课/下课铃 | 学校 チャイム |
| SE09 | door.mp3 | 开门 | ドア 開く |
| SE10 | surprise.mp3 | 惊讶效果 | 驚き |
| SE11 | heartbeat.mp3 | 心动瞬间 | 心臓 ドキドキ |
| SE12 | keyboard_fast.mp3 | 快速打字（Murasame） | キーボード 高速 |
| SE13 | firework.mp3 | 烟火场景 | 花火 |
| SE14 | wind.mp3 | 天台环境音 | 風 穏やか |
| SE15 | page_turn.mp3 | Backlog 翻页 | ページ めくる |
| SE16 | level_up.mp3 | 好感度上升 | レベルアップ |

**SE 获取指令：**
```bash
# 効果音ラボ: https://soundeffect-lab.info/ （日系音效首选）
# Freesound.org（CC0 音效，用英文搜索）
# OtoLogic: https://otologic.jp/
#
# 放入 public/assets/audio/se/ 目录
```

### 7.3 音频管理器规范

```javascript
const AudioManager = {
  bgm: {
    current: null,         // 当前播放的 BGM
    volume: 0.5,           // BGM 音量 (0-1)
    crossfadeDuration: 1500, // 切换 BGM 时的交叉淡入淡出时长 (ms)
  },
  se: {
    volume: 0.7,           // 音效音量
    concurrent: true,      // 允许同时播放多个音效
  },
  // 功能要求:
  // 1. BGM 切换时必须 crossfade，不能硬切
  // 2. 场景切换时根据 script 指令自动切换 BGM
  // 3. BGM / SE 音量独立控制
  // 4. BGM 循环播放
  // 5. 所有音频加载失败时静默处理（不崩溃）
  // 6. 首次交互后再播放（浏览器 autoplay 策略）
};
```

---

## 八、完整技术架构

### 8.1 项目目录结构

```
Alethicode/
├── package.json              # Vue 3 + Vite
├── vite.config.js
├── index.html
├── public/
│   └── assets/
│       ├── characters/        # 角色立绘 SVG（运行时可用 Vue 组件替代）
│       ├── backgrounds/       # 背景素材（如有外部图片）
│       ├── ui/               # UI 图标/装饰素材
│       └── audio/
│           ├── bgm/          # BGM MP3 文件
│           └── se/           # 音效 MP3 文件
└── src/
    ├── main.js               # Vue 应用入口
    ├── App.vue               # 根组件（场景路由）
    │
    ├── engine/               # ===== VN 引擎核心 =====
    │   ├── VNEngine.js       # 状态机 + 游戏主循环
    │   ├── ScriptRunner.js   # 脚本指令解释器
    │   ├── SaveManager.js    # 存档管理（localStorage）
    │   ├── AudioManager.js   # 音频管理（BGM/SE）
    │   ├── LLMManager.js     # LLM API 调用 + Fallback
    │   └── TransitionManager.js # 画面过渡效果
    │
    ├── components/           # ===== 游戏 UI 组件 =====
    │   ├── TitleScreen.vue        # 标题画面
    │   ├── GameScreen.vue         # 游戏主画面（容器）
    │   ├── DialogueBox.vue        # 对话框（逐字显示+自动+快进）
    │   ├── CharacterLayer.vue     # 角色立绘层（SVG 渲染+表情切换）
    │   ├── BackgroundLayer.vue    # 背景层（CSS/SVG + 时段变体）
    │   ├── ChoiceMenu.vue         # 选项菜单（2-4 选项+动画）
    │   ├── CodingChallenge.vue    # 编程挑战（选择/填空/排序三模式）
    │   ├── LocationSelect.vue     # 地点选择地图（自由时段用）
    │   ├── FreeTalkPanel.vue      # 自由对话面板（LLM 驱动）
    │   ├── SaveLoadPanel.vue      # 存读档界面
    │   ├── BacklogPanel.vue       # 历史对话回看
    │   ├── SettingsPanel.vue      # 设置面板
    │   ├── GalleryScreen.vue      # CG 鉴赏 + 音乐鉴赏
    │   ├── TransitionOverlay.vue  # 场景过渡遮罩层
    │   └── StatusToast.vue        # 好感度变化提示（非数值，用❤图标）
    │
    ├── characters/           # ===== 角色 SVG 组件 =====
    │   ├── NeneSprite.vue
    │   ├── YoshinoSprite.vue
    │   ├── AyaseSprite.vue
    │   ├── KannaSprite.vue
    │   └── MurasameSprite.vue
    │
    ├── scripts/              # ===== 剧情脚本 =====
    │   ├── prologue.js            # 序章（80-100 条对话）
    │   ├── chapter1.js            # 第一章（120-150 条）
    │   ├── chapter2.js            # 第二章（130-160 条）
    │   ├── chapter3.js            # 第三章（150-180 条）
    │   └── routes/
    │       ├── nene.js            # Nene 线（100-130 条）
    │       ├── yoshino.js
    │       ├── ayase.js
    │       ├── kanna.js
    │       └── murasame.js
    │
    ├── data/                 # ===== 游戏数据 =====
    │   ├── characters.js          # 角色完整数据（含 LLM prompt）
    │   ├── challenges.js          # 编程题库（29 道）
    │   ├── locations.js           # 地点数据
    │   ├── fallbackDialogues.js   # LLM 失败时的备用对话
    │   └── gameConfig.js          # 游戏配置常量
    │
    └── styles/
        ├── game.css               # 全局样式
        ├── variables.css          # CSS 变量/设计令牌
        ├── dialogue.css           # 对话框样式
        ├── challenge.css          # 编程挑战样式
        └── animations.css         # 过渡/动画
```

### 8.2 VN 引擎指令集（完整）

```javascript
// ===== 基础指令 =====
{ type: 'dialogue', speaker: 'nene', text: '台词', expression: 'smile' }
{ type: 'monologue', text: '（主角内心独白）' }
{ type: 'narration', text: '旁白文字' }

// ===== 选择与分支 =====
{ type: 'choice', prompt: '提示文字',
  options: [
    { text: '选项文字', effects: { nene: 5 }, next: 'scene_id', flags: { key: true } },
    ...
  ]
}
{ type: 'condition', check: 'affection.yoshino >= 30', true_branch: 'id', false_branch: 'id' }
{ type: 'jump', target: 'scene_id' }

// ===== 场景演出 =====
{ type: 'bg', src: 'classroom', variant: 'day|evening|night', transition: 'fade|slide|dissolve', duration: 1000 }
{ type: 'char_enter', character: 'nene', position: 'left|center|right', expression: 'smile', animation: 'fade_in|slide_from_left|slide_from_right' }
{ type: 'char_exit', character: 'nene', animation: 'fade_out|slide_out_left' }
{ type: 'char_expression', character: 'nene', expression: 'blush' }
{ type: 'char_move', character: 'nene', to: 'center', duration: 500 }

// ===== 音频 =====
{ type: 'bgm', src: 'bgm_02_daily', fadeIn: 1000 }
{ type: 'bgm_stop', fadeOut: 1000 }
{ type: 'se', src: 'surprise' }

// ===== 特殊效果 =====
{ type: 'screen_effect', effect: 'flash_white|shake|fade_to_black', duration: 500 }
{ type: 'wait', duration: 1000 }
{ type: 'auto_save' }

// ===== 游戏系统 =====
{ type: 'challenge', id: 'ch1_variables', context_dialogue: { before, success, fail, hint } }
{ type: 'location_select', available: ['classroom', 'library', 'rooftop', 'computer_room'] }
{ type: 'free_talk', character: 'nene', max_turns: 5, context: '午休，教室里只有两个人' }
{ type: 'flag', set: 'key_name', value: true }
{ type: 'affection', character: 'nene', change: 5 }
{ type: 'route_decision', logic: '...' }

// ===== CG / 特殊画面 =====
{ type: 'cg', id: 'nene_smile_closeup', transition: 'fade' }
{ type: 'title_card', text: '第一章「Hello, World!」', subtitle: '—— 初识 Python ——' }
{ type: 'ending', type: 'good|normal|true', route: 'nene', title: 'System.love = True' }
```

### 8.3 存档数据结构

```javascript
const saveData = {
  slot: 1,                               // 存档位 (1-6, 0=自动)
  timestamp: Date.now(),
  version: '1.0.0',                      // 用于存档兼容性检查

  // 游戏进度
  currentScript: 'chapter1',             // 当前脚本文件
  instructionIndex: 42,                  // 当前指令位置
  currentChapter: '第一章',
  currentScene: '教室 · 午休',

  // 游戏状态
  playerName: '和真',
  affection: { nene: 15, yoshino: 8, ayase: 12, kanna: 5, murasame: 0 },
  flags: {
    saw_murasame_ch1: true,
    challenge_ch1_1_passed: true,
    // ...
  },
  challengeResults: {
    'ch1_variables': { passed: true, attempts: 1 },
    // ...
  },
  unlockedCGs: ['prologue_01'],
  unlockedBGM: ['bgm_01', 'bgm_02'],

  // LLM 对话历史（压缩存储，每角色只保留最近 10 轮）
  conversationHistory: {
    nene: [{ role: 'user', content: '...' }, { role: 'assistant', content: '...' }],
    // ...
  },

  // 设置
  settings: {
    textSpeed: 30,        // 逐字显示速度 (ms/字)
    autoSpeed: 3000,      // 自动播放间隔 (ms)
    bgmVolume: 0.5,
    seVolume: 0.7,
    fontSize: 'medium',   // small / medium / large
  }
};

// 存储方式: localStorage
// Key 格式: 'alethicode_save_${slot}'
// 自动存档 Key: 'alethicode_save_auto'
```

---

## 九、画面过渡与演出效果

| 效果 | 用途 | CSS 实现 |
|------|------|---------|
| 淡入淡出 | 场景切换（默认） | `opacity 0→1, transition 1s ease` |
| 左滑切换 | 移动到相邻场景 | `translateX(-100%) → 0, transition 0.8s` |
| 白色闪光 | 重要瞬间/冲击 | 白色 overlay `opacity 0→1→0`, 0.3s |
| 画面震动 | 惊吓/冲击 | `@keyframes shake { transform: translateX(±5px) }`, 0.5s |
| 黑屏转场 | 时间跳跃/章节过渡 | 黑色 overlay fade 1s + 章节标题卡 |
| 模糊过渡 | 回忆/幻想 | `filter: blur(0→10px→0)`, 1.5s |
| 粒子庆祝 | 编程题答对 | Canvas confetti 粒子, 2s |
| 樱花飘落 | 标题画面/温馨场景 | CSS animation + 20 个 petal 元素 |
| 文字渐显 | 逐字显示 | `setInterval` 每 30ms 追加一字 |
| 立绘滑入 | 角色登场 | `translateX(±100px) → 0`, `opacity 0→1`, 0.5s |
| 选项展开 | 选择肢出现 | `scaleY(0→1) + opacity`, staggered 0.1s |
| 代码打字机 | 编程题代码展示 | 逐字显示 + 等宽字体 + 光标闪烁 |

---

## 十、快捷键与操作

| 按键 | 功能 |
|------|------|
| 空格 / 回车 / 鼠标点击 | 翻页（下一句对话） |
| 空格（对话逐字显示中） | 跳过动画，立即显示全文 |
| Ctrl（按住） | 快进模式（快速翻页已读文本） |
| S | 打开存档面板 |
| L | 打开读档面板 |
| H / 鼠标滚轮上 | 打开历史对话（Backlog） |
| Esc | 关闭当前面板 / 返回 |
| A | 切换自动播放 |
| F | 全屏切换 |

移动端：
- 点击屏幕 = 翻页
- 上滑 = Backlog
- 长按 = 快进
- 底部功能栏按钮 = 各面板

---

## 十一、响应式设计

```css
/* 桌面端 (默认) */
.game-container {
  width: 1280px;
  height: 720px;
  aspect-ratio: 16 / 9;
}

/* 平板 */
@media (max-width: 1024px) {
  .game-container { width: 100vw; height: 56.25vw; }
  .dialogue-box { font-size: 15px; }
}

/* 手机竖屏 */
@media (max-width: 768px) {
  .game-container { width: 100vw; height: 100vh; }
  .dialogue-box { height: 40vh; font-size: 14px; }
  .character-sprite { max-height: 55vh; }
  .system-buttons { font-size: 12px; }
  /* 编程挑战布局调整为纵向排列 */
  .challenge-container { flex-direction: column; }
}
```

---

## 十二、品质检查清单（上线前全部 ✅）

### 12.1 功能完整性
- [ ] 标题画面：新游戏 / 继续 / 读档 / CG鉴赏 / 音乐鉴赏 / 设置，全部可用
- [ ] 序章 → 第一章 → 第二章 → 第三章 全流程可走通
- [ ] 5 条角色线各自可完整通关至结局画面
- [ ] 所有 11 个结局均可到达（5 Good + 5 Normal + 1 True）
- [ ] True End 在全线 Good End 通关后正确解锁
- [ ] Murasame 隐藏线在满足条件时正确解锁
- [ ] 所有 29 道编程题可正确作答、判定、给反馈
- [ ] 选择题/填空题/排序题三种题型的 UI 和交互都正常
- [ ] 所有选择肢正确影响好感度和剧情分支
- [ ] 日程选择（课间/午休/放学后 × 5 地点）正常运作
- [ ] LLM 自由对话正常生成，角色人设一致
- [ ] LLM 失败时 fallback 预设对话正确显示
- [ ] 存档/读档功能正常（6 个手动位 + 1 个自动位）
- [ ] 自动存档在每章开头 + 每个选择点前正确触发
- [ ] Backlog（历史对话）可正常浏览，包含 LLM 对话
- [ ] CG 鉴赏画廊正确显示已解锁/未解锁状态
- [ ] 音乐鉴赏播放已解锁 BGM
- [ ] 设置面板所有选项生效（文字速度/自动速度/音量/字体大小）

### 12.2 体验品质
- [ ] 文字逐字显示流畅，速度可调
- [ ] 点击可跳过逐字显示，直接显示全文
- [ ] 自动模式节奏自然（等文本长度动态调整等待时间）
- [ ] 快进模式仅跳过已读文本，未读文本正常显示
- [ ] BGM 切换有 crossfade，无硬切突兀感
- [ ] 所有场景转换有过渡动画
- [ ] 立绘登场/退场/表情切换有动画过渡
- [ ] 选择肢出现有展开动画
- [ ] 编程题答对有庆祝粒子效果，答错有提示动画
- [ ] 好感度变化有心形图标微动画提示（不显示数值）
- [ ] 对话框美观，文字清晰，角色名标签带角色主题色
- [ ] 内心独白/旁白/普通对话在样式上有明显区分
- [ ] 代码在编程题中用等宽字体 + 语法高亮显示
- [ ] 移动端可正常游玩
- [ ] 所有快捷键生效

### 12.3 内容质量
- [ ] 所有预设对话无错别字、无语法错误
- [ ] 每位角色的口癖和说话风格一致
- [ ] 角色间对话有化学反应（互动自然、有梗）
- [ ] 编程知识点准确，答案正确
- [ ] 编程题解析清晰易懂
- [ ] 每条路线有足够的情感铺垫和高潮
- [ ] 结局文案有足够感染力
- [ ] Murasame 的解锁条件有足够暗示引导玩家
- [ ] 全部五位角色的 fallback 对话库足够丰富（各好感度段至少 5 条）

### 12.4 容错与健壮性
- [ ] LLM API 超时（10s）/ 报错时平滑降级到 fallback
- [ ] 存档 localStorage 满时提示玩家
- [ ] 存档数据损坏时优雅处理（提示而非崩溃）
- [ ] 音频文件加载失败时静默继续
- [ ] SVG 立绘渲染异常时显示角色名色块占位
- [ ] 网络完全断开时编程挑战和预设剧情仍可正常游玩
- [ ] 浏览器自动播放策略处理（首次点击后才播放 BGM）
- [ ] 长时间游玩（2h+）无内存泄漏

---

## 十三、开发里程碑（执行顺序）

```
━━━ Phase 1: 引擎基座（必须最先完成）━━━━━━━━━━━━━━━━
  ① 项目脚手架（Vue 3 + Vite + 目录结构 + 基础配置）
  ② VN 引擎核心（VNEngine.js + ScriptRunner.js 状态机）
  ③ 对话系统（DialogueBox.vue：逐字显示 + 翻页 + 自动 + 快进）
  ④ 角色立绘系统（CharacterLayer.vue + SVG 表情切换）
  ⑤ 背景系统（BackgroundLayer.vue + CSS/SVG + 时段变体）
  ⑥ 存档系统（SaveManager.js + SaveLoadPanel.vue）
  ⑦ 音频系统（AudioManager.js + BGM crossfade + SE）

━━━ Phase 2: 交互系统 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⑧ 选择肢系统（ChoiceMenu.vue + 好感度联动）
  ⑨ 编程挑战（CodingChallenge.vue：选择/填空/排序三模式）
  ⑩ 日程/地点选择（LocationSelect.vue + 自由时段逻辑）
  ⑪ LLM 集成（LLMManager.js + FreeTalkPanel.vue + Fallback）

━━━ Phase 3: 内容填充（最大工作量）━━━━━━━━━━━━━━━━━━
  ⑫ 角色 SVG 立绘绘制（5角色 × 8表情 = 40 套表情差分）
  ⑬ 场景背景制作（10场景 × 3时段 = 30 变体）
  ⑭ BGM / SE 下载与集成
  ⑮ 序章剧本编写与注入（80-100 条对话 + 2 编程题）
  ⑯ 第一章剧本（120-150 条 + 3 题 + 3 自由时段事件）
  ⑰ 第二章剧本（130-160 条 + 4 题 + 编程赛事件）
  ⑱ 第三章剧本（150-180 条 + 4 题 + 文化祭 + 路线分歧）
  ⑲ 5 条角色线剧本（各 100-130 条 + 各 3 题 + 结局）
  ⑳ Fallback 对话库填充（5角色 × 3好感段 × 5条 = 75 条）

━━━ Phase 4: 打磨交付 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ㉑ 标题画面精修（Logo + 动画 + 菜单交互）
  ㉒ 过渡动画与演出效果调校
  ㉓ Backlog 面板 + CG/音乐鉴赏
  ㉔ 设置面板（文字速度/音量/字号）
  ㉕ 快捷键绑定 + 移动端适配
  ㉖ 全品质检查清单验收（第十二节全部 ✅）
  ㉗ 通关测试：至少完整通关 1 条线（确认 ≥2 小时）
```

---

## 十四、附录

### 14.1 角色好感度增减规则汇总

| 行为 | 好感度变化 |
|------|-----------|
| 主线对话选了关心她的选项 | +3 ~ +5 |
| 主线对话选了冷漠/得罪她的选项 | -1 ~ -3 |
| 编程题答对（关联角色） | +2 ~ +3 |
| 编程题答错（关联角色） | +1（鼓励型角色如 Nene）/ 0（其他） |
| 自由时段去她所在的地点 | +1（基础拜访奖励） |
| LLM 自由对话中获得角色认可 | +0 ~ +2（LLM 返回值控制） |
| 好感度阈值事件完成 | +5（特殊奖励） |
| 烟火选择了她 | +10（最终分歧加权） |
| 编程赛赢了她 | +3（Ayase/Yoshino 特有） |
| 编程赛输给她 | -1 ~ 0 |

### 14.2 命名约定

```
文件名：kebab-case (dialogue-box.vue)
组件名：PascalCase (DialogueBox)
脚本变量：camelCase (currentChapter)
CSS 类名：BEM (dialogue-box__text--active)
常量：UPPER_SNAKE (MAX_AFFECTION)
存档 Key：snake_case (alethicode_save_1)
BGM 文件：bgm_XX_name.mp3
SE 文件：se_XX_name.mp3
角色 ID：小写英文 (nene, yoshino, ayase, kanna, murasame)
```

### 14.3 性能预算

| 指标 | 目标 |
|------|------|
| 首屏加载 | < 3s（4G 网络） |
| 场景切换 | < 500ms |
| LLM 响应 | < 5s（含 UI loading 动画） |
| 内存占用 | < 200MB |
| localStorage 存档总大小 | < 5MB |
| 60fps | 所有动画保持 60fps |