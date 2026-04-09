export const chapter3 = [
  { type: 'title_card', text: '第三章「函数之约」', subtitle: '—— 函数与模块化 ——' },
  { type: 'bg', src: 'classroom_day', transition: 'fade', duration: 1000 },
  { type: 'bgm', src: 'daily', fadeIn: 1000 },
  { type: 'monologue', text: '时间过得很快，转眼已经入学好几周了。班味已经渗透到骨子里了。' },
  { type: 'monologue', text: '编程从完全陌生变得越来越自然。今天要学的是——函数。含金量还在升。' },

  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '今天的主题是函数！函数就是把一组代码打包起来，给它取个名字，以后随时都能用！' },
  { type: 'dialogue', speaker: 'nene', expression: 'normal', text: '用 def 关键字定义，括号里写参数，return 写返回值。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '就像做菜的菜谱一样——写好一次，以后按菜谱操作就行！' },

  { type: 'challenge', id: 'ch3_function_def',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'smile', text: '定义函数用什么关键字呢？' },
      success: { speaker: 'nene', expression: 'gentle_smile', text: 'def！对了！definition 的缩写～' },
      fail: { speaker: 'nene', expression: 'thinking', text: 'def 是 define 的缩写，用来定义函数哦～' }
    }
  },

  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '学会了定义，再来看看函数的返回值～' },

  { type: 'challenge', id: 'ch3_return_value',
    context_dialogue: {
      before: { speaker: 'yoshino', expression: 'normal', text: '函数返回值的追踪是基本功。仔细看。' },
      success: { speaker: 'yoshino', expression: 'slight_smile', text: '正确。逻辑清晰。' },
      fail: { speaker: 'yoshino', expression: 'cold', text: '先算函数返回值，再算外面的表达式。分步骤来。' }
    }
  },

  { type: 'char_exit', character: 'nene', animation: 'fade_out' },
  { type: 'se', src: 'bell' },

  // 课间自由时段
  { type: 'narration', text: '课间休息。走廊里传来关于文化祭的讨论声。' },
  { type: 'char_enter', character: 'ayase', position: 'right', expression: 'fired_up' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '听说了吗！下个月就是文化祭！我们班要做「编程体验展」！夯爆了！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '超级酷吧！让来参观的人体验编程的乐趣！必须整一个大的！' },
  { type: 'char_exit', character: 'ayase' },

  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch3_classroom' },
    { id: 'computer_room_day', character: 'nene', next: 'ch3_computer' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch3_rooftop' },
    { id: 'library_day', character: 'kanna', next: 'ch3_library' }
  ]},
]

export const ch3_classroom = [
  { type: 'bg', src: 'classroom_day' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'normal' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '文化祭的编程体验展，我负责统筹。需要帮手。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '……你来帮我吧。你的代码虽然还不够规范，但思路还算清晰。' },
  { type: 'monologue', text: '（诶？Yoshino 居然主动邀请我？）' },
  { type: 'affection', character: 'yoshino', change: 3 },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, context: '课间，讨论文化祭准备' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch3_afternoon' }
]

export const ch3_computer = [
  { type: 'bg', src: 'computer_room_day' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '文化祭好期待啊～我也想参加！虽然我是 AI 助教……活人感应该够了吧？' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '如果可以的话……你愿意和我一起逛文化祭吗？不是教学任务……是私人的邀请。这算情绪价值吗？' },
  { type: 'affection', character: 'nene', change: 3 },
  { type: 'free_talk', character: 'nene', max_turns: 3, context: '课间，Nene 邀请你一起逛文化祭' },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch3_afternoon' }
]

export const ch3_rooftop = [
  { type: 'bg', src: 'rooftop_day' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'grin' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '文化祭我要做一个超酷的小游戏！用 Python 写的！直接起飞！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'competitive', text: '你要不要跟我一起做？两个人超级加倍！比一个人做得快嘛！' },
  { type: 'affection', character: 'ayase', change: 3 },
  { type: 'free_talk', character: 'ayase', max_turns: 3, context: '课间，天台，讨论文化祭的编程项目' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch3_afternoon' }
]

export const ch3_library = [
  { type: 'bg', src: 'library_day' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'contemplative' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……文化祭。人很多。我不太擅长。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'slight_smile', text: '……但如果是你的话。也许可以一起。' },
  { type: 'affection', character: 'kanna', change: 3 },
  { type: 'free_talk', character: 'kanna', max_turns: 3, context: '课间，图书馆' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch3_afternoon' }
]

const ch3_afternoon_arr = [
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'bgm', src: 'daily', crossfade: 1000 },
  { type: 'se', src: 'bell' },
  { type: 'narration', text: '下午的课是函数调用顺序的实践。' },

  { type: 'challenge', id: 'ch3_function_order',
    context_dialogue: {
      before: { speaker: 'ayase', expression: 'fired_up', text: '排序题！我上次输了，这次一定要赢！' },
      success: { speaker: 'ayase', expression: 'pout', text: '你又答对了！可恶！' },
      fail: { speaker: 'nene', expression: 'gentle_smile', text: '函数要先定义（def）才能调用哦～' }
    }
  },

  // 午休自由时段
  { type: 'narration', text: '午休时间。文化祭的准备越来越忙了。' },
  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch3_noon_yoshino' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch3_noon_ayase' },
    { id: 'library_day', character: 'kanna', next: 'ch3_noon_kanna' },
    { id: 'computer_room_day', character: 'nene', next: 'ch3_noon_nene' }
  ]},
]

