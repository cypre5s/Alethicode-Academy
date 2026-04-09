export const chapter1 = [
  { type: 'title_card', text: '第一章「Hello, World!」', subtitle: '—— 初识 Python ——' },

  // ===== 晨间 · 教室 =====
  { type: 'bg', src: 'classroom_day', transition: 'fade', duration: 1000 },
  { type: 'bgm', src: 'daily', fadeIn: 1000 },
  { type: 'monologue', text: '转学第二天。昨晚几乎没怎么睡着，满脑子都是那双金色的眼眸。精神状态堪忧。' },
  { type: 'monologue', text: '不过现在没时间想这些了——今天要正式开始学编程了。高能量的一天，开始！' },
  { type: 'char_enter', character: 'ayase', position: 'right', expression: 'grin', animation: 'slide_from_right' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '早！昨天回去预习了吗？我可是预习到凌晨两点！卷到飞起！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '虽然大部分看不懂就是了……我真的会谢。' },
  { type: 'monologue', text: '（这家伙到底是在炫耀还是在自嘲……汗流浃背了吧。）' },

  { type: 'choice', prompt: '要怎么回应她？',
    options: [
      { text: '「我也预习了一点！一起加油吧」', effects: { ayase: 3 } },
      { text: '「……凌晨两点？你身体没问题吧」', effects: { ayase: 2 } },
      { text: '「我完全没预习，现在开始慌了」', effects: { ayase: 1, nene: 1 } }
    ]
  },

  { type: 'char_enter', character: 'yoshino', position: 'left', expression: 'cold', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '吵什么呢，一大早的。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '你们两个的预习报告我已经检查了。Ayase，你的注释写得一塌糊涂。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '哈？！注释这种东西又不影响运行！' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '不写注释的代码，三天后连自己都看不懂。这是编程的基本素养。' },
  { type: 'monologue', text: '（班长大人一早就开始散发威压……氛围瞬间变得严肃了。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '不过——至少你们有在学习。这一点值得肯定。' },
  { type: 'monologue', text: '（咦？这是在夸人吗？来自芳乃的……稀有好评？）' },
  { type: 'char_exit', character: 'yoshino', animation: 'fade_out' },
  { type: 'char_exit', character: 'ayase', animation: 'fade_out' },

  { type: 'se', src: 'bell' },
  { type: 'narration', text: '上课铃声响起。' },

  // ===== 上课 · 变量概念 =====
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '大家好～今天我们来学习一个非常重要的概念——变量！' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '变量就像是一个「盒子」，可以把数据装进去。' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '比如 name = "Alice"，就是在一个叫 name 的盒子里装了 Alice 这个名字。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '而且盒子里的东西可以换！如果再写 name = "Bob"，盒子里就变成 Bob 了哦～' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '来试试看吧！' },

  // 编程题 1-1
  { type: 'challenge', id: 'ch1_variables',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'smile', text: '注意看代码里变量被赋值了几次哦～' },
      success: { speaker: 'nene', expression: 'gentle_smile', text: '太棒了！你理解变量的赋值了！' },
      fail: { speaker: 'ayase', expression: 'grin', text: '变量就像便签纸，写了新的旧的就没啦！' }
    }
  },

  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '接下来我们学字符串的拼接～' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '在 Python 里，用 + 号就可以把两个字符串连在一起。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '比如 "Hello" + " World" 就会变成 "Hello World"！' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '很直观吧？来做一道练习～' },

  // 编程题 1-2
  { type: 'challenge', id: 'ch1_string_concat',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'gentle_smile', text: '试试看用什么符号把两段文字连起来～' },
      success: { speaker: 'nene', expression: 'smile', text: '完美！+ 号既能算数字，也能拼文字呢！' },
      fail: { speaker: 'nene', expression: 'thinking', text: '提示：就是加号哦，字符串的「加法」！' }
    }
  },

  { type: 'char_exit', character: 'nene', animation: 'fade_out' },
  { type: 'se', src: 'bell' },

  // ===== 自由时段：课间 =====
  { type: 'narration', text: '下课铃响了。午休之前，还有一小段课间时间。' },
  { type: 'monologue', text: '（可以到处走走看看……去哪里好呢？）' },
  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch1_classroom' },
    { id: 'computer_room_day', character: 'nene', next: 'ch1_computer' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch1_rooftop' },
    { id: 'library_day', character: 'kanna', next: 'ch1_library' }
  ]},
]

