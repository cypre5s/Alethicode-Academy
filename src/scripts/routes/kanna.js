export const routeKanna = [
  // ──────────────────────────────────────────────
  // Kanna 线「人间失格、あるいは再帰」
  // 文風：太宰治《人间失格》—— 自我解体的独白、
  // 对人间的恐怖与憧憬、用自嘲掩饰脆弱、
  // 诗化的绝望中透出微弱的救赎之光
  // ──────────────────────────────────────────────
  { type: 'title_card', text: 'Kanna 线「人间失格、あるいは再帰」', subtitle: '—— 我对人类的营生，始终怀着不安与恐惧 ——' },
  { type: 'bg', src: 'library_day', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'peaceful', fadeIn: 1500 },

  // ===== K-01: 独白 =====
  { type: 'narration', text: '我自幼便对人类的交往感到恐惧。' },
  { type: 'narration', text: '不，与其说恐惧，不如说——不理解。人们对视时交换的那种无形之物，于我而言，如同一门从未学过的语言。' },
  { type: 'narration', text: '微笑是什么意思？嘲笑和善意之间的界线在哪里？什么时候该说话？什么时候该沉默？' },
  { type: 'narration', text: '这些对别人来说像呼吸一样自然的事——对我来说，每一次都是一道没有标准答案的考试。' },
  { type: 'narration', text: '所以我选择了图书馆。那个靠窗第三排、最角落的座位。围巾裹到下巴，像是用柔软的织物筑起一道城墙。' },
  { type: 'narration', text: '书不会嘲笑你。代码不会误解你。算法不会在背后议论你。' },
  { type: 'narration', text: '——直到那个人开始每天出现在我的世界里。' },

  // ===== K-02: 日常 · 固定座位 =====
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'slight_smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……你来了。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'normal', text: '……你的座位。在那里。热可可。两颗糖。' },
  { type: 'monologue', text: '（她已经给我固定了座位。那杯可可总是恰好的温度。她对这个世界如此笨拙，对我却如此细致。）' },
  { type: 'monologue', text: '（这种矛盾——让我的胸口隐隐作痛。是好的那种痛吗？我还无法判断。）' },
  { type: 'narration', text: '我在她旁边坐下来。从包里拿出课本。' },
  { type: 'narration', text: '她没有说话。只是把自己的椅子往我这边挪了大约三厘米——也许她以为我没注意到。' },
  { type: 'narration', text: '但我注意到了。三厘米。在她的世界里，这可能等同于一个拥抱。' },

  // ===== K-03: 安静的日常 · 不说话的对话 =====
  { type: 'narration', text: '日子一天天过去。我们之间的沉默，不知何时变得比世上任何语言都要丰饶。' },
  { type: 'narration', text: '图书馆管理员曾经好奇地问过：「你们是朋友吗？怎么从来不说话？」' },
  { type: 'narration', text: 'Kanna 沉默了很久。最后她用围巾遮住嘴唇，细声说——' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……不说话也是一种对话。也许是……我唯一不会失败的那种。' },
  { type: 'monologue', text: '（「唯一不会失败的对话」——那句话像一把极细的针，不知扎进了我心脏的哪个角落。）' },

  { type: 'narration', text: '她总是用代码替代言语。仿佛那些由 0 和 1 构成的世界，才是她真正的母语。' },
  { type: 'narration', text: '有一次她给我看了一段代码——没有说一个字，只是把屏幕转向我。' },
  { type: 'narration', text: '代码运行后打印了一行字：「今天也很高兴你来了。」' },
  { type: 'narration', text: '然后她迅速关掉了终端，假装什么都没发生。' },
  { type: 'monologue', text: '（她用 print() 对我说了她说不出口的话。这大概是世界上最内向的社交方式。）' },

  // ===== K-04: 递归 · 自我参照 =====
  { type: 'dialogue', speaker: 'kanna', expression: 'absorbed', text: '……递归就是……函数调用自己。像镜子对着镜子。无限但有终止条件。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……人和人的关系也是递归的。你影响我，我影响你。无限循环。但有一个终止条件——' },
  { type: 'narration', text: '她的声音在这里断了一拍。围巾下的嘴唇微微颤动。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……不想结束。这是我第一次……不想给递归设终止条件。' },
  { type: 'monologue', text: '（她是在说——她不想让我们的关系结束。用递归来表白。只有 Kanna 做得出来。）' },
  { type: 'affection', character: 'kanna', change: 3 },

  // 编程题 K-1
  { type: 'challenge', id: 'kanna_recursion',
    context_dialogue: {
      before: { speaker: 'kanna', expression: 'contemplative', text: '……斐波那契。数学的诗。每一项都是前两项之和。' },
      success: { speaker: 'kanna', expression: 'slight_smile', text: '……嗯。你理解递归了。像两面相对的镜子。无限。但不恐怖。' },
      fail: { speaker: 'kanna', expression: 'normal', text: '……fib(6) = fib(5) + fib(4) = 5 + 3 = 8。一步步追。' }
    }
  },

  // ===== K-05: 给她带伞 =====
  { type: 'bg', src: 'library_day', transition: 'fade' },
  { type: 'bgm', src: 'gentle_rain', crossfade: 2000 },
  { type: 'narration', text: '某天下雨了。图书馆快要关门了，但 Kanna 还坐在那里。' },
  { type: 'narration', text: '她没有伞。也没有外套。只有那条围巾。' },
  { type: 'narration', text: '她看着窗外的雨，像是在看一个无法跨越的深渊。' },
  { type: 'monologue', text: '（她不是在犹豫要不要淋雨。她是——无法迈出那一步。）' },
  { type: 'monologue', text: '（一个人走进雨中、走过走廊、走过校门——这些对她来说不是物理距离，而是心理距离。）' },
  { type: 'monologue', text: '（一个人面对下雨的世界，对她来说——太吵了。太多变量了。太不可控了。）' },
  { type: 'narration', text: '我把自己的伞放在她旁边的椅子上。没有说话。' },
  { type: 'narration', text: '然后走开了几步——给她空间。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'surprised', text: '……这是……' },
  { type: 'narration', text: '她拿起伞。看了看伞，又看了看我的背影。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……你会淋湿。' },
  { type: 'monologue', text: '「没关系。我跑得快。」' },
  { type: 'narration', text: '她沉默了很久。然后——' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……一起走吧。伞……够大的。' },
  { type: 'narration', text: '那是她第一次主动邀请我做一件事——一件需要物理接近的事。' },
  { type: 'narration', text: '一把伞下面。两个人。肩膀几乎碰在一起。' },
  { type: 'narration', text: '雨水打在伞面上的声音像是白噪音。在那个小小的空间里——世界变得安静了。' },
  { type: 'narration', text: '她的围巾蹭到了我的袖子。她没有缩开。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……谢谢。' },
  { type: 'narration', text: '那声「谢谢」轻得像是雨滴落在花瓣上的声音。但我听到了。' },
  { type: 'affection', character: 'kanna', change: 4 },

  // ===== K-06: 发现星空程序的秘密 =====
  { type: 'bg', src: 'library_day', transition: 'fade' },
  { type: 'bgm', src: 'mystery', crossfade: 1500 },
  { type: 'narration', text: '恥の多い生涯を送って来ました——不，那是别人的故事。但 Kanna 大概也会这样开头吧。' },
  { type: 'narration', text: '某天，我无意间瞥见了她的屏幕。那个文化祭上展出过的星空程序——被改写得面目全非。' },
  { type: 'narration', text: '每颗星星旁边都标注着名字。稀疏的、寥落的——这就是她宇宙中全部的星座。' },
  { type: 'narration', text: '角落里有一颗几乎看不见的小星星，标注着「父」。还有一颗标注着「母」。' },
  { type: 'narration', text: '它们的亮度都设置为 0.1——几乎不可见。像是被关了静音的存在。' },
  { type: 'monologue', text: '（她的父母……亮度只有 0.1。这意味着什么？）' },
  { type: 'monologue', text: '（而屏幕中央有一颗星。大得不像话。亮度被赋值为 float("inf")——无穷大。）' },
  { type: 'monologue', text: '（标签上写着我的名字。）' },
  { type: 'narration', text: '她只用了一个浮点数的溢出，便将全部的感情袒露无遗。这种事情——只有不懂得撒谎的人才做得出。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'surprised', text: '！' },
  { type: 'narration', text: '她按 Ctrl+W 的速度大概是 120 毫秒。但人的眼睛只需要 13 毫秒便能捕捉一个画面。来不及了。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……你不应该看到那个。那是——只属于我的星空。不，我是说……' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……无穷大的亮度。物理上不合理。但我已经放弃了合理。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '对你的感情……从一开始就不合理。一个害怕全世界的人，却不害怕你。这本身就是——Bug。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……但这个 Bug……我不想 fix。' },

  // 编程题 K-2
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……你想学画星空吗。我教你。这样……你就能理解我的世界。' },
  { type: 'challenge', id: 'kanna_star_pattern',
    context_dialogue: {
      before: { speaker: 'kanna', expression: 'absorbed', text: '……字符串重复。★ 乘以数字。像星空一样排列。' },
      success: { speaker: 'kanna', expression: 'warm_smile', text: '……很美。像星空一样。你画的星空……和我的不一样。但一样美。' },
      fail: { speaker: 'kanna', expression: 'contemplative', text: '……字符串乘以数字就会重复。"★" * 3 = "★★★"。' }
    }
  },

  // ===== K-07: 社交恐惧「失效」=====
  { type: 'bg', src: 'school_yard_day', transition: 'fade' },
  { type: 'bgm', src: 'romantic', crossfade: 2000 },
  { type: 'narration', text: '某天午休，一件不可能的事情发生了。Kanna 走出了图书馆。' },
  { type: 'narration', text: '她站在操场边缘——那个她曾用「人间地狱」来形容的地方。围巾裹到了鼻尖以上，只露出一双淡金色的眼睛。' },
  { type: 'narration', text: '周围是笑声、球声、青春的喧嚣。而她站在那片喧嚣的岸边，像一个不会游泳的人望着大海。' },
  { type: 'narration', text: '她的手指攥着围巾的边缘——指节发白。那是恐惧的颜色。' },
  { type: 'narration', text: '但她没有转身逃回图书馆。她站在那里——像是一棵决定在风暴中不弯腰的小树。' },
  { type: 'char_enter', character: 'kanna', position: 'center', expression: 'surprised', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'kanna', expression: 'surprised', text: '……奇怪。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '以前来这里……30 秒。只要 30 秒，我就会被人群淹没。喘不过气。想逃回书的世界。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '我一直以为——人间对我关上了门。我不配站在阳光下面。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……但现在。已经 5 分钟了。心跳虽然快，但不是恐惧。是……另一种东西。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '因为你在。你站在我和人间之间。像一扇半开的门。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '不是把人间关在外面的门。是——让光进来的门。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……我的程序里有一个 try-except。try 活在人间，except 逃回图书馆。一直是这样的。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……但你不是 except。你是——exception。一个我不想 catch 的异常。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '让它崩溃吧。让我的旧程序彻底崩溃。因为……你是我唯一的 exception。' },
  { type: 'monologue', text: '（她的声音在围巾下几不可闻。但每一个字都像是用尽了全身的勇气。）' },
  { type: 'monologue', text: '（一个对人间失去了资格的少女——正在用代码的语言，重新申请入场券。）' },
  { type: 'affection', character: 'kanna', change: 5 },

  { type: 'free_talk', character: 'kanna', max_turns: 3, promptId: 'kanna_route_exception', context: '操场边，Kanna 第一次走出图书馆面对人群，说你是她唯一不想 catch 的 exception', sceneObjective: '围绕面对恐惧和走出舒适区的勇气展开对话' },

  // 编程题 K-3
  { type: 'bg', src: 'library_day', transition: 'fade' },
  { type: 'challenge', id: 'kanna_search',
    context_dialogue: {
      before: { speaker: 'kanna', expression: 'contemplative', text: '……搜索算法。在数据中找到答案。' },
      success: { speaker: 'kanna', expression: 'warm_smile', text: '……二分搜索。最优解。时间复杂度 O(log n)。……就像找到你。快速而精准。' },
      fail: { speaker: 'kanna', expression: 'normal', text: '……已排序用二分。O(log n)。' }
    }
  },
  { type: 'char_exit', character: 'kanna', animation: 'fade_out' },

  // ===== K-08: 关键选择：图书馆的告白 =====
  { type: 'bg', src: 'library_evening', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'romantic', crossfade: 1500 },
  { type: 'narration', text: '傍晚的图书馆。世界正在褪色——不，是夕阳把所有的颜色都借走了，只留下一种：金。' },
  { type: 'narration', text: '管理员像一个识趣的舞台导演，说了句「今天提前关门」便消失了。' },
  { type: 'narration', text: '图书馆变成了一座空城。只有两个人，和一台还在运行星空程序的笔记本电脑。' },
  { type: 'narration', text: '我此刻才明白——那些日日夜夜的沉默、那些可可上漂浮的糖、那些用递归比喻的心意——全部都在向这一刻汇聚。' },
  { type: 'narration', text: '像是一个递归函数——层层嵌套，终于到达了 base case。终止条件。' },
  { type: 'char_enter', character: 'kanna', position: 'center', expression: 'blush', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……我有个问题。' },
  { type: 'narration', text: '她说这句话的时候，手指放开了围巾。那条陪伴她度过无数个恐惧时刻的围巾——从下巴滑落，露出了完整的脸。' },
  { type: 'narration', text: '我第一次看到她没有围巾遮挡的样子。嘴唇很薄，下巴很尖，有一颗小小的痣在嘴角旁边。' },
  { type: 'narration', text: '嘴唇在颤抖。淡金色的瞳孔在夕阳中像两颗正在融化的星。她浑身都在发抖——但眼神是坚定的。' },
  { type: 'narration', text: '那是一个「人间失格」的少女，用尽一生的勇气，向人间递出的入场申请。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……怎样才能告诉一个人……「我喜欢你」？' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……我搜索了所有的算法。穷举、二分、动态规划。没有一个适用。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……穷举太慢了。二分需要排序但感情没有顺序。动态规划需要最优子结构但喜欢不是最优化问题。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……也许——这种问题。不该用算法解。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……也许……只需要——直接说。' },
  { type: 'narration', text: '她的声音在最后两个字上碎裂了。像是一块冰在春天的阳光下第一次出现了裂缝。' },

  { type: 'choice', prompt: '', options: [
    { text: '「直接说。就像现在这样——我喜欢你，Kanna。」', effects: { kanna: 15 }, next: 'kanna_good_path' },
    { text: '「用代码写也很好啊。很像你的风格。」', effects: { kanna: 8 }, next: 'kanna_normal_path' }
  ]},
]

const kanna_good = [
  { label: 'kanna_good_path' },
  { type: 'bgm', src: 'ending', fadeIn: 2000 },
  { type: 'dialogue', speaker: 'kanna', expression: 'surprised', text: '……！' },
  { type: 'narration', text: '她的眼睛瞬间睁大了。像是看到了不可能存在的东西——比如，被全世界拒绝的自己，被眼前这个人完完全全地接受了。' },
  { type: 'narration', text: '围巾从手中滑落，落在脚边。银蓝色的头发遮住了大半张脸。但遮不住的是——泪水。' },
  { type: 'narration', text: '不是悲伤的泪。也不完全是喜悦。是某种更深、更沉、像是从心脏最底部被挖出来的东西。' },
  { type: 'narration', text: '像是一个溺水很久的人，终于触碰到了水面。第一口空气灌进肺里的那种——痛苦的、解脱的、滚烫的呼吸。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'teary', text: '……' },
  { type: 'narration', text: '十秒的沉默。窗外一片银杏叶飘进了图书馆，落在她的围巾上。她没有去捡。' },
  { type: 'narration', text: '因为她双手正在捂着脸。从指缝里溢出来的——是无声的泪。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……我一直以为。自己是被判了人间失格的人。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……不配被喜欢。不配站在阳光下。只配躲在代码和书本的后面。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……小时候在学校里被孤立过。因为不会说话。不会笑。不会跟别人玩。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……老师说我「性格有问题」。同学说我「怪人」。家长说我「没有前途」。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……于是我把自己关进了代码的世界。因为在那里——没有人会评判你。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'teary', text: '……但你。你每天都来。你喝我泡的可可。你坐在我给你留的座位上。你读我写的代码。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'teary', text: '……你下雨天给我留伞。你帮我画星空。你在操场上站在我身边。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……你让我觉得——也许。也许我还没有被取消人间的资格。' },
  { type: 'narration', text: '她拿起笔记本电脑。手指比任何时候都慢——她在星空程序的中心，一个字母一个字母地敲出一行代码。' },
  { type: 'narration', text: '每按一个键——就像是在积攒勇气。一个字母的勇气。' },
  { type: 'narration', text: '运行。屏幕上的星空中心浮现出一行文字，像黎明一样缓慢地亮起——' },
  { type: 'narration', text: '「return "好きです";」' },
  { type: 'narration', text: '所有的星星在同一瞬间变亮了。仿佛整个宇宙替她说出了那句她此生最害怕说出口的话。' },
  { type: 'se', src: 'level_up' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……递归的终止条件。我找了一辈子。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……就是你说「我喜欢你」的这一瞬间。无限循环的人间——终于。可以。停下来了。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……不是停止运行。是——终于可以安心地运行下去了。' },
  { type: 'monologue', text: '（窗外银杏还在飘。夕阳把整座图书馆变成了金色的摇篮。）' },
  { type: 'monologue', text: '（一个自认为「人间失格」的少女——在代码的星空下，终于找回了活在人间的资格。）' },
  { type: 'monologue', text: '（不是因为她变了。而是因为——有人告诉她，她本来就够格。）' },

  // 尾声
  { type: 'wait', duration: 1500 },
  { type: 'bg', src: 'library_day', transition: 'fade', duration: 2000 },
  { type: 'bgm', src: 'spring_breeze', crossfade: 2000 },
  { type: 'narration', text: '——几个月后。春天又来了。' },
  { type: 'narration', text: '图书馆。那个固定的角落。两个座位。两杯可可。' },
  { type: 'narration', text: '但有一个变化——她的围巾不再裹到下巴了。而是松松地挂在脖子上，像一条温暖的装饰。' },
  { type: 'narration', text: '她的嘴角——偶尔会上扬。那种笑容很小、很轻——但很真。' },
  { type: 'char_enter', character: 'kanna', position: 'center', expression: 'warm_smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……今天的可可。三颗糖。因为……春天应该更甜一些。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……星空程序。我更新了。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……你的星旁边。多了一颗小星星。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……是我的。亮度不是无穷大。是 1.0。正常的亮度。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……因为我不需要无穷大的亮度来表达了。只需要——和你一样亮就好。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……并排。在一起。' },
  { type: 'narration', text: '窗外的樱花飘进图书馆。一片花瓣落在她的可可杯里。' },
  { type: 'narration', text: '她没有捞出来。而是连花瓣一起喝了。' },
  { type: 'narration', text: '然后说——' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……春天的味道。' },
  { type: 'narration', text: '那一刻。图书馆角落里的两个人——像两颗终于找到彼此轨道的星星。' },
  { type: 'narration', text: '安静地、恒久地、温暖地——并排闪烁着。' },

  { type: 'cg', id: 'kanna_good_end' },
  { type: 'ending', endingType: 'good', route: 'kanna', title: 'return "好きです";',
    text: '恥の多い生涯を送って来ました。\n——但从今天开始，那些羞耻都变成了勋章。\n\n因为你说了「我喜欢你」。\n因为递归终于有了终止条件。\n因为人间失格的少女，被一个人重新赋予了资格。\n\n两颗星。并排。亮度 1.0。正常的亮度。足够了。' }
]

const kanna_normal = [
  { label: 'kanna_normal_path' },
  { type: 'bgm', src: 'sad', crossfade: 2000 },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……嗯。代码。我擅长的方式。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……也许你是对的。有些话……用代码说更安全。不会被拒绝。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……因为代码不会笑话你。不会觉得你奇怪。不会说你「人间失格」。' },
  { type: 'narration', text: '她重新裹上了围巾。把半张脸藏进了柔软的织物里。' },
  { type: 'narration', text: '那条围巾——又回到了它原来的位置。像是一扇重新关上的门。' },
  { type: 'narration', text: '但门缝里——有一丝光。比以前宽了一点点。' },
  { type: 'narration', text: '几天后，你收到了一封邮件。附件是一个 Python 文件。' },
  { type: 'narration', text: '文件名叫 "star_for_you.py"。打开后——' },
  { type: 'narration', text: '运行会画出一片星空。星空中有一颗最亮的星，旁边标注着你的名字。' },
  { type: 'narration', text: '代码的最后一行是——' },
  { type: 'narration', text: '# TODO: 告白' },
  { type: 'narration', text: '下面是一行注释掉的代码：# print("好きです")' },
  { type: 'narration', text: '那个 # 像是一扇门上的锁。打不开——但也没有焊死。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……也许……下一次迭代。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……等我删掉那个 # 的时候。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……等我变得够勇敢的时候。' },
  { type: 'narration', text: '邮件的最后还有一行 P.S.——' },
  { type: 'narration', text: '「可可。三颗糖。你下次来的时候。——K」' },
  { type: 'narration', text: '她在等。在她的图书馆角落里，安静地等。' },
  { type: 'narration', text: '等那个让她有勇气删掉 # 的那一天。' },
  { type: 'ending', endingType: 'normal', route: 'kanna', title: '//TODO: 告白',
    text: '代码的最后一行永远是 TODO。\n「也许……下一次迭代。等我删掉那个 # 的时候。」\n# print("好きです")\n\n可可。三颗糖。你下次来的时候。——K' }
]

export { kanna_good as routeKannaGood, kanna_normal as routeKannaNormal }
