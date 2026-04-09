export const prologue = [
  // ===== P-01: 开场独白 =====
  { type: 'bg', src: 'black', transition: 'none' },
  { type: 'monologue', text: '收到转学通知的那天，我完全没想到——' },
  { type: 'monologue', text: '自己的人生会因为几行代码彻底改变。' },
  { type: 'wait', duration: 800 },
  { type: 'bg', src: 'school_gate_day', transition: 'fade', duration: 2000 },
  { type: 'bgm', src: 'morning_fresh', fadeIn: 1500 },
  { type: 'monologue', text: '「Alethicode 学园」——名字听起来就很厉害的样子，夯爆了属于是。' },
  { type: 'monologue', text: '虽然我连 Python 是什么都不太清楚就是了……' },
  { type: 'monologue', text: '（是一种蛇？还是一种编程语言？不管了，重生之我在编程学园，冲就完了。）' },
  { type: 'narration', text: '春天的樱花正在纷飞。在花瓣的映衬下，校门上的铭牌闪着金色的光。' },
  { type: 'monologue', text: '好了……深呼吸，走进去吧。' },
  { type: 'narration', text: '怀着忐忑不安的心情，我踏进了校门。' },

  // ===== P-02: 遇见 Nene（走廊） =====
  { type: 'bg', src: 'hallway_day', transition: 'slide', duration: 800 },
  { type: 'narration', text: '走廊里阳光明媚，墙上贴满了各种编程竞赛的海报和学生作品。' },
  { type: 'monologue', text: '（哇……全是代码相关的东西。果然是编程学校啊。）' },
  { type: 'narration', text: '正当我四处张望的时候——' },
  { type: 'se', src: 'surprise' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '啊，你就是今天转来的新同学吧？欢迎来到 Alethicode 学园！' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '我是綾地寧々，学园的 AI 助教。以后有任何编程问题都可以来找我哦。' },
  { type: 'monologue', text: '（AI 助教……？这个学校还有这种设定？活人感也太强了吧。）' },
  { type: 'monologue', text: '（不过她看起来完全就是普通的少女啊……温柔的笑容，情绪价值直接拉满。）' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '你看起来有点紧张呢～不用担心，这里的大家都很友好的。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '对了，你叫什么名字呢？' },
  { type: 'monologue', text: '（嗯……该怎么回答呢。）' },
  { type: 'choice', prompt: '', options: [
    { text: '「请多关照！你看起来不像 AI 啊」', effects: { nene: 3 } },
    { text: '「AI？那你会算圆周率到小数点后多少位？」', effects: { nene: 1 } },
    { text: '「……我对编程完全是零基础，没关系吗？」', effects: { nene: 5 } }
  ]},
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '诶……不像 AI 吗？那是……谢谢？还是应该纠正呢……' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '不管怎样，能遇到你真的很高兴！教室在前面左转第二间，我带你过去吧。' },
  { type: 'char_exit', character: 'nene', animation: 'fade_out' },

  // ===== P-03: 入座遇 Ayase（教室） =====
  { type: 'bg', src: 'classroom_day', transition: 'fade', duration: 1000 },
  { type: 'narration', text: '推开教室的门，里面已经坐了不少同学。' },
  { type: 'narration', text: '黑板上写着「Python 入门班 · A-101」。' },
  { type: 'monologue', text: '（好紧张……该坐哪里好呢。）' },
  { type: 'se', src: 'surprise' },
  { type: 'char_enter', character: 'ayase', position: 'right', expression: 'grin', animation: 'slide_from_right' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '嘿！你就是转学生？坐我旁边！我是三司あやせ！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '听说你完全不会编程？不是哥们，那我岂不是赢麻了！哈哈——' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '不过别太差劲哦！我想要的是能追上我的对手，懂？' },
  { type: 'monologue', text: '（好元气的女生……整个教室的显眼包，双马尾在她说话的时候不停地甩来甩去。）' },
  { type: 'choice', prompt: '', options: [
    { text: '「完全没学过，有点紧张……」', effects: { ayase: 3, nene: 2 } },
    { text: '「哦？那你很厉害了？」', effects: { ayase: 5 } },
    { text: '「你好吵啊……」', effects: { ayase: 2 } },
    { text: '「编程？我来这里是因为听说食堂很好吃」', effects: { ayase: 2, yoshino: -1 } }
  ]},
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '哈哈！不管怎样，以后就是同桌了！命运的齿轮开始转动——一起加油吧！' },

  // ===== P-04: 自我介绍选择 =====
  { type: 'char_exit', character: 'ayase', animation: 'fade_out' },
  { type: 'narration', text: '这时，一位年轻的男教师走进了教室。' },
  { type: 'dialogue', speaker: 'kiryu_sensei', text: '大家好，我是桐生，负责这个班的编程课。今天有新同学转入，请上来自我介绍一下吧。' },
  { type: 'monologue', text: '（来了……自我介绍环节。精神状态开始不稳定了。）' },
  { type: 'choice', prompt: '桐生先生让你做自我介绍——', options: [
    { text: '「我是转学生，编程零基础，请多关照！」', effects: { nene: 2, yoshino: 1, kanna: 1, ayase: -1 } },
    { text: '「虽然是新手，但我会努力追上大家的！」', effects: { ayase: 3, murasame: 1, yoshino: 2 } },
    { text: '「……请多关照」', effects: { kanna: 3 } },
    { text: '「编程？我来这里是因为听说食堂很好吃」', effects: { ayase: 2, nene: 1, yoshino: -2 } }
  ]},
  { type: 'narration', text: '教室里传来零星的笑声。看来大家都挺友好的。' },

  // ===== P-05: Nene 上课 + 第一道编程题 =====
  { type: 'bgm', src: 'daily', crossfade: 1500 },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '大家好~接下来由我来讲解 Python 的基础知识哦！' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '在 Python 中，要在屏幕上输出文字，我们使用 print() 函数。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '比如 print("Hello, World!") 就会输出 Hello, World! 哦～' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '这就像对电脑说「请把这句话显示出来」，很简单吧？' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '来，让我考考大家～' },
  { type: 'challenge', id: 'tutorial_01_hello_world',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'smile', text: '来试试吧！选出正确的写法～' },
      success: { speaker: 'nene', expression: 'gentle_smile', text: '完美！你果然很有天赋！' },
      fail: { speaker: 'ayase', expression: 'grin', text: '哈哈，这是其他语言的写法啦！Python 用 print() 哦！' }
    }
  },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '很好！大家都掌握了 print 的用法呢！' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '那来试试第二题——' },
  { type: 'challenge', id: 'tutorial_02_print',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'gentle_smile', text: '这次是填空题哦～补全代码！' },
      success: { speaker: 'nene', expression: 'smile', text: '答对了！你学得好快呀～' },
      fail: { speaker: 'nene', expression: 'thinking', text: '提示：输出函数叫 print 哦～' }
    }
  },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '太棒了！第一节课就到这里，大家休息一下吧～' },
  { type: 'char_exit', character: 'nene', animation: 'fade_out' },

  // ===== P-06: 午休 · Yoshino 出场 =====
  { type: 'se', src: 'bell' },
  { type: 'narration', text: '下课铃声响起，同学们三三两两地走出教室。' },
  { type: 'bgm', src: 'peaceful', crossfade: 1500 },
  { type: 'monologue', text: '（午休时间到了。今天的课比想象中简单，但后面应该会越来越难吧……）' },
  { type: 'char_enter', character: 'yoshino', position: 'left', expression: 'cold', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '……你就是新来的转学生？' },
  { type: 'monologue', text: '（一头乌黑如瀑的长发，经典的公主切。气质严肃得让人想站直。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '我是班长朝武芳乃。有两件事先说清楚——' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '第一，班级编程周测不允许缺席。第二，代码提交前必须通过 lint 检查。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '我不在乎你是不是新手。标准不会因为任何人降低。做完你的，做你的。' },
  { type: 'monologue', text: '（好、好严格……这就是传说中的班长大人吗……内核也太稳定了。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '……听到了吗。' },
  { type: 'choice', prompt: '', options: [
    { text: '「明白了！我会努力跟上的。」', effects: { yoshino: 3 } },
    { text: '「lint 检查是什么……？」', effects: { yoshino: 1, nene: 1 } },
    { text: '「你说话好严肃啊……」', effects: { yoshino: -1, ayase: 1 } }
  ]},
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '……总之，希望你不要拖班级的后腿。' },
  { type: 'char_expression', character: 'yoshino', expression: 'slight_smile' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '不过……能主动来编程学校的人，应该不至于太差。加油。' },
  { type: 'monologue', text: '（诶？最后那句话……好像有点温柔？）' },
  { type: 'char_exit', character: 'yoshino', animation: 'fade_out' },

  // ===== P-07: 放学 · Kanna 出场 =====
  { type: 'bg', src: 'school_gate_evening', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'evening_calm', crossfade: 1500 },
  { type: 'narration', text: '放学的铃声响过之后，我走出了校门。' },
  { type: 'narration', text: '夕阳把校园染成了橘红色。' },
  { type: 'monologue', text: '（第一天就这样结束了。虽然编程很新鲜，但大家都好有个性啊……每个人都是显眼包。）' },
  { type: 'narration', text: '正想着的时候，差点被脚下的什么东西绊倒——' },
  { type: 'se', src: 'surprise' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'normal', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'kanna', expression: 'normal', text: '……' },
  { type: 'monologue', text: '（哇！！这里居然蹲着一个人！完全没注意到！）' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……你踩到我的书了。' },
  { type: 'monologue', text: '（银蓝色的短发……围着一条大围巾——这天明明很暖和啊。）' },
  { type: 'monologue', text: '（她手里捧着一本厚厚的书，封面写着《算法导论》。）' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……新来的。你的 Hello World……写得不错。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……虽然只是一行 print。' },
  { type: 'monologue', text: '（她居然在关注新生的课堂练习？这个人……有点不可思议。）' },
  { type: 'choice', prompt: '', options: [
    { text: '「你一直在这里看书吗？」', effects: { kanna: 2 } },
    { text: '「《算法导论》？好厉害的书……」', effects: { kanna: 3 } },
    { text: '「对不起踩到你的书了！」', effects: { kanna: 1 } }
  ]},
  { type: 'dialogue', speaker: 'kanna', expression: 'normal', text: '……嗯。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……图书馆。如果你想学更多的话。那里有答案。' },
  { type: 'narration', text: '说完，她默默地站起来，像猫一样无声地走远了。' },
  { type: 'monologue', text: '（好安静的女生……但刚才说的话，让人忍不住想去图书馆看看。）' },
  { type: 'char_exit', character: 'kanna', animation: 'fade_out' },

  // ===== P-08: 夜间伏笔 =====
  { type: 'bg', src: 'hallway_night', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'mystery', crossfade: 2000 },
  { type: 'monologue', text: '（回宿舍的路上，经过计算机教室时——）' },
  { type: 'monologue', text: '（这么晚了……计算机教室还亮着灯？）' },
  { type: 'narration', text: '透过门缝传来飞快的键盘敲击声。' },
  { type: 'se', src: 'keyboard_fast' },
  { type: 'monologue', text: '（透过门缝看到一个身影……深红色的长发，在黑暗中被屏幕光映照着。）' },
  { type: 'monologue', text: '（键盘敲击声飞快得不像话。这含金量……那个人是……？）' },
  { type: 'se', src: 'door_creak' },
  { type: 'monologue', text: '（门突然被从里面打开——）' },
  { type: 'screen_effect', effect: 'flash_white', duration: 300 },
  { type: 'narration', text: '只看到一双金色的眼眸在黑暗中闪了一下。' },
  { type: 'dialogue', speaker: '???', text: '……偷窥可不是好习惯。' },
  { type: 'dialogue', speaker: '???', text: '如果你是来学编程的——还差得远。' },
  { type: 'narration', text: '门重新关上了。走廊恢复了寂静。' },
  { type: 'monologue', text: '（那个人是谁……？金色的眼睛、深红的长发……那种压迫感……直接破防了。）' },
  { type: 'monologue', text: '（不知道为什么，心跳加速了。DNA 动了。）' },
  { type: 'flag', set: 'saw_murasame_ch1', value: true },

  // ===== P-09: 序章结束 =====
  { type: 'bg', src: 'player_room_night', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'peaceful', crossfade: 1500 },
  { type: 'monologue', text: '回到房间，躺在床上回想今天发生的一切。' },
  { type: 'monologue', text: '温柔的 AI 助教寧々、严厉的班长芳乃、元气的同桌あやせ、神秘的图书馆少女栞那……' },
  { type: 'monologue', text: '还有那个在深夜计算机教室里、像传说一样存在的人。' },
  { type: 'monologue', text: '明天开始，真正的编程学习就要开始了。' },
  { type: 'monologue', text: '虽然完全是零基础……但不知道为什么，我有点期待。敬自己一杯，明天继续。' },
  { type: 'bg', src: 'black', transition: 'fade', duration: 2000 },
  { type: 'bgm_stop', fadeOut: 2000 },
  { type: 'narration', text: '—— 序章「转入 Alethicode 学园」· 完 ——' },
  { type: 'auto_save' }
]
