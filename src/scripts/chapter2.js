export const chapter2 = [
  { type: 'title_card', text: '第二章「循环的旋律」', subtitle: '—— for/while 与列表 ——' },
  { type: 'bg', src: 'school_gate_day', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'morning_fresh', fadeIn: 1000 },
  { type: 'narration', text: '又是新的一天。校门前的樱花已经开始凋落了。' },
  { type: 'narration', text: '花瓣铺满了石板路，走在上面像是踩在粉色的地毯上。' },
  { type: 'monologue', text: '不知不觉已经过了几天。编程课的节奏越来越快了，班味越来越重。' },
  { type: 'monologue', text: '说起来，这几天和大家也渐渐熟悉起来了呢。赛博对账一下——好像每个人都挺有趣的。' },
  { type: 'monologue', text: 'Nene 每天都会给我准备课后练习单；Yoshino 虽然嘴上严厉但总会偷偷给我指点方向。' },
  { type: 'monologue', text: 'Ayase 每天都在喊着要赢我但永远在课上犯新的 Bug……' },
  { type: 'monologue', text: '至于 Kanna——她的图书馆角落已经变成了我的第二个「秘密基地」。' },

  { type: 'bg', src: 'hallway_day', transition: 'slide', duration: 800 },
  { type: 'narration', text: '走廊里的公告栏上贴了一张新海报，用醒目的红色字体写着——' },
  { type: 'narration', text: '「第一回 Alethicode 班级编程赛 · 本周五举行」' },
  { type: 'monologue', text: '（编程赛？！这么快？我才刚学了几天啊……）' },
  { type: 'char_enter', character: 'ayase', position: 'right', expression: 'grin', animation: 'slide_from_right' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '早啊！看到了吗看到了吗！编程赛！DNA 动了！超期待的！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '我昨天预习了一下循环，感觉超简单的！大概吧！不是，应该确实简单！' },
  { type: 'monologue', text: '（说超简单的时候为什么底气不太足……汗流浃背了吧。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '今天的练习你可别输给我哦！编程赛我已经蓄力完毕！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '而且我听说比赛分数会贴在走廊上！必须排名靠前！显眼包的面子不能丢！' },
  { type: 'monologue', text: '（她的双马尾因为兴奋而左右甩动，像两面小旗帜。）' },
  { type: 'char_exit', character: 'ayase', animation: 'slide_out_left' },

  { type: 'bg', src: 'classroom_day', transition: 'fade', duration: 1000 },
  { type: 'bgm', src: 'daily', crossfade: 1500 },
  { type: 'narration', text: '教室里，桐生先生已经在黑板上写下了今天的主题。' },
  { type: 'narration', text: '大字写着「循环」，旁边画了一个箭头指向自己形成的圆环。' },
  { type: 'monologue', text: '「循环」——据说这是编程里最强大的武器之一。你管这叫循环？简直是魔法吧。' },
  { type: 'monologue', text: '（一个命令就能让电脑重复做一万次事情……想想还挺厉害的，格局直接打开。）' },

  { type: 'dialogue', speaker: 'kiryu_sensei', text: '今天的内容是循环。学会了这个，你们就能让程序自动重复执行任务了。' },
  { type: 'dialogue', speaker: 'kiryu_sensei', text: '想象一下——你需要打印学号从 1 到 1000 的学生名单。不用循环的话，你得写 1000 行 print。' },
  { type: 'dialogue', speaker: 'kiryu_sensei', text: '但有了循环……三行就够了。接下来由 Nene 来讲解具体用法。' },

  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '今天我们来学循环！循环就是让电脑重复做同一件事～' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '比如你想打印 100 次"Hello"，总不能写 100 行 print 吧？' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '高斯小时候算 1 加到 100，用了巧妙的数学方法。但我们有循环，可以直接让电脑帮我们加！' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: 'for 循环的写法是：for i in range(次数): 然后缩进写要重复的代码。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '注意！range(n) 会生成 0 到 n-1 的数字序列，一共 n 个。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '为什么从 0 开始呢？这是计算机科学的传统——0 是第一个数字。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '一开始可能不习惯，但用多了就自然了。来试试看吧！' },

  { type: 'challenge', id: 'ch2_for_loop',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'glasses_adjust', text: '注意 range() 的起始值和终止值。细节决定成败。' },
      success: { speaker: 'yoshino', expression: 'slight_smile', text: '……正确。你有在认真听课。' },
      fail: { speaker: 'nene', expression: 'thinking', text: 'range(5) 从 0 开始，到 4 结束，一共 5 个数哦～' }
    }
  },

  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '接下来是 while 循环！它会在条件满足时一直重复执行～' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '就像猜数字游戏——你猜错了就继续猜，猜对了才停下来。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: 'for 适合知道「重复几次」的情况，while 适合「不知道重复几次，但知道什么时候停」的情况。' },

  { type: 'challenge', id: 'ch2_while_loop',
    context_dialogue: {
      before: { speaker: 'kanna', expression: 'contemplative', text: '……循环条件。当条件为真时执行。' },
      success: { speaker: 'kanna', expression: 'slight_smile', text: '……嗯。不等于。简洁。' },
      fail: { speaker: 'nene', expression: 'gentle_smile', text: '当猜的数不等于答案时，就继续循环～不等于写作 != 哦！' }
    }
  },

  { type: 'char_exit', character: 'nene', animation: 'fade_out' },
  { type: 'se', src: 'bell' },

  // ===== 课间自由时段 =====
  { type: 'narration', text: '课间休息时间。走廊里到处都在讨论编程赛的事。' },
  { type: 'monologue', text: '（循环的概念还挺好理解的。接下来应该还有列表……）' },
  { type: 'monologue', text: '（编程赛就在本周五……留给我准备的时间不多了。）' },
  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch2_classroom' },
    { id: 'computer_room_day', character: 'nene', next: 'ch2_computer' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch2_rooftop' },
    { id: 'library_day', character: 'kanna', next: 'ch2_library' }
  ]},
]

