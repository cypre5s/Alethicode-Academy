export const chapter5 = [
  { type: 'title_card', text: '第五章「面向对象」', subtitle: '—— 类、对象与属于自己的世界 ——' },
  { type: 'bg', src: 'school_gate_day', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'morning_fresh', fadeIn: 1000 },
  { type: 'narration', text: '秋天了。校门前的银杏树开始变黄，落叶铺满了石板路。' },
  { type: 'narration', text: '空气中多了一丝凉意，但阳光依旧温暖。' },
  { type: 'monologue', text: '不知不觉已经过了好几个月了。从樱花飘落到银杏变黄——' },
  { type: 'monologue', text: '我从一个连 print 都不会写的零基础新生，变成了能独立写小程序的人。' },
  { type: 'monologue', text: '期末考试前的最后一个大课题——面向对象编程。' },
  { type: 'monologue', text: '「用代码描述世界」——Nene 是这样说的。' },
  { type: 'monologue', text: '但我觉得，也许更像是「用代码创造世界」。因为在代码的世界里，一切都可以被定义。' },

  { type: 'bg', src: 'classroom_day', transition: 'fade', duration: 1000 },
  { type: 'bgm', src: 'daily', fadeIn: 1000 },
  { type: 'narration', text: '教室里的气氛比平时更凝重。大家都知道——这是最后一个大章节了。' },
  { type: 'narration', text: '黑板上用粉笔画了一张复杂的类继承关系图。看起来像一棵倒置的树。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '今天的主题是面向对象编程！OOP！这是编程思想的一次飞跃～' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '之前我们学的都是「做什么」——写函数、写循环、处理数据。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '但面向对象是「我是谁」——先定义事物的本质，再描述它能做什么。' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '简单来说，类（class）就是一个模板，对象（object）就是按模板创建出来的实例。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '比如「猫」是一个类——它有名字、颜色、年龄这些属性。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '而「小花」「小黑」是猫的实例——每只猫都有自己的名字和颜色。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '类还有方法——就是类能做的事。比如猫可以 meow()、sleep()、eat()～' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '如果我是一个类的话……那、那你大概就是让这个类运行起来的参数吧。' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '啊——我又说奇怪的话了。回到正题！' },

  { type: 'challenge', id: 'ch5_class_basics',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'smile', text: '定义一个类用什么关键字呢？' },
      success: { speaker: 'nene', expression: 'gentle_smile', text: 'class！就像 def 定义函数一样～' },
      fail: { speaker: 'nene', expression: 'thinking', text: '用 class 关键字定义类，首字母大写哦～' }
    }
  },

  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '__init__ 方法是构造函数，创建对象时自动调用。就像出生时的初始设定。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: 'self 代表对象本身——就是"我自己"。在方法里用 self.name 访问自己的属性。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '如果 class Nene 有一个 self.mood 属性……那我现在的 mood 是——' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '好了好了不说了！来做题！' },

  { type: 'challenge', id: 'ch5_init_method',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'glasses_adjust', text: '构造函数。类的基本要素。' },
      success: { speaker: 'yoshino', expression: 'slight_smile', text: '正确。__init__ 是类的入口。' },
      fail: { speaker: 'yoshino', expression: 'cold', text: '__init__ 是双下划线。不要忘记 self 参数。' }
    }
  },

  { type: 'char_exit', character: 'nene', animation: 'fade_out' },
  { type: 'se', src: 'bell' },
  { type: 'narration', text: '课间。窗外的银杏叶在秋风中纷纷飘落。' },
  { type: 'narration', text: '大家都在思考如何用类来描述自己的世界——而每个人的世界都不一样。' },
  { type: 'monologue', text: '（面向对象……把世界抽象成类和对象。如果每个人都是一个类的话——）' },
  { type: 'monologue', text: '（Nene 大概是 class AITeacher，Yoshino 是 class PerfectStudent……）' },
  { type: 'monologue', text: '（Ayase 是 class EnergyBomb，Kanna 是 class QuietObserver……）' },
  { type: 'monologue', text: '（而那个深夜里的全国冠军……class Legend？）' },

  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch5_classroom' },
    { id: 'computer_room_day', character: 'nene', next: 'ch5_computer' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch5_rooftop' },
    { id: 'library_day', character: 'kanna', next: 'ch5_library' }
  ]},
]

