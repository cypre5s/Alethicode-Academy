# Alethicode Academy — 编程学园恋物语

<p align="center">
  <strong>视觉小说 × Python 编程挑战 × 恋爱养成</strong><br>
  一款原创 Web Galgame
</p>

---

## 简介

你是一名编程零基础的转学生，来到了传说中的 **Alethicode 学园**。在这里，你将一边学习 Python 编程，一边与五位性格迥异的女主角相遇、相知、相恋。

关键剧情由预设脚本驱动，日常对话和自由时段则通过 **LLM（大语言模型）** 实时生成——每次游玩都能获得独一无二的体验。

## 特色

- **完整剧情线** — 序章 + 3 章共通线 + 5 条角色线，共 11 个结局（Good End / Normal End / True End）
- **编程挑战** — 20+ 道 Python 题目（选择 / 填空 / 排序），答对涨好感，答错触发角色吐槽
- **LLM 智能对话** — 自由时段与角色闲聊，AI 基于角色人设 + 好感度动态生成回复
- **5 位可攻略角色** — 各含立绘 + 8 种表情差分
- **完整系统** — 对话（逐字显示 / 自动 / 快进 / Backlog）、选择肢、存读档、CG 鉴赏、设置面板

## 角色一览

| 角色 | 定位 | 编程风格 |
|------|------|----------|
| **綾地寧々** (Nene) | AI 助教 · 温柔导师 | 基础语法导师，擅长生活比喻 |
| **朝武芳乃** (Yoshino) | 班长 · 编程高手 | 代码审查官，追求 Clean Code |
| **三司あやせ** (Ayase) | 同桌 · 元气少女 | 学得快但粗心，暴躁 Debug |
| **明月栞那** (Kanna) | 图书馆常客 · 算法迷 | 算法天才，用最少代码解题 |
| **ムラサメ** (Murasame) | 传说学姐 · 竞赛冠军 | 顶级全栈，直接扔难题 |

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Vue 3 |
| 构建工具 | Vite |
| 部署 | Vercel |
| LLM 对话 | 兼容 OpenAI 格式的 API（默认 DeepSeek） |

## 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) 18+
- 包管理器：npm

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/cypre5s/Alethicode-Academy.git
cd Alethicode-Academy

# 安装依赖
npm install

# 启动开发服务器（浏览器自动打开 http://localhost:3333）
npm run dev
```

### LLM 对话配置（可选）

自由时段的 AI 对话需要配置 API 密钥。在项目根目录创建 `.env.local`：

```env
VITE_DEEPSEEK_API_KEY=你的API密钥
VITE_DEEPSEEK_BASE_URL=https://api.deepseek.com
VITE_DEEPSEEK_MODEL=deepseek-chat
```

> 未配置 API 密钥时，游戏会自动使用预设的 fallback 对话，不影响主线剧情游玩。

## 项目结构

```
Alethicode-Academy/
├── public/assets/          # 静态资源
│   ├── audio/              #   BGM + 音效
│   ├── backgrounds/        #   场景背景（10+ 场景 × 昼/夕/夜）
│   ├── cg/                 #   CG 事件图
│   ├── characters/         #   角色立绘（5 角色 × 8 表情）
│   └── ui/                 #   UI 素材
├── src/
│   ├── characters/         # 角色立绘组件
│   ├── components/         # Vue 组件
│   │   ├── TitleScreen.vue       # 标题画面
│   │   ├── GameScreen.vue        # 主游戏界面
│   │   ├── DialogueBox.vue       # 对话框
│   │   ├── ChoiceMenu.vue        # 选择肢
│   │   ├── CodingChallenge.vue   # 编程挑战
│   │   ├── SaveLoadPanel.vue     # 存读档
│   │   ├── GalleryScreen.vue     # CG/音乐鉴赏
│   │   └── ...
│   ├── data/               # 游戏数据
│   │   ├── characters.js         # 角色配置
│   │   ├── challenges.js         # 编程题库
│   │   └── ...
│   ├── engine/             # 游戏引擎
│   │   ├── VNEngine.js           # 视觉小说核心引擎
│   │   ├── AudioManager.js       # 音频管理
│   │   ├── LLMManager.js         # LLM 对话管理
│   │   └── SaveManager.js        # 存档管理
│   ├── scripts/            # 剧情脚本
│   │   ├── prologue.js           # 序章
│   │   ├── chapter1~3.js         # 共通线三章
│   │   └── routes/               # 角色个人线
│   └── styles/             # 样式
├── tests/                  # 测试
└── tools/                  # 辅助工具脚本
```

## 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览构建产物 |
| `npm test` | 运行测试 |

## 游玩时长

| 内容 | 预计时长 |
|------|----------|
| 序章（新手教程 + 角色介绍） | 15-20 分钟 |
| 共通线三章（含编程挑战 + 自由时段） | 65-80 分钟 |
| 角色个人线（每条） | 15-20 分钟 |
| **单线通关** | **约 80-100 分钟** |
| **全线通关** | **约 3-4 小时** |

## 许可

Developed by dhu_cypress, assisted with opus.