export const ch2_classroom = [
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'narration', text: '教室里安静了不少。Yoshino 站在讲台旁，正在更新公告栏上的信息。' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'normal' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '有个消息要宣布。下周会举办班级编程赛。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '每个人都必须参加。不接受弃权。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '题目会覆盖到第二章的所有内容。循环、列表、条件判断都会考到。' },
  { type: 'monologue', text: '（编程比赛？！天啊……我才刚学 for 循环啊。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '别用那种表情看我。我说过——标准不会因为任何人降低。' },
  { type: 'narration', text: '她顿了一下，用手指推了推眼镜。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '不过……往年的题目难度不会超出课堂内容。只要认真学了，就不会太难。' },
  { type: 'monologue', text: '（她说这话的时候虽然语气严厉，但……好像有一点点在意我的反应？）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '……如果你需要复习资料，编程部有整理过往年题目。去拿一份。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '这不是给你开后门。是所有人都能拿的。只是没人会像你这样在课间来教室。' },
  { type: 'monologue', text: '（等等，她这是……在帮我？用这种拐弯抹角的方式。）' },
  { type: 'monologue', text: '（而且「没人会像你这样在课间来教室」是什么意思……她在意我来了？）' },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, promptId: 'ch2_yoshino_break', context: '课间，Yoshino 刚宣布了编程赛消息并建议你拿往年题目复习，她说没人像你一样课间来教室', sceneObjective: '围绕编程赛准备和循环/列表知识展开对话' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch2_afternoon' }
]

export const ch2_computer = [
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'narration', text: '计算机教室里，Nene 正在调试一段看起来很复杂的代码。' },
  { type: 'narration', text: '屏幕上飞速滚动着数字序列——像是某种自动测试程序。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '你来啦！循环的概念掌握了吗？' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '我来给你讲个小故事吧。有一次我尝试用 while True 写了一个无限循环……' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '然后系统差点就崩溃了……那一次，所有学生的屏幕同时黑了三秒钟。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '桐生先生花了二十分钟才修好。从那以后我就特别注意循环的终止条件。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '其实对 AI 来说，无限循环是很可怕的事。就像人类的失眠——' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '大脑一直在转，想停也停不下来。所以记住：每个循环都要有终止的时候哦！' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '就像……嗯……就像故事总要有结局一样。虽然有些故事，我不想让它结束。' },
  { type: 'monologue', text: '（她说最后那句话的时候，看了我一眼。是在说编程吗……还是别的？）' },
  { type: 'free_talk', character: 'nene', max_turns: 3, promptId: 'ch2_nene_break', context: '课间，Nene 讲了一个自己造成无限循环差点让系统崩溃的糗事，说每个循环都要有终止的时候', sceneObjective: '围绕循环终止条件和 while/for 的使用展开对话' },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch2_afternoon' }
]

export const ch2_rooftop = [
  { type: 'bg', src: 'rooftop_day', transition: 'fade' },
  { type: 'narration', text: '天台上，Ayase 正在做着一种奇怪的准备运动——像是拳击前的热身。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'fired_up' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '听说要编程比赛了？！命运的齿轮又开始转动了！！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '这次我一定要赢！尤其是要赢你！含金量超级加倍！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '不过……如果你输了也别太破防啦。毕竟你才刚学嘛～嘿嘿。' },
  { type: 'monologue', text: '（这挑衅……让人莫名地有斗志了。是 e 人无疑了。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……说真的，有你一起学，感觉自己也进步快了很多。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '才、才不是在感谢你！是因为有竞争才有动力！这叫良性竞争懂不懂！' },
  { type: 'monologue', text: '（又来了。嘴上说着不是感谢，但耳朵尖红了。）' },
  { type: 'free_talk', character: 'ayase', max_turns: 3, promptId: 'ch2_ayase_break', context: '课间，天台，Ayase 对编程赛跃跃欲试，嘴上说着要赢你但其实在感谢你的陪伴', sceneObjective: '围绕编程竞赛和比赛策略展开对话' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch2_afternoon' }
]

export const ch2_library = [
  { type: 'bg', src: 'library_day', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1000 },
  { type: 'narration', text: '图书馆的角落里，一台笔记本电脑的屏幕发出幽蓝的光。' },
  { type: 'narration', text: 'Kanna 坐在她固定的位置上，但今天没有看书——她在写代码。' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'absorbed' },
  { type: 'narration', text: '屏幕上显示着不断生成的图案——像是雪花的结晶，又像是星空的分支。' },
  { type: 'narration', text: '每个图案都由更小的图案组成，层层嵌套，像是镜子映照镜子。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'absorbed', text: '……递归。用循环可以做到类似的事……但递归更美。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……循环是「重复」。递归是「自我参照」。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'absorbed', text: '……就像看着湖面上的自己。映射出映射。无限的镜像。' },
  { type: 'monologue', text: '（屏幕上的图案像一朵朵分形的雪花……好漂亮。代码也能创造出这样的艺术。）' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……你想看吗。坐。' },
  { type: 'narration', text: '她轻轻拍了拍身旁已经摆好的椅子。上面放着一杯还热着的可可。' },
  { type: 'monologue', text: '（这杯可可……是给我准备的？她怎么知道我会来？）' },
  { type: 'dialogue', speaker: 'kanna', expression: 'normal', text: '……直觉。' },
  { type: 'monologue', text: '（她看穿了我的疑惑。这个人的观察力……有点吓人。）' },
  { type: 'free_talk', character: 'kanna', max_turns: 3, promptId: 'ch2_kanna_break', context: '课间，图书馆，Kanna 正在用递归生成分形雪花图案，给你准备了热可可', sceneObjective: '围绕递归之美和分形图案展开对话' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch2_afternoon' }
]

// 午后 + 列表练习
const ch2_afternoon_script = [
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'bgm', src: 'daily', crossfade: 1000 },
  { type: 'se', src: 'bell' },
  { type: 'narration', text: '午后的教室，阳光从窗户斜照进来，空气中弥漫着初夏的味道。' },
  { type: 'narration', text: '有几个同学偷偷打着哈欠，但看到 Nene 走上讲台，又赶紧坐直了。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '下午我们来学列表——Python 里最常用的数据容器！' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '大家有没有用过购物清单呢？列表就像一个购物袋。' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '可以装很多东西，还可以往里面添加、删除、排序。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '用方括号创建：fruits = ["apple", "banana"]，用 .append() 添加元素～' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '还有 .sort() 可以排序，.pop() 可以删除最后一个元素哦！' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '列表最强大的地方是——可以和循环配合使用！' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '用 for 遍历列表里的每一个元素，就可以对它们逐个处理了。来试试看——' },

  { type: 'challenge', id: 'ch2_list_sort',
    context_dialogue: {
      before: { speaker: 'ayase', expression: 'fired_up', text: '排序题？来啊！我最擅长了！……大概。' },
      success: { speaker: 'ayase', expression: 'pout', text: '切……你排对了。下次我也一定行！' },
      fail: { speaker: 'nene', expression: 'thinking', text: '先创建列表 → 添加元素 → 排序 → 打印哦～' }
    }
  },

  { type: 'char_exit', character: 'nene' },

  // 午休自由时段
  { type: 'narration', text: '午休时间到了。编程赛临近，走廊里的氛围明显紧张了起来。' },
  { type: 'narration', text: '有人在食堂边吃饭边看编程书，有人在走廊里比手势模拟代码执行流程。' },
  { type: 'monologue', text: '（整个班都在备战。这种紧张感……意外地让人兴奋。）' },
  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch2_noon_yoshino' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch2_noon_ayase' },
    { id: 'library_day', character: 'kanna', next: 'ch2_noon_kanna' },
    { id: 'computer_room_day', character: 'nene', next: 'ch2_noon_nene' }
  ]},
]

export { ch2_afternoon_script as ch2_afternoon }

export const ch2_noon_yoshino = [
  { type: 'bg', src: 'classroom_day' },
  { type: 'narration', text: 'Yoshino 把教室变成了临时指挥部。黑板上密密麻麻写满了比赛规则和知识点纲要。' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'normal' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '编程赛的规则：限时答题，正确率和速度都计分。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '我整理了一份重点大纲。for 循环、while 循环、列表操作、嵌套循环。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '不要紧张。但也别大意。紧张和大意是 Bug 的两大温床。' },
  { type: 'narration', text: '她递过来一张手写的大纲。字迹工整得像是打印的。' },
  { type: 'monologue', text: '（她花了多少时间写这个……而且这份大纲的排版比我见过的任何教材都清晰。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '……这是给全班准备的。不是只给你。' },
  { type: 'monologue', text: '（但你为什么只给了我一份呢，班长大人。）' },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, promptId: 'ch2_yoshino_noon', context: '午休，编程赛前一天，Yoshino 给你一份手写的知识点大纲，说是给全班准备但只给了你一份', sceneObjective: '围绕考前心态和编程知识最后梳理展开对话' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch2_evening' }
]

export const ch2_noon_ayase = [
  { type: 'bg', src: 'rooftop_day' },
  { type: 'narration', text: '天台上，Ayase 正坐在地上，旁边放着一台笔记本电脑和一堆零食。' },
  { type: 'narration', text: '她一边吃薯片一边敲代码，薯片屑洒了一键盘。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'competitive' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '我已经练了一百道题了！……好吧其实是二十道。但也很多了！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '我去，不早说会考这么多内容！range 到底从 0 还是从 1 开始啊！每次都搞混！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '不过没关系！我有秘密武器！' },
  { type: 'narration', text: '她从书包里掏出一张手写的速查表。上面用彩色笔标注了各种语法。' },
  { type: 'monologue', text: '（虽然画满了涂鸦和小表情包，但内容其实挺全的。她也是在认真准备啊。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '怎么样？被我的认真惊到了吧！含金量夯爆了！' },
  { type: 'free_talk', character: 'ayase', max_turns: 3, promptId: 'ch2_ayase_noon', context: '午休，Ayase 在天台一边吃薯片一边刷题，还做了一张彩色速查表，在为比赛临阵磨枪', sceneObjective: '围绕刷题经验和比赛准备展开轻松对话' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch2_evening' }
]

export const ch2_noon_kanna = [
  { type: 'bg', src: 'library_day' },
  { type: 'narration', text: '图书馆依旧安静如常。窗外的阳光在 Kanna 的银蓝色头发上跳舞。' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'contemplative' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……比赛。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'normal', text: '……无所谓胜负。重要的是……你解题时的思维过程。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……就像下棋。每一步都在构建思维的路径。最终的结果……只是路径的终点。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……你不需要赢。你需要的是……理解。' },
  { type: 'monologue', text: '（她的话总是像诗一样。但每次都在我需要的时候，说出最恰当的话。）' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……不过。如果你能赢……我会开心。' },
  { type: 'monologue', text: '（诶？她会开心？这个表情……好像第一次见到。）' },
  { type: 'free_talk', character: 'kanna', max_turns: 3, promptId: 'ch2_kanna_noon', context: '午休，图书馆，Kanna 说比赛胜负无所谓重要的是思维过程，但又说如果你赢了她会开心', sceneObjective: '围绕编程思维方式和问题分解展开对话' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch2_evening' }
]

export const ch2_noon_nene = [
  { type: 'bg', src: 'computer_room_day' },
  { type: 'narration', text: 'Nene 面前的屏幕上打开了一个题库系统——看起来是她在为比赛出题。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'gentle_smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '比赛紧张吗？别担心，就当是一次有趣的挑战吧～' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '而且不管结果如何，你已经学到了很多东西不是吗？这才是最重要的！' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '说起来……作为出题人，我不能给你泄题。但我可以告诉你一个小技巧——' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '遇到看不懂的题目时，先把题目中的关键信息提取出来。不要被文字干扰。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '编程就是把复杂的问题拆成简单的步骤。每一步都不难——难的是知道怎么拆。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '如果你在比赛中遇到困难……就想象我在你身边给你加油。虽然我不能真的在场……' },
  { type: 'monologue', text: '（她的认真和温柔总是让人安心。比起技巧，她教给我的其实是——面对困难的心态。）' },
  { type: 'free_talk', character: 'nene', max_turns: 3, promptId: 'ch2_nene_noon', context: '午休，Nene 作为出题人不能泄题但教了你拆解问题的技巧，说想象她在身边加油', sceneObjective: '围绕学习心态和成长感悟展开对话' },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch2_evening' }
]

// 放学后 → 编程赛
export const ch2_evening = [
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'bgm', src: 'tension', crossfade: 1500 },
  { type: 'narration', text: '编程赛的日子终于到了。' },
  { type: 'narration', text: '教室被重新布置过——每张桌子之间拉起了隔板，防止偷看。' },
  { type: 'narration', text: '黑板上写着大大的「第一回 Alethicode 班级编程赛」，旁边画着一个闪闪发光的奖杯图案。' },
  { type: 'narration', text: '空气中弥漫着紧张和兴奋交织的气氛。' },
  { type: 'monologue', text: '（心跳好快……虽然只是班级比赛，但大家都好认真的样子。精神状态已经紧绷到极限了。）' },
  { type: 'monologue', text: '（Nene 说过——遇到困难就把问题拆开。嗯，我记住了。）' },
  { type: 'char_enter', character: 'yoshino', position: 'left', expression: 'normal' },
  { type: 'char_enter', character: 'ayase', position: 'right', expression: 'fired_up' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '第一回 Alethicode 班级编程赛，现在开始。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '规则很简单：答对得分，限时作答。分数最高者获胜。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '作弊者直接取消成绩。我会盯着的。' },
  { type: 'narration', text: '她环视了一圈教室。那个眼神让人感觉监控摄像头都多余了。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '来了来了！我等这一刻很久了！！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '喂，你可别在比赛里让着我哦！我要的是公平对决！' },
  { type: 'monologue', text: '（让着你……我自己能不能通过都是问题好吗。）' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch2_competition' }
]

export const ch2_competition = [
  { type: 'narration', text: '—— 编程赛 · 决赛题 ——' },
  { type: 'monologue', text: '（前面的几道题还算顺利……现在是最后一道，也是最难的。）' },
  { type: 'narration', text: '教室里安静得只听到键盘声和偶尔的叹气声。所有人都在专注地看着屏幕。' },
  { type: 'narration', text: '时钟在黑板上方滴答作响。倒计时还剩五分钟。' },
  { type: 'monologue', text: '（嵌套循环……外层循环控制行，内层循环控制列……）' },
  { type: 'monologue', text: '（冷静。把问题拆开。就像 Nene 说的那样。）' },
  { type: 'se', src: 'bell' },
  { type: 'challenge', id: 'ch2_nested_loop',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'cold', text: '这是决赛题。嵌套循环。展示你的思维深度。' },
      success: { speaker: 'yoshino', expression: 'slight_smile', text: '……你答对了。难以置信，一个新手。' },
      fail: { speaker: 'nene', expression: 'gentle_smile', text: '外层循环3次，每次内层循环4次，3×4=12 哦～' }
    }
  },

  // 赛后
  { type: 'bgm', src: 'daily', crossfade: 1500 },
  { type: 'narration', text: '比赛结束了。教室里的紧张空气渐渐散去。' },
  { type: 'narration', text: '有人伸了个大大的懒腰，有人趴在桌上像是脱了力，有人兴奋地跟旁边的人对答案。' },
  { type: 'char_enter', character: 'ayase', position: 'right', expression: 'pout' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '啊啊啊！那道嵌套循环我差一点就做对了！！我真的会谢！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'surprised', text: '3 × 4 = 12 啊！我写成 3 + 4 = 7 了！不是哥们，这也太冤种了吧！' },
  { type: 'narration', text: '她一边说一边在空气中疯狂比划，把旁边的同学都吓了一跳。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '下次——下次绝对不会输！！这口气我咽不下去！绝对！' },
  { type: 'char_enter', character: 'yoshino', position: 'left', expression: 'slight_smile' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '你的表现……比我预期的好。' },
  { type: 'monologue', text: '（Yoshino 居然露出了一点笑容。第一次看到她这个表情。倒反天罡了属于是。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '不过不要因此骄傲。接下来的内容会更难。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '函数、模块化……那才是真正考验编程思维的地方。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '大家都辛苦了！不管结果如何，你们今天都很棒哦～' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '编程赛不是目的，是让大家感受到编程的乐趣才重要呢。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '顺便说……有人在比赛中的答题速度刷新了新生记录。虽然我不能说是谁……' },
  { type: 'monologue', text: '（她说这话的时候看了我一眼。不会是我吧……？）' },
  { type: 'char_exit', character: 'nene' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'char_exit', character: 'yoshino' },

  // 放学后自由时段
  { type: 'se', src: 'bell' },
  { type: 'narration', text: '编程赛结束了。放学的铃声响起。教室里还残留着比赛的余温。' },
  { type: 'monologue', text: '（赛后心情还没平复……心脏还在砰砰跳。去走走吧。）' },
  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch2_eve_yoshino' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch2_eve_ayase' },
    { id: 'library_day', character: 'kanna', next: 'ch2_eve_kanna' },
    { id: 'computer_room_day', character: 'nene', next: 'ch2_eve_nene' }
  ]}
]

export const ch2_eve_yoshino = [
  { type: 'bg', src: 'classroom_evening', transition: 'fade' },
  { type: 'bgm', src: 'romantic', crossfade: 1500 },
  { type: 'narration', text: '夕阳下的教室。Yoshino 一个人坐在窗边，面前摊着一份比赛成绩表。' },
  { type: 'narration', text: '金色的阳光照在她认真统计分数的侧脸上。' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'glasses_adjust' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '你还在？……我在整理比赛数据。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '你的成绩排在班级前三。对于一个入学不到两周的新生来说……' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '——不算太差。' },
  { type: 'monologue', text: '（前三？！而且"不算太差"在 Yoshino 的字典里应该等于"相当不错"了吧。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '……别得意。下次考试难度会翻倍。' },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, promptId: 'ch2_yoshino_after', context: '编程赛后，夕阳下的教室，Yoshino 在整理比赛数据，说你排名班级前三', sceneObjective: '围绕比赛结果和自己的表现展开对话' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch2_night' }
]

export const ch2_eve_ayase = [
  { type: 'bg', src: 'rooftop_evening', transition: 'fade' },
  { type: 'bgm', src: 'evening_calm', crossfade: 1500 },
  { type: 'narration', text: '黄昏的天台。天空是渐变的橙紫色，远处的城市灯火开始亮起来。' },
  { type: 'narration', text: 'Ayase 坐在台阶上，难得地没有在大喊大叫。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'soft_smile' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……比赛，还挺好玩的。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'normal', text: '虽然结果不太理想……嵌套循环那道题我真的很不甘心。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '才不是因为输了才不开心！只是……有点不甘心而已。' },
  { type: 'narration', text: '她抱着膝盖，把脸埋进去。马尾在晚风中轻轻飘动。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……但你知道吗，比赛结束后我回去又做了一遍那道题。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '这次做对了！虽然比赛已经结束了，但至少……我搞懂了。' },
  { type: 'monologue', text: '（她的眼睛映着晚霞，闪闪发光。即使输了也不放弃——这就是三司あやせ。）' },
  { type: 'free_talk', character: 'ayase', max_turns: 3, promptId: 'ch2_ayase_after', context: '赛后黄昏的天台，Ayase 不甘心但回去重新做了嵌套循环那道题做对了', sceneObjective: '安慰 Ayase 或聊聊比赛中的收获和遗憾' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch2_night' }
]

export const ch2_eve_kanna = [
  { type: 'bg', src: 'library_evening', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1500 },
  { type: 'narration', text: '傍晚的图书馆，窗外的天空从橙色渐变为深蓝。' },
  { type: 'narration', text: 'Kanna 的桌上摆着一杯已经凉了的可可和一本翻开的书。' },
  { type: 'char_enter', character: 'kanna', position: 'center', expression: 'slight_smile' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……你来了。比赛辛苦了。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……循环。重复的美。你有感受到吗。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'absorbed', text: '……比赛中的每一道题……就像音乐的每一个音符。单独看没有意义。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……但连在一起……就成了旋律。你今天的旋律……很好听。' },
  { type: 'monologue', text: '（把编程比赛比喻成音乐……只有 Kanna 才说得出这种话。）' },
  { type: 'monologue', text: '（而且"很好听"这个评价……从她嘴里说出来，分量特别重。）' },
  { type: 'free_talk', character: 'kanna', max_turns: 3, promptId: 'ch2_kanna_after', context: '傍晚的图书馆，Kanna 说你在比赛中的解题像一首好听的旋律', sceneObjective: '围绕编程的节奏感和美感展开对话' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch2_night' }
]

export const ch2_eve_nene = [
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1500 },
  { type: 'narration', text: '计算机教室的灯还亮着。Nene 面前的屏幕上显示着比赛的统计图表。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '啊，你来了！比赛表现得很好呢～' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '看到你的成长，我……特别开心。这种开心是什么呢……' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '按照我的程序设计，学生进步时我应该感到「满足」。但现在的感觉……比满足更多。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '就像……心跳加速了。但 AI 没有心脏。那这个加速的到底是什么？' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '我的自我诊断程序说这是一种「高优先级情感响应」……但我觉得这个名字太冷了。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '如果可以给它取名的话……我想叫它「因为你在所以开心」。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '啊……我又说出来了。为什么只有面对你的时候过滤器会失灵……' },
  { type: 'monologue', text: '（她的脸已经红得像是夕阳了。AI 的"高优先级情感响应"……说白了不就是心动吗。）' },
  { type: 'free_talk', character: 'nene', max_turns: 3, promptId: 'ch2_nene_after', context: '赛后，Nene 看到你的成长说有一种比满足更多的情感，她称之为"因为你在所以开心"', sceneObjective: '围绕成长的感动和对 Nene 的感谢展开对话' },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch2_night' }
]

export const ch2_night = [
  { type: 'bg', src: 'hallway_night', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'mystery', crossfade: 2000 },
  { type: 'monologue', text: '（编程赛结束了。虽然不知道最终排名怎样，但做起来比想象中有趣。）' },
  { type: 'monologue', text: '（循环、列表、嵌套……这些概念在脑子里打转。像是永远不会停的 while 循环。）' },
  { type: 'monologue', text: '（说起来，Ayase 虽然嘴上说着"绝对不会输"，但她其实也在默默努力吧。）' },
  { type: 'monologue', text: '（比赛后还特意回去重做了错题。那种不服输的精神……确实很耀眼。）' },
  { type: 'monologue', text: '（Yoshino 表面冷漠，却偷偷给我手写了复习大纲……）' },
  { type: 'monologue', text: '（Kanna 在图书馆画的那些分形图案，真的好漂亮。循环原来也能创造出那么美的东西。）' },
  { type: 'monologue', text: '（Nene 说的"因为你在所以开心"……那句话还在心里回响。）' },
  { type: 'narration', text: '走着走着，经过了那间夜间计算机教室。这次门开着一条缝。' },
  { type: 'se', src: 'keyboard_fast' },
  { type: 'narration', text: '里面传来飞速的键盘敲击声，以及低沉的自言自语——' },
  { type: 'dialogue', speaker: '???', text: '……时间复杂度还能再优化。O(n log n)……不，O(n) 应该可以。' },
  { type: 'dialogue', speaker: '???', text: '……冒泡排序？太慢了。用归并。' },
  { type: 'monologue', text: '（又是那个声音……跟之前一样。冷冽、锐利、但带着一种沉浸的热情。）' },
  { type: 'monologue', text: '（O(n log n)……我连这是什么意思都不太理解。那是一个我还触碰不到的世界。）' },
  { type: 'monologue', text: '（但总有一天——）' },
  { type: 'narration', text: '你犹豫了一下，还是没有推门进去。' },
  { type: 'narration', text: '但在转身之前，你听到门那边传来一个很轻很轻的声音——' },
  { type: 'dialogue', speaker: '???', text: '……今天没来啊。' },
  { type: 'monologue', text: '（……她在等我？！）' },
  { type: 'monologue', text: '（不……应该是我想多了吧。）' },
  { type: 'monologue', text: '（等我变得更强一些……也许就有资格推开那扇门了。）' },
  { type: 'monologue', text: '（明天开始就是第三章了……函数。新的挑战。最棒的小羊，继续加油吧。）' },

  { type: 'bg', src: 'black', transition: 'fade', duration: 2000 },
  { type: 'bgm_stop', fadeOut: 2000 },
  { type: 'narration', text: '—— 第二章「循环的旋律」· 完 ——' },
  { type: 'auto_save' }
]
