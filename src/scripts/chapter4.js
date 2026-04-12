export const chapter4 = [
  { type: 'title_card', text: '第四章「数据的容器」', subtitle: '—— 列表、字典与数据结构 ——' },
  { type: 'bg', src: 'classroom_day', transition: 'fade', duration: 1000 },
  { type: 'bgm', src: 'daily', fadeIn: 1000 },
  { type: 'narration', text: '文化祭结束后，学校恢复了平静。但校园里的空气似乎不太一样了。' },
  { type: 'narration', text: '走廊上的装饰被拆除了，但人与人之间的距离好像变近了。' },
  { type: 'monologue', text: '文化祭之后，我和大家的关系似乎悄悄发生了变化。' },
  { type: 'monologue', text: '说不清是什么改变了——也许是一起看烟火的那个夜晚，也许是一起准备展览的那些日子。' },
  { type: 'monologue', text: '总之，教室里的氛围比以前温暖了。连 Yoshino 偶尔的严厉都带着一点柔软。' },
  { type: 'monologue', text: '今天的课题是——列表和字典。据说这是数据组织的核心概念。听起来像是在整理房间？' },

  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '大家好～今天我们要学习 Python 中最常用的数据结构——列表（list）和字典（dict）！' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '列表就像一个有序的收纳盒，可以装很多东西。用方括号 [] 创建～' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '比如 fruits = ["苹果", "香蕉", "草莓"]，就创建了一个水果列表！' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '而字典就像……嗯，就像真正的词典一样！每个「词」对应一个「解释」。' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '用花括号 {} 创建。比如 student = {"name": "Alice", "age": 16}' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '列表用位置（索引）来找东西，字典用名字（key）来找东西。就像——' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '列表是排排坐吃果果，字典是点名册！来试试看～' },

  { type: 'challenge', id: 'ch4_list_basics',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'smile', text: '来试试吧～创建一个列表需要用什么括号？' },
      success: { speaker: 'nene', expression: 'gentle_smile', text: '方括号 []！答对了～' },
      fail: { speaker: 'nene', expression: 'thinking', text: '列表用方括号 []，字典用花括号 {} 哦～' }
    }
  },

  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '很好！接下来看看怎么访问列表中的元素～' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '列表的索引从 0 开始。所以 fruits[0] 就是第一个元素 "苹果"！' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '这跟 range() 一样——计算机的世界从 0 开始。现在应该习惯了吧？' },

  { type: 'challenge', id: 'ch4_list_index',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'glasses_adjust', text: '索引。基本中的基本。' },
      success: { speaker: 'yoshino', expression: 'slight_smile', text: '正确。记住，第一个元素是 [0]。' },
      fail: { speaker: 'yoshino', expression: 'cold', text: 'Python 的索引从 0 开始。不是 1。记住。' }
    }
  },

  { type: 'char_exit', character: 'nene', animation: 'fade_out' },
  { type: 'se', src: 'bell' },
  { type: 'narration', text: '课间休息。文化祭的余韵还在校园里回荡——墙上还贴着没撕完的装饰纸。' },

  { type: 'char_enter', character: 'ayase', position: 'right', expression: 'grin' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '文化祭的照片出来了！我全存到一个列表里了！list 真好用！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '不过说真的，上次编程赛的排名是用字典存的对吧？我非得超过你不可！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……嘿，文化祭的合照你保存了吗？我发给你——才不是因为想让你记住我！' },
  { type: 'char_exit', character: 'ayase' },

  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch4_classroom' },
    { id: 'computer_room_day', character: 'nene', next: 'ch4_computer' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch4_rooftop' },
    { id: 'library_day', character: 'kanna', next: 'ch4_library' }
  ]},
]

