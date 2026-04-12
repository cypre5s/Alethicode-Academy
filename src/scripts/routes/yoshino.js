export const routeYoshino = [
  { type: 'title_card', text: 'Yoshino 线「完美代码的裂痕」', subtitle: '—— 不完美也是一种美 ——' },
  { type: 'bg', src: 'classroom_day', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'peaceful', fadeIn: 1500 },

  // ===== 日常铺垫 =====
  { type: 'narration', text: '文化祭后，Yoshino 对我的态度发生了微妙的变化。' },
  { type: 'narration', text: '以前她只在必要时才跟我说话。现在——她会主动问我问题。' },
  { type: 'narration', text: '虽然每次都是以「代码审查」为借口。' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'normal', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '今天的代码审查——你来协助我。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '不是因为你有多优秀。只是……两个人效率更高。' },
  { type: 'monologue', text: '（又是那种口是心非的语气……你细品，确实是傲娇。）' },

  // ===== 代码审查日常 =====
  { type: 'narration', text: '一起做代码审查的日子里，我渐渐发现了 Yoshino 不为人知的一面。' },
  { type: 'narration', text: '她的桌面永远一尘不染。文件按字母排列，笔按颜色归位。' },
  { type: 'narration', text: '连喝水的杯子都放在桌面上固定的位置——从不偏移一毫米。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '这段代码的缩进不统一。重写。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '变量命名不规范。改掉。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '注释写得太少——不，太多了。只保留必要的。' },
  { type: 'monologue', text: '（她对代码的要求近乎苛刻。内核稳定得可怕。）' },
  { type: 'monologue', text: '（但有时候……她对自己的要求更苛刻。我开始注意到一些细节——）' },

  // ===== 发现异常 =====
  { type: 'narration', text: '某天，我注意到她的手指上贴着创可贴。不是一个——是三个。' },
  { type: 'monologue', text: '（她在改作业的时候，手指在发抖。但她用力握住笔来掩饰。）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '……看什么。赶紧审查代码。' },
  { type: 'monologue', text: '（她的声音比平时更冷。像是在筑墙。）' },

  // ===== 发现 Yoshino 的秘密 =====
  { type: 'bg', src: 'classroom_evening', transition: 'fade' },
  { type: 'bgm', src: 'sad', crossfade: 2000 },
  { type: 'narration', text: '某天傍晚，我路过教室时看到了令人意外的一幕——' },
  { type: 'narration', text: 'Yoshino 一个人坐在夕阳中，反复修改着一段已经完美的代码。' },
  { type: 'narration', text: '她的手指在键盘上飞快地敲击——删除、重写、再删除、再重写。' },
  { type: 'narration', text: '那种表情……不是追求卓越的专注，而是一种接近强迫症的执念。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '还不够好……这里可以再优化……效率还能提升 0.01%……' },
  { type: 'monologue', text: '（她在改已经完美的代码？0.01% 的效率提升？）' },
  { type: 'monologue', text: '（而且……她看起来很疲惫。眼下有明显的黑眼圈，嘴唇也有点干裂。）' },
  { type: 'se', src: 'door' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'surprised', text: '！你……什么时候在那里的。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '不要偷看别人的代码。这是基本礼仪。' },
  { type: 'narration', text: '她迅速关闭了屏幕。但在关闭之前，我看到了编辑器底部的状态栏——' },
  { type: 'narration', text: '这个文件已经被修改了 147 次。' },
  { type: 'monologue', text: '（147 次……一段已经完美的代码，被修改了 147 次。这不是追求完美——这是被完美束缚了。）' },

  // 编程题 Y-1
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '……既然你在。帮我把这段重复代码重构一下。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '消除重复是代码质量的基本要求。我做到了——但你来检验一下。' },
  { type: 'challenge', id: 'yoshino_refactor',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'glasses_adjust', text: '重复代码是坏代码。用函数消除重复。' },
      success: { speaker: 'yoshino', expression: 'slight_smile', text: '很好。这才是应有的代码质量。' },
      fail: { speaker: 'yoshino', expression: 'cold', text: '函数定义要放在调用之前。代码规范不是可选项。' }
    }
  },

  // ===== 深入了解：Yoshino 的过去 =====
  { type: 'bg', src: 'rooftop_evening', transition: 'fade' },
  { type: 'bgm', src: 'sad', crossfade: 2000 },
  { type: 'narration', text: '某天放学后，我在天台找到了 Yoshino。她靠着围栏站着，看着远方。' },
  { type: 'narration', text: '夕阳把她的影子拉得很长。风吹起她的黑发，露出了通常被遮住的右耳。' },
  { type: 'narration', text: '她的右耳上有一个小小的耳洞——但没有戴耳环。' },
  { type: 'monologue', text: '（Yoshino 有耳洞？她看起来不像是会打耳洞的类型……以前的她，是什么样的？）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '……你怎么知道我在这里。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '别说是碰巧。你这个人从来都不「碰巧」出现。' },
  { type: 'monologue', text: '（被看穿了。但这不正说明她也在观察我吗。）' },
  { type: 'narration', text: '沉默了很久。风把远处社团活动的声音送了过来。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '……你想知道为什么我对代码这么执着吗。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '小时候参加编程比赛。全市第二名。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '正常人会觉得这很好对吧。但我父亲不这么认为。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '他说——「第二名就是第一个输家」。' },
  { type: 'monologue', text: '（第二名就是第一个输家……？）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '从那以后我就决定——代码必须完美。思维必须完美。成绩必须完美。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'cold', text: '不能有任何瑕疵。因为瑕疵就意味着——不被认可。' },
  { type: 'narration', text: '她的声音很平静。但握着围栏的手指，指节发白。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'tsundere_pout', text: '……为什么跟你说这些。不讲了不讲了。忘掉。这是命令。' },
  { type: 'monologue', text: '（她在害怕。害怕被看到不完美的自己。所以用命令来筑墙。）' },
  { type: 'monologue', text: '（但她选择告诉我……这意味着——她信任我。即使她自己还不愿意承认。）' },

  { type: 'choice', prompt: '', options: [
    { text: '「第二名也很棒。你已经很努力了。」', effects: { yoshino: 4 } },
    { text: '「你不需要完美。你只需要做你自己。」', effects: { yoshino: 5 } },
    { text: '安静地站在她旁边，什么都不说', effects: { yoshino: 3 } }
  ]},

  // 编程题 Y-2
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'bgm', src: 'daily', crossfade: 1500 },
  { type: 'narration', text: '第二天的课上，Yoshino 出了一道关于边界测试的题。' },
  { type: 'challenge', id: 'yoshino_boundary',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'glasses_adjust', text: '边界测试。完美的代码也需要在边界上经受考验。' },
      success: { speaker: 'yoshino', expression: 'slight_smile', text: '边界值……你懂了。没有什么是真正完美的。连代码也是。' },
      fail: { speaker: 'yoshino', expression: 'normal', text: '边界值是最容易出 Bug 的地方。18 正好在 >= 18 的边界上。' }
    }
  },

  // ===== 写爱心代码 =====
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'romantic', crossfade: 1500 },
  { type: 'narration', text: '我决定做一件事——写一个「不完美但有趣」的程序给 Yoshino。' },
  { type: 'narration', text: '一个用 ASCII 字符画的爱心图案。' },
  { type: 'narration', text: '代码故意不那么「规范」——变量名用了日语拼音，缩进故意多了一格，注释写着私密的话。' },
  { type: 'narration', text: '因为完美的代码她见过太多了。我想让她看到——不完美也可以有温度。' },

  // 编程题 Y-3
  { type: 'challenge', id: 'yoshino_pair',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'normal', text: '协作编程？好吧……这次你写，我审查。' },
      success: { speaker: 'yoshino', expression: 'blush', text: '……函数调用是对的。逻辑清晰。只是……为什么要写这种程序？' },
      fail: { speaker: 'yoshino', expression: 'cold', text: '调用 yoshino_check(code) 来执行审查。' }
    }
  },

  // ===== 关键场景：展示爱心代码 =====
  { type: 'bg', src: 'classroom_evening', transition: 'fade' },
  { type: 'bgm', src: 'romantic', crossfade: 2000 },
  { type: 'narration', text: '夕阳下的教室。只有我们两个人。' },
  { type: 'narration', text: '我打开笔记本电脑，运行了那段代码。' },
  { type: 'narration', text: '屏幕上，一个由星号组成的爱心图案缓缓显现——' },
  { type: 'narration', text: '爱心的中间写着一行注释：# 给芳乃。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'surprised', text: '你写了……一个画爱心的程序？' },
  { type: 'narration', text: '她盯着屏幕。表情从惊讶变成了茫然，再变成了某种我看不透的复杂情绪。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '变量名用的是 heart 而不是 h……还算可以。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '但缩进多了一个空格……注释太私人了……' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'tsundere_pout', text: '这代码完全不规范！变量命名不统一！PEP8 违规至少五处！' },
  { type: 'narration', text: '但她的手在发抖。不是愤怒——而是感动。' },
  { type: 'narration', text: '因为有人第一次不是为了「正确」而写代码——而是为了「她」而写代码。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '……为什么。为什么要写这种东西给我。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'rare_gentle', text: '我不需要……不完美的代码。我只接受……' },
  { type: 'narration', text: '她的声音越来越小。最后几乎只是唇形在动——' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '……可是。这是我收到过的……最温暖的代码。' },

  { type: 'choice', prompt: 'Yoshino 的防线崩溃了——', options: [
    { text: '上前拥抱她', effects: { yoshino: 15 }, flags: { yoshino_hug: true }, next: 'yoshino_good_path' },
    { text: '给她空间，安静地陪在身边', effects: { yoshino: 8 }, flags: { yoshino_hug: false }, next: 'yoshino_normal_path' }
  ]},
]