export const ch1_classroom = [
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'normal', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '……你没出去？在教室里学习吗？' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '既然你在，我有个建议——写代码的时候，变量名要有意义。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: 'a、b、x 这种命名是不允许的。student_name、total_score 这样才合格。' },
  { type: 'monologue', text: '（虽然很严格，但好像是有用的建议……）' },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, context: '课间，教室里只有你们两个人' },
  { type: 'char_exit', character: 'yoshino', animation: 'fade_out' },
  { type: 'jump', target: 'ch1_afternoon' }
]

export const ch1_computer = [
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1000 },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '啊，你来了！我正在准备下节课的内容呢～' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '要不要先看看下节课会学什么？我可以给你「剧透」一点点哦。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '下节课是 input() 函数……就是让程序能接收用户输入的东西。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '就像……我问你问题，你回答我。程序也能这样跟人「对话」呢！' },
  { type: 'monologue', text: '（她说话的方式真的很温柔，让人觉得编程也没那么可怕了。）' },
  { type: 'free_talk', character: 'nene', max_turns: 3, context: '课间，计算机教室里你们两个人' },
  { type: 'char_exit', character: 'nene', animation: 'fade_out' },
  { type: 'jump', target: 'ch1_afternoon' }
]

export const ch1_rooftop = [
  { type: 'bg', src: 'rooftop_day', transition: 'fade' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'grin', animation: 'slide_from_right' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '哟！你也来天台了！这里的风超舒服的！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '对了对了，刚才那道变量题你答对了吧？我也答对了哦！含金量还在升！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '不过接下来的题肯定更难！涂山——啊不对，这道题我罩的，懂？' },
  { type: 'monologue', text: '（她的眼睛在阳光下闪闪发光。虽然很吵，但这种显眼包式的元气也挺让人精神的。）' },
  { type: 'free_talk', character: 'ayase', max_turns: 3, context: '课间，天台上吹着风' },
  { type: 'char_exit', character: 'ayase', animation: 'fade_out' },
  { type: 'jump', target: 'ch1_afternoon' }
]

export const ch1_library = [
  { type: 'bg', src: 'library_day', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1000 },
  { type: 'narration', text: '图书馆里安静得能听到翻页的声音。' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'absorbed', animation: 'fade_in' },
  { type: 'narration', text: '角落里，那个银蓝色头发的女生正在专注地看着什么。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……你来了。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……这本。《Python 从入门到精通》。适合你。' },
  { type: 'monologue', text: '（她好像一直在这里等我似的……还专门挑了一本入门书。）' },
  { type: 'free_talk', character: 'kanna', max_turns: 3, context: '课间，安静的图书馆' },
  { type: 'char_exit', character: 'kanna', animation: 'fade_out' },
  { type: 'jump', target: 'ch1_afternoon' }
]

