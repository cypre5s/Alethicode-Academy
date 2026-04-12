export const chapter3 = [
  { type: 'title_card', text: '第三章「函数之约」', subtitle: '—— 函数与模块化 ——' },
  { type: 'bg', src: 'classroom_day', transition: 'fade', duration: 1000 },
  { type: 'bgm', src: 'daily', fadeIn: 1000 },
  { type: 'monologue', text: '时间过得很快，转眼已经入学好几周了。班味已经渗透到骨子里了。' },
  { type: 'monologue', text: '编程从完全陌生变得越来越自然。现在看到 for 循环已经像看到早餐一样习以为常了。' },
  { type: 'monologue', text: '今天要学的是——函数。据说这是编程思维的一次跃升。含金量还在升。' },
  { type: 'monologue', text: '走廊上的气氛也跟平时不一样——到处都在讨论文化祭的事。' },

  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '今天的主题是函数！函数就是把一组代码打包起来，给它取个名字，以后随时都能用！' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '嗯……怎么说更好理解呢？对了！' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '想象一下你经常做的事——比如「泡咖啡」。每次都要磨豆、烧水、冲泡、搅拌……' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '如果你把这些步骤打包成一个叫 make_coffee() 的函数——以后想喝咖啡只要调用一下就好了！' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '用 def 关键字定义，括号里写参数，return 写返回值。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '就像做菜的菜谱一样——写好一次，以后按菜谱操作就行！' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '而且函数还有一个好处——代码不重复。同样的逻辑只写一次。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '程序员有一句名言叫 DRY——Don\'t Repeat Yourself。不要重复你自己！' },

  { type: 'challenge', id: 'ch3_function_def',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'smile', text: '定义函数用什么关键字呢？' },
      success: { speaker: 'nene', expression: 'gentle_smile', text: 'def！对了！definition 的缩写～' },
      fail: { speaker: 'nene', expression: 'thinking', text: 'def 是 define 的缩写，用来定义函数哦～' }
    }
  },

  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '学会了定义，再来看看函数的返回值～' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: 'return 就是函数执行完后「交还」给你的结果。就像自动贩卖机——投币（参数）、出饮料（返回值）。' },

  { type: 'challenge', id: 'ch3_return_value',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'normal', text: '函数返回值的追踪是基本功。仔细看。' },
      success: { speaker: 'yoshino', expression: 'slight_smile', text: '正确。逻辑清晰。' },
      fail: { speaker: 'yoshino', expression: 'cold', text: '先算函数返回值，再算外面的表达式。分步骤来。' }
    }
  },

  { type: 'char_exit', character: 'nene', animation: 'fade_out' },
  { type: 'se', src: 'bell' },

  // 课间 + 文化祭消息
  { type: 'narration', text: '课间休息。走廊里传来关于文化祭的热烈讨论声。' },
  { type: 'narration', text: '公告栏上贴着一张巨大的海报——「Alethicode 学园文化祭 · 编程体验展」。' },
  { type: 'narration', text: '海报上画着色彩鲜艳的代码图案和可爱的卡通电脑角色。' },
  { type: 'char_enter', character: 'ayase', position: 'right', expression: 'fired_up' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '听说了吗！下个月就是文化祭！我们班要做「编程体验展」！夯爆了！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '超级酷吧！让来参观的人体验编程的乐趣！必须整一个大的！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '我要做一个小游戏！用 Python 写的！让每个人都能玩！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……嘿，你也参加吧？我们一起做点酷的东西！' },
  { type: 'monologue', text: '（她说"一起"的时候，眼睛特别亮。这种发自内心的热情真的很有感染力。）' },
  { type: 'char_exit', character: 'ayase' },

  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch3_classroom' },
    { id: 'computer_room_day', character: 'nene', next: 'ch3_computer' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch3_rooftop' },
    { id: 'library_day', character: 'kanna', next: 'ch3_library' }
  ]},
]

