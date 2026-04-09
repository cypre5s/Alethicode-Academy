export const routeAyase = [
  { type: 'title_card', text: 'Ayase 线「Bug 与 Butterfly」', subtitle: '—— 有些东西比赢更重要 ——' },
  { type: 'bg', src: 'rooftop_day', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'daily', fadeIn: 1500 },
  { type: 'narration', text: '文化祭结束后的第二天。天台上风很大，Ayase 已经在那里等着了。' },

  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'grin', animation: 'slide_from_right' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '嘿！从今天开始，我要超级加倍努力训练！下次比赛一定要赢你！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '所以——你要当我的陪练！不许拒绝！这事没得商量！' },
  { type: 'monologue', text: '（她的竞争心还是这么旺盛啊……）' },
  { type: 'monologue', text: '（不过最近她看我的眼神好像有点不一样了。怎么说呢……少了一些挑衅，多了一些……柔和？）' },

  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '别发呆了！来来来，从今天开始，每天放学后特训！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '我列了一个训练计划！Bug 调试、算法对战、限时赛——全套！' },
  { type: 'monologue', text: '（她居然会列训练计划……这还是那个粗心大意的 Ayase 吗。）' },

  // === 训练日常 ===
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'narration', text: '从那天起，我们开始每天一起训练编程。' },
  { type: 'narration', text: '计算机教室里总是回荡着她充满活力的声音。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '来！限时5分钟！看谁先做出来！' },
  { type: 'monologue', text: '（每次她说这话的时候，翠绿色的眼睛里都闪着光。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '啊啊啊又输了！不是哥们你怎么这么快！我真的会谢！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '再来一次！这次一定——' },
  { type: 'narration', text: '她总是不服输。输了就再来，再输就再来。' },
  { type: 'narration', text: '但渐渐地，我发现——' },
  { type: 'monologue', text: '（她输了之后虽然嘴上喊着不甘心，但回家后一定会偷偷练到很晚。）' },
  { type: 'monologue', text: '（因为第二天她的代码总是比前一天更漂亮。）' },

  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '嘿嘿，昨天回去研究了一下你的解法！我发现了更好的方法！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '你以为你永远都能赢我？天真！' },
  { type: 'monologue', text: '（不知道从什么时候开始，和她一起训练变成了每天最期待的事。）' },

  // 编程题 A-1
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '今天的训练主题——找 Bug！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '这个我擅长——毕竟我制造了世界上最多的 Bug！含金量夯爆了！哈哈！' },
  { type: 'monologue', text: '（你管这叫擅长……这算什么光荣的事情……）' },
  { type: 'challenge', id: 'ayase_find_bug',
    context_dialogue: {
      before: { speaker: 'ayase', expression: 'competitive', text: '看谁先找到！一二三——开始！' },
      success: { speaker: 'ayase', expression: 'pout', text: '你找到了……我居然没发现。可恶！明天一定赢回来！' },
      fail: { speaker: 'ayase', expression: 'grin', text: '嘿嘿，这次我看出来了！第4行应该用 += 不是 =！我赢了！' }
    }
  },

  // === 发现异常 ===
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'bgm', src: 'tension', crossfade: 1500 },
  { type: 'narration', text: '训练持续了两周。新的编程比赛来了——这次是校际赛，规模更大。' },
  { type: 'narration', text: '大家都很紧张。连 Yoshino 都难得地在比赛前给全班做了辅导。' },
  { type: 'char_enter', character: 'ayase', position: 'right', expression: 'fired_up' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '终于到了！这次我一定要拿第一！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '练了这么久，如果还输就太丢人了！' },
  { type: 'char_exit', character: 'ayase' },

  { type: 'narration', text: '但在比赛中，我注意到了奇怪的事——' },
  { type: 'monologue', text: '（等等……Ayase 的答题速度好像变慢了。）' },
  { type: 'monologue', text: '（不对，不是变慢了。她明明看了一眼答案就移开了视线。）' },
  { type: 'monologue', text: '（那道题我们训练的时候做过——她当时一秒就选出了正确答案。）' },
  { type: 'monologue', text: '（可是刚才……她故意选了错误选项。）' },
  { type: 'monologue', text: '（Ayase……为什么要故意输？）' },

  // === 天台对质 ===
  { type: 'bg', src: 'rooftop_evening', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'romantic', crossfade: 2000 },
  { type: 'narration', text: '比赛结束后，我在天台找到了她。' },
  { type: 'narration', text: '夕阳把她的橙色双马尾染成了更深的金红色。她背对着我，看着远方。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'normal' },
  { type: 'dialogue', speaker: 'ayase', expression: 'normal', text: '……嘿。你来了。' },
  { type: 'monologue', text: '（她的声音……好安静。完全不像平时那个元气炸裂的 Ayase。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '你是不是发现了。在比赛里。' },
  { type: 'monologue', text: '「……你故意输了。」' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……嗯。对。我故意输了。' },
  { type: 'monologue', text: '「为什么？你不是最讨厌输的吗？」' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '因为……如果我赢了，就没有理由继续当你的「对手」了。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '「追上你」是我唯一能想到的……接近你的理由。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '如果我追上了……甚至超过了……那我就没有继续留在你身边的借口了啊。' },
  { type: 'monologue', text: '（原来……她的竞争心背后藏着这样的感情。）' },
  { type: 'monologue', text: '（她不是想赢我。她是害怕——害怕赢了之后就失去了靠近我的理由。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '……笨蛋。别用那种眼神看我。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '我们来做题！用编程解决一切！' },

  // 编程题 A-2
  { type: 'challenge', id: 'ayase_game_logic',
    context_dialogue: {
      before: { speaker: 'ayase', expression: 'competitive', text: '石头剪刀布！用代码决胜负！' },
      success: { speaker: 'ayase', expression: 'soft_smile', text: 'and……两个条件都满足才算赢。就像……竞争和喜欢可以同时存在。' },
      fail: { speaker: 'ayase', expression: 'grin', text: '两个条件用 and 连接！就像——算了我不说了！' }
    }
  },

  // === 约定最后一战 ===
  { type: 'bg', src: 'rooftop_day', transition: 'fade' },
  { type: 'bgm', src: 'daily', crossfade: 1500 },
  { type: 'narration', text: '第二天，Ayase 找到了我。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'fired_up' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '我想好了！我不要再逃了！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '我们来最后一场公平的编程对决！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '谁都不许放水！不许让着对方！全力以赴！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '不管结果怎样……这一次，我要堂堂正正地面对你。面对我自己。' },
  { type: 'monologue', text: '（她的眼神变了。不再是单纯的争强好胜。）' },
  { type: 'monologue', text: '（那是决心——面对自己感情的决心。）' },

  // === 最终对决 ===
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'battle', crossfade: 1500 },
  { type: 'narration', text: '计算机教室。只有我们两个人。两台电脑并排摆着。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '准备好了吗？' },
  { type: 'monologue', text: '「当然。」' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '那——最终对决，开始！！' },
  { type: 'se', src: 'bell' },

  { type: 'challenge', id: 'ayase_final_race',
    context_dialogue: {
      before: { speaker: 'ayase', expression: 'fired_up', text: '这是最后一题！约瑟夫环问题！全力以赴！！' },
      success: { speaker: 'ayase', expression: 'soft_smile', text: '你赢了……但奇怪的是，我一点也不难过。反而觉得……松了一口气。' },
      fail: { speaker: 'ayase', expression: 'grin', text: '嘿嘿！最后一局我赢了！但是……赢了之后，我想说的话反而说不出口了。' }
    }
  },

  // === 对决结束 ===
  { type: 'bgm_stop', fadeOut: 1000 },
  { type: 'narration', text: '对决结束了。' },
  { type: 'narration', text: '夕阳从计算机教室的窗户照进来，把两人的影子拉得很长。' },
  { type: 'se', src: 'wind' },

  { type: 'bg', src: 'rooftop_evening', transition: 'fade', duration: 2000 },
  { type: 'bgm', src: 'romantic', crossfade: 2000 },
  { type: 'narration', text: '不知道是谁先提议的，我们来到了天台。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'soft_smile' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '结束了呢……最后的对决。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'normal', text: '不管谁赢谁输——' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '我想说的其实不是「我要赢你」……' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '一直以来，那些挑衅、那些比赛、那些每天放学后的训练——' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '全都是……想跟你在一起的借口而已。' },

  { type: 'choice', prompt: '', options: [
    { text: '「不管谁赢谁输，我都想一直和你比下去。」', effects: { ayase: 15 }, next: 'ayase_good_path' },
    { text: '「你是我遇到过最好的对手。」', effects: { ayase: 8 }, next: 'ayase_normal_path' }
  ]},
]

const ayase_good = [
  { label: 'ayase_good_path' },
  { type: 'bgm', src: 'ending', fadeIn: 2000 },
  { type: 'dialogue', speaker: 'ayase', expression: 'surprised', text: '……！' },
  { type: 'narration', text: '她愣了一秒。然后——' },
  { type: 'narration', text: 'Ayase 冲了上来，抱住了你。双马尾在晚风中飘扬。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '笨蛋！我想要的奖品从来就不是奖杯！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '是你啊。从第一天坐在我旁边的时候开始……就一直是你。' },
  { type: 'monologue', text: '（她的声音在颤抖。那个总是大大咧咧的显眼包 Ayase，此刻就像一只终于停下来的蝴蝶。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '……你知道 Bug 和 Butterfly 有什么共同点吗？' },
  { type: 'monologue', text: '「都从代码里诞生的？」' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '都是意料之外的惊喜啊。就像——喜欢上你这件事。' },
  { type: 'cg', id: 'ayase_good_end' },
  { type: 'ending', endingType: 'good', route: 'ayase', title: 'Winner Takes All',
    text: '不管谁赢谁输，最珍贵的奖品一直都在身边。\n三司あやせ终于找到了比胜利更重要的东西。\n——那就是，在你身边的每一天。' }
]

const ayase_normal = [
  { label: 'ayase_normal_path' },
  { type: 'bgm', src: 'sad', crossfade: 2000 },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '对手……嗯。最好的对手。' },
  { type: 'monologue', text: '（她笑了。但那个笑容……好像有什么碎掉了的声音。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '那我会变得更强！总有一天会强到——你不得不正视我！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '等着我——然后我会亲口告诉你的！' },
  { type: 'narration', text: '她留下了一个编程挑战的链接，然后转身跑开了。' },
  { type: 'narration', text: '橙色的双马尾在夕阳里飘扬，像两道燃烧的火焰。' },
  { type: 'monologue', text: '（那个链接上写着：「等你变得更强再打开。——Ayase」）' },
  { type: 'ending', endingType: 'normal', route: 'ayase', title: 'Rematch',
    text: '「我会变得更强。等我——然后我会亲口告诉你的。」\n约定重赛的那一天，一定会来。\n到那时，三司あやせ会用全力赢一次——然后说出一直藏在心里的话。' }
]

export { ayase_good as routeAyaseGood, ayase_normal as routeAyaseNormal }