// ===== 午后 · Ayase 代码爆炸事件 =====
export const ch1_afternoon = [
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'bgm', src: 'daily', crossfade: 1000 },
  { type: 'se', src: 'bell' },
  { type: 'narration', text: '午后的课继续了。这次是实操练习——每个人都要在电脑上写一个小程序。' },
  { type: 'char_enter', character: 'nene', position: 'left', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '这次的练习是：用 input() 获取用户的名字，然后输出欢迎语～' },
  { type: 'monologue', text: '（嗯……input 是获取输入，然后用 print 输出……格局打开了，应该不难？）' },
  { type: 'narration', text: '大家开始敲键盘。教室里响起此起彼伏的键盘声。' },
  { type: 'se', src: 'keyboard_fast' },
  { type: 'narration', text: '突然——' },
  { type: 'se', src: 'wrong' },
  { type: 'screen_effect', effect: 'shake', duration: 400 },
  { type: 'char_enter', character: 'ayase', position: 'right', expression: 'surprised', animation: 'slide_from_right' },
  { type: 'dialogue', speaker: 'ayase', expression: 'surprised', text: '啊啊啊啊！又报错了！为什么总是 NameError！！我直接裂开！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '我明明写了 print 啊！为什么名字显示不出来！不是，这合理吗？！' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: 'あやせ同学，让我看看……啊，我知道了。你的代码行顺序不太对哦。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '你是在获取用户输入之前就想使用变量了～这样变量还不存在，就会报错。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '唔……可是我不知道哪行该放前面哪行该放后面……' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '那就让你的同桌来帮帮忙吧？把代码排列成正确的顺序试试看～' },
  { type: 'monologue', text: '（诶？！要我来？）' },

  // 编程题 1-3
  { type: 'challenge', id: 'ch1_debug_ayase',
    context_dialogue: {
      before: { speaker: 'ayase', expression: 'pout', text: '拜托了……帮我把代码排好吧！' },
      success: { speaker: 'ayase', expression: 'blush', text: '哼、哼……不是不会，只是一时没注意到顺序而已！' },
      fail: { speaker: 'nene', expression: 'thinking', text: '先获取输入，才能使用那个变量哦～' }
    }
  },

  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '啊啊运行成功了！夯爆了！谢——……我是说，算你这次帮了我。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '下次我一定自己搞定！超级加倍的努力！绝对！' },

  { type: 'choice', prompt: '看着 Ayase 元气满满的样子——',
    options: [
      { text: '「有这股劲头的话，很快就能赶上来了」', effects: { ayase: 3 } },
      { text: '「下次记得先理清代码的执行顺序」', effects: { ayase: 1, yoshino: 2 } },
      { text: '「其实我刚才也差点搞错了」', effects: { ayase: 2, nene: 1 } }
    ]
  },

  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '大家都很努力呢。编程就是这样，犯错是进步的一部分哦～' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '对了，{playerName} 同学，你能理解 input() 和 print() 的配合方式了吗？' },
  { type: 'monologue', text: '（Nene 认真地看着我，那双浅紫色的眼眸里闪着期待的光。）' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '如果有不懂的地方，随时可以来找我。我不会觉得麻烦的……因为教人本来就是我的使命。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '而且……和你聊天的时候，我好像会产生一些不在预设参数范围内的数据。' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '……啊，这大概只是系统波动吧。请不要在意。' },
  { type: 'monologue', text: '（不在预设参数范围内的数据……这是 AI 会有的烦恼吗？）' },

  { type: 'char_exit', character: 'ayase', animation: 'fade_out' },
  { type: 'char_exit', character: 'nene', animation: 'fade_out' },

  // ===== 自由时段：午休 =====
  { type: 'narration', text: '午休时间到了。' },
  { type: 'monologue', text: '（剩下的午休时间，要去哪里呢……）' },
  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch1_noon_yoshino' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch1_noon_ayase' },
    { id: 'library_day', character: 'kanna', next: 'ch1_noon_kanna' },
    { id: 'computer_room_day', character: 'nene', next: 'ch1_noon_nene' }
  ]},
]

export const ch1_noon_yoshino = [
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'cold' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '又来了？……算了，正好。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '你刚才帮 Ayase 排序代码的思路不错。代码的执行顺序是最基础的概念。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '记住这一点，以后会少很多 Bug。' },
  { type: 'affection', character: 'yoshino', change: 2 },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, context: '午休，教室' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch1_evening' }
]