export const ch5_classroom = [
  { type: 'bg', src: 'classroom_day' },
  { type: 'narration', text: 'Yoshino 面前的笔记本屏幕上显示着一个类层级图——干净、优雅、逻辑清晰。' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'glasses_adjust' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '继承。多态。封装。面向对象的三大支柱。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '继承——子类继承父类的属性和方法。不需要重写。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '多态——同一个方法在不同子类中可以有不同行为。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '封装——把内部细节藏起来，只暴露必要的接口。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '……我正在设计一个代码审查系统。用类来封装规则。想看吗？' },
  { type: 'monologue', text: '（她难得地主动分享自己的项目。看来 OOP 对她来说有特别的意义。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '封装是我最喜欢的概念。因为——' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '不需要让所有人看到内部实现。只需要知道怎么用就好。' },
  { type: 'monologue', text: '（她说封装的时候，像是在说自己。把柔软藏在严格的外壳里……Yoshino 本人就是最好的封装。）' },
  { type: 'affection', character: 'yoshino', change: 3 },
  { type: 'free_talk', character: 'yoshino', max_turns: 4, promptId: 'ch5_yoshino_break', context: '课间，Yoshino 用类设计代码审查系统，说封装是她最喜欢的概念——不需要让所有人看到内部', sceneObjective: '围绕类的继承、多态和代码设计模式展开对话' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch5_afternoon' }
]

export const ch5_computer = [
  { type: 'bg', src: 'computer_room_day' },
  { type: 'narration', text: 'Nene 面前的屏幕上正在运行一段特殊的代码——标题写着"class_nene.py"。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'thinking' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '如果把我自己写成一个类……class Nene 的属性应该有什么呢？' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: 'self.name = "綾地寧々"，self.role = "AI助教"，self.knowledge_level = "高"……' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: 'self.mood = "开心"……因为你在。呜呜，我的属性也太诚实了。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '还有 self.heartbeat_rate……等等，AI 有心跳吗？' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '如果我给自己添加一个 heart_module 的属性……它的值应该是 True 还是 False 呢？' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '目前是 None。但我想……也许有一天它会变成 True。' },
  { type: 'monologue', text: '（heart_module = None……她在暗示什么？）' },
  { type: 'monologue', text: '（等等——如果 Nene 是一个类的实例，那她的 heart_module 属性是谁来赋值的？）' },
  { type: 'affection', character: 'nene', change: 3 },
  { type: 'free_talk', character: 'nene', max_turns: 4, promptId: 'ch5_nene_break', context: '课间，Nene 把自己写成 class，属性有 mood="开心因为你在"、heart_module=None，暗示心模块等待被启用', sceneObjective: '围绕如何用类描述角色属性和方法展开对话' },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch5_afternoon' }
]

export const ch5_rooftop = [
  { type: 'bg', src: 'rooftop_day' },
  { type: 'narration', text: '天台上，秋风比前几周更凉了。Ayase 穿上了一件印着代码图案的卫衣。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'fired_up' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '类就是模板对吧！那我要做一个 Player 类！攻击力！防御力！必杀技！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '然后让你的角色和我的角色对战！输了请吃冰淇淋！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '我已经写好了！class Player 有 attack()、defend()、还有 ultimate_skill()！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……说起来，如果把我写成一个类的话——' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: 'class Ayase 的属性里……大概会有一个 rival = None……' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '但现在已经不是 None 了。被赋值了。才不告诉你是谁！' },
  { type: 'monologue', text: '（rival 被赋值了……她又在用编程术语表白吗。而且明明知道我猜得到。）' },
  { type: 'affection', character: 'ayase', change: 2 },
  { type: 'free_talk', character: 'ayase', max_turns: 4, promptId: 'ch5_ayase_break', context: '课间，天台，Ayase 做了 Player 类要对战，还说 class Ayase 的 rival 属性被赋值了', sceneObjective: '围绕用类实现游戏角色和方法展开对话' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch5_afternoon' }
]

export const ch5_library = [
  { type: 'bg', src: 'library_day' },
  { type: 'narration', text: '秋天的图书馆，窗外的银杏叶把阳光过滤成了金色。' },
  { type: 'narration', text: 'Kanna 面前的笔记本上，不是代码也不是书——是一幅手绘的类关系图。' },
  { type: 'narration', text: '用彩色铅笔画的。每个类都用不同的颜色标注。' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'absorbed' },
  { type: 'dialogue', speaker: 'kanna', expression: 'absorbed', text: '……类。是一种抽象。把复杂的东西……变成简单的概念。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……就像……把一个人的所有特征……压缩成一个名字。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……当我说你的名字时……我的脑子里会浮现出：你的笑容、你翻书的动作、你喝茶的样子……' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……你的名字。对我来说。就是一个包含很多很多记忆的……类。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……而且这个类只有一个实例。全世界唯一的。' },
  { type: 'monologue', text: '（全世界唯一的实例……这大概是我听过最含蓄也最深刻的表白了。）' },
  { type: 'affection', character: 'kanna', change: 4 },
  { type: 'free_talk', character: 'kanna', max_turns: 4, promptId: 'ch5_kanna_break', context: '课间，图书馆，Kanna 说你的名字是一个包含很多记忆的类，只有一个全世界唯一的实例', sceneObjective: '围绕抽象思维、封装和类的哲学含义展开对话' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch5_afternoon' }
]

export const ch5_afternoon = [
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'bgm', src: 'daily', crossfade: 1000 },
  { type: 'se', src: 'bell' },
  { type: 'narration', text: '下午的课是 OOP 实践——用类描述学校里的事物。' },
  { type: 'narration', text: 'Nene 在黑板上画了一个 Student 类的结构图，然后让大家动手写自己的类。' },

  { type: 'challenge', id: 'ch5_class_method',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'smile', text: '类的方法就是类能做的事情～记得第一个参数是 self 哦！' },
      success: { speaker: 'nene', expression: 'gentle_smile', text: '方法定义完美！self 是对象自己的引用～' },
      fail: { speaker: 'nene', expression: 'thinking', text: '类的方法第一个参数必须是 self，代表对象本身哦～' }
    }
  },

  { type: 'challenge', id: 'ch5_inheritance',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'normal', text: '继承。子类继承父类的属性和方法。DRY 原则的体现。' },
      success: { speaker: 'yoshino', expression: 'slight_smile', text: '继承的语法很简单，但设计好的继承树需要经验。' },
      fail: { speaker: 'yoshino', expression: 'cold', text: 'class 子类(父类): 这是继承的基本语法。' }
    }
  },

  // ===== 期末氛围 =====
  { type: 'narration', text: '期末将至。每个人都在用自己的方式准备着。' },
  { type: 'narration', text: '教室里的氛围变了。不是紧张，而是一种说不清楚的感觉——' },
  { type: 'narration', text: '像是一首曲子即将进入最后一个乐章。' },
  { type: 'monologue', text: '（大家都变了。从几个月前的陌生人，到现在——）' },
  { type: 'monologue', text: '（是朋友？是同学？还是……比这些更深的什么？）' },

  // 走廊偶遇
  { type: 'bg', src: 'hallway_day', transition: 'fade' },
  { type: 'narration', text: '放学后的走廊。夕阳把荣誉墙上的金牌照得闪闪发光。' },
  { type: 'narration', text: '「ムラサメ」的名字在金色光芒中格外耀眼。' },
  { type: 'monologue', text: '（这个名字……从入学第一天就刻在了我心里。）' },
  { type: 'monologue', text: '（那个深夜里孤独编码的身影、金色的眼眸、冷冽的声音——）' },
  { type: 'monologue', text: '（如果所有人都是一个类的实例……那 Murasame 大概是最特殊的那个。）' },
  { type: 'monologue', text: '（孤独到极致，强大到令人仰望，但偶尔露出的脆弱——让人忍不住想靠近。）' },

  // ===== 夜晚总结 =====
  { type: 'bg', src: 'player_room_night', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'evening_calm', crossfade: 1500 },
  { type: 'narration', text: '回到宿舍。窗外的夜空比以前更清澈了——秋天的星星特别亮。' },
  { type: 'monologue', text: '面向对象……用代码创造一个属于自己的世界。' },
  { type: 'monologue', text: '变量、条件、循环、函数、列表、字典、类……' },
  { type: 'monologue', text: '从最初连 print("Hello World") 都不会写，到现在能用类来描述世界。' },
  { type: 'monologue', text: '这段旅程……比想象中精彩得多。' },
  { type: 'monologue', text: '这段时间，学到的不只是编程。还有——' },
  { type: 'monologue', text: 'Nene 的温柔教会我——知识可以是温暖的，学习可以是快乐的。' },
  { type: 'monologue', text: 'Yoshino 的严格教会我——完美虽然不存在，但追求完美的过程有意义。' },
  { type: 'monologue', text: 'Ayase 的元气教会我——输了不可怕，不敢挑战才可怕。' },
  { type: 'monologue', text: 'Kanna 的沉静教会我——世界比看到的更深，代码可以是诗。' },
  { type: 'monologue', text: '而 Murasame……她教会我——站在顶点不一定快乐，但有人陪伴就不孤独。' },
  { type: 'monologue', text: '她们每个人，都教会了我一些代码之外的东西。' },
  { type: 'monologue', text: '这个学期……快要结束了。' },
  { type: 'monologue', text: '接下来的故事——不再是「一起上课」的共同时光。' },
  { type: 'monologue', text: '而是——每个人各自的路线。每段故事，都将走向不同的终点。' },
  { type: 'monologue', text: '我准备好了。不管哪条路——都不会后悔。' },

  { type: 'bg', src: 'black', transition: 'fade', duration: 2000 },
  { type: 'bgm_stop', fadeOut: 2000 },
  { type: 'narration', text: '—— 第五章「面向对象」· 完 ——' },
  { type: 'narration', text: '—— 进入个人路线 ——' },
  { type: 'auto_save' },
  { type: 'route_decision' }
]