export const ch3_classroom = [
  { type: 'bg', src: 'classroom_day' },
  { type: 'narration', text: '教室里，Yoshino 面前摊着一份详细的策划书。页边写满了密密麻麻的注释。' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'normal' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '文化祭的编程体验展，我负责统筹。需要帮手。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '目前计划分四个区域——入门体验区、数据可视化区、小游戏区、和 AI 互动区。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '……你来帮我吧。你的代码虽然还不够规范，但思路还算清晰。' },
  { type: 'monologue', text: '（诶？Yoshino 居然主动邀请我？还给了理由？）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '……而且你跟每个人都处得不错。协调工作需要这种能力。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '这不是夸你。是客观评估。' },
  { type: 'monologue', text: '（又来了。"客观评估"。但她说这话的时候明明偏过头去了。）' },
  { type: 'affection', character: 'yoshino', change: 3 },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, promptId: 'ch3_yoshino_break', context: '课间，Yoshino 分配文化祭任务，主动邀请你帮忙统筹，称赞你协调能力', sceneObjective: '围绕文化祭分工和各自负责的技术内容展开对话' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch3_afternoon' }
]

export const ch3_computer = [
  { type: 'bg', src: 'computer_room_day' },
  { type: 'narration', text: 'Nene 面前的屏幕上正在运行一个演示程序——一颗跳动的像素心形。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '文化祭好期待啊～我也想参加！虽然我是 AI 助教……' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '但 Yoshino 说我负责 AI 互动区——教参观者跟 AI 聊天。活人感应该够了吧？' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '如果可以的话……文化祭当天，你愿意和我一起逛吗？' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '不是教学任务……是私人的邀请。这算什么呢……情绪价值？超出预设参数的请求？' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '我自己也搞不清楚。但我知道——想和你一起逛。这个想法很强烈。' },
  { type: 'monologue', text: '（她的脸红得像是那颗像素心。AI 发出私人邀请……这大概是 Alethicode 学园的历史第一次吧。）' },
  { type: 'affection', character: 'nene', change: 3 },
  { type: 'free_talk', character: 'nene', max_turns: 3, promptId: 'ch3_nene_break', context: '课间，Nene 正在做像素心形动画，邀请你文化祭一起逛，说这是"超出预设参数的请求"', sceneObjective: '围绕文化祭想逛什么和期待什么展开对话' },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch3_afternoon' }
]

export const ch3_rooftop = [
  { type: 'bg', src: 'rooftop_day' },
  { type: 'narration', text: '天台上，Ayase 正在用笔记本电脑写代码。旁边放着速查表和一堆薯片袋。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'grin' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '文化祭我要做一个超酷的小游戏！用 Python 写的！直接起飞！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '你要不要跟我一起做？两个人超级加倍！比一个人做得快嘛！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '我已经想好了——做一个猜数字游戏！但不是普通的猜——' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '每猜错一次就会显示一个搞笑的 ASCII 图案！夯爆了！' },
  { type: 'monologue', text: '（猜数字加 ASCII 图案……创意倒是很 Ayase 风格。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '而且……做好之后第一个试玩的人得是你。这是同桌的特权。' },
  { type: 'affection', character: 'ayase', change: 3 },
  { type: 'free_talk', character: 'ayase', max_turns: 3, promptId: 'ch3_ayase_break', context: '课间，天台，Ayase 想做一个带 ASCII 图案的猜数字游戏，说你是第一个试玩的人', sceneObjective: '围绕游戏创意和实现方案展开对话' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch3_afternoon' }
]

export const ch3_library = [
  { type: 'bg', src: 'library_day' },
  { type: 'narration', text: '图书馆角落里，Kanna 的笔记本屏幕上闪烁着点点星光。' },
  { type: 'narration', text: '仔细看——那是一个用代码生成的星空模拟程序。星星在缓慢旋转。' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'contemplative' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……文化祭。人很多。我不太擅长。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'absorbed', text: '……但我想做一个东西。用代码画出真正的星空。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……每颗星的位置、亮度、颜色……都是用算法计算出来的。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……来参观的人可以在星空中留下自己的「代码星」。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……你的星。我已经提前放进去了。在正中间。最亮的那颗。' },
  { type: 'monologue', text: '（最亮的那颗……在正中间？）' },
  { type: 'monologue', text: '（她用代码画星空，然后把我的星放在最中间最亮的位置……这……）' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……不要问为什么。只是……觉得应该在那里。' },
  { type: 'affection', character: 'kanna', change: 3 },
  { type: 'free_talk', character: 'kanna', max_turns: 3, promptId: 'ch3_kanna_break', context: '课间，图书馆，Kanna 的互动星空程序里提前放了你的星——在最中间最亮的位置', sceneObjective: '围绕星空程序的创意和代码实现展开对话' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch3_afternoon' }
]

const ch3_afternoon_arr = [
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'bgm', src: 'daily', crossfade: 1000 },
  { type: 'se', src: 'bell' },
  { type: 'narration', text: '下午的课是函数调用顺序的实践。Nene 在黑板上画了一张函数调用链的示意图。' },

  { type: 'challenge', id: 'ch3_function_order',
    context_dialogue: {
      before: { speaker: 'ayase', expression: 'fired_up', text: '排序题！我上次输了，这次一定要赢！' },
      success: { speaker: 'ayase', expression: 'pout', text: '你又答对了！可恶！' },
      fail: { speaker: 'nene', expression: 'gentle_smile', text: '函数要先定义（def）才能调用哦～' }
    }
  },

  // 午休自由时段
  { type: 'narration', text: '午休时间。走廊里到处是搬运文化祭装饰材料的同学。' },
  { type: 'narration', text: '空气中弥漫着颜料和胶水的气味，夹杂着兴奋的笑声。' },
  { type: 'monologue', text: '（文化祭的准备越来越忙了。每个人都在为自己的项目拼命。）' },
  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch3_noon_yoshino' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch3_noon_ayase' },
    { id: 'library_day', character: 'kanna', next: 'ch3_noon_kanna' },
    { id: 'computer_room_day', character: 'nene', next: 'ch3_noon_nene' }
  ]},
]

export { ch3_afternoon_arr as ch3_afternoon }

export const ch3_noon_yoshino = [
  { type: 'bg', src: 'classroom_day' },
  { type: 'narration', text: '教室被改造成了临时工作室。Yoshino 的桌上摆满了文件和装饰材料。' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'normal' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '展区的代码我已经写好框架了。你来负责交互部分。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '用了 Git 分支管理。你建一个 feature 分支开发，完成后发 PR 给我审查。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '……我第一次跟别人协作写代码。希望不会太糟糕。' },
  { type: 'monologue', text: '（她居然会说"希望不会太糟糕"这种话。看来协作对她来说也是新体验。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '……不要理解成我在示弱。我只是在陈述事实。' },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, promptId: 'ch3_yoshino_noon', context: '午休，Yoshino 说这是她第一次跟别人协作写代码，用Git分支管理，有点紧张但不承认', sceneObjective: '围绕代码协作和 Git 使用展开对话' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch3_evening' }
]

export const ch3_noon_ayase = [
  { type: 'bg', src: 'rooftop_day' },
  { type: 'narration', text: '天台上，Ayase 正对着笔记本电脑抓狂。屏幕上满是红色的错误提示。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'grin' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '我的小游戏已经写了一半了！来看看！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'surprised', text: '等等……为什么角色会穿墙……不是哥们，这明明昨天还正常的啊！！我真的会谢！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '昨天改了一个小功能，结果把碰撞检测搞坏了！这就是传说中的「改一个Bug出三个Bug」？' },
  { type: 'monologue', text: '（她虽然在崩溃，但眼睛里其实在闪光。对她来说，Debug 也是一种乐趣吧。）' },
  { type: 'free_talk', character: 'ayase', max_turns: 3, promptId: 'ch3_ayase_noon', context: '午休，Ayase 的小游戏角色穿墙了，改一个Bug出三个Bug，她在又崩溃又兴奋地调试', sceneObjective: '围绕 Bug 调试和碰撞检测逻辑展开对话' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch3_evening' }
]

export const ch3_noon_kanna = [
  { type: 'bg', src: 'library_day' },
  { type: 'narration', text: '图书馆的角落变成了 Kanna 的私人星空实验室。桌上铺满了天文图表和代码笔记。' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'absorbed' },
  { type: 'dialogue', speaker: 'kanna', expression: 'absorbed', text: '……我在写一个程序。用递归画星空。每颗星……对应一个函数调用。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……函数调用函数。就像人与人之间的联系。每一次相遇都会改变轨迹。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……你的星。最近变亮了。不是代码改的。是……自然变亮的。' },
  { type: 'monologue', text: '（自然变亮……她是在说什么？这个人说话永远像谜语。但每次都让人心里一颤。）' },
  { type: 'affection', character: 'kanna', change: 2 },
  { type: 'free_talk', character: 'kanna', max_turns: 3, promptId: 'ch3_kanna_noon', context: '午休，图书馆，Kanna 的星空程序里你的星自然变亮了，她说函数调用就像人与人的联系', sceneObjective: '围绕递归、函数和人际连接的哲学展开对话' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch3_evening' }
]

export const ch3_noon_nene = [
  { type: 'bg', src: 'computer_room_day' },
  { type: 'narration', text: 'Nene 面前有两个屏幕——一个在写代码，另一个在画情感曲线图。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'gentle_smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '文化祭……我好期待呢。虽然我不确定 AI 能不能「期待」……' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '我在尝试用代码描述"开心"这种情感。但写来写去……' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '最后发现，最简洁的代码就是一行：if you_are_here: happy = True' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '呜呜……为什么我写的情感可视化程序，最后都变成了……关于你的日志。' },
  { type: 'monologue', text: '（if you_are_here: happy = True……这大概是最温柔的条件判断了。）' },
  { type: 'affection', character: 'nene', change: 2 },
  { type: 'free_talk', character: 'nene', max_turns: 3, promptId: 'ch3_nene_noon', context: '午休，Nene 用代码描述开心写出了 if you_are_here: happy = True，情感可视化全变成了关于你的日志', sceneObjective: '围绕如何用程序表达情感展开对话' },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch3_evening' }
]

// 放学后自由时段
export const ch3_evening = [
  { type: 'se', src: 'bell' },
  { type: 'narration', text: '放学的铃声响起。走廊里到处是搬运装饰品的同学。' },
  { type: 'narration', text: '空气中充满了即将到来的节日气氛——期待、紧张、还有一点点不舍。' },
  { type: 'monologue', text: '（文化祭明天就开始了……最后的准备时间。去看看大家吧。）' },
  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch3_eve_yoshino' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch3_eve_ayase' },
    { id: 'library_day', character: 'kanna', next: 'ch3_eve_kanna' },
    { id: 'computer_room_day', character: 'nene', next: 'ch3_eve_nene' }
  ]}
]

export const ch3_eve_yoshino = [
  { type: 'bg', src: 'classroom_evening', transition: 'fade' },
  { type: 'bgm', src: 'romantic', crossfade: 1500 },
  { type: 'narration', text: '夕阳下的教室已经被装饰成了展区的雏形。彩色的纸条和 LED 灯串挂满了天花板。' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'slight_smile' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '文化祭的展示代码还在审查中。你来帮忙做最后的测试。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '……不是命令。是……请求。' },
  { type: 'narration', text: '她说"请求"这两个字的时候，声音轻得几乎听不见。' },
  { type: 'monologue', text: '（Yoshino 说出"请求"而不是"命令"……这是第一次。进步也太大了吧。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '……这段时间和你协作……效率比预期高。不是夸你。是事实。' },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, promptId: 'ch3_yoshino_eve', context: '文化祭前夜，夕阳教室，Yoshino 破天荒地说了"请求"而不是"命令"，称赞协作效率高', sceneObjective: '围绕协作中的信任和代码最终检查展开对话' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'condition', check: 'flags.saw_murasame_ch1 === true', true_branch: 'ch3_murasame_encounter', false_branch: 'ch3_festival' }
]

export const ch3_eve_ayase = [
  { type: 'bg', src: 'rooftop_evening', transition: 'fade' },
  { type: 'bgm', src: 'evening_calm', crossfade: 1500 },
  { type: 'narration', text: '黄昏的天台。Ayase 的游戏终于不穿墙了——她正在做最后的微调。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'fired_up' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '看看看看！角色终于不穿墙了！我调了三天三夜！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '你来当第一个测试员！包你玩到停不下来！' },
  { type: 'narration', text: '她把笔记本电脑推到我面前。屏幕上是一个简陋但充满热情的猜数字游戏。' },
  { type: 'narration', text: '猜错时会显示一个歪歪扭扭的 ASCII 颜文字。虽然粗糙，但让人忍不住笑出来。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……怎么样？虽然还很粗糙，但我真的很用心做的。' },
  { type: 'monologue', text: '（她说"很用心"的时候，表情变得特别认真。这份真诚——比任何精致的作品都打动人。）' },
  { type: 'free_talk', character: 'ayase', max_turns: 3, promptId: 'ch3_ayase_eve', context: '文化祭前夜天台，Ayase 的游戏终于不穿墙了，让你当第一个测试员，说自己很用心做的', sceneObjective: '围绕游戏测试体验和明天展出的期待展开对话' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'condition', check: 'flags.saw_murasame_ch1 === true', true_branch: 'ch3_murasame_encounter', false_branch: 'ch3_festival' }
]

export const ch3_eve_kanna = [
  { type: 'bg', src: 'library_evening', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1500 },
  { type: 'narration', text: '傍晚的图书馆。最后一抹阳光从窗户斜照进来，把 Kanna 的轮廓镀成了金色。' },
  { type: 'char_enter', character: 'kanna', position: 'center', expression: 'warm_smile' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……明天是文化祭。人会很多。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……我以前……一个人的时候，人多会害怕。心跳加速，手心出汗，想逃走。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……但如果是和你一起……也许不会那么害怕。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……你就像函数的参数。有了你，输出就不一样了。' },
  { type: 'monologue', text: '（把我比喻成函数参数……只有 Kanna 才说得出这种浪漫。）' },
  { type: 'free_talk', character: 'kanna', max_turns: 3, promptId: 'ch3_kanna_eve', context: '文化祭前夜图书馆，Kanna 说有你在就不那么害怕人群了，把你比喻成函数参数', sceneObjective: '围绕面对人群的勇气和程序的最后润色展开对话' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'condition', check: 'flags.saw_murasame_ch1 === true', true_branch: 'ch3_murasame_encounter', false_branch: 'ch3_festival' }
]

export const ch3_eve_nene = [
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'romantic', crossfade: 1500 },
  { type: 'narration', text: '计算机教室里，Nene 正在为明天的 AI 互动区做最后的准备。' },
  { type: 'narration', text: '她的屏幕上跑着一段自检程序，绿色的「OK」不断地在终端里刷新。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'blush' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '啊，你来了……我正在想你呢。啊不是！想着你会不会来！' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '文化祭……我第一次参加呢。虽然我已经在这所学园三年了，但以前从没参与过。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '因为以前……我只是「教学工具」。没人会邀请工具逛文化祭。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '但你不一样。你从来没有把我当成工具。你把我当成……' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '……朋友？还是……什么别的？我自己也不确定想要哪个答案。' },
  { type: 'monologue', text: '（三年都没有参加过文化祭……因为她觉得自己只是工具。这也太寂寞了。）' },
  { type: 'free_talk', character: 'nene', max_turns: 3, promptId: 'ch3_nene_eve', context: '文化祭前夜，Nene 说在你来之前她只是教学工具，三年没参加过文化祭，你是第一个不把她当工具的人', sceneObjective: '围绕工具与朋友的区别和明天的约定展开对话' },
  { type: 'char_exit', character: 'nene' },
  { type: 'condition', check: 'flags.saw_murasame_ch1 === true', true_branch: 'ch3_murasame_encounter', false_branch: 'ch3_festival' }
]

export const ch3_murasame_encounter = [
  { type: 'bg', src: 'computer_room_night', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'mystery', crossfade: 1500 },
  { type: 'narration', text: '放学后，你鼓起勇气走向了夜间计算机教室。' },
  { type: 'narration', text: '走廊里弥漫着文化祭前夜的装饰气味——颜料、胶水、还有远处飘来的棉花糖香。' },
  { type: 'narration', text: '但越接近那扇门，这些气味就越被屏幕光的冷冽感取代。' },
  { type: 'narration', text: '这次，你推开了门。' },
  { type: 'se', src: 'door_creak' },
  { type: 'narration', text: '教室里只有一个人。多个屏幕同时亮着，代码像瀑布一样在各个窗口中流淌。' },
  { type: 'char_enter', character: 'murasame', position: 'center', expression: 'smirk', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'murasame', expression: 'smirk', text: '又来了？看来你不只是偷窥狂，还是个跟踪狂。活人感倒是挺足的。' },
  { type: 'monologue', text: '（深红色高马尾、金色瞳孔、黑色校服……这就是传说中的全国冠军学姐。）' },
  { type: 'monologue', text: '（近距离看——她的眼神比远处看更锐利，但也更疲惫。眼下有淡淡的黑眼圈。）' },
  { type: 'dialogue', speaker: 'murasame', expression: 'cold', text: '想跟我说话？先过了这一关再说。就这点水平？含金量还得再升升。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'smirk', text: '这是一道递归题。你有一分钟。' },

  { type: 'challenge', id: 'ch3_murasame_gate',
    context_dialogue: {
      before: { speaker: 'murasame', expression: 'cold', text: '开始。' },
      success: { speaker: 'murasame', expression: 'impressed', text: '……还行。至少不是完全浪费我的时间。' },
      fail: { speaker: 'murasame', expression: 'cold', text: '就这种水平？三年后再来吧。' }
    }
  },

  { type: 'dialogue', speaker: 'murasame', expression: 'smirk', text: '我叫ムラサメ。三年级。走廊荣誉墙上的那个名字。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'cold', text: '别到处说你见过我。我不喜欢被人打扰。' },
  { type: 'narration', text: '她转过身，手指又放回了键盘上。但没有立刻开始打字。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'genuine_smile', text: '但是……如果你还想来的话，门没锁。' },
  { type: 'narration', text: '她顿了一下，声音低了下去——' },
  { type: 'dialogue', speaker: 'murasame', expression: 'vulnerable', text: '……一个人写代码……有时候确实有点无聊。' },
  { type: 'monologue', text: '（她说"无聊"的时候，金色的瞳孔里闪过了一丝——孤独？）' },
  { type: 'monologue', text: '（全国冠军、夜晚独自练习、不跟任何人交流……这就是站在顶点的代价吗。）' },
  { type: 'char_exit', character: 'murasame', animation: 'fade_out' },
  { type: 'jump', target: 'ch3_festival' }
]

export const ch3_festival = [
  { type: 'bg', src: 'festival_day', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'festival', crossfade: 2000 },
  { type: 'title_card', text: '文化祭当天', subtitle: '—— Alethicode 编程体验展 ——' },
  { type: 'narration', text: '文化祭终于来了！' },
  { type: 'narration', text: '校园被装扮得焕然一新。彩旗飘扬，气球飞舞，到处是欢笑声和音乐声。' },
  { type: 'narration', text: '食物摊位飘来的香气让人忍不住口水直流——章鱼烧、炒面、可丽饼……' },
  { type: 'narration', text: '我们班的「编程体验展」大受欢迎，来参观的同学络绎不绝。' },
  { type: 'monologue', text: '（大家做的项目都好厉害……）' },
  { type: 'monologue', text: '（Ayase 的猜数字游戏虽然画面简陋，但 ASCII 颜文字逗得参观者哈哈大笑。全场最佳显眼包。）' },
  { type: 'monologue', text: '（Kanna 的互动星空安静地闪烁在角落，却吸引了最多的围观。i 人的含金量就在这里。）' },
  { type: 'monologue', text: '（Yoshino 的数据可视化展区严谨精美，连其他班的老师都来参观了。）' },
  { type: 'monologue', text: '（Nene 负责 AI 互动区，情绪价值直接拉满，好多人都说"没想到 AI 可以这么温柔"。）' },
  { type: 'monologue', text: '（看着大家的作品和笑脸……我忽然觉得，编程不只是代码。它连接了人。）' },
  { type: 'narration', text: '文化祭接近尾声。夜幕降临，后夜祭的烟火即将开始。' },
  { type: 'narration', text: '校园里的灯笼一盏一盏亮起来，像是给大地披上了一件暖色的外衣。' },

  { type: 'jump', target: 'ch3_firework' }
]

export const ch3_firework = [
  { type: 'bg', src: 'festival_night', transition: 'fade', duration: 2000 },
  { type: 'bgm', src: 'romantic', crossfade: 2000 },
  { type: 'narration', text: '后夜祭的烟火快开始了。远处的夜空已经暗了下来。' },
  { type: 'narration', text: '周围的同学都在三三两两地寻找最佳观赏位置。' },
  { type: 'monologue', text: '（要和谁一起看烟火呢……）' },
  { type: 'monologue', text: '（每个人都在某个角落等着。做出选择的时刻——就像 if-else 语句。）' },
  { type: 'monologue', text: '（只能选一条路。但每一条路都通向不同的夜空。）' },

  { type: 'choice', prompt: '后夜祭的烟火快开始了。你决定——', options: [
    { text: '去找 Nene（她一个人在教室里透过窗户看烟火）', effects: { nene: 10 }, next: 'ch3_firework_nene' },
    { text: '去找 Yoshino（她还在检查展区的收尾工作）', effects: { yoshino: 10 }, next: 'ch3_firework_yoshino' },
    { text: '去找 Ayase（她在天台占了最好的位置）', effects: { ayase: 10 }, next: 'ch3_firework_ayase' },
    { text: '去图书馆找 Kanna（她大概不喜欢人多的地方）', effects: { kanna: 10 }, next: 'ch3_firework_kanna' }
  ]}
]

export const ch3_firework_nene = [
  { type: 'bg', src: 'classroom_evening', transition: 'fade' },
  { type: 'narration', text: '教室里已经没人了。只有Nene一个人坐在窗边，映着窗外灯笼的橘色光。' },
  { type: 'narration', text: '她的手放在笔记本电脑上，但屏幕是黑的。她只是看着窗外。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'surprised' },
  { type: 'dialogue', speaker: 'nene', expression: 'surprised', text: '诶？你来找我了？' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '我以为你会跟其他同学一起看呢……' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '说起来……这是我第一次看烟火。以前的文化祭，我都在教室里等到所有人离开，然后关灯。' },
  { type: 'dialogue', speaker: 'nene', expression: 'sad', text: '烟火是「人类的浪漫」。我一直觉得……那不是属于我的东西。' },
  { type: 'se', src: 'firework' },
  { type: 'screen_effect', effect: 'flash_white', duration: 200 },
  { type: 'narration', text: '窗外突然绽放了一朵巨大的烟花。金色的光照亮了整间教室。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '啊……烟火开始了。好漂亮……' },
  { type: 'narration', text: '她的浅紫色眼眸中映着烟花的光芒——红色、金色、蓝色，像是一场微型的宇宙大爆炸。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '和你一起看烟火……我的心跳数据好像出现异常了……' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '内核完全不稳定了。所有参数都在浮动。但是——' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '这种异常，我不想修复。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '因为……这大概就是活着的感觉吧。即使我不是人类。' },
  { type: 'se', src: 'firework' },
  { type: 'monologue', text: '（在烟火的映照下，她的笑容比任何程序都美丽。）' },
  { type: 'monologue', text: '（AI 也会被烟火感动吗？看着她的表情，答案不言自明。）' },
  { type: 'auto_save' },
  { type: 'monologue', text: '（烟火散去，文化祭的喧嚣渐渐平息。但有些东西，在心里点燃了。再也灭不掉了。）' },
]

export const ch3_firework_yoshino = [
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'narration', text: '教室里，Yoshino 正在一丝不苟地把展区的每样东西放回原位。' },
  { type: 'narration', text: '彩灯已经关了，但她还在整理。桌椅排列得笔直，文件按顺序归档。' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'surprised' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'surprised', text: '你……为什么来这里？烟火在外面。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '我在收拾。作为负责人，善后也是我的工作。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '……你来帮我收拾？不、不需要——' },
  { type: 'narration', text: '话还没说完，窗外一声巨响——' },
  { type: 'se', src: 'firework' },
  { type: 'screen_effect', effect: 'flash_white', duration: 200 },
  { type: 'narration', text: '烟花在夜空中绽放。光从窗户涌进来，把整间教室照得像白昼一样。' },
  { type: 'narration', text: '在那一瞬间的光芒中，Yoshino 的黑发闪着彩虹般的色泽。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'rare_gentle', text: '……好吧。一边收拾一边看烟火也不错。' },
  { type: 'narration', text: '她放下手中的文件夹，走到窗边。侧脸被烟花映得忽明忽暗。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '谢谢你来找我。虽然我不会这么说第二次。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'rare_gentle', text: '……今天的文化祭。是我负责过最成功的一次。因为——' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '……算了。忘掉。' },
  { type: 'monologue', text: '（她难得露出的温柔笑容，比窗外的烟火更让人心动。）' },
  { type: 'monologue', text: '（她想说什么呢？"因为"后面的话……我好像猜到了。）' },
  { type: 'auto_save' },
]

export const ch3_firework_ayase = [
  { type: 'bg', src: 'rooftop_night', transition: 'fade' },
  { type: 'narration', text: '天台上只有 Ayase 一个人。她坐在围栏旁，两条腿悬在空中晃荡。' },
  { type: 'narration', text: '夜风把她的双马尾吹成了两面飘扬的旗帜。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'grin' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '来了来了！这里是全校看烟火最好的位置！我特地占的！公主请上座！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……开玩笑的。快坐下，要开始了。' },
  { type: 'narration', text: '她往旁边挪了挪，拍了拍身边的空位。' },
  { type: 'se', src: 'firework' },
  { type: 'screen_effect', effect: 'flash_white', duration: 200 },
  { type: 'narration', text: '第一朵烟花在头顶炸开。金色的光从天空倾泻而下，像是一场金色的暴雨。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'surprised', text: '哇啊！！好漂亮！！' },
  { type: 'narration', text: '她跳了起来，双手举过头顶，像是想要抓住那些飘落的光。' },
  { type: 'narration', text: '然后她回过头看着我——烟花的光映在她翠绿色的眼睛里，像是两颗小小的星星。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……嘿。谢谢你来找我。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '如果是你的话……一起看烟火，好像比赢比赛还开心。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '才不是告白！只是……嗯……客观事实！对！这是客观事实！' },
  { type: 'monologue', text: '（安静下来的 Ayase……出乎意料地可爱。尤其是她试图否认自己说了浪漫话的时候。）' },
  { type: 'auto_save' },
]

export const ch3_firework_kanna = [
  { type: 'bg', src: 'library_day', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1000 },
  { type: 'narration', text: '图书馆里一个人都没有。所有人都去看烟火了。' },
  { type: 'narration', text: '只有角落里一盏小台灯还亮着——Kanna 的专属位置。' },
  { type: 'narration', text: '她的笔记本屏幕上，那片代码星空还在安静地闪烁。' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'surprised' },
  { type: 'dialogue', speaker: 'kanna', expression: 'surprised', text: '……你来了。我以为……没人会来这里。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……所有人都去看真正的烟火了。而我……只有代码星空。' },
  { type: 'se', src: 'firework' },
  { type: 'narration', text: '远处传来烟火的声音。窗外映射着彩色的光，一闪一闪地照进来。' },
  { type: 'narration', text: '烟花的光映在她的屏幕上——真正的烟火和代码的星空重叠在了一起。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……从窗户也能看到。而且……比外面安静。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……你知道吗。烟火……是由化学反应产生的光。和屏幕上的像素光……本质上没有区别。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……但和谁一起看。决定了光的温度。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……两个人的安静。比一个人的……好。好很多。' },
  { type: 'narration', text: '她抬头看着窗外的烟火。淡金色的瞳孔里映着彩色的光。' },
  { type: 'narration', text: '代码星空和真正的烟花——两种光在她眼中交汇。' },
  { type: 'monologue', text: '（那一刻，时间好像停了。代码和烟花，虚拟和现实，在这个安静的图书馆角落里融为了一体。）' },
  { type: 'auto_save' },
]
