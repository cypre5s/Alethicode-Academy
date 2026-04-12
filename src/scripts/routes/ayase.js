export const routeAyase = [
  { type: 'title_card', text: 'Ayase 线「Bug 与 Butterfly」', subtitle: '—— 有些东西比赢更重要 ——' },
  { type: 'bg', src: 'rooftop_day', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'daily', fadeIn: 1500 },
  { type: 'narration', text: '文化祭结束后的第二天。空气中还残留着昨晚烟火的硝烟味。' },
  { type: 'narration', text: '天台上风很大。银杏叶开始泛黄，秋天正式到来了。' },

  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'grin', animation: 'slide_from_right' },
  { type: 'narration', text: 'Ayase 已经在那里等着了。今天的她穿了一件新卫衣——印着一只可爱的小蝴蝶图案。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '嘿！从今天开始，我要超级加倍努力训练！下次比赛一定要赢你！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '所以——你要当我的陪练！不许拒绝！这事没得商量！' },
  { type: 'monologue', text: '（她的竞争心还是这么旺盛啊……）' },
  { type: 'monologue', text: '（不过最近她看我的眼神好像有点不一样了。怎么说呢……少了一些挑衅，多了一些……柔和？）' },
  { type: 'monologue', text: '（而且那件卫衣上的蝴蝶——跟她平时的风格完全不一样。以前她只穿运动装。）' },

  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '别发呆了！来来来，从今天开始，每天放学后特训！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '我列了一个训练计划！Bug 调试、算法对战、限时赛——全套！' },
  { type: 'monologue', text: '（她居然会列训练计划……这还是那个粗心大意的 Ayase 吗。）' },
  { type: 'narration', text: '她把一张精心制作的训练日程表递给我。上面用彩色笔画满了标注和小插图。' },
  { type: 'narration', text: '——第一天的计划旁边画了两个小人并排坐在电脑前。一个有马尾。' },
  { type: 'monologue', text: '（这个画……是她和我吗？）' },

  // === 训练日常 ===
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'daily', crossfade: 1000 },
  { type: 'narration', text: '从那天起，我们开始每天一起训练编程。' },
  { type: 'narration', text: '计算机教室里总是回荡着她充满活力的声音——和偶尔的崩溃声。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '来！限时5分钟！看谁先做出来！' },
  { type: 'monologue', text: '（每次她说这话的时候，翠绿色的眼睛里都闪着光。像是晨露中的树叶。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '啊啊啊又输了！不是哥们你怎么这么快！我真的会谢！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '再来一次！这次一定——' },
  { type: 'narration', text: '她总是不服输。输了就再来，再输就再来。永不言弃。' },
  { type: 'narration', text: '但渐渐地，我发现了一个秘密——' },
  { type: 'monologue', text: '（她输了之后虽然嘴上喊着不甘心，但回家后一定会偷偷练到很晚。）' },
  { type: 'monologue', text: '（因为第二天她的代码总是比前一天更漂亮。变量名从 a、b 变成了有意义的名字。）' },
  { type: 'monologue', text: '（注释从没有变成了详细的说明。甚至开始用 f-string 而不是 + 号拼接。）' },

  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '嘿嘿，昨天回去研究了一下你的解法！我发现了更好的方法！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '你以为你永远都能赢我？天真！三司あやせ的进化可没有上限！' },
  { type: 'monologue', text: '（不知道从什么时候开始，和她一起训练变成了每天最期待的事。）' },
  { type: 'monologue', text: '（不是因为编程——是因为她。那种不服输的光芒，每天都在变得更耀眼。）' },

  // === 训练中的温柔时刻 ===
  { type: 'narration', text: '有一天训练结束后，她递给我一瓶运动饮料。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '别误会！是自动贩卖机多掉了一瓶！才不是专门买的！' },
  { type: 'monologue', text: '（这瓶是草莓味的。她怎么知道我喜欢草莓味？我好像从来没说过。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……上次在食堂你拿了草莓牛奶。我就——算了不说了。喝不喝随便你。' },
  { type: 'monologue', text: '（她观察得比我想象的仔细啊。嘴上说着"随便"，但细节出卖了她。）' },

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

  // === 校际赛来临 ===
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'bgm', src: 'tension', crossfade: 1500 },
  { type: 'narration', text: '训练持续了两周。新的编程比赛来了——这次是校际赛，规模更大。' },
  { type: 'narration', text: '来自全市八所学校的精英齐聚。气氛比班级赛紧张十倍。' },
  { type: 'narration', text: '大家都很紧张。连 Yoshino 都难得地在比赛前给全班做了辅导。' },
  { type: 'char_enter', character: 'ayase', position: 'right', expression: 'fired_up' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '终于到了！这次我一定要拿第一！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '练了这么久，如果还输就太丢人了！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……而且，我想让你看到——我的努力没有白费。' },
  { type: 'monologue', text: '（最后那句话，声音小得差点听不见。但我听到了。）' },
  { type: 'char_exit', character: 'ayase' },

  // === 比赛中的异常 ===
  { type: 'narration', text: '但在比赛中，我注意到了奇怪的事——' },
  { type: 'monologue', text: '（等等……Ayase 的答题速度好像变慢了。）' },
  { type: 'monologue', text: '（不对，不是变慢了。她明明看了一眼答案就移开了视线。）' },
  { type: 'monologue', text: '（那道题我们训练的时候做过——她当时一秒就选出了正确答案。）' },
  { type: 'monologue', text: '（可是刚才……她故意选了错误选项。）' },
  { type: 'monologue', text: '（Ayase……为什么要故意输？）' },
  { type: 'monologue', text: '（从第一天认识她开始，她就是那个「绝对不服输」的人。怎么会故意输？）' },

  // === 天台对质 ===
  { type: 'bg', src: 'rooftop_evening', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'romantic', crossfade: 2000 },
  { type: 'narration', text: '比赛结束后，我在天台找到了她。' },
  { type: 'narration', text: '夕阳把她的橙色双马尾染成了更深的金红色。她背对着我，看着远方的城市天际线。' },
  { type: 'narration', text: '风很大。她的马尾在晚风中像两面火焰般的旗帜。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'normal' },
  { type: 'dialogue', speaker: 'ayase', expression: 'normal', text: '……嘿。你来了。' },
  { type: 'monologue', text: '（她的声音……好安静。完全不像平时那个元气炸裂的 Ayase。）' },
  { type: 'monologue', text: '（她甚至没有回头看我。第一次见她不面对我说话。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '你是不是发现了。在比赛里。' },
  { type: 'monologue', text: '「……你故意输了。」' },
  { type: 'narration', text: '她终于转过头来。翠绿色的眼睛在夕阳下湿润了。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……嗯。对。我故意输了。' },
  { type: 'monologue', text: '「为什么？你不是最讨厌输的吗？」' },
  { type: 'narration', text: '她低下头。马尾垂落在肩膀上。声音变得很轻——' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '因为……如果我赢了，就没有理由继续当你的「对手」了。' },
  { type: 'monologue', text: '（……什么？）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '「追上你」是我唯一能想到的……接近你的理由。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '如果我追上了……甚至超过了……那我就没有继续留在你身边的借口了啊。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '那份训练日程表……你翻到最后一页看过吗？' },
  { type: 'monologue', text: '（最后一页？我只看了第一页就按照计划开始了。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '最后一页画着两个小人。跟第一页一样。但……' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '没有电脑。没有代码。只有两个人站在夕阳下。就像现在这样。' },
  { type: 'monologue', text: '（原来……她的竞争心背后藏着这样的感情。）' },
  { type: 'monologue', text: '（她不是想赢我。她是害怕——害怕赢了之后就失去了靠近我的理由。）' },
  { type: 'monologue', text: '（那些挑衅、那些不服输、那些每天放学后的训练——全都是爱的伪装。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '……笨蛋。别用那种眼神看我。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'pout', text: '我们来做题！用编程解决一切！这种氛围我受不了！' },

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
  { type: 'narration', text: '第二天，Ayase 找到了我。她的表情变了——不再是逃避，而是决心。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'fired_up' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '我想好了！我不要再逃了！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '我们来最后一场公平的编程对决！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '谁都不许放水！不许让着对方！全力以赴！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '不管结果怎样……这一次，我要堂堂正正地面对你。面对我自己的心。' },
  { type: 'monologue', text: '（她的眼神变了。不再是单纯的争强好胜。）' },
  { type: 'monologue', text: '（那是决心——面对自己感情的决心。像蝴蝶破茧的那一刻。）' },

  // === 最终对决 ===
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'battle', crossfade: 1500 },
  { type: 'narration', text: '计算机教室。放学后。只有我们两个人。' },
  { type: 'narration', text: '两台电脑并排摆着。窗外的夕阳从侧面照进来，把我们的影子投在墙上。' },
  { type: 'narration', text: '两个影子并排。就像训练日程表第一页上画的那幅画。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '准备好了吗？' },
  { type: 'monologue', text: '「当然。」' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '那——最终对决，开始！！' },
  { type: 'se', src: 'bell' },

  { type: 'challenge', id: 'ayase_final_race',
    context_dialogue: {
      before: { speaker: 'ayase', expression: 'fired_up', text: '这是最后一题！约瑟夫环问题！全力以赴！！' },
      success: { speaker: 'ayase', expression: 'soft_smile', text: '你赢了……但奇怪的是，我一点也不难过。反而觉得——终于可以说了。' },
      fail: { speaker: 'ayase', expression: 'grin', text: '嘿嘿！最后一局我赢了！这次是真的赢了！所以——我有资格说了。' }
    }
  },

  // === 对决结束 ===
  { type: 'bgm_stop', fadeOut: 1000 },
  { type: 'narration', text: '对决结束了。' },
  { type: 'narration', text: '教室里安静得只能听到电脑风扇的嗡嗡声和彼此的呼吸。' },
  { type: 'narration', text: '夕阳从计算机教室的窗户照进来，把两人的影子拉得很长。' },
  { type: 'narration', text: '两个影子——从并排慢慢靠拢，几乎重叠在一起。' },
  { type: 'se', src: 'wind' },

  { type: 'bg', src: 'rooftop_evening', transition: 'fade', duration: 2000 },
  { type: 'bgm', src: 'romantic', crossfade: 2000 },
  { type: 'narration', text: '不知道是谁先提议的，我们来到了天台。' },
  { type: 'narration', text: '和第一天一样的天台。和第一天一样的风。' },
  { type: 'narration', text: '但现在——一切都不一样了。' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'soft_smile' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '结束了呢……最后的对决。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'normal', text: '不管谁赢谁输——' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '我想说的其实不是「我要赢你」……' },
  { type: 'narration', text: '她深吸了一口气。马尾在风中飘动。翠绿色的眼睛直直地看着我——' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '一直以来，那些挑衅、那些比赛、那些每天放学后的训练——' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '全都是……想跟你在一起的借口而已。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '每次说「我要赢你」——其实是在说「我不想失去你」。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '所以——今天，这一次，不用借口了。' },
  { type: 'narration', text: '她的声音在颤抖。但眼神比任何时候都坚定。' },

  { type: 'choice', prompt: '', options: [
    { text: '「不管谁赢谁输，我都想一直和你比下去——一直在一起。」', effects: { ayase: 15 }, next: 'ayase_good_path' },
    { text: '「你是我遇到过最好的对手。」', effects: { ayase: 8 }, next: 'ayase_normal_path' }
  ]},
]

const ayase_good = [
  { label: 'ayase_good_path' },
  { type: 'bgm', src: 'ending', fadeIn: 2000 },
  { type: 'dialogue', speaker: 'ayase', expression: 'surprised', text: '……！' },
  { type: 'narration', text: '她愣了一秒。翠绿色的眼睛在夕阳下变得像融化的宝石。' },
  { type: 'narration', text: '然后——' },
  { type: 'narration', text: 'Ayase 冲了上来，抱住了你。双马尾在晚风中飘扬——像两条燃烧的火舌。' },
  { type: 'narration', text: '她的肩膀在颤抖。但抱得很紧。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '笨蛋！我想要的奖品从来就不是奖杯！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '是你啊。从第一天坐在我旁边的时候开始……就一直是你。' },
  { type: 'monologue', text: '（她的声音在颤抖。那个总是大大咧咧的显眼包 Ayase——）' },
  { type: 'monologue', text: '（此刻就像一只终于停下来的蝴蝶。不再飞，不再闹，安静地停在我的肩上。）' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '……你知道 Bug 和 Butterfly 有什么共同点吗？' },
  { type: 'monologue', text: '「都是意料之外的东西？」' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '都是在代码里诞生的惊喜啊。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '就像——喜欢上你这件事。明明不在我的「计划」里。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '但它就这样发生了。然后我发现——这是我写过的最美的 Bug。' },
  { type: 'narration', text: '夕阳在两个人的身后慢慢沉下去。' },
  { type: 'narration', text: '天台上只剩下风声、心跳声、和两个人轻轻的笑声。' },
  { type: 'cg', id: 'ayase_good_end' },
  { type: 'ending', endingType: 'good', route: 'ayase', title: 'Winner Takes All',
    text: '不管谁赢谁输，最珍贵的奖品一直都在身边。\n三司あやせ终于找到了比胜利更重要的东西。\n\n「喜欢上你——是我写过的最美的 Bug。」' }
]

const ayase_normal = [
  { label: 'ayase_normal_path' },
  { type: 'bgm', src: 'sad', crossfade: 2000 },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '对手……嗯。最好的对手。' },
  { type: 'monologue', text: '（她笑了。但那个笑容——像是一段代码明明运行成功了，但返回值却不是她想要的。）' },
  { type: 'narration', text: '风吹过天台。她的马尾在夕阳中飘扬。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '那我会变得更强！总有一天会强到——你不得不正视我！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '不只是作为对手——作为……算了！等着我！' },
  { type: 'narration', text: '她留下了一个编程挑战的链接。然后转身跑开了。' },
  { type: 'narration', text: '橙色的双马尾在夕阳里飘扬，像两道燃烧的火焰。' },
  { type: 'narration', text: '跑了几步，她又回过头——用力挥了挥手。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '——下次见面的时候，我一定会让你说出不同的答案！等我！' },
  { type: 'monologue', text: '（那个链接上写着：「等你准备好再打开。——Ayase」）' },
  { type: 'monologue', text: '（她的背影消失在楼梯口。但她留下的挑战——永远不会过期。）' },
  { type: 'ending', endingType: 'normal', route: 'ayase', title: 'Rematch',
    text: '「下次见面的时候，我一定会让你说出不同的答案。」\n约定重赛的那一天，一定会来。\n到那时——三司あやせ会用全力赢一次。\n然后说出一直藏在心里的话。' }
]

export { ayase_good as routeAyaseGood, ayase_normal as routeAyaseNormal }