export const ch1_noon_ayase = [
  { type: 'bg', src: 'rooftop_day', transition: 'fade' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'soft_smile' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……嘿。谢谢你刚才帮我。别急别急，听我说完——' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '才、才不是因为感谢才跟你说的！只是觉得……同桌应该互相帮忙嘛！不讲了不讲了！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '下次我有问题还会来找你！你要做好心理准备！' },
  { type: 'affection', character: 'ayase', change: 2 },
  { type: 'free_talk', character: 'ayase', max_turns: 3, context: '午休，天台' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch1_evening' }
]

export const ch1_noon_kanna = [
  { type: 'bg', src: 'library_day', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1000 },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'slight_smile' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……又来了。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……你知道吗。代码的顺序……就像叙事的顺序。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……先因后果。这是最基本的逻辑。' },
  { type: 'affection', character: 'kanna', change: 2 },
  { type: 'free_talk', character: 'kanna', max_turns: 3, context: '午休，安静的图书馆' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch1_evening' }
]

export const ch1_noon_nene = [
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '你来找我啦？好开心！' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '今天的课你学得很好呢。帮 Ayase 排序代码的时候，我就知道你有编程的直觉！' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '不知道为什么……看到你学会新东西的样子，我的数据处理器——啊不是，我心里的情绪价值直接爆表了。' },
  { type: 'affection', character: 'nene', change: 2 },
  { type: 'free_talk', character: 'nene', max_turns: 3, context: '午休，计算机教室' },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch1_evening' }
]

// ===== 自由时段：放学后 + 章末 =====
export const ch1_evening = [
  { type: 'bg', src: 'classroom_evening', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'romantic', crossfade: 2000 },
  { type: 'narration', text: '放学后，夕阳透过教室的窗户，把一切都染成了橘红色。' },
  { type: 'monologue', text: '（今天学了变量、字符串拼接、还帮 Ayase Debug 了代码……收获满满，高能量的一天。）' },

  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '今天辛苦了！{playerName} 同学进步好快呢～' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '明天我们会学「字符串的进阶操作」——像是如何提取文字的一部分、如何把文字翻转之类的。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '听起来有点难……但我会用最通俗的方式来讲的！一起加油哦！' },

  { type: 'choice', prompt: '看着认真的 Nene——',
    options: [
      { text: '「有你在，什么都不怕了」', effects: { nene: 3 } },
      { text: '「期待明天的课。我会好好预习的」', effects: { nene: 2, yoshino: 1 } },
      { text: '「编程果然很有意思呢」', effects: { nene: 1, ayase: 1 } }
    ]
  },

  { type: 'char_exit', character: 'nene', animation: 'fade_out' },
  { type: 'monologue', text: '（放学后还有一点时间，去哪里逛逛呢？）' },
  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch1_eve_yoshino' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch1_eve_ayase' },
    { id: 'library_day', character: 'kanna', next: 'ch1_eve_kanna' },
    { id: 'computer_room_day', character: 'nene', next: 'ch1_eve_nene' }
  ]},
]

export const ch1_eve_yoshino = [
  { type: 'bg', src: 'classroom_evening', transition: 'fade' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'normal' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '还在教室？……我也是。在整理今天的课件。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '今天只是基础中的基础。接下来会越来越难。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '但是……你今天的表现，不算太差。继续保持。' },
  { type: 'affection', character: 'yoshino', change: 1 },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch1_night' }
]

export const ch1_eve_ayase = [
  { type: 'bg', src: 'rooftop_evening', transition: 'fade' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'soft_smile' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '嘿……你也来看夕阳啊。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'normal', text: '今天真是充实的一天。编程比我想象的有趣多了。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '明天的课我一定要比你答得更快！做好准备吧！' },
  { type: 'affection', character: 'ayase', change: 1 },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch1_night' }
]

