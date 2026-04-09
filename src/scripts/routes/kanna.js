export const routeKanna = [
  { type: 'title_card', text: 'Kanna 线「递归的星空」', subtitle: '—— 连接不只是网络协议 ——' },
  { type: 'bg', src: 'library_day', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'peaceful', fadeIn: 1500 },

  { type: 'narration', text: '文化祭后，我开始每天去图书馆。' },
  { type: 'narration', text: '不为了看书——而是为了那个安静角落里的身影。' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'slight_smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……你来了。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'normal', text: '……你的座位。在那里。' },
  { type: 'monologue', text: '（她已经给我固定了座位了吗……旁边还放了一本《Python 数据可视化》。）' },

  { type: 'narration', text: '日子一天天过去。我们的对话虽然不多，但每一个字都有分量。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……这道题。用递归可以优化。你想看吗。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'absorbed', text: '……递归就是……函数调用自己。像镜子对着镜子。无限但有终止条件。' },

  // 编程题 K-1
  { type: 'challenge', id: 'kanna_recursion',
    context_dialogue: {
      before: { speaker: 'kanna', expression: 'contemplative', text: '……斐波那契。数学的诗。' },
      success: { speaker: 'kanna', expression: 'slight_smile', text: '……嗯。你理解递归了。' },
      fail: { speaker: 'kanna', expression: 'normal', text: '……fib(6) = fib(5) + fib(4) = 5 + 3 = 8。一步步追。' }
    }
  },

  // 发现星空程序
  { type: 'narration', text: '某天，我无意间看到了 Kanna 屏幕上的程序——' },
  { type: 'narration', text: '一个用递归算法模拟星空的程序。每颗星星代表一个她在意的人。' },
  { type: 'monologue', text: '（等等……屏幕上有一颗特别亮的新星。标签写着……我的名字？）' },
  { type: 'dialogue', speaker: 'kanna', expression: 'surprised', text: '！' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……你不应该看到那个。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……那颗星。最近越来越亮了。我……不知道为什么。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……骗人。我知道为什么。只是……不知道怎么说。' },

  // 编程题 K-2
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……你想学画星空吗。我教你。' },
  { type: 'challenge', id: 'kanna_star_pattern',
    context_dialogue: {
      before: { speaker: 'kanna', expression: 'absorbed', text: '……字符串重复。★ 乘以数字。' },
      success: { speaker: 'kanna', expression: 'warm_smile', text: '……很美。像星空一样。' },
      fail: { speaker: 'kanna', expression: 'contemplative', text: '……字符串乘以数字就会重复。"★" * 3 = "★★★"。' }
    }
  },

  // 社交恐惧「失效」
  { type: 'bg', src: 'school_yard_day', transition: 'fade' },
  { type: 'bgm', src: 'romantic', crossfade: 2000 },
  { type: 'dialogue', speaker: 'kanna', expression: 'surprised', text: '……奇怪。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '和其他人说话……我会紧张。心跳加速。想逃走。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '但是和你……心跳虽然加速。但不想逃。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……我的社交恐惧。对你……失效了。这是 Bug 吗。i 人变 e 人了。' },
  { type: 'monologue', text: '（不是 Bug……那叫喜欢吧。DNA 动了。）' },

  // 编程题 K-3
  { type: 'bg', src: 'library_day', transition: 'fade' },
  { type: 'challenge', id: 'kanna_search',
    context_dialogue: {
      before: { speaker: 'kanna', expression: 'contemplative', text: '……搜索算法。在数据中找到答案。' },
      success: { speaker: 'kanna', expression: 'warm_smile', text: '……二分搜索。最优解。……就像找到你。' },
      fail: { speaker: 'kanna', expression: 'normal', text: '……已排序用二分。O(log n)。' }
    }
  },

  // 关键选择
  { type: 'bgm', src: 'romantic', crossfade: 1500 },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……我有个问题。关于……不是算法的问题。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……怎样才能告诉一个人……「我喜欢你」？' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……用代码写？还是……直接说？' },

  { type: 'choice', prompt: '', options: [
    { text: '「直接说。就像现在这样——我喜欢你，Kanna。」', effects: { kanna: 15 }, next: 'kanna_good_path' },
    { text: '「用代码写也很好啊。很像你。」', effects: { kanna: 8 }, next: 'kanna_normal_path' }
  ]},
]

const kanna_good = [
  { label: 'kanna_good_path' },
  { type: 'bgm', src: 'ending', fadeIn: 2000 },
  { type: 'dialogue', speaker: 'kanna', expression: 'surprised', text: '……！' },
  { type: 'dialogue', speaker: 'kanna', expression: 'teary', text: '……' },
  { type: 'narration', text: '她低下头，银蓝色的头发遮住了表情。但你看到了——她在笑。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……找到了。最优解。就是你。' },
  { type: 'narration', text: '她发来一个程序。运行后，屏幕上一个字一个字显示——' },
  { type: 'narration', text: '「return "好きです";」' },
  { type: 'cg', id: 'kanna_good_end' },
  { type: 'ending', endingType: 'good', route: 'kanna', title: 'return "好きです";',
    text: '在所有的搜索算法中，最优解只有一个。\n明月栞那找到了她的答案——就是你。' }
]

const kanna_normal = [
  { label: 'kanna_normal_path' },
  { type: 'bgm', src: 'sad', crossfade: 2000 },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……嗯。代码。我擅长的方式。' },
  { type: 'narration', text: '几天后，你收到了一封邮件。附件是一个 Python 文件。' },
  { type: 'narration', text: '打开后，代码的最后一行是——' },
  { type: 'narration', text: '# TODO: 告白' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……也许……下一次迭代。' },
  { type: 'ending', endingType: 'normal', route: 'kanna', title: '//TODO: 告白',
    text: '代码的最后一行永远是 TODO。\n「也许……下一次迭代。」' }
]

export { kanna_good as routeKannaGood, kanna_normal as routeKannaNormal }