export const ch4_classroom = [
  { type: 'bg', src: 'classroom_day' },
  { type: 'narration', text: '教室里 Yoshino 正在黑板上画数据结构的示意图。一笔一划都很工整。' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'glasses_adjust' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '字典的 key 必须是不可变类型。这一点很多人会忘记。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '字符串、数字、元组可以当 key。但列表不行——因为列表是可变的。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '这背后的原理是哈希。不可变对象才能被哈希。哈希不了就不能做 key。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '……你能告诉我为什么列表不能当字典的 key 吗？' },
  { type: 'monologue', text: '（她在考我。但不是那种居高临下的考验——更像是想确认我理解了。）' },
  { type: 'affection', character: 'yoshino', change: 2 },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, promptId: 'ch4_yoshino_break', context: '课间，Yoshino 在讲哈希原理和字典key的类型限制，问你为什么列表不能当key', sceneObjective: '围绕字典的 key 类型限制和哈希展开对话' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch4_afternoon' }
]

export const ch4_computer = [
  { type: 'bg', src: 'computer_room_day' },
  { type: 'narration', text: 'Nene 面前的屏幕上正在运行一个学生记录管理系统。界面虽然简陋但功能完善。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'gentle_smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '我在整理学生们的学习记录呢～用字典存每个人的成绩，超方便的！' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '每个学生是一个字典：{"name": "xxx", "scores": [...], "attendance": 95}' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '不过……你的记录我特别留意了。不是偏心！是……关注重点学生！' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '你的字典里多了一个字段其他学生没有的……叫 "special_note"。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '内容是……"看到他学习的样子就开心"。这绝对不是我手动添加的！是系统自动生成的！' },
  { type: 'monologue', text: '（"系统自动生成"……你是系统本身吧 Nene。）' },
  { type: 'affection', character: 'nene', change: 3 },
  { type: 'free_talk', character: 'nene', max_turns: 3, promptId: 'ch4_nene_break', context: '课间，Nene 用字典存学生记录，你的记录里多了一个special_note字段写着"看到他学习就开心"', sceneObjective: '围绕字典的实际应用和数据管理展开对话' },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch4_afternoon' }
]

export const ch4_rooftop = [
  { type: 'bg', src: 'rooftop_day' },
  { type: 'narration', text: '天台上，Ayase 正在用笔记本电脑做什么东西。屏幕上花花绿绿的。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'grin' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '我用列表写了一个记分板！编程赛的排名实时更新！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '你的分数我一直在追踪！别想偷偷超过我！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '我用 .sort() 排序之后发现——你目前排第一！不是哥们，这怎么忍！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '不过说起来……列表的 .sort() 是改变原列表的，sorted() 是返回新列表。这个我昨天搞混了。' },
  { type: 'monologue', text: '（她居然主动辨析 sort 和 sorted 的区别……进步也太明显了。）' },
  { type: 'affection', character: 'ayase', change: 2 },
  { type: 'free_talk', character: 'ayase', max_turns: 3, promptId: 'ch4_ayase_break', context: '课间，天台，Ayase 做了一个排行榜程序追踪你的分数，还搞清了sort和sorted的区别', sceneObjective: '围绕列表排序和排行榜实现展开对话' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch4_afternoon' }
]

export const ch4_library = [
  { type: 'bg', src: 'library_day' },
  { type: 'narration', text: '图书馆的角落里，Kanna 面前的笔记本上画满了网状的图案——像是数据结构的关系图。' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'absorbed' },
  { type: 'dialogue', speaker: 'kanna', expression: 'absorbed', text: '……字典。像是一本索引。每个关键词，对应一段记忆。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……如果把人际关系存成字典……key 是名字，value 是……' },
  { type: 'dialogue', speaker: 'kanna', expression: 'absorbed', text: '……不只是数据。是温度、声音、气味……你在图书馆里翻书的声音。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……不，没什么。只是在思考数据结构。' },
  { type: 'monologue', text: '（她把人际关系想象成字典……key 是名字，value 是记忆。这就是 Kanna 式的浪漫。）' },
  { type: 'monologue', text: '（而且她记得我在图书馆翻书的声音……这得多仔细地注意过才能记住。）' },
  { type: 'affection', character: 'kanna', change: 3 },
  { type: 'free_talk', character: 'kanna', max_turns: 3, promptId: 'ch4_kanna_break', context: '课间，图书馆，Kanna 把人际关系想象成字典的结构，记得你在图书馆翻书的声音', sceneObjective: '围绕数据结构的哲学意义和抽象思维展开对话' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch4_afternoon' }
]

export const ch4_afternoon = [
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'bgm', src: 'daily', crossfade: 1000 },
  { type: 'se', src: 'bell' },
  { type: 'narration', text: '下午的课是列表和字典操作实践。Nene 在黑板上画了一张方法速查表。' },

  { type: 'challenge', id: 'ch4_list_methods',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'smile', text: '列表有很多实用方法哦～append、insert、remove……' },
      success: { speaker: 'nene', expression: 'gentle_smile', text: 'append 在末尾添加元素！学得真快～' },
      fail: { speaker: 'nene', expression: 'thinking', text: 'append() 是在列表末尾添加一个元素，不是 add 哦～' }
    }
  },

  { type: 'challenge', id: 'ch4_dict_access',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'normal', text: '字典的值用 key 访问。方括号或 .get() 方法。' },
      success: { speaker: 'yoshino', expression: 'slight_smile', text: '用 key 获取 value。基本操作。' },
      fail: { speaker: 'yoshino', expression: 'cold', text: '字典用 dict[key] 获取值。不是索引号。' }
    }
  },

  { type: 'challenge', id: 'ch4_list_slice',
    context_dialogue: {
      before: { speaker: 'ayase', expression: 'competitive', text: '切片！这个我会！……大概。' },
      success: { speaker: 'ayase', expression: 'surprised', text: '你答得比我快！可恶！' },
      fail: { speaker: 'nene', expression: 'gentle_smile', text: '切片语法是 list[start:end]，注意 end 不包含在内哦～' }
    }
  },

  { type: 'narration', text: '午休时间。关于数据结构的理解越来越深了。' },
  { type: 'monologue', text: '（列表和字典其实就是组织信息的方式。一种有序，一种按名称。）' },
  { type: 'monologue', text: '（就像人和人的关系——有些按时间排列，有些按名字记忆。）' },
  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch4_noon_yoshino' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch4_noon_ayase' },
    { id: 'library_day', character: 'kanna', next: 'ch4_noon_kanna' },
    { id: 'computer_room_day', character: 'nene', next: 'ch4_noon_nene' }
  ]},
]