export { ch3_afternoon_arr as ch3_afternoon }

export const ch3_noon_yoshino = [
  { type: 'bg', src: 'classroom_day' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'normal' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'normal', text: '展区的代码我已经写好框架了。你来负责交互部分。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '……我第一次跟别人协作写代码。希望不会太糟糕。' },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, context: '午休，跟 Yoshino 一起准备文化祭' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'jump', target: 'ch3_evening' }
]

export const ch3_noon_ayase = [
  { type: 'bg', src: 'rooftop_day' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'grin' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '我的小游戏已经写了一半了！来看看！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'surprised', text: '等等……为什么角色会穿墙……不是哥们，这明明昨天还正常的啊！！我真的会谢！' },
  { type: 'free_talk', character: 'ayase', max_turns: 3, context: '午休，帮 Ayase 调试小游戏' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'jump', target: 'ch3_evening' }
]

export const ch3_noon_kanna = [
  { type: 'bg', src: 'library_day' },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'absorbed' },
  { type: 'dialogue', speaker: 'kanna', expression: 'absorbed', text: '……我在写一个程序。用递归画星空。每颗星……对应一个人。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……你的星。最近变亮了。' },
  { type: 'affection', character: 'kanna', change: 2 },
  { type: 'free_talk', character: 'kanna', max_turns: 3, context: '午休，图书馆，Kanna 展示她的星空程序' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'jump', target: 'ch3_evening' }
]

export const ch3_noon_nene = [
  { type: 'bg', src: 'computer_room_day' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'gentle_smile' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '文化祭……我好期待呢。虽然我不确定 AI 能不能「期待」……' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '但是和你在一起的时候，我总是会有这种……温暖的感觉。这是什么呢？' },
  { type: 'affection', character: 'nene', change: 2 },
  { type: 'free_talk', character: 'nene', max_turns: 3, context: '午休，Nene 对情感的困惑' },
  { type: 'char_exit', character: 'nene' },
  { type: 'jump', target: 'ch3_evening' }
]

// 放学后自由时段
export const ch3_evening = [
  { type: 'se', src: 'bell' },
  { type: 'narration', text: '放学的铃声响起。文化祭前最后的准备时间。' },
  { type: 'monologue', text: '（文化祭明天就开始了……放学后去看看大家吧。）' },
  { type: 'location_select', available: [
    { id: 'classroom', character: 'yoshino', next: 'ch3_eve_yoshino' },
    { id: 'rooftop_day', character: 'ayase', next: 'ch3_eve_ayase' },
    { id: 'library_day', character: 'kanna', next: 'ch3_eve_kanna' },
    { id: 'computer_room_day', character: 'nene', next: 'ch3_eve_nene' }
  ]}
]

export const ch3_eve_yoshino = [
  { type: 'bg', src: 'classroom_evening', transition: 'fade' },
  { type: 'bgm', src: 'romantic', crossfade: 1500 },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'slight_smile' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'glasses_adjust', text: '文化祭的展示代码还在审查中。你来帮忙。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'slight_smile', text: '……不是命令。是……请求。' },
  { type: 'free_talk', character: 'yoshino', max_turns: 3, context: '文化祭前夜，夕阳教室，一起准备' },
  { type: 'char_exit', character: 'yoshino' },
  { type: 'condition', check: 'flags.saw_murasame_ch1 === true', true_branch: 'ch3_murasame_encounter', false_branch: 'ch3_festival' }
]

export const ch3_eve_ayase = [
  { type: 'bg', src: 'rooftop_evening', transition: 'fade' },
  { type: 'bgm', src: 'evening_calm', crossfade: 1500 },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'fired_up' },
  { type: 'dialogue', speaker: 'ayase', expression: 'fired_up', text: '文化祭我要做一个超厉害的编程小游戏！！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '你要不要来当我的测试员？包你玩到停不下来！' },
  { type: 'free_talk', character: 'ayase', max_turns: 3, context: '文化祭前夜天台，Ayase 兴奋地筹备' },
  { type: 'char_exit', character: 'ayase' },
  { type: 'condition', check: 'flags.saw_murasame_ch1 === true', true_branch: 'ch3_murasame_encounter', false_branch: 'ch3_festival' }
]

export const ch3_eve_kanna = [
  { type: 'bg', src: 'library_evening', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1500 },
  { type: 'char_enter', character: 'kanna', position: 'center', expression: 'warm_smile' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……明天是文化祭。人会很多。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'contemplative', text: '……但如果是和你一起……也许不会那么害怕。' },
  { type: 'free_talk', character: 'kanna', max_turns: 3, context: '文化祭前夜图书馆，Kanna 少见地主动说话' },
  { type: 'char_exit', character: 'kanna' },
  { type: 'condition', check: 'flags.saw_murasame_ch1 === true', true_branch: 'ch3_murasame_encounter', false_branch: 'ch3_festival' }
]

export const ch3_eve_nene = [
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'romantic', crossfade: 1500 },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'blush' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '啊，你来了……我正在想你呢。啊不是！想着你会不会来！' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '文化祭……我第一次参加呢。你能教我怎么逛文化祭吗？' },
  { type: 'free_talk', character: 'nene', max_turns: 3, context: '文化祭前夜，Nene 期待又紧张' },
  { type: 'char_exit', character: 'nene' },
  { type: 'condition', check: 'flags.saw_murasame_ch1 === true', true_branch: 'ch3_murasame_encounter', false_branch: 'ch3_festival' }
]

