export const routeYoshino = [
  { type: 'title_card', text: 'Yoshino 线「完美代码的裂痕」', subtitle: '—— 不完美也是一种美 ——' },
  { type: 'bg', src: 'classroom_day', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'peaceful', fadeIn: 1500 },

  { type: 'narration', text: '文化祭后，Yoshino 对我的态度发生了微妙的变化。' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'normal', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '今天的代码审查——你来协助我。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '不是因为你有多优秀。只是……两个人效率更高。' },
  { type: 'monologue', text: '（又是那种口是心非的语气……你细品，确实是傲娇。）' },

  { type: 'narration', text: '一起做代码审查的日子里，我渐渐发现了 Yoshino 不为人知的一面。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '这段代码的缩进不统一。重写。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '变量命名不规范。改掉。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '注释写得太少——不，太多了。只保留必要的。' },
  { type: 'monologue', text: '（她对代码的要求近乎苛刻。内核稳定得可怕。但有时候……她对自己的要求更苛刻。）' },

  // 发现 Yoshino 的秘密
  { type: 'bg', src: 'classroom_evening', transition: 'fade' },
  { type: 'bgm', src: 'sad', crossfade: 2000 },
  { type: 'narration', text: '某天傍晚，我路过教室时看到了令人意外的一幕——' },
  { type: 'narration', text: 'Yoshino 一个人坐在夕阳中，反复修改着一段已经完美的代码。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '还不够好……这里可以再优化……' },
  { type: 'monologue', text: '（她在改已经完美的代码？而且……她看起来很疲惫。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'surprised', text: '！你……什么时候在那里的。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '不要偷看别人的代码。这是基本礼仪。' },

  // 编程题 Y-1
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '……既然你在。帮我把这段重复代码重构一下。' },
  { type: 'challenge', id: 'yoshino_refactor',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'glasses_adjust', text: '重复代码是坏代码。用函数消除重复。' },
      success: { speaker: 'yoshino', expression: 'slight_smile', text: '很好。这才是应有的代码质量。' },
      fail: { speaker: 'yoshino', expression: 'cold', text: '函数定义要放在调用之前。代码规范不是可选项。' }
    }
  },

  // 深入了解
  { type: 'narration', text: '慢慢地，我了解到了 Yoshino 完美主义背后的原因。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '小时候参加编程比赛……输了。父亲说我不够努力。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '从那以后我就决定——代码必须完美。人也必须完美。不能有任何瑕疵。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'tsundere_pout', text: '……为什么跟你说这些。不讲了不讲了。忘掉。这是命令。' },

  // 编程题 Y-2
  { type: 'challenge', id: 'yoshino_boundary',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'glasses_adjust', text: '边界测试。完美的代码也需要在边界上经受考验。' },
      success: { speaker: 'yoshino', expression: 'slight_smile', text: '边界值……你懂了。没有什么是真正完美的。' },
      fail: { speaker: 'yoshino', expression: 'normal', text: '边界值是最容易出 Bug 的地方。18 正好在 >= 18 的边界上。' }
    }
  },

  // 写爱心代码
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'narration', text: '我决定做一件事——写一个「不完美但有趣」的程序给 Yoshino。' },
  { type: 'narration', text: '一个用 ASCII 字符画的爱心图案。代码故意不那么「规范」，但充满温度。' },

  // 编程题 Y-3
  { type: 'challenge', id: 'yoshino_pair',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'normal', text: '协作编程？好吧……这次你写，我审查。' },
      success: { speaker: 'yoshino', expression: 'blush', text: '……函数调用是对的。逻辑清晰。只是……为什么要写这种程序？' },
      fail: { speaker: 'yoshino', expression: 'cold', text: '调用 yoshino_check(code) 来执行审查。' }
    }
  },

  // 关键选择
  { type: 'bg', src: 'classroom_evening', transition: 'fade' },
  { type: 'bgm', src: 'romantic', crossfade: 2000 },
  { type: 'dialogue', speaker: 'yoshino', expression: 'surprised', text: '你写了……一个画爱心的程序？' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '变量名用的是 heart 而不是 h……缩进多了一个空格……注释写着「给芳乃」……' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'tsundere_pout', text: '这代码完全不规范！变量命名不统一！注释太私人了！' },
  { type: 'narration', text: '但她的手在发抖。不是愤怒——而是感动。' },

  { type: 'choice', prompt: 'Yoshino 崩溃了——', options: [
    { text: '上前拥抱她', effects: { yoshino: 15 }, flags: { yoshino_hug: true }, next: 'yoshino_good_path' },
    { text: '给她空间，安静地陪在身边', effects: { yoshino: 8 }, flags: { yoshino_hug: false }, next: 'yoshino_normal_path' }
  ]},
]

const yoshino_good = [
  { label: 'yoshino_good_path' },
  { type: 'bgm', src: 'ending', fadeIn: 2000 },
  { type: 'dialogue', speaker: 'yoshino', expression: 'rare_gentle', text: '……你这个笨蛋。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '代码不规范……注释有错字……完全不是好代码。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'rare_gentle', text: '但是……' },
  { type: 'narration', text: '她打开编辑器，在那段爱心代码的最后加了一行注释——' },
  { type: 'narration', text: '// I lkie you' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '故意拼错的。因为……完美的告白太不像我了。预制告白什么的，太下头了。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'rare_gentle', text: '这段代码……不完美。但是……我不想修改了。' },
  { type: 'cg', id: 'yoshino_good_end' },
  { type: 'ending', endingType: 'good', route: 'yoshino', title: '不完全なコード、完全な気持ち',
    text: '不完美的代码，完整的心意。\n朝武芳乃第一次接受了——世界上有比完美更重要的东西。' }
]

const yoshino_normal = [
  { label: 'yoshino_normal_path' },
  { type: 'bgm', src: 'sad', crossfade: 2000 },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '……谢谢你。给我空间。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '你的代码……我会好好保存的。作为参考。仅此而已。' },
  { type: 'narration', text: '毕业前的最后一次代码审查——' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '你的代码审查结果：合格。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'rare_gentle', text: '// 合格。……谢谢。' },
  { type: 'ending', endingType: 'normal', route: 'yoshino', title: 'Code Review',
    text: '最后的代码审查，只有一行注释：\n// 合格。……谢谢。' }
]

export { yoshino_good as routeYoshinoGood, yoshino_normal as routeYoshinoNormal }