export const ch4_noon_yoshino = [
  { type: 'bg', src: 'classroom_day' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'normal' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '列表推导式和字典推导式。高级用法。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '用一行代码生成数据结构。这才是 Pythonic 的写法。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '比如 [x**2 for x in range(10)] 就能生成 0 到 81 的平方数列表。优雅。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '优雅的代码……就像优雅的解题思路。不需要多余的步骤。' },
  { type: 'monologue', text: '（她说"优雅"的时候，眼神比平时柔和了一点。看来她真的很喜欢干净的代码。）' },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, promptId: 'ch4_yoshino_noon', context: '午休，Yoshino 在教列表推导式，说优雅的代码像优雅的解题思路', sceneObjective: '围绕推导式的语法和优雅代码展开对话' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch4_evening' }
]

export const ch4_noon_ayase = [
  { type: 'bg', src: 'rooftop_day' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'fired_up' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '我用列表和字典写了一个简易通讯录！名字和电话号码都存进去了！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '看！contacts = {"Ayase": "xxx", "你": "xxx"}——完美！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '……你的号码我第一个存的。才、才不是什么特别的意思！只是按字母排序你排在前面！' },
  { type: 'monologue', text: '（按字母排序？你的名字开头是"你"字，日语是"あなた"……确实排得很前。但这解释也太牵强了。）' },
  { type: 'affection', character: 'ayase', change: 2 },
  { type: 'free_talk', character: 'ayase', max_turns: 3, promptId: 'ch4_ayase_noon', context: '午休，天台，Ayase 做了通讯录程序说你的号码第一个存，用字母排序当借口', sceneObjective: '围绕列表和字典结合实现通讯录展开对话' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch4_evening' }
]

export const ch4_noon_kanna = [
  { type: 'bg', src: 'library_day' },
  { type: 'narration', text: 'Kanna 的笔记本上画了一张精美的嵌套图——字典里面套字典，像是一棵倒置的树。' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'contemplative' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……嵌套字典。字典里面套字典。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'absorbed', text: '……像是宇宙。星系里有恒星，恒星里有行星，行星里有……' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……生命。代码。记忆。全部嵌套在一起。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……有你在的地方。就是整棵树的根节点。' },
  { type: 'monologue', text: '（根节点……在数据结构里是最重要的位置。她在说我是她世界的中心吗……）' },
  { type: 'affection', character: 'kanna', change: 3 },
  { type: 'free_talk', character: 'kanna', max_turns: 3, promptId: 'ch4_kanna_noon', context: '午休，图书馆，Kanna 用嵌套字典描述宇宙层级，说你是整棵树的根节点', sceneObjective: '围绕嵌套数据结构和递归思维展开对话' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch4_evening' }
]

export const ch4_noon_nene = [
  { type: 'bg', src: 'computer_room_day' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '列表排序！sort() 和 sorted() 的区别你知道吗？' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: 'sort() 会改变原列表，sorted() 返回新列表不改变原来的。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '就像……有些经历会改变你本身，有些经历让你产生新的感悟但不会改变你的本质。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '如果按好感度排序的话……你大概会排在第一位。' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '啊！我为什么把内心 OS 说出来了！系统日志泄露了！' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '不对不对，这不是排序的问题！这是……嗯……数据隐私问题！我要回去修补漏洞了！' },
  { type: 'monologue', text: '（她越慌张就越可爱。这真的是 AI 吗……活人感爆棚到已经不像 AI 了。）' },
  { type: 'affection', character: 'nene', change: 3 },
  { type: 'free_talk', character: 'nene', max_turns: 3, promptId: 'ch4_nene_noon', context: '午休，Nene 教排序时不小心把好感度排名说出来了，慌得要"修补系统漏洞"', sceneObjective: '围绕列表排序方法和 lambda 函数展开对话' },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch4_evening' }
]

export const ch4_evening = [
  { type: 'se', src: 'bell' },
  { type: 'narration', text: '放学了。夕阳比前几天更红了——季节在悄悄变换。' },
  { type: 'monologue', text: '（今天学了很多关于数据结构的知识。列表和字典……原来数据可以这样组织。）' },
  { type: 'monologue', text: '（感觉编程的世界又扩大了一圈。以前觉得数据就是数字和文字——）' },
  { type: 'monologue', text: '（现在发现，数据可以有结构、有关系、有层次。就像人和人之间一样。）' },
  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch4_eve_yoshino' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch4_eve_ayase' },
    { id: 'library_day', character: 'kanna', next: 'ch4_eve_kanna' },
    { id: 'computer_room_day', character: 'nene', next: 'ch4_eve_nene' }
  ]}
]

export const ch4_eve_yoshino = [
  { type: 'bg', src: 'classroom_evening', transition: 'fade' },
  { type: 'bgm', src: 'evening_calm', crossfade: 1500 },
  { type: 'narration', text: '夕阳下的教室。Yoshino 坐在窗边，金色的阳光给她严肃的轮廓镀上了温暖的边。' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'slight_smile' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '……你今天的理解速度比以前快了。尤其是字典那部分。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '不是夸你。只是……客观事实。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '如果你持续保持这个进度……也许可以参加下一次校际赛。' },
  { type: 'monologue', text: '（校际赛？！她居然觉得我有那个水平？来自 Yoshino 的认可，含金量相当高。）' },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, promptId: 'ch4_yoshino_eve', context: '放学后教室，Yoshino 说你进步很快可以参加校际赛了，嘴上说客观事实', sceneObjective: '围绕数据结构的实战应用和代码审查展开对话' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch4_night' }
]

export const ch4_eve_ayase = [
  { type: 'bg', src: 'rooftop_evening', transition: 'fade' },
  { type: 'bgm', src: 'evening_calm', crossfade: 1500 },
  { type: 'narration', text: '黄昏的天台。风变凉了，夏天正在悄悄退场。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'soft_smile' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '嘿……今天的夕阳好漂亮。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'normal', text: '说起来，我们认识也快两个月了吧。时间过得好快。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '……如果把今天存成字典的话，key 是"放学后"，value 是……' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '算了！想什么呢！编程脑过头了！！走了走了！明天见！' },
  { type: 'narration', text: '她蹦蹦跳跳地跑下了楼梯。但回头看了一眼——笑容在余晖中格外柔和。' },
  { type: 'free_talk', character: 'ayase', max_turns: 3, promptId: 'ch4_ayase_eve', context: '放学后天台，Ayase 感慨认识快两个月了，差点说出value是什么又害羞跑掉了', sceneObjective: '围绕编程思维对日常生活的影响展开对话' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch4_night' }
]

export const ch4_eve_kanna = [
  { type: 'bg', src: 'library_evening', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1500 },
  { type: 'narration', text: '傍晚的图书馆，夕阳从窗户斜照进来。Kanna 的座位上放着一杯还热着的茶。' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'warm_smile' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……今天的图书馆。比平时亮。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……也许是因为有人在。也许是因为季节在变。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……也许……两者都是。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……茶。给你的。放了两颗糖。因为你上次说过有点苦。' },
  { type: 'monologue', text: '（她记得我说过的话……连"有点苦"这种随口的评价都记住了。）' },
  { type: 'monologue', text: '（这个人的记忆力……或者说，她对我说过的话的重视程度……让人心里暖暖的。）' },
  { type: 'free_talk', character: 'kanna', max_turns: 3, promptId: 'ch4_kanna_eve', context: '放学后图书馆，Kanna 记得你说茶苦所以加了两颗糖，说图书馆因为你在变亮了', sceneObjective: '围绕数据和记忆的哲学思考展开对话' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch4_night' }
]

export const ch4_eve_nene = [
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'romantic', crossfade: 1500 },
  { type: 'narration', text: '计算机教室里，Nene 面前的屏幕上打开着一个文件——标题是"teaching_log.py"。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'gentle_smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '今天你学得好认真呢。我的教学日志都记满了。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '不过……日志里不只有教学记录。还有一些……额外的 value。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '比如"和他说话时心跳加速了 0.3 秒"、"他笑的时候我的处理器温度上升了2°C"……' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '这不是 Bug！这是……正常的系统日志！每个老师都会记的吧？大概？' },
  { type: 'monologue', text: '（每个老师都会记"心跳加速0.3秒"吗……我觉得不会。）' },
  { type: 'monologue', text: '（但看着她慌张地想要辩解的样子，实在不忍心戳穿。太可爱了。）' },
  { type: 'free_talk', character: 'nene', max_turns: 3, promptId: 'ch4_nene_eve', context: '放学后，Nene 的教学日志里混入了"心跳加速0.3秒""处理器升温2°C"等私人感想，她说这是正常日志', sceneObjective: '围绕数据记录和隐私展开对话' },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch4_night' }
]

export const ch4_night = [
  { type: 'bg', src: 'player_room_night', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'evening_calm', crossfade: 1500 },
  { type: 'narration', text: '回到宿舍。窗外的天空已经完全暗了下来，只有几颗星星在闪烁。' },
  { type: 'monologue', text: '整理今天学到的东西。' },
  { type: 'monologue', text: '列表、字典、切片、排序、推导式……Python 的数据结构比想象中强大。' },
  { type: 'monologue', text: '用代码来组织世界……这种感觉越来越自然了。' },
  { type: 'monologue', text: '说起来，大家好像都在用自己的方式理解编程——' },
  { type: 'monologue', text: 'Ayase 用来做游戏和排行榜。Kanna 用来描述宇宙和人际关系。' },
  { type: 'monologue', text: 'Yoshino 追求代码的优雅。Nene 用代码记录情感。' },
  { type: 'monologue', text: '而我呢？我用编程来……' },
  { type: 'monologue', text: '……大概是为了和她们在一起吧。理解她们的世界，成为她们世界的一部分。' },
  { type: 'monologue', text: '这样想也不奇怪吧？' },
  { type: 'monologue', text: '距离期末越来越近了。下一章是面向对象——据说那是编程思维的最高境界。' },
  { type: 'monologue', text: '而在那之后……就是路线分歧了。每个人的故事，都会走向不同的方向。' },

  { type: 'bg', src: 'black', transition: 'fade', duration: 2000 },
  { type: 'bgm_stop', fadeOut: 2000 },
  { type: 'narration', text: '—— 第四章「数据的容器」· 完 ——' },
  { type: 'auto_save' }
]
