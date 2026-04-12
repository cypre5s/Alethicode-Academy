export const routeKanna = [
  { type: 'title_card', text: 'Kanna 线「递归的星空」', subtitle: '—— 连接不只是网络协议 ——' },
  { type: 'bg', src: 'library_day', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'peaceful', fadeIn: 1500 },

  // ===== 日常铺垫 =====
  { type: 'narration', text: '文化祭后，我开始每天去图书馆。' },
  { type: 'narration', text: '不为了看书——而是为了那个安静角落里的身影。' },
  { type: 'narration', text: '她总是坐在同一个位置：靠窗第三排，最角落的座位。' },
  { type: 'narration', text: '围巾裹到下巴，身边永远放着一杯热饮和一堆比她还厚的书。' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'slight_smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……你来了。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'normal', text: '……你的座位。在那里。热可可。两颗糖。' },
  { type: 'monologue', text: '（她已经给我固定了座位，而且记住了我喝可可要加两颗糖。）' },
  { type: 'monologue', text: '（每天来的时候，可可都已经泡好了。她来得比我更早。）' },

  // ===== 安静的日常 =====
  { type: 'narration', text: '日子一天天过去。我们的对话虽然不多，但每一个字都有分量。' },
  { type: 'narration', text: '大部分时间我们各自看书或写代码。偶尔交换一个眼神，就够了。' },
  { type: 'narration', text: '图书馆管理员曾经好奇地问过：「你们是朋友吗？怎么从来不说话？」' },
  { type: 'narration', text: 'Kanna 回答：「……不说话也是一种对话。」' },
  { type: 'monologue', text: '（不说话也是一种对话……只有 Kanna 才会这么想吧。但我完全理解。）' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……这道题。用递归可以优化。你想看吗。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'absorbed', text: '……递归就是……函数调用自己。像镜子对着镜子。无限但有终止条件。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……人和人的关系也是递归的。你影响我，我影响你。无限循环。但有一个终止条件——' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……不想结束。' },

  // 编程题 K-1
  { type: 'challenge', id: 'kanna_recursion',
    context_dialogue: {
      before: { speaker: 'kanna', expression: 'contemplative', text: '……斐波那契。数学的诗。每一项都是前两项之和。' },
      success: { speaker: 'kanna', expression: 'slight_smile', text: '……嗯。你理解递归了。' },
      fail: { speaker: 'kanna', expression: 'normal', text: '……fib(6) = fib(5) + fib(4) = 5 + 3 = 8。一步步追。' }
    }
  },

  // ===== 发现星空程序的秘密 =====
  { type: 'narration', text: '某天，我无意间看到了 Kanna 屏幕上的程序——' },
  { type: 'narration', text: '那个文化祭上展出过的星空模拟程序。但现在多了很多新功能。' },
  { type: 'narration', text: '每颗星星旁边都有一个小标签。放大后可以看到——' },
  { type: 'narration', text: '每个标签写着一个名字。是她在意的人。' },
  { type: 'monologue', text: '（等等……屏幕中间有一颗特别大、特别亮的星。标签写着……我的名字？）' },
  { type: 'monologue', text: '（而且这颗星的亮度比其他所有星加起来都亮。代码里写着 brightness = float("inf")。）' },
  { type: 'monologue', text: '（无穷大的亮度……）' },
  { type: 'dialogue', speaker: 'kanna', expression: 'surprised', text: '！' },
  { type: 'narration', text: '她迅速按了 Ctrl+W 关闭了窗口。但来不及了。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……你不应该看到那个。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……那颗星。亮度是无穷大。我知道这在物理上不合理。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……但我的感觉就是这样。不需要合理。只需要……真实。' },

  // 编程题 K-2
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……你想学画星空吗。我教你。这样……你就能理解我的世界。' },
  { type: 'challenge', id: 'kanna_star_pattern',
    context_dialogue: {
      before: { speaker: 'kanna', expression: 'absorbed', text: '……字符串重复。★ 乘以数字。像星空一样排列。' },
      success: { speaker: 'kanna', expression: 'warm_smile', text: '……很美。像星空一样。你画的星空……和我的不一样。但一样美。' },
      fail: { speaker: 'kanna', expression: 'contemplative', text: '……字符串乘以数字就会重复。"★" * 3 = "★★★"。' }
    }
  },

  // ===== 社交恐惧「失效」=====
  { type: 'bg', src: 'school_yard_day', transition: 'fade' },
  { type: 'bgm', src: 'romantic', crossfade: 2000 },
  { type: 'narration', text: '某天午休，Kanna 破天荒地离开了图书馆。' },
  { type: 'narration', text: '她站在操场边缘，围巾裹到了鼻子以上。像一只警惕的小动物。' },
  { type: 'narration', text: '周围有很多人在运动、聊天。她的手指紧紧攥着围巾的边缘。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'surprised', text: '……奇怪。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '和其他人说话……我会紧张。心跳加速，手心出汗，想逃走。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '以前来操场……30 秒就想回图书馆。但现在——' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '——已经 5 分钟了。因为你在。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……我的社交恐惧。对你……失效了。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……这不是 Bug。是……exception。一个特殊的例外。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……你是我唯一的 exception。' },
  { type: 'monologue', text: '（唯一的 exception……在编程里是异常，但在感情里——是唯一的例外。）' },
  { type: 'monologue', text: '（她用代码来描述感情。但那些话比任何直白的告白都打动人。）' },

  // 编程题 K-3
  { type: 'bg', src: 'library_day', transition: 'fade' },
  { type: 'challenge', id: 'kanna_search',
    context_dialogue: {
      before: { speaker: 'kanna', expression: 'contemplative', text: '……搜索算法。在数据中找到答案。' },
      success: { speaker: 'kanna', expression: 'warm_smile', text: '……二分搜索。最优解。时间复杂度 O(log n)。……就像找到你。快速而精准。' },
      fail: { speaker: 'kanna', expression: 'normal', text: '……已排序用二分。O(log n)。' }
    }
  },

  // ===== 关键选择：图书馆的告白 =====
  { type: 'bg', src: 'library_evening', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'romantic', crossfade: 1500 },
  { type: 'narration', text: '傍晚的图书馆。夕阳从窗户照进来，把整个空间染成了金色。' },
  { type: 'narration', text: '只有我们两个人。图书馆管理员说"今天提前关门"就离开了。' },
  { type: 'narration', text: 'Kanna 的星空程序在笔记本上安静地闪烁着。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……我有个问题。关于……不是算法的问题。' },
  { type: 'narration', text: '她把围巾拉下来。露出了完整的脸。' },
  { type: 'narration', text: '这是我第一次看到她没有围巾遮挡的样子——嘴唇微微颤抖，但眼神坚定。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……怎样才能告诉一个人……「我喜欢你」？' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……用代码写？用递归？用搜索算法找到最优表达方式？' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……还是……直接说？' },
  { type: 'narration', text: '她的淡金色瞳孔在夕阳中像两颗溶化的星星。' },

  { type: 'choice', prompt: '', options: [
    { text: '「直接说。就像现在这样——我喜欢你，Kanna。」', effects: { kanna: 15 }, next: 'kanna_good_path' },
    { text: '「用代码写也很好啊。很像你的风格。」', effects: { kanna: 8 }, next: 'kanna_normal_path' }
  ]},
]

const kanna_good = [
  { label: 'kanna_good_path' },
  { type: 'bgm', src: 'ending', fadeIn: 2000 },
  { type: 'dialogue', speaker: 'kanna', expression: 'surprised', text: '……！' },
  { type: 'narration', text: '她的眼睛瞬间睁大了。围巾从手中滑落。' },
  { type: 'narration', text: '然后——很慢很慢地——她低下了头。银蓝色的头发遮住了大半张脸。' },
  { type: 'narration', text: '但你看到了——她的嘴角微微上翘。眼角有泪光。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'teary', text: '……' },
  { type: 'narration', text: '沉默了十秒。窗外一片银杏叶飘进了图书馆。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……找到了。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……搜索了很久。遍历了所有的数据。穷举了所有的可能性。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……最优解。只有一个。就是你。' },
  { type: 'narration', text: '她拿起笔记本电脑，打开了她的星空程序。' },
  { type: 'narration', text: '然后——在所有星星的中间，添加了一行代码。' },
  { type: 'narration', text: '运行后，屏幕上的星空中心出现了一行文字，一个字一个字地显示——' },
  { type: 'narration', text: '「return "好きです";」' },
  { type: 'narration', text: '文字显示完的那一刻，所有的星星同时变亮了。像是整个宇宙都在庆祝。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……递归的终止条件。找到了。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……就是你说「我喜欢你」的这一刻。无限循环……终于可以停下来了。' },
  { type: 'monologue', text: '（窗外的银杏叶还在飘。夕阳把图书馆变成了金色的世界。）' },
  { type: 'monologue', text: '（在代码的星空下，两颗孤独的星终于找到了彼此。）' },
  { type: 'cg', id: 'kanna_good_end' },
  { type: 'ending', endingType: 'good', route: 'kanna', title: 'return "好きです";',
    text: '在所有的搜索算法中，最优解只有一个。\n明月栞那找到了她的答案——就是你。\n\n递归的终止条件：你说「我喜欢你」的那一刻。' }
]

const kanna_normal = [
  { label: 'kanna_normal_path' },
  { type: 'bgm', src: 'sad', crossfade: 2000 },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……嗯。代码。我擅长的方式。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……也许你是对的。有些话……用代码说更安全。不会被拒绝。' },
  { type: 'narration', text: '她重新裹上了围巾。把半张脸藏进了柔软的织物里。' },
  { type: 'narration', text: '几天后，你收到了一封邮件。附件是一个 Python 文件。' },
  { type: 'narration', text: '文件名叫 "star_for_you.py"。打开后——' },
  { type: 'narration', text: '运行会画出一片星空。星空中有一颗最亮的星，旁边标注着你的名字。' },
  { type: 'narration', text: '代码的最后一行是——' },
  { type: 'narration', text: '# TODO: 告白' },
  { type: 'narration', text: '下面是一行注释掉的代码：# print("好きです")' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……也许……下一次迭代。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……等我删掉那个 # 的时候。' },
  { type: 'ending', endingType: 'normal', route: 'kanna', title: '//TODO: 告白',
    text: '代码的最后一行永远是 TODO。\n「也许……下一次迭代。等我删掉那个 # 的时候。」\n# print("好きです")' }
]

export { kanna_good as routeKannaGood, kanna_normal as routeKannaNormal }