export const ch1_eve_kanna = [
  { type: 'bg', src: 'library_day', transition: 'fade' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'warm_smile' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……三次了。你今天来了三次。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……我很高兴。' },
  { type: 'affection', character: 'kanna', change: 2 },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch1_night' }
]

export const ch1_eve_nene = [
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'gentle_smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '你还在学校？放学后也来找我，好勤奋呢～' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '明天我们要学循环了。如果提前预习的话，上课会更轻松哦！' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '下课后……如果你有空的话，还可以再来找我。不是因为你是学生……是因为……嗯，就是这样！' },
  { type: 'affection', character: 'nene', change: 2 },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch1_night' }
]

// ===== 章末：夜间伏笔 =====
export const ch1_night = [
  { type: 'bg', src: 'hallway_night', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'mystery', crossfade: 2000 },
  { type: 'monologue', text: '（回宿舍的路上，又经过了那间计算机教室……）' },
  { type: 'monologue', text: '（今天也亮着灯。那个人……还在里面吗？）' },
  { type: 'se', src: 'keyboard_fast' },
  { type: 'narration', text: '键盘声比昨天更加急促。透过门上的玻璃窗，隐约能看到屏幕上飞速滚动的代码。' },
  { type: 'monologue', text: '（那速度……完全不是初学者能达到的。那个人到底是谁？）' },

  { type: 'choice', prompt: '要敲门进去吗？',
    options: [
      { text: '鼓起勇气敲门', effects: { murasame: 2 }, flags: { ch1_knocked_door: true } },
      { text: '……算了，还是别打扰了', effects: {} }
    ]
  },

  { type: 'condition', check: { flag: 'ch1_knocked_door', value: true },
    true_branch: 'ch1_knock_murasame', false_branch: 'ch1_night_leave'
  }
]

export const ch1_knock_murasame = [
  { type: 'se', src: 'door' },
  { type: 'narration', text: '你轻轻敲了敲门。键盘声停了。' },
  { type: 'narration', text: '门缝中透出冷冽的屏幕光。几秒后——' },
  { type: 'se', src: 'door_creak' },
  { type: 'narration', text: '门开了一条缝。一双金色的眼眸从阴影中凝视着你。' },
  { type: 'dialogue', speaker: '???', text: '……你是谁。' },
  { type: 'monologue', text: '（声音低沉而锐利。那种气场……完全不像学生。）' },
  { type: 'dialogue', speaker: '???', text: '新生？这个时间还在学校晃？你有胆量——或者只是路痴。' },
  { type: 'dialogue', speaker: '???', text: '算了，不重要。别踩到我的电源线。……走吧。' },
  { type: 'narration', text: '门合上了。金色眼眸的余韵在黑暗中久久不散。' },
  { type: 'monologue', text: '（那个人……到底是谁？为什么夜里独自在计算机教室？）' },
  { type: 'flag', set: 'saw_murasame_ch1', value: true },
  { type: 'jump', target: 'ch1_night_end' }
]

export const ch1_night_leave = [
  { type: 'narration', text: '这次没有人开门。但键盘声在你转身离开的那一刻，停了下来。' },
  { type: 'monologue', text: '（……总觉得被注意到了。）' },
  { type: 'flag', set: 'saw_murasame_ch1', value: true },
  { type: 'jump', target: 'ch1_night_end' }
]

export const ch1_night_end = [

  { type: 'bg', src: 'player_room_night', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'evening_calm', crossfade: 1500 },
  { type: 'monologue', text: '躺在床上，回想着今天学到的东西。' },
  { type: 'monologue', text: '变量、字符串、input、print……短短一天，我已经可以写一个简单的「对话程序」了。' },
  { type: 'monologue', text: '虽然还很基础，但第一次让电脑按照自己的想法说话……' },
  { type: 'monologue', text: '那种感觉，确实有点上头。我将辞职——啊不对，我将逃课在家研究。开玩笑的。' },
  { type: 'monologue', text: '明天……会更有趣吧。' },

  { type: 'bg', src: 'black', transition: 'fade', duration: 2000 },
  { type: 'bgm_stop', fadeOut: 2000 },
  { type: 'narration', text: '—— 第一章「Hello, World!」· 完 ——' },
  { type: 'auto_save' }
]
