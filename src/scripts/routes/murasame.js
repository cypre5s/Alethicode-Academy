export const routeMurasame = [
  { type: 'title_card', text: 'Murasame 线「最后的竞赛」', subtitle: '—— 站在顶点的孤独与温暖 ——' },
  { type: 'bg', src: 'computer_room_night', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'mystery', fadeIn: 1500 },

  { type: 'char_enter', character: 'murasame', position: 'center', expression: 'smirk', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'murasame', expression: 'smirk', text: '你还真是锲而不舍。每天都来。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'cold', text: '我说过，门没锁。但没说欢迎你来。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'smirk', text: '……算了。既然来了，就别浪费我的时间。给你一道题。' },

  { type: 'narration', text: '就这样，我开始了与 Murasame 的夜间特训。' },
  { type: 'narration', text: '她的教学方式只有一个——扔给你超出能力范围的难题，然后冷眼看你挣扎。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'cold', text: '这道题给你十分钟。做不出来就滚。' },
  { type: 'monologue', text: '（虽然她嘴上这么说……但每次我做不出来，她都会「不经意间」在黑板上写下提示。）' },

  // 全国赛消息
  { type: 'bg', src: 'hallway_day', transition: 'fade' },
  { type: 'bgm', src: 'tension', crossfade: 1500 },
  { type: 'narration', text: '某天，学校公告栏贴出了消息——全国编程竞赛，团队赛，每队两人。' },
  { type: 'bg', src: 'computer_room_night', transition: 'fade' },
  { type: 'char_enter', character: 'murasame', position: 'center', expression: 'cold' },
  { type: 'dialogue', speaker: 'murasame', expression: 'cold', text: '全国赛。团队赛。两个人。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'smirk', text: '正常来说，我应该找一个和我水平相当的搭档。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'cold', text: '但很遗憾，这所学校里没有。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'smirk', text: '所以——你来。' },
  { type: 'monologue', text: '（诶？！！）' },
  { type: 'dialogue', speaker: 'murasame', expression: 'cold', text: '别误会。不是因为你够格。含金量还差得远。是因为你有潜力。还有——' },
  { type: 'dialogue', speaker: 'murasame', expression: 'impressed', text: '你是唯一一个……每天都来找我的人。' },
  { type: 'monologue', text: '（她的声音在说最后那句话时，好像轻了一点。）' },

  // 集训 + 编程题 M-1
  { type: 'narration', text: '集训开始了。Murasame 的训练强度是地狱级的。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'cold', text: '这段代码是 O(n²)。优化到 O(n)。给你五分钟。' },
  { type: 'challenge', id: 'murasame_optimize',
    context_dialogue: {
      before: { speaker: 'murasame', expression: 'cold', text: '暴力解法谁都会。证明你值得当我的搭档。' },
      success: { speaker: 'murasame', expression: 'impressed', text: '……不错。set 去重，O(n)。你总算开窍了。' },
      fail: { speaker: 'murasame', expression: 'smirk', text: 'set 会去重。len(set(nums)) 就是去重后的长度。动动脑子。' }
    }
  },

  // 发现脆弱面
  { type: 'bg', src: 'computer_room_night', transition: 'fade' },
  { type: 'bgm', src: 'romantic', crossfade: 2000 },
  { type: 'narration', text: '凌晨三点，我发现 Murasame 趴在键盘上睡着了。' },
  { type: 'narration', text: '屏幕上还亮着代码编辑器。她的手指还放在键盘上。' },
  { type: 'monologue', text: '（她每天训练到这么晚……这就是全国冠军的代价吗？如何呢又能怎。）' },
  { type: 'narration', text: '我轻轻把校服外套盖在她身上。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'vulnerable', text: '……嗯？谁……' },
  { type: 'dialogue', speaker: 'murasame', expression: 'surprised', text: '你……什么时候来的。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'cold', text: '我没有睡着。只是……闭眼思考。松弛感，懂吗？' },
  { type: 'monologue', text: '（键盘上有口水印……你管这叫松弛感？）' },
  { type: 'dialogue', speaker: 'murasame', expression: 'vulnerable', text: '……你不觉得我很无聊吗。每天都在这里写代码。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'genuine_smile', text: '但是……最近，好像不那么寂寞了。' },

  // 编程题 M-2
  { type: 'narration', text: '比赛临近，我们需要练习代码合并。' },
  { type: 'challenge', id: 'murasame_merge',
    context_dialogue: {
      before: { speaker: 'murasame', expression: 'smirk', text: '这是协作题。你负责排序输出。别拖我后腿。' },
      success: { speaker: 'murasame', expression: 'genuine_smile', text: '配合得不错。下次比赛也这样就好了。' },
      fail: { speaker: 'murasame', expression: 'cold', text: '数据 → 排序 → 遍历 → 输出。这么简单的流程都搞不清？' }
    }
  },

  // 比赛当天
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'battle', crossfade: 1500 },
  { type: 'title_card', text: '全国编程竞赛 · 团队赛', subtitle: '' },
  { type: 'narration', text: '全国赛当天。最后一道题，难度超乎想象。Murasame 负责了前面的所有题目——' },
  { type: 'dialogue', speaker: 'murasame', expression: 'fierce', text: '最后一题交给你。我已经……没有力气了。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'cold', text: '别让我失望。' },
  { type: 'monologue', text: '（她把最后的希望交给了我。这份信任的分量——）' },

  // 编程题 M-3
  { type: 'challenge', id: 'murasame_final',
    context_dialogue: {
      before: { speaker: 'murasame', expression: 'fierce', text: '最后一题。证明我没有看错人。' },
      success: { speaker: 'murasame', expression: 'impressed', text: '……Kadane 算法。你……做到了。' },
      fail: { speaker: 'murasame', expression: 'genuine_smile', text: '没关系。你已经做得很好了。比赛不只是结果。……我第一次这么说。' }
    }
  },

  // 关键选择
  { type: 'bg', src: 'rooftop_night', transition: 'fade' },
  { type: 'bgm', src: 'ending', crossfade: 2000 },
  { type: 'narration', text: '比赛结束了。不管结果如何——' },
  { type: 'char_enter', character: 'murasame', position: 'center', expression: 'genuine_smile' },
  { type: 'dialogue', speaker: 'murasame', expression: 'genuine_smile', text: '嘿……我问你一个问题。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'vulnerable', text: '你觉得……和我一起打比赛，开心吗？' },
  { type: 'monologue', text: '（她第一次用这种不设防的眼神看我。没有毒舌，没有伪装。只有一个等待答案的少女。）' },

  { type: 'choice', prompt: '', options: [
    { text: '「开心。不只是比赛——认识你这件事本身，就让我很开心。」', effects: { murasame: 15 }, next: 'murasame_good_path' },
    { text: '「你是最棒的搭档。」', effects: { murasame: 8 }, next: 'murasame_normal_path' }
  ]},
]

const murasame_good = [
  { label: 'murasame_good_path' },
  { type: 'narration', text: '她转过头，深红的马尾在夜风中飘动。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'blush', text: '……切。这种台词是从哪个恋爱游戏学来的。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'genuine_smile', text: '但是——' },
  { type: 'narration', text: '她看着远方的夜景，声音轻得像呢喃——' },
  { type: 'dialogue', speaker: 'murasame', expression: 'vulnerable', text: '这个冠军……有一半是你的。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'blush', text: '不……算了。全部都给你。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'genuine_smile', text: '连我这个人也——' },
  { type: 'dialogue', speaker: 'murasame', expression: 'blush', text: '……闭嘴，什么都没说。' },
  { type: 'monologue', text: '（但你分明在笑啊，Murasame。）' },
  { type: 'cg', id: 'murasame_good_end' },
  { type: 'ending', endingType: 'good', route: 'murasame', title: "Champion's Heart",
    text: '站在顶点的孤独，终于有人理解。\nムラサメ把冠军——和心——都交给了你。' }
]

const murasame_normal = [
  { label: 'murasame_normal_path' },
  { type: 'bgm', src: 'sad', crossfade: 2000 },
  { type: 'dialogue', speaker: 'murasame', expression: 'smirk', text: '搭档……嗯。不坏。' },
  { type: 'narration', text: '毕业典礼后，你收到了一条消息——' },
  { type: 'narration', text: '「别让我失望。——传说学姐遗言」' },
  { type: 'dialogue', speaker: 'murasame', expression: 'smirk', text: '下一个全国冠军……你来继承吧。' },
  { type: 'ending', endingType: 'normal', route: 'murasame', title: 'Logout',
    text: '「别让我失望。——传说学姐遗言」\n她的背影消失在校门口。但约定永远不会过期。' }
]

const murasame_true = [
  { label: 'murasame_true_path' },
  { type: 'bg', src: 'computer_room_night', transition: 'fade', duration: 2000 },
  { type: 'bgm', src: 'ending', fadeIn: 2000 },
  { type: 'narration', text: '通关了所有人的 Good Ending 后——一封匿名邮件出现在收件箱中。' },
  { type: 'narration', text: '「来老地方。带上你学到的一切。——M」' },
  { type: 'char_enter', character: 'murasame', position: 'center', expression: 'genuine_smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'murasame', expression: 'genuine_smile', text: '你来了。这次我不考你了。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'smirk', text: '你已经证明了自己。不只是对我——对所有人。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'genuine_smile', text: '我要带你去一个地方。这所学园的核心——' },
  { type: 'bg', src: 'computer_room_day', transition: 'fade', duration: 2000 },
  { type: 'screen_effect', effect: 'flash_white', duration: 500 },
  { type: 'narration', text: '她带你来到了学园地下的核心服务器机房。' },
  { type: 'narration', text: '数不清的服务器闪烁着蓝绿色的灯光，像一片数字的星海。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'impressed', text: '这就是 Alethicode 学园的真正核心。所有的教学系统、AI 助教、评测服务器……都运行在这里。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'vulnerable', text: '你知道吗？这个学园……其实是我父亲创建的。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'genuine_smile', text: '他相信编程可以改变人生。所以创办了这所学校，开发了 AI 教学系统。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'vulnerable', text: '但他三年前去世了。留下的只有这些代码……和我。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'genuine_smile', text: '我一直一个人守护着这里。直到你来了。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'blush', text: '你证明了他是对的——编程确实能改变一个人。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'genuine_smile', text: '你改变了 Nene、改变了 Yoshino、改变了 Ayase、改变了 Kanna……' },
  { type: 'dialogue', speaker: 'murasame', expression: 'vulnerable', text: '也改变了我。' },
  { type: 'narration', text: '她伸出手，轻轻碰了碰服务器的外壳。金色瞳孔映着蓝绿色的光。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'genuine_smile', text: '以后……这个地方由你和我一起守护。可以吗？' },
  { type: 'dialogue', speaker: 'murasame', expression: 'blush', text: '——这是命令，不是商量。笨蛋。' },
  { type: 'monologue', text: '（在数字星海的中心，两个人的手牵在了一起。）' },
  { type: 'monologue', text: '（这不是终点。这是新的起点——属于我们所有人的 Source Code。）' },
  { type: 'cg', id: 'murasame_true_end' },
  { type: 'ending', endingType: 'true', route: 'murasame', title: 'Source Code',
    text: '揭开 Alethicode 学园的秘密。\n代码连接了所有人的心——这是最美的源代码。\n\n—— 全线完结 · 感谢游玩 ——' }
]

export { murasame_good as routeMurasameGood, murasame_normal as routeMurasameNormal, murasame_true as routeMurasameTrue }