const yoshino_good = [
  { label: 'yoshino_good_path' },
  { type: 'bgm', src: 'ending', fadeIn: 2000 },
  { type: 'narration', text: '我上前一步，轻轻抱住了她。' },
  { type: 'narration', text: '她的身体僵硬了一秒——然后慢慢地、慢慢地放松了。' },
  { type: 'narration', text: '她把脸埋在我的肩膀上。黑发铺散开来，有洗发水淡淡的清香。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'rare_gentle', text: '……你这个笨蛋。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '代码不规范……注释有错字……完全不是好代码。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'rare_gentle', text: '但是……' },
  { type: 'narration', text: '她轻轻推开我。走到电脑前。' },
  { type: 'narration', text: '她打开编辑器，在那段爱心代码的最后加了一行注释——' },
  { type: 'narration', text: '// I lkie you' },
  { type: 'monologue', text: '（lkie……不是 like？）' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '故意拼错的。因为……完美的告白太不像我了。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'rare_gentle', text: '预制告白什么的，太下头了。所以——' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '这个 typo 是我留的。是专属于我的……不完美。' },
  { type: 'narration', text: '她转过头。夕阳照在她难得温柔的脸上。' },
  { type: 'narration', text: '那个总是追求完美的少女，第一次接受了——世界上有比完美更重要的东西。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'rare_gentle', text: '这段代码……不完美。但是——我不想修改了。永远不改。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '因为这是唯一一段……让我想保留 Bug 的代码。' },
  { type: 'cg', id: 'yoshino_good_end' },
  { type: 'ending', endingType: 'good', route: 'yoshino', title: '不完全なコード、完全な気持ち',
    text: '不完美的代码，完整的心意。\n朝武芳乃第一次接受了——世界上有比完美更重要的东西。\n\n// I lkie you\n// 这个 typo 是故意的。是我唯一想保留的 Bug。' }
]

const yoshino_normal = [
  { label: 'yoshino_normal_path' },
  { type: 'bgm', src: 'sad', crossfade: 2000 },
  { type: 'narration', text: '我站在原地，安静地陪着她。' },
  { type: 'narration', text: '夕阳慢慢西沉。教室里的光从金色变成了橘红色，最后变成了深紫色。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '……谢谢你。给我空间。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '你的代码……我会好好保存的。作为参考。仅此而已。' },
  { type: 'narration', text: '她把那段代码保存在了一个私人文件夹里。文件名是「不要打开.py」。' },
  { type: 'monologue', text: '（不要打开.py……如果真的不要打开，又为什么要保存呢。）' },
  { type: 'narration', text: '毕业前的最后一次代码审查——' },
  { type: 'bg', src: 'classroom_evening', transition: 'fade', duration: 1500 },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '你的代码审查结果：合格。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '变量命名规范、逻辑清晰、注释恰当。没有任何问题。' },
  { type: 'narration', text: '她把审查报告递给我。在报告的最后——手写的备注栏——' },
  { type: 'narration', text: '// 合格。……谢谢你教会我：代码不需要完美，写代码的人也不需要。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'rare_gentle', text: '……再见。' },
  { type: 'ending', endingType: 'normal', route: 'yoshino', title: 'Code Review',
    text: '最后的代码审查报告，备注栏手写着一行字：\n// 合格。……谢谢你教会我：代码不需要完美。' }
]

export { yoshino_good as routeYoshinoGood, yoshino_normal as routeYoshinoNormal }
