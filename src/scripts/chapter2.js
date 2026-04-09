export const chapter2 = [
  { type: 'title_card', text: '第二章「循环的旋律」', subtitle: '—— for/while 与列表 ——' },
  { type: 'bg', src: 'school_gate_day', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'morning_fresh', fadeIn: 1000 },
  { type: 'narration', text: '又是新的一天。校门前的樱花已经开始凋落了。' },
  { type: 'monologue', text: '不知不觉已经过了几天。编程课的节奏越来越快了，班味越来越重。' },
  { type: 'monologue', text: '说起来，这几天和大家也渐渐熟悉起来了呢。赛博对账一下——好像每个人都挺有趣的。' },

  { type: 'bg', src: 'hallway_day', transition: 'slide', duration: 800 },
  { type: 'char_enter', character: 'ayase', position: 'right', expression: 'grin', animation: 'slide_from_right' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '早啊！听说今天要学循环？DNA 动了！超期待的！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '我昨天预习了一下，感觉超简单的！大概吧！不是，应该确实简单！' },
  { type: 'monologue', text: '（说超简单的时候为什么底气不太足……汗流浃背了吧。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '今天的练习你可别输给我哦！我已经蓄力完毕！' },
  { type: 'char_exit', character: 'ayase', animation: 'slide_out_left' },

  { type: 'bg', src: 'classroom_day', transition: 'fade', duration: 1000 },
  { type: 'bgm', src: 'daily', crossfade: 1500 },
  { type: 'narration', text: '教室里，桐生先生已经在黑板上写下了今天的主题。' },
  { type: 'monologue', text: '「循环」——据说这是编程里最强大的武器之一。你管这叫循环？简直是魔法吧。' },
  { type: 'monologue', text: '（一个命令就能让电脑重复做一万次事情……想想还挺厉害的，格局直接打开。）' },

  { type: 'dialogue', speaker: 'kiryu_sensei', text: '今天的内容是循环。学会了这个，你们就能让程序自动重复执行任务了。' },
  { type: 'dialogue', speaker: 'kiryu_sensei', text: '接下来由 Nene 来讲解具体用法。' },

  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '今天我们来学循环！循环就是让电脑重复做同一件事～' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '比如你想打印 100 次"Hello"，总不能写 100 行 print 吧？' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '高斯小时候算 1 加到 100，用了巧妙的方法。但我们有循环，可以直接让电脑帮我们加！' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: 'for 循环的写法是：for i in range(次数): 然后缩进写要重复的代码。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '注意！range(n) 会生成 0 到 n-1 的数字序列，一共 n 个。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '来试试看吧！这道题是关于自然数求和的～' },

  { type: 'challenge', id: 'ch2_for_loop',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'glasses_adjust', text: '注意 range() 的起始值和终止值。' },
      success: { speaker: 'yoshino', expression: 'slight_smile', text: '……正确。你有在认真听课。' },
      fail: { speaker: 'nene', expression: 'thinking', text: 'range(5) 从 0 开始，到 4 结束，一共 5 个数哦～' }
    }
  },

  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '接下来是 while 循环！它会在条件满足时一直重复执行～' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '就像猜数字游戏，你猜错了就继续猜，猜对了才停下来。' },

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
  { type: 'narration', text: '课间休息时间。' },
  { type: 'monologue', text: '（循环的概念还挺好理解的。接下来应该还有列表……）' },
  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch2_classroom' },
    { id: 'computer_room_day', character: 'nene', next: 'ch2_computer' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch2_rooftop' },
    { id: 'library_day', character: 'kanna', next: 'ch2_library' }
  ]},
]

