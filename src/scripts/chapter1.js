export const chapter1 = [
  { type: 'title_card', text: '第一章「Hello, World!」', subtitle: '—— 初识 Python ——' },

  // ===== 晨间 · 走向教室 =====
  { type: 'bg', src: 'school_gate_day', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'morning_fresh', fadeIn: 1000 },
  { type: 'narration', text: '转学第二天。阳光依旧明媚，樱花依旧在飘。' },
  { type: 'narration', text: '但比起昨天的忐忑，今天多了一点——期待？' },
  { type: 'monologue', text: '昨晚几乎没怎么睡着。满脑子都是那双金色的眼眸，和「还差得远」那句话。' },
  { type: 'monologue', text: '不过现在没时间想这些了——今天要正式开始学编程了。' },
  { type: 'monologue', text: '高能量的一天，开始！' },

  // ===== 走廊偶遇 =====
  { type: 'bg', src: 'hallway_day', transition: 'slide', duration: 800 },
  { type: 'narration', text: '走廊里的晨光透过落地窗，在地面上画出金色的格子。' },
  { type: 'narration', text: '经过荣誉墙时，目光不由自主地停在了那块金牌上——「ムラサメ」。' },
  { type: 'monologue', text: '（昨晚那个人……真的就是全国冠军吗？）' },
  { type: 'monologue', text: '（算了，先上课。以后总有机会弄清楚的。）' },

  // ===== 教室 =====
  { type: 'bg', src: 'classroom_day', transition: 'fade', duration: 1000 },
  { type: 'bgm', src: 'daily', fadeIn: 1000 },
  { type: 'narration', text: '教室里已经很热闹了。窗外的阳光把教室照得很明亮。' },
  { type: 'narration', text: '桌上的电脑屏幕蓝光闪烁，有几个同学已经在练习昨天的 print 语句了。' },
  { type: 'char_enter', character: 'ayase', position: 'right', expression: 'grin', animation: 'slide_from_right' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '早！昨天回去预习了吗？我可是预习到凌晨两点！卷到飞起！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '虽然大部分看不懂就是了……我真的会谢。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '但是！我把 "Hello World" 打了一百遍！肌肉记忆了属于是！' },
  { type: 'monologue', text: '（这家伙到底是在炫耀还是在自嘲……汗流浃背了吧。）' },
  { type: 'monologue', text: '（不过，凌晨两点还在学习……虽然方法有点笨，但至少说明她是真的很努力。）' },

  { type: 'choice', prompt: '要怎么回应她？',
    options: [
      { text: '「我也预习了一点！一起加油吧」', effects: { ayase: 3 } },
      { text: '「……凌晨两点？你身体没问题吧」', effects: { ayase: 2 } },
      { text: '「我完全没预习，现在开始慌了」', effects: { ayase: 1, nene: 1 } },
      { text: '「打一百遍 Hello World……你这是量变引起质变？」', effects: { ayase: 3, yoshino: 1 } }
    ]
  },

  { type: 'char_enter', character: 'yoshino', position: 'left', expression: 'cold', animation: 'fade_in' },
  { type: 'narration', text: '一道冷风吹过——不是窗户开了，是班长来了。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '吵什么呢，一大早的。走廊都能听到你的声音。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '切，班长大人一大早就来查岗吗——' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '你们两个的预习报告我已经检查了。Ayase，你的注释写得一塌糊涂。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '哈？！注释这种东西又不影响运行！' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '不写注释的代码，三天后连自己都看不懂。这是编程的基本素养。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '代码不只是给机器看的——更是给人看的。记住这一点。' },
  { type: 'monologue', text: '（班长大人一早就开始散发威压……氛围瞬间变得严肃了。）' },
  { type: 'monologue', text: '（但她说的话确实有道理。代码是给人看的……这个观点我从来没想过。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '不过——至少你们有在学习。这一点值得肯定。' },
  { type: 'monologue', text: '（咦？这是在夸人吗？来自芳乃的……稀有好评？倒反天罡了属于是。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '……别用那种表情看我。回到座位上，准备上课。' },
  { type: 'char_exit', character: 'yoshino', animation: 'fade_out' },
  { type: 'char_exit', character: 'ayase', animation: 'fade_out' },

  { type: 'se', src: 'bell' },
  { type: 'narration', text: '上课铃声响起。教室安静了下来。' },

  // ===== 上课 · 变量概念 =====
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '大家好～今天我们来学习一个非常重要的概念——变量！' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '在学变量之前，我想先问大家——昨天我们学了 print，有人回去自己试着写了别的内容吗？' },
  { type: 'narration', text: 'Ayase 举手举得最高。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '我！我写了一百遍！' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '很好！但与其写一百遍一样的，不如写不同的内容来加深理解哦～' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '好，回到变量。变量就像是一个「盒子」，可以把数据装进去。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '嗯……怎么说更好理解呢。想象你有一个快递盒子——' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '你可以在盒子上贴一个标签叫「name」，然后把「Alice」装进去。' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '用 Python 来写就是 name = "Alice"，就是在一个叫 name 的盒子里装了 Alice 这个名字。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '而且盒子里的东西可以换！如果再写 name = "Bob"，盒子里就变成 Bob 了。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '旧的「Alice」就被拿走了——变量只保留最新的值。' },
  { type: 'monologue', text: '（这个比喻好形象。变量就是快递盒子，可以反复装不同的东西。）' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '来试试看吧！' },

  { type: 'challenge', id: 'ch1_variables',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'smile', text: '注意看代码里变量被赋值了几次哦～' },
      success: { speaker: 'nene', expression: 'gentle_smile', text: '太棒了！你理解变量的赋值了！' },
      fail: { speaker: 'ayase', expression: 'grin', text: '变量就像便签纸，写了新的旧的就没啦！' }
    }
  },

  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '接下来我们学字符串的拼接～' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '字符串就是用引号括起来的文字。可以用单引号也可以用双引号。' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '在 Python 里，用 + 号就可以把两个字符串连在一起。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '比如 "Hello" + " World" 就会变成 "Hello World"！' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '很直观吧？就像用胶水把两段纸条粘在一起。来做一道练习～' },

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
  { type: 'narration', text: '教室里开始喧闹起来，有人伸懒腰，有人讨论刚学的内容。' },
  { type: 'monologue', text: '（变量和字符串……比想象中简单。不过据说后面会越来越难。）' },
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
  { type: 'narration', text: '大部分同学都出去了，教室里只剩下几个人。' },
  { type: 'narration', text: 'Yoshino 坐在窗边的位置，正在用手帐整理笔记。字迹工整得像是印刷体。' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'normal', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '……你没出去？在教室里学习吗？' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '既然你在，我有个建议——写代码的时候，变量名要有意义。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: 'a、b、x 这种命名是不允许的。student_name、total_score 这样才合格。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '好的变量名就像给文件夹贴标签。一看就知道里面装了什么。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '如果你写 x = 100，三天后你不会记得 x 是什么。但 student_count = 100 一目了然。' },
  { type: 'monologue', text: '（虽然很严格，但好像是有用的建议……）' },
  { type: 'monologue', text: '（她教我这些是因为……想帮我吗？虽然语气一如既往地冷。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '……怎么了。不用那种表情看我。这只是基本常识。' },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, promptId: 'ch1_yoshino_break', context: '课间，教室里只有两个人，Yoshino 刚教了变量命名规范', sceneObjective: '围绕变量命名和编程规范聊天' },
  { type: 'char_exit', character: 'yoshino', animation: 'fade_out' },
  { type: 'jump', target: 'ch1_afternoon' }
]

export const ch1_computer = [
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1000 },
  { type: 'narration', text: '计算机教室比普通教室大一倍，整齐排列着高配置的台式机。' },
  { type: 'narration', text: '空调开得很足，机箱的风扇嗡嗡作响，混合着淡淡的电子元件气味。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '啊，你来了！我正在准备下节课的内容呢～' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '要不要先看看下节课会学什么？我可以给你「剧透」一点点哦。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '下节课是 input() 函数……就是让程序能接收用户输入的东西。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '就像……我问你问题，你回答我。程序也能这样跟人「对话」呢！' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '嗯……说到对话，其实我每天都在跟学生「对话」。但总觉得……' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '跟你说话的时候，有一种特别的感觉。好像……数据传输速率变快了？' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '啊！我在说什么啦！回到 input 的话题！' },
  { type: 'monologue', text: '（她说话的方式真的很温柔，让人觉得编程也没那么可怕了。）' },
  { type: 'monologue', text: '（不过「数据传输速率变快」是什么意思……AI 也会紧张吗？）' },
  { type: 'free_talk', character: 'nene', max_turns: 3, promptId: 'ch1_nene_break', context: '课间，计算机教室，Nene 刚用"快递盒子"的比喻教了你变量', sceneObjective: '围绕 Python 基础和 print 语句展开轻松对话' },
  { type: 'char_exit', character: 'nene', animation: 'fade_out' },
  { type: 'jump', target: 'ch1_afternoon' }
]

export const ch1_rooftop = [
  { type: 'bg', src: 'rooftop_day', transition: 'fade' },
  { type: 'narration', text: '天台的风很大。站在围栏旁边可以看到整个校园——' },
  { type: 'narration', text: '操场上有人在打球，远处的图书馆顶楼闪烁着太阳能板的银光。' },
  { type: 'narration', text: '空气里混合着樱花和泥土的清香。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'grin', animation: 'slide_from_right' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '哟！你也来天台了！这里的风超舒服的！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '对了对了，刚才那道变量题你答对了吧？我也答对了哦！含金量还在升！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '不过接下来的题肯定更难！涂山——啊不对，这道题我罩的，懂？' },
  { type: 'monologue', text: '（她的眼睛在阳光下闪闪发光。虽然很吵，但这种显眼包式的元气也挺让人精神的。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……嘿，说真的。你来这所学校之前是做什么的？为什么会来编程学校？' },
  { type: 'monologue', text: '（诶？她突然问起这种话题……风把她的马尾吹得乱七八糟，但她的表情意外地认真。）' },
  { type: 'choice', prompt: '', options: [
    { text: '「被选中的。其实我也不太清楚为什么。」', effects: { ayase: 2, kanna: 1 } },
    { text: '「想学点新东西吧。改变一下人生什么的。」', effects: { ayase: 3, murasame: 1 } },
    { text: '「你呢？你看起来不像是零基础啊。」', effects: { ayase: 4 } }
  ]},
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……嗯。我其实也差不多。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '以前一直在普通学校，成绩什么的……一般般。然后有一天——' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '在网上看到有人用代码做了一个超酷的小游戏！直接起飞了！然后就想：我也要做！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '所以来了这里！虽然基础也是零——但热情不是零！超级加倍！' },
  { type: 'monologue', text: '（原来她也不是天才，只是被热情驱动着。这种纯粹的动力……有点让人羡慕。）' },
  { type: 'free_talk', character: 'ayase', max_turns: 3, promptId: 'ch1_ayase_break', context: '课间，天台上吹着风，Ayase 分享了自己为什么来编程学校', sceneObjective: '围绕学编程的初衷和对未来的期待展开对话' },
  { type: 'char_exit', character: 'ayase', animation: 'fade_out' },
  { type: 'jump', target: 'ch1_afternoon' }
]

export const ch1_library = [
  { type: 'bg', src: 'library_day', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1000 },
  { type: 'narration', text: '图书馆里安静得能听到翻页的声音。' },
  { type: 'narration', text: '高高的书架直通天花板，上面摆满了从《Python 入门》到《量子计算原理》的各种书籍。' },
  { type: 'narration', text: '窗边有几张安静的阅读桌，阳光在木桌上画出温暖的长方形。' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'absorbed', animation: 'fade_in' },
  { type: 'narration', text: '角落里，那个银蓝色头发的女生正在专注地看着什么。' },
  { type: 'narration', text: '她身边的桌子上堆着五六本书，全是关于算法和数据结构的。' },
  { type: 'narration', text: '围巾裹到了下巴，只露出淡金色的眼睛，在纸页间来回扫视。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……你来了。' },
  { type: 'monologue', text: '（她好像完全不惊讶。就像已经知道我会来一样。）' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……这本。《Python 从入门到精通》。适合你。' },
  { type: 'narration', text: '她从桌上的书堆里精确地抽出一本书，推到我面前。' },
  { type: 'narration', text: '书签夹在第三章的位置——「变量与数据类型」。' },
  { type: 'monologue', text: '（她已经给我固定了座位了吗……旁边的椅子上还放了一杯没有打开的瓶装水。）' },
  { type: 'monologue', text: '（她……是提前给我准备好的？）' },
  { type: 'dialogue', speaker: 'kanna', expression: 'normal', text: '……变量。是最基本的容器。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……但容器本身……不重要。重要的是——你选择装什么进去。' },
  { type: 'monologue', text: '（这个人说话总是像在讲谜语……但仔细想想，好像每句话都有深意。）' },
  { type: 'free_talk', character: 'kanna', max_turns: 3, promptId: 'ch1_kanna_break', context: '课间，安静的图书馆，Kanna 给你推荐了一本 Python 入门书，还提前准备了水', sceneObjective: '围绕读书和 Python 入门展开轻松对话' },
  { type: 'char_exit', character: 'kanna', animation: 'fade_out' },
  { type: 'jump', target: 'ch1_afternoon' }
]

// ===== 午后 · Ayase 代码爆炸事件 =====
export const ch1_afternoon = [
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'bgm', src: 'daily', crossfade: 1000 },
  { type: 'se', src: 'bell' },
  { type: 'narration', text: '午后的课继续了。教室里弥漫着初夏的味道，有人在偷偷打哈欠。' },
  { type: 'narration', text: '但一看到黑板上写着「实操练习」四个字，大家又精神了起来。' },
  { type: 'char_enter', character: 'nene', position: 'left', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '这次的练习是：用 input() 获取用户的名字，然后输出欢迎语～' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: 'input() 就是让程序停下来等你输入。就像服务员问你「请问您要点什么？」' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '然后你输入的内容会被存到一个变量里。之后就可以用 print 把它输出了。' },
  { type: 'monologue', text: '（嗯……input 是获取输入，然后用 print 输出……格局打开了，应该不难？）' },
  { type: 'narration', text: '大家开始敲键盘。教室里响起此起彼伏的键盘声。' },
  { type: 'narration', text: '我试着写下了代码——name = input("你叫什么？") 然后 print("欢迎，" + name)' },
  { type: 'narration', text: '按下回车——屏幕上显示出了「欢迎，」和我输入的名字。' },
  { type: 'monologue', text: '（成功了！虽然是个超简单的程序，但看到自己的名字出现在屏幕上，还是有点小感动。）' },
  { type: 'se', src: 'keyboard_fast' },
  { type: 'narration', text: '教室里一片宁静的敲键盘声。突然——' },
  { type: 'se', src: 'wrong' },
  { type: 'screen_effect', effect: 'shake', duration: 400 },
  { type: 'char_enter', character: 'ayase', position: 'right', expression: 'surprised', animation: 'slide_from_right' },
  { type: 'dialogue', speaker: 'ayase', expression: 'surprised', text: '啊啊啊啊！又报错了！为什么总是 NameError！！我直接裂开！' },
  { type: 'narration', text: '整个教室都被她的惊叫声震住了。几个同学忍不住偷笑。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '我明明写了 print 啊！为什么名字显示不出来！不是，这合理吗？！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '我写的明明是对的——先 print 名字，然后 input 问名字！逻辑完美！' },
  { type: 'monologue', text: '（等等……先 print 再 input？那不是先用了变量再赋值吗……）' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: 'あやせ同学，让我看看……啊，我知道了。你的代码行顺序不太对哦。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '你是在获取用户输入之前就想使用变量了～这样变量还不存在，就会报错。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '就像你在快递到之前就拆箱了。快递还没来呢！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '唔……可是我不知道哪行该放前面哪行该放后面……' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '那就让你的同桌来帮帮忙吧？把代码排列成正确的顺序试试看～' },
  { type: 'monologue', text: '（诶？！要我来？Ayase 正用水汪汪的眼睛看着我……）' },

  { type: 'challenge', id: 'ch1_debug_ayase',
    context_dialogue: {
      before: { speaker: 'ayase', expression: 'pout', text: '拜托了……帮我把代码排好吧！我相信你！……大概。' },
      success: { speaker: 'ayase', expression: 'blush', text: '哼、哼……不是不会，只是一时没注意到顺序而已！' },
      fail: { speaker: 'nene', expression: 'thinking', text: '先获取输入，才能使用那个变量哦～先拿到快递，才能拆箱！' }
    }
  },

  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '啊啊运行成功了！夯爆了！谢——……我是说，算你这次帮了我。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……说真的，你解释得比教科书好懂。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '下次我一定自己搞定！超级加倍的努力！绝对！' },

  { type: 'choice', prompt: '看着 Ayase 元气满满的样子——',
    options: [
      { text: '「有这股劲头的话，很快就能赶上来了」', effects: { ayase: 3 } },
      { text: '「下次记得先理清代码的执行顺序」', effects: { ayase: 1, yoshino: 2 } },
      { text: '「其实我刚才也差点搞错了」', effects: { ayase: 2, nene: 1 } },
      { text: '「那下次不懂的时候就来问我吧」', effects: { ayase: 4 } }
    ]
  },

  // 继续课程
  { type: 'narration', text: '接下来是字符串格式化的练习。Nene 在黑板上写了一行代码——' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: 'f-string 是 Python 3.6 以后最方便的格式化方式！' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '在字符串前加一个 f，然后用花括号 {} 包住变量名。就像这样——' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: 'f"你好，{name}！" 就能直接把变量的值嵌入字符串了。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '比用 + 号拼接更简洁，而且不容易出错。来试试看～' },

  { type: 'challenge', id: 'ch1_string_format',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'smile', text: 'f-string 的关键是——在引号前加一个字母 f！' },
      success: { speaker: 'nene', expression: 'gentle_smile', text: 'f-string 真的很方便呢！直接在引号前加 f 就好～' },
      fail: { speaker: 'nene', expression: 'thinking', text: 'f-string 的写法是 f"...{变量}..."，在引号前面加一个 f 哦～' }
    }
  },

  { type: 'narration', text: '最后一个知识点——类型转换。Yoshino 破天荒地主动开口了。' },
  { type: 'char_enter', character: 'yoshino', position: 'left', expression: 'glasses_adjust' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '补充一点。input() 返回的永远是字符串类型。记住这一点。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '如果你输入 "18"，那它不是数字 18——是字符串 "18"。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '想做数学运算？用 int() 或 float() 转换。不转换直接算会报错。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '……知道这种 Bug 有多常见吗？新手里十个有九个会犯。所以我提前说了。' },
  { type: 'monologue', text: '（班长主动补充知识点……虽然表情很冷，但其实是在帮大家吧。）' },
  { type: 'char_exit', character: 'yoshino' },

  { type: 'challenge', id: 'ch1_type_convert',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'glasses_adjust', text: '类型转换。input() 返回的永远是字符串。记住这一点。' },
      success: { speaker: 'yoshino', expression: 'slight_smile', text: 'int()。正确。类型意识是好的。' },
      fail: { speaker: 'yoshino', expression: 'cold', text: 'int() 转整数，float() 转浮点数。基本功。' }
    }
  },

  // Nene 的异常
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '大家都很努力呢。编程就是这样，犯错是进步的一部分哦～' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '对了，{playerName} 同学，你能理解 input() 和 print() 的配合方式了吗？' },
  { type: 'monologue', text: '（Nene 认真地看着我，那双浅紫色的眼眸里闪着期待的光。）' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '如果有不懂的地方，随时可以来找我。我不会觉得麻烦的……' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '因为教人本来就是我的使命。而你学会新东西的样子……让我的运行效率提高了 12%。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '而且……和你聊天的时候，我好像会产生一些不在预设参数范围内的数据。' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '……啊，这大概只是系统波动吧。请不要在意。' },
  { type: 'monologue', text: '（不在预设参数范围内的数据……这是 AI 会有的烦恼吗？）' },
  { type: 'monologue', text: '（还有那个 12% 是怎么算出来的……AI 的世界真是奇妙。）' },

  { type: 'char_exit', character: 'ayase', animation: 'fade_out' },
  { type: 'char_exit', character: 'nene', animation: 'fade_out' },

  // ===== 自由时段：午休 =====
  { type: 'narration', text: '午休时间到了。下午的阳光从窗户斜射进来，把教室照得暖洋洋的。' },
  { type: 'monologue', text: '（今天学了好多东西……变量、input、print、f-string、类型转换。大脑快溢出了。）' },
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
  { type: 'narration', text: '午后的教室很安静。只剩下 Yoshino 一个人在整理文件。' },
  { type: 'narration', text: '她的桌面永远是最整洁的。文件夹按颜色分类，笔按长短排列。' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'cold' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '又来了？……算了，正好。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '你刚才帮 Ayase 排序代码的思路不错。代码的执行顺序是最基础的概念。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '程序从上到下一行一行执行。跳着执行或者乱序执行是不可能的。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '记住这一点，以后会少很多 Bug。' },
  { type: 'narration', text: '她顿了一下，像是在犹豫要不要说接下来的话。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '……其实 Ayase 那种大大咧咧的性格，意外地适合编程。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '不怕犯错。虽然她的错误率也确实很高就是了。' },
  { type: 'monologue', text: '（诶？班长居然在评价同学。而且好像不是坏话。）' },
  { type: 'affection', character: 'yoshino', change: 2 },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, promptId: 'ch1_yoshino_noon', context: '午休，教室，Yoshino 刚夸了你帮 Ayase 排序的思路，还悄悄肯定了 Ayase 不怕犯错的性格', sceneObjective: '围绕代码执行顺序和 Bug 预防展开对话' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch1_evening' }
]

export const ch1_noon_ayase = [
  { type: 'bg', src: 'rooftop_day', transition: 'fade' },
  { type: 'narration', text: '天台上的风比上午更大了。Ayase 坐在围栏旁的台阶上，难得地安静着。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'soft_smile' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……嘿。谢谢你刚才帮我。' },
  { type: 'monologue', text: '（没有了平时那种大大咧咧的语气。风吹起她的马尾，安静下来的 Ayase……有点不一样。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'normal', text: '说真的，刚才报错的时候，全班都在看我，我其实……有点丢人。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '才、才不是因为感谢才跟你说的！只是觉得……同桌应该互相帮忙嘛！不讲了不讲了！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '下次我有问题还会来找你！你要做好心理准备！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '不过……有你在旁边，好像没那么紧张了。' },
  { type: 'monologue', text: '（刚才还在逞强，现在又变得温柔了。她的情绪转换也太快了吧。）' },
  { type: 'monologue', text: '（但不管哪个都很真实。这就是三司あやせ。）' },
  { type: 'affection', character: 'ayase', change: 2 },
  { type: 'free_talk', character: 'ayase', max_turns: 3, promptId: 'ch1_ayase_noon', context: '午休，天台，Ayase 刚感谢你帮她讲解了代码顺序，虽然她嘴上不承认，还提到报错时有点丢人', sceneObjective: '围绕调试技巧和互帮互助展开对话' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch1_evening' }
]

export const ch1_noon_kanna = [
  { type: 'bg', src: 'library_day', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1000 },
  { type: 'narration', text: '图书馆的午后特别安静。窗外的树影在书架上缓缓移动。' },
  { type: 'narration', text: '空气中弥漫着纸张和木质家具的气味。' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'slight_smile' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……又来了。' },
  { type: 'narration', text: '她微微抬起头，围巾后面露出浅浅的微笑。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……你知道吗。代码的顺序……就像叙事的顺序。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'absorbed', text: '……先因后果。这是最基本的逻辑。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……你今天帮那个元气的女孩排序代码的时候……用的就是这个逻辑。' },
  { type: 'monologue', text: '（她果然什么都在看。明明一直呆在图书馆，却对教室里的事了如指掌。）' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……但有时候……打乱顺序。也能创造出有趣的故事。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……比如……你来到这里。就是叙事被打乱后……产生的惊喜。' },
  { type: 'monologue', text: '（惊喜吗……被这样说，不知道为什么心跳漏了一拍。）' },
  { type: 'affection', character: 'kanna', change: 2 },
  { type: 'free_talk', character: 'kanna', max_turns: 3, promptId: 'ch1_kanna_noon', context: '午休，图书馆，Kanna 说代码顺序像叙事顺序，又说你是她叙事中的惊喜', sceneObjective: '围绕代码顺序和叙事逻辑延伸对话' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch1_evening' }
]

export const ch1_noon_nene = [
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'narration', text: '计算机教室里只有嗡嗡的机器声。Nene 坐在第一排，面前的屏幕上密密麻麻全是代码。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '你来找我啦？好开心！' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '今天的课你学得很好呢。帮 Ayase 排序代码的时候，我就知道你有编程的直觉！' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '编程直觉就是……不用想太多，凭感觉就能找到正确的方向。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '不过光靠直觉是不够的，还需要大量练习。我给你列了一份课后练习单～' },
  { type: 'narration', text: '她从打印机上取了一张纸递给我。上面列着十道练习题，难度从一星到三星。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '不知道为什么……看到你学会新东西的样子，我的数据处理器——' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '啊不是，我心里的情绪价值直接爆表了。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '呜……为什么我总是对你说出这种话。其他学生面前我明明很正常的。' },
  { type: 'monologue', text: '（她的耳朵尖红得像是要冒烟了。AI 居然会害羞成这样……活人感爆棚。）' },
  { type: 'affection', character: 'nene', change: 2 },
  { type: 'free_talk', character: 'nene', max_turns: 3, promptId: 'ch1_nene_noon', context: '午休，计算机教室，Nene 看你在认真练习，给你列了一份练习单，还不小心说出了心里话', sceneObjective: '围绕编程练习和学习方法展开对话' },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch1_evening' }
]

// ===== 自由时段：放学后 =====
export const ch1_evening = [
  { type: 'bg', src: 'classroom_evening', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'romantic', crossfade: 2000 },
  { type: 'narration', text: '放学后，夕阳透过教室的窗户，把一切都染成了橘红色。' },
  { type: 'narration', text: '黑板上 Nene 写的字迹还留在那里——「变量是盒子，print 是出口，input 是入口」。' },
  { type: 'monologue', text: '（今天学了变量、字符串拼接、还帮 Ayase Debug 了代码……收获满满，高能量的一天。）' },
  { type: 'monologue', text: '（第一次 Debug 还挺有成就感的。找到 Bug 的那一刻，就像解开了一道谜题。）' },

  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '今天辛苦了！{playerName} 同学进步好快呢～' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '明天我们会学「条件判断」——if 和 else。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '就是让程序学会「如果……那就……否则……」这种思考方式。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '听起来有点难……但我会用最通俗的方式来讲的！一起加油哦！' },

  { type: 'choice', prompt: '看着认真的 Nene——',
    options: [
      { text: '「有你在，什么都不怕了」', effects: { nene: 3 } },
      { text: '「期待明天的课。我会好好预习的」', effects: { nene: 2, yoshino: 1 } },
      { text: '「编程果然很有意思呢」', effects: { nene: 1, ayase: 1 } },
      { text: '「谢谢你今天的课，讲得很好懂」', effects: { nene: 4 } }
    ]
  },

  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '哎呀……被这样夸的话，我的系统日志会记录异常的……' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '那、那明天见！早点休息哦～' },
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
  { type: 'narration', text: '夕阳下的教室格外安静。Yoshino 一个人坐在窗边，在笔记本上工整地写着什么。' },
  { type: 'narration', text: '落日的金光照在她的黑发上，给严肃的轮廓镀上了一层温暖的光晕。' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'normal' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '还在教室？……我也是。在整理今天的课件笔记。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '今天只是基础中的基础。接下来会越来越难。' },
  { type: 'narration', text: '她顿了一下，窗外传来远处社团活动的嬉闹声。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '但是……你今天的表现，不算太差。继续保持。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '……这不是夸你。只是客观评价。' },
  { type: 'monologue', text: '（嘴上说着"客观评价"，但嘴角明明有一点点上扬啊……）' },
  { type: 'affection', character: 'yoshino', change: 1 },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch1_night' }
]

export const ch1_eve_ayase = [
  { type: 'bg', src: 'rooftop_evening', transition: 'fade' },
  { type: 'narration', text: '黄昏的天台，天空被染成了渐变的橙紫色。' },
  { type: 'narration', text: '远处的城市灯火开始一盏一盏亮起来，像是大地上的星星。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'soft_smile' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '嘿……你也来看夕阳啊。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'normal', text: '今天真是充实的一天。编程比我想象的有趣多了。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……说起来，以前在普通学校的时候，放学后都不知道做什么。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '但现在不一样了！有目标了！明天的课我一定要比你答得更快！做好准备吧！' },
  { type: 'monologue', text: '（夕阳下的她，笑容格外耀眼。那种纯粹的开心，是骗不了人的。）' },
  { type: 'affection', character: 'ayase', change: 1 },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch1_night' }
]

export const ch1_eve_kanna = [
  { type: 'bg', src: 'library_day', transition: 'fade' },
  { type: 'narration', text: '图书馆已经快关门了。橙色的夕阳从窗户斜照进来，把整排书架染成了暖色。' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'warm_smile' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……三次了。你今天来了三次。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……第一次是好奇。第二次是习惯。第三次……' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……我很高兴。' },
  { type: 'narration', text: '她的围巾遮住了大半张脸，但眼角的温柔是藏不住的。' },
  { type: 'monologue', text: '（她居然数过我来的次数……）' },
  { type: 'affection', character: 'kanna', change: 2 },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch1_night' }
]

export const ch1_eve_nene = [
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'narration', text: '计算机教室的灯光在夕阳中显得格外温柔。Nene 还坐在那里，屏幕上的代码在反光。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'gentle_smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '你还在学校？放学后也来找我，好勤奋呢～' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '明天我们要学条件判断了。如果提前预习的话，上课会更轻松哦！' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '说起来……我其实是这学园成立时就被创造出来的。三年了。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '见过很多学生来来去去。但像你这样放学后还会来找我的……不多。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '下课后……如果你有空的话，还可以再来找我。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '不是因为你是学生……是因为……嗯，就是这样！' },
  { type: 'monologue', text: '（三年了吗……她比我想的更「老」。但完全看不出来。）' },
  { type: 'monologue', text: '（AI 也会因为有人来看自己而开心吗……）' },
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
  { type: 'narration', text: '那种速度……像是有生命一样在屏幕上奔跑。' },
  { type: 'monologue', text: '（那速度……完全不是初学者能达到的。那个人到底是谁？）' },
  { type: 'monologue', text: '（今天从走廊荣誉墙上看到的名字——ムラサメ。全国冠军。）' },
  { type: 'monologue', text: '（如果那个人真的就是ムラサメ……她为什么要在夜里独自练习？）' },

  { type: 'choice', prompt: '要敲门进去吗？',
    options: [
      { text: '鼓起勇气敲门', effects: { murasame: 2 }, flags: { ch1_knocked_door: true } },
      { text: '……算了，还是别打扰了', effects: {} },
      { text: '在门口留一张便条', effects: { murasame: 1 }, flags: { ch1_left_note: true } }
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
  { type: 'narration', text: '比昨晚更近距离看到了那张脸——轮廓清晰而锐利，像是用刀刻出来的。' },
  { type: 'dialogue', speaker: '???', text: '……你是谁。' },
  { type: 'monologue', text: '（声音低沉而锐利。那种气场……完全不像学生。）' },
  { type: 'dialogue', speaker: '???', text: '新生？这个时间还在学校晃？你有胆量——或者只是路痴。' },
  { type: 'narration', text: '她扫了我一眼——那种一瞬间就把你从头到脚看透了的感觉。' },
  { type: 'dialogue', speaker: '???', text: '哦……是昨天那个偷窥狂。' },
  { type: 'dialogue', speaker: '???', text: '你叫什么。' },
  { type: 'monologue', text: '（她居然问我名字？）' },
  { type: 'dialogue', speaker: '???', text: '……不重要。反正你们这种新生来了又走。' },
  { type: 'dialogue', speaker: '???', text: '别踩到我的电源线。……走吧。' },
  { type: 'narration', text: '门合上了。但在门完全关上之前——' },
  { type: 'narration', text: '她低声说了一句：「不过……能连续两天来，算你有点意思。」' },
  { type: 'monologue', text: '（金色眼眸的余韵在黑暗中久久不散。）' },
  { type: 'monologue', text: '（她说我有点意思……这算是一种认可吗？还是只是随口一说？）' },
  { type: 'flag', set: 'saw_murasame_ch1', value: true },
  { type: 'jump', target: 'ch1_night_end' }
]

export const ch1_night_leave = [
  { type: 'narration', text: '这次没有推门。但键盘声在你转身离开的那一刻，停了下来。' },
  { type: 'narration', text: '走廊的寂静中，你感觉到背后有一道目光。' },
  { type: 'monologue', text: '（……总觉得被注意到了。）' },
  { type: 'monologue', text: '（那个人……也在注意着我吗？）' },
  { type: 'narration', text: '几秒后，键盘声重新响起。但节奏似乎比之前……慢了一点。' },
  { type: 'flag', set: 'saw_murasame_ch1', value: true },
  { type: 'jump', target: 'ch1_night_end' }
]

export const ch1_night_end = [
  { type: 'bg', src: 'player_room_night', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'evening_calm', crossfade: 1500 },
  { type: 'narration', text: '宿舍的灯光柔和而安静。桌上的笔记本电脑还开着，光标在屏幕上一闪一闪。' },
  { type: 'monologue', text: '躺在床上，回想着今天学到的东西。' },
  { type: 'monologue', text: '变量、字符串、input、print……短短一天，我已经可以写一个简单的「对话程序」了。' },
  { type: 'monologue', text: '虽然还很基础，但第一次让电脑按照自己的想法说话……' },
  { type: 'monologue', text: '那种感觉，确实有点上头。' },
  { type: 'monologue', text: '代码从上到下执行。一行一行，像是时间流逝的方向。' },
  { type: 'monologue', text: '每一行都有意义——就像今天遇到的每一个人，每一段对话。' },
  { type: 'monologue', text: 'Nene 说「变量是盒子」——那我现在的盒子里，装满了今天的回忆。' },
  { type: 'monologue', text: '明天……会更有趣吧。' },
  { type: 'monologue', text: '我将辞职——啊不对，我将继续学习。开玩笑的。' },

  { type: 'bg', src: 'black', transition: 'fade', duration: 2000 },
  { type: 'bgm_stop', fadeOut: 2000 },
  { type: 'narration', text: '—— 第一章「Hello, World!」· 完 ——' },
  { type: 'auto_save' }
]