export const ch3_murasame_encounter = [
  { type: 'bg', src: 'computer_room_night', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'mystery', crossfade: 1500 },
  { type: 'narration', text: '放学后，你鼓起勇气走向了夜间计算机教室。' },
  { type: 'narration', text: '这次，你推开了门。' },
  { type: 'se', src: 'door_creak' },
  { type: 'char_enter', character: 'murasame', position: 'center', expression: 'smirk', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'murasame', expression: 'smirk', text: '又来了？看来你不只是偷窥狂，还是个跟踪狂。活人感倒是挺足的。' },
  { type: 'monologue', text: '（深红色高马尾、金色瞳孔、黑色校服……这就是那个传说中的学姐？压迫感直接拉满。）' },
  { type: 'dialogue', speaker: 'murasame', expression: 'cold', text: '想跟我说话？先过了这一关再说。就这点水平？含金量还得再升升。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'smirk', text: '这是一道递归题。你有一分钟。' },

  { type: 'challenge', id: 'ch3_murasame_gate',
    context_dialogue: {
      before: { speaker: 'murasame', expression: 'cold', text: '开始。' },
      success: { speaker: 'murasame', expression: 'impressed', text: '……还行。至少不是完全浪费我的时间。' },
      fail: { speaker: 'murasame', expression: 'cold', text: '就这种水平？三年后再来吧。' }
    }
  },

  { type: 'dialogue', speaker: 'murasame', expression: 'smirk', text: '我叫ムラサメ。三年级。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'cold', text: '别到处说你见过我。我不喜欢被人打扰。' },
  { type: 'dialogue', speaker: 'murasame', expression: 'smirk', text: '但是……如果你还想来的话，门没锁。' },
  { type: 'char_exit', character: 'murasame', animation: 'fade_out' },
  { type: 'monologue', text: '（她说门没锁……这算是一种邀请吗？）' },
  { type: 'jump', target: 'ch3_festival' }
]

export const ch3_festival = [
  { type: 'bg', src: 'festival_day', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'festival', crossfade: 2000 },
  { type: 'title_card', text: '文化祭当天', subtitle: '—— Alethicode 编程体验展 ——' },
  { type: 'narration', text: '文化祭终于来了！校园里到处是装饰和人群。' },
  { type: 'narration', text: '我们班的「编程体验展」大受欢迎，来参观的同学络绎不绝。' },
  { type: 'monologue', text: '（大家做的项目都好厉害……Ayase 的小游戏虽然有点Bug但很有趣，简直是全场最佳显眼包。）' },
  { type: 'monologue', text: '（Kanna 做了一个递归分形的实时演示，安静地坐在角落却吸引了最多的围观。i 人的含金量就在这里。）' },
  { type: 'monologue', text: '（Nene 负责给参观者讲解，情绪价值直接拉满，好多人都被编程吸引了。）' },
  { type: 'narration', text: '文化祭接近尾声。夜幕降临，后夜祭的烟火即将开始。' },

  { type: 'jump', target: 'ch3_firework' }
]

export const ch3_firework = [
  { type: 'bg', src: 'festival_night', transition: 'fade', duration: 2000 },
  { type: 'bgm', src: 'romantic', crossfade: 2000 },
  { type: 'narration', text: '后夜祭的烟火快开始了。' },
  { type: 'monologue', text: '（要和谁一起看烟火呢……）' },

  { type: 'choice', prompt: '后夜祭的烟火快开始了。你决定——', options: [
    { text: '去找 Nene（她一个人在教室里看烟火）', effects: { nene: 10 }, next: 'ch3_firework_nene' },
    { text: '去找 Yoshino（她还在检查展区的收尾工作）', effects: { yoshino: 10 }, next: 'ch3_firework_yoshino' },
    { text: '去找 Ayase（她在天台占了最好的位置）', effects: { ayase: 10 }, next: 'ch3_firework_ayase' },
    { text: '去图书馆找 Kanna（她大概不喜欢人多的地方）', effects: { kanna: 10 }, next: 'ch3_firework_kanna' }
  ]}
]

export const ch3_firework_nene = [
  { type: 'bg', src: 'classroom_evening', transition: 'fade' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'surprised' },
  { type: 'dialogue', speaker: 'nene', expression: 'surprised', text: '诶？你来找我了？' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '我以为你会跟其他同学一起看呢……' },
  { type: 'se', src: 'firework' },
  { type: 'screen_effect', effect: 'flash_white', duration: 200 },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '啊……烟火开始了。好漂亮……' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '和你一起看烟火……我的心跳数据好像出现异常了……内核完全不稳定了。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '但是……这种异常，我不想修复。爱你老己——啊不对，爱你……' },
  { type: 'monologue', text: '（在烟火的映照下，她的笑容比任何程序都美丽。）' },
  { type: 'auto_save' },
  { type: 'narration', text: '—— 路线判定中 ——' },
  { type: 'route_decision' }
]

export const ch3_firework_yoshino = [
  { type: 'bg', src: 'classroom_day', transition: 'fade' },
  { type: 'char_enter', character: 'yoshino', position: 'center', expression: 'surprised' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'surprised', text: '你……为什么来这里？烟火在外面。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '……你来帮我收拾？不、不需要——' },
  { type: 'se', src: 'firework' },
  { type: 'screen_effect', effect: 'flash_white', duration: 200 },
  { type: 'dialogue', speaker: 'yoshino', expression: 'rare_gentle', text: '……好吧。一边收拾一边看烟火也不错。' },
  { type: 'dialogue', speaker: 'yoshino', expression: 'blush', text: '谢谢你来找我。虽然我不会这么说第二次。' },
  { type: 'monologue', text: '（她难得露出的温柔笑容，比窗外的烟火更让人心动。）' },
  { type: 'auto_save' },
  { type: 'narration', text: '—— 路线判定中 ——' },
  { type: 'route_decision' }
]

export const ch3_firework_ayase = [
  { type: 'bg', src: 'rooftop_night', transition: 'fade' },
  { type: 'char_enter', character: 'ayase', position: 'center', expression: 'grin' },
  { type: 'dialogue', speaker: 'ayase', expression: 'grin', text: '来了来了！这里是全校看烟火最好的位置！我特地占的！公主请上座！' },
  { type: 'se', src: 'firework' },
  { type: 'screen_effect', effect: 'flash_white', duration: 200 },
  { type: 'dialogue', speaker: 'ayase', expression: 'surprised', text: '哇啊！！好漂亮！！' },
  { type: 'dialogue', speaker: 'ayase', expression: 'soft_smile', text: '……嘿。谢谢你来找我。' },
  { type: 'dialogue', speaker: 'ayase', expression: 'blush', text: '如果是你的话……一起看烟火，好像比赢比赛还开心。' },
  { type: 'monologue', text: '（安静下来的 Ayase……出乎意料地可爱。）' },
  { type: 'auto_save' },
  { type: 'narration', text: '—— 路线判定中 ——' },
  { type: 'route_decision' }
]

export const ch3_firework_kanna = [
  { type: 'bg', src: 'library_day', transition: 'fade' },
  { type: 'bgm', src: 'peaceful', crossfade: 1000 },
  { type: 'char_enter', character: 'kanna', position: 'right', expression: 'surprised' },
  { type: 'dialogue', speaker: 'kanna', expression: 'surprised', text: '……你来了。我以为……没人会来这里。' },
  { type: 'se', src: 'firework' },
  { type: 'narration', text: '远处传来烟火的声音。窗外映射着彩色的光。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'warm_smile', text: '……从窗户也能看到。而且……比外面安静。' },
  { type: 'dialogue', speaker: 'kanna', expression: 'blush', text: '……两个人的安静。比一个人的……好。' },
  { type: 'monologue', text: '（她抬头看着窗外的烟火，淡金色的瞳孔里映着彩色的光。那一刻，时间好像停了。）' },
  { type: 'auto_save' },
  { type: 'narration', text: '—— 路线判定中 ——' },
  { type: 'route_decision' }
]