export const ch2_classroom = [
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'normal' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '有个消息要宣布。下周会举办班级编程赛。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '每个人都必须参加。不接受弃权。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '题目会覆盖到第二章的所有内容。循环、列表、条件判断都会考到。' },
  { type: 'monologue', text: '（编程比赛？！天啊……我才刚学 for 循环啊。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '别用那种表情看我。我说过——标准不会因为任何人降低。' },
  { type: 'monologue', text: '（她说这话的时候虽然语气严厉，但……好像有一点点在意我的反应？）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '……如果你需要复习资料，编程部有整理过往年题目。去拿一份。' },
  { type: 'monologue', text: '（等等，她这是……在帮我？用这种拐弯抹角的方式。）' },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, context: '课间，Yoshino 宣布了编程赛的消息，提供了复习建议' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch2_afternoon' }
]

export const ch2_computer = [
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '你来啦！循环的概念掌握了吗？' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '我来给你讲个小故事吧。有一次我尝试用 while True 写了一个无限循环……' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '然后系统差点就崩溃了……从那以后我就特别注意循环的终止条件。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '记住：每个循环都要有终止的时候哦！就像……嗯……就像故事总要有结局一样。' },
  { type: 'free_talk', character: 'nene', max_turns: 3, context: '课间，讨论循环的终止条件' },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch2_afternoon' }
]

export const ch2_rooftop = [
  { type: 'bg', src: 'rooftop_day', transition: 'fade' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'fired_up' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '听说要编程比赛了？！命运的齿轮又开始转动了！！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '这次我一定要赢！尤其是要赢你！含金量超级加倍！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '不过……如果你输了也别太破防啦。毕竟你才刚学嘛～嘿嘿。' },
  { type: 'monologue', text: '（这挑衅……让人莫名地有斗志了。是 e 人无疑了。）' },
  { type: 'free_talk', character: 'ayase', max_turns: 3, context: '课间，天台，讨论即将到来的编程比赛' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch2_afternoon' }
]

export const ch2_library = [
  { type: 'bg', src: 'library_day', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1000 },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'absorbed' },
  { type: 'narration', text: 'Kanna 正在用笔记本电脑运行一段程序。屏幕上显示着不断生成的图案。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'absorbed', text: '……递归。用循环可以做到类似的事……但递归更美。' },
  { type: 'monologue', text: '（屏幕上的图案像一朵朵分形的雪花……好漂亮。）' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……你想看吗。坐。' },
  { type: 'free_talk', character: 'kanna', max_turns: 3, context: '课间，图书馆，Kanna 在演示分形图案' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch2_afternoon' }
]

// 午后 + 列表练习
const ch2_afternoon_script = [
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'bgm', src: 'daily', crossfade: 1000 },
  { type: 'se', src: 'bell' },
  { type: 'narration', text: '午后的教室，阳光从窗户斜照进来，空气中弥漫着初夏的味道。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '下午我们来学列表——Python 里最常用的数据容器！' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '大家有没有用过购物清单呢？列表就像一个购物袋。' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '可以装很多东西，还可以往里面添加、删除、排序。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '用方括号创建：fruits = ["apple", "banana"]，用 .append() 添加元素～' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '还有 .sort() 可以排序，.pop() 可以删除最后一个元素哦！' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '列表加上循环，就能做很多事情了！来试试看——' },

  { type: 'challenge', id: 'ch2_list_sort',
    context_dialogue: {
      before: { speaker: 'ayase', expression: 'fired_up', text: '排序题？来啊！我最擅长了！……大概。' },
      success: { speaker: 'ayase', expression: 'pout', text: '切……你排对了。下次我也一定行！' },
      fail: { speaker: 'nene', expression: 'thinking', text: '先创建列表 → 添加元素 → 排序 → 打印哦～' }
    }
  },

  { type: 'char_exit', character: 'nene' },

  // 午休自由时段
  { type: 'narration', text: '午休时间到了。编程赛临近，大家都在抓紧练习。' },
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
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'normal' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '编程赛的规则：限时答题，正确率和速度都计分。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '不要紧张。但也别大意。' },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, context: '午休，讨论编程赛' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch2_evening' }
]

export const ch2_noon_ayase = [
  { type: 'bg', src: 'rooftop_day' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'competitive' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '我已经练了一百道题了！……好吧其实是二十道。但也很多了！我去，不早说会考这么多！' },
  { type: 'free_talk', character: 'ayase', max_turns: 3, context: '午休，Ayase 在为编程赛做准备' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch2_evening' }
]

export const ch2_noon_kanna = [
  { type: 'bg', src: 'library_day' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'contemplative' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……比赛。无所谓胜负。重要的是……你解题时的思维过程。' },
  { type: 'free_talk', character: 'kanna', max_turns: 3, context: '午休，图书馆' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch2_evening' }
]

export const ch2_noon_nene = [
  { type: 'bg', src: 'computer_room_day' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'gentle_smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '比赛紧张吗？别担心，就当是一次有趣的挑战吧～' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '而且不管结果如何，你已经学到了很多东西不是吗？这才是最重要的！' },
  { type: 'free_talk', character: 'nene', max_turns: 3, context: '午休，Nene 给你考前鼓励' },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch2_evening' }
]

// 放学后 → 编程赛
export const ch2_evening = [
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'bgm', src: 'tension', crossfade: 1500 },
  { type: 'narration', text: '编程赛的日子终于到了。教室里弥漫着紧张的气氛。' },
  { type: 'narration', text: '桌上摆好了电脑，黑板上写着大大的「第一回 Alethicode 班级编程赛」。' },
  { type: 'monologue', text: '（心跳好快……虽然只是班级比赛，但大家都好认真的样子。精神状态已经紧绷到极限了。）' },
  { type: 'char_enter', character: 'yoshino', position: 'left', expression: 'normal' },
  { type: 'char_enter', character: 'ayase', position: 'right', expression: 'fired_up' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '第一回 Alethicode 班级编程赛，现在开始。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '规则很简单：答对得分，限时作答。分数最高者获胜。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '作弊者直接取消成绩。我会盯着的。' },
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
  { type: 'narration', text: '教室里安静得只听到键盘声。所有人都在专注地看着屏幕。' },
  { type: 'se', src: 'bell' },
  { type: 'challenge', id: 'ch2_nested_loop',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'cold', text: '这是决赛题。嵌套循环。' },
      success: { speaker: 'yoshino', expression: 'slight_smile', text: '……你答对了。难以置信，一个新手。' },
      fail: { speaker: 'nene', expression: 'gentle_smile', text: '外层循环3次，每次内层循环4次，3×4=12 哦～' }
    }
  },

  // 赛后
  { type: 'bgm', src: 'daily', crossfade: 1500 },
  { type: 'narration', text: '比赛结束了。教室里的紧张空气渐渐散去，取而代之的是热闹的讨论声。' },
  { type: 'char_enter', character: 'ayase', position: 'right', expression: 'pout' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '啊啊啊！那道嵌套循环我差一点就做对了！！我真的会谢！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'surprised', text: '3 × 4 = 12 啊！我写成 3 + 4 = 7 了！不是哥们，这也太冤种了吧！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '下次——下次绝对不会输！！这口气我咽不下去！' },
  { type: 'char_enter', character: 'yoshino', position: 'left', expression: 'slight_smile' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '你的表现……比我预期的好。' },
  { type: 'monologue', text: '（Yoshino 居然露出了一点笑容。第一次看到她这个表情。倒反天罡了属于是。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '不过不要因此骄傲。接下来的内容会更难。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '函数、模块化……那才是真正考验编程思维的地方。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '大家都辛苦了！不管结果如何，你们今天都很棒哦～' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '编程赛不是目的，是让大家感受到编程的乐趣才重要呢。' },
  { type: 'char_exit', character: 'nene' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'char_exit', character: 'yoshino' },

  // 放学后自由时段
  { type: 'se', src: 'bell' },
  { type: 'narration', text: '编程赛结束了。放学的铃声响起。' },
  { type: 'monologue', text: '（赛后心情还没平复……去走走吧。）' },
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
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'glasses_adjust' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '你还在？……我在整理比赛数据。' },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, context: '编程赛后，夕阳下的教室，Yoshino 在整理成绩' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch2_night' }
]

export const ch2_eve_ayase = [
  { type: 'bg', src: 'rooftop_evening', transition: 'fade' },
  { type: 'bgm', src: 'evening_calm', crossfade: 1500 },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'soft_smile' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……比赛，还挺好玩的。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '才不是因为输了才不开心！只是……有点不甘心而已。' },
  { type: 'free_talk', character: 'ayase', max_turns: 3, context: '赛后黄昏的天台，Ayase 难得安静' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch2_night' }
]

export const ch2_eve_kanna = [
  { type: 'bg', src: 'library_evening', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1500 },
  { type: 'char_enter', character: 'kanna', position: 'center', expression: 'slight_smile' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……你来了。比赛辛苦了。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……循环。重复的美。你有感受到吗。' },
  { type: 'free_talk', character: 'kanna', max_turns: 3, context: '傍晚的图书馆，Kanna 在看关于迭代与递归的书' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch2_night' }
]

export const ch2_eve_nene = [
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1500 },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '啊，你来了！比赛表现得很好呢～' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '看到你的成长，我……特别开心。这种开心是什么呢……' },
  { type: 'free_talk', character: 'nene', max_turns: 3, context: '赛后，Nene 对你的成长感到喜悦和困惑' },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch2_night' }
]

export const ch2_night = [
  { type: 'bg', src: 'hallway_night', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'mystery', crossfade: 2000 },
  { type: 'monologue', text: '（编程赛结束了。虽然不知道最终排名怎样，但做起来比想象中有趣。）' },
  { type: 'monologue', text: '（循环、列表、嵌套……这些概念在脑子里打转。）' },
  { type: 'monologue', text: '（说起来，Ayase 虽然嘴上说着"绝对不会输"，但她其实也在默默努力吧。）' },
  { type: 'monologue', text: '（Yoshino 表面冷漠，却偷偷告诉我去拿复习资料……）' },
  { type: 'monologue', text: '（Kanna 在图书馆画的那些分形图案，真的好漂亮。循环原来也能创造出那么美的东西。）' },
  { type: 'narration', text: '走着走着，经过了那间夜间计算机教室。这次门开着一条缝。' },
  { type: 'se', src: 'keyboard_fast' },
  { type: 'narration', text: '里面传来飞速的键盘敲击声，以及低沉的自言自语——' },
  { type: 'dialogue', speaker: '???', text: '……时间复杂度还能再优化。O(n log n)……不，O(n) 应该可以。' },
  { type: 'dialogue', speaker: '???', text: '……冒泡排序？太慢了。用归并。' },
  { type: 'monologue', text: '（又是那个声音……跟上次一样。那个人到底在做什么？竞赛训练？）' },
  { type: 'monologue', text: '（O(n log n)……我连这是什么意思都不太理解。差距大到破防。）' },
  { type: 'narration', text: '你犹豫了一下，还是没有推门进去。' },
  { type: 'monologue', text: '（等我变得更强一些……也许就有资格推开那扇门了。敬自己一杯。）' },
  { type: 'monologue', text: '（明天开始就是第三章了……函数。最棒的小羊，继续加油吧。）' },

  { type: 'bg', src: 'black', transition: 'fade', duration: 2000 },
  { type: 'bgm_stop', fadeOut: 2000 },
  { type: 'narration', text: '—— 第二章「循环的旋律」· 完 ——' },
  { type: 'auto_save' }
]
