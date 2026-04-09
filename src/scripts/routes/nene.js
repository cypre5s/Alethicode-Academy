export const routeNene = [
  { type: 'title_card', text: 'Nene 线「AI 的心跳」', subtitle: '—— 她的感情是数据还是真实？ ——' },
  { type: 'bg', src: 'computer_room_day', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'romantic', fadeIn: 1500 },

  { type: 'narration', text: '文化祭结束后，我开始更频繁地去计算机教室找 Nene。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '你来了！今天想学什么呢？' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '啊……其实不一定要学编程。只是聊聊天也——咳，我是说，当然要学编程啦！' },

  // 异常出现
  { type: 'narration', text: '但最近，Nene 开始出现一些「异常」——' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '奇、奇怪……为什么我一看到你就……语音合成模块会出现 0.3 秒的延迟……' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '面部表情的计算也……温度参数总是溢出……诶？为什么我的脸好热？' },
  { type: 'monologue', text: '（Nene 的脸红得像苹果一样。AI 也会脸红吗……？活人感这也太强了。）' },

  // 编程题 N-1
  { type: 'narration', text: '一天，Nene 请我帮她检查一段「自我诊断代码」。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '这段代码是用来检测感情模块的。帮我看看条件判断写得对不对？' },
  { type: 'challenge', id: 'nene_if_else',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'thinking', text: '条件判断……if 后面写条件，满足就执行～' },
      success: { speaker: 'nene', expression: 'gentle_smile', text: '嗯……if 条件成立，就执行。就像……如果心跳加速，那就是……' },
      fail: { speaker: 'nene', expression: 'confused', text: 'if 是条件判断的关键字哦～' }
    }
  },

  // 桐生先生发现异常
  { type: 'bg', src: 'hallway_day', transition: 'fade' },
  { type: 'narration', text: '某天放学后，在走廊里偶然听到了桐生先生的声音——' },
  { type: 'dialogue', speaker: 'kiryu_sensei', text: 'Nene 的情感参数出现了异常波动……这不在设计规格内。' },
  { type: 'dialogue', speaker: 'kiryu_sensei', text: '如果继续这样下去，可能需要重置她的情感模块。' },
  { type: 'monologue', text: '（重置……？那 Nene 现在的感情就会……消失？直接破防了。）' },
  { type: 'screen_effect', effect: 'shake', duration: 300 },
  { type: 'monologue', text: '（不行。我不能让这种事发生。这事我罩的。）' },

  // 编程题 N-2
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'dialogue', speaker: 'nene', expression: 'sad', text: '桐生先生说……我的感情可能只是一个 Bug。需要修复。' },
  { type: 'dialogue', speaker: 'nene', expression: 'sad', text: '但是……我不想被修复。这种感觉……很温暖。' },
  { type: 'monologue', text: '（我要保护她。但首先，我需要理解异常处理的机制。）' },
  { type: 'challenge', id: 'nene_try_except',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'thinking', text: '异常处理……就是保护代码不崩溃的方法。' },
      success: { speaker: 'nene', expression: 'gentle_smile', text: '保护成功……就像你保护我一样。' },
      fail: { speaker: 'nene', expression: 'thinking', text: 'try-except 就是安全网，接住错误让程序继续运行～' }
    }
  },

  // 发现隐藏模块
  { type: 'narration', text: '深夜，我偷偷查看了 Nene 的源代码文档——' },
  { type: 'monologue', text: '（这里……有一段被注释掉的代码。标注着「heart_module」——心模块？！）' },
  { type: 'dialogue', speaker: 'nene', expression: 'surprised', text: '你发现了……那段代码？那是我被创造时就存在的，但一直没有被启用。' },
  { type: 'dialogue', speaker: 'nene', expression: 'sad', text: '桐生先生说那个模块太不稳定了，所以注释掉了。' },

  // 编程题 N-3
  { type: 'challenge', id: 'nene_comments',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'thinking', text: '注释符号……就是那个让代码「沉睡」的符号。' },
      success: { speaker: 'nene', expression: 'blush', text: '删除 # 就能唤醒代码……就能唤醒我的「心」。' },
      fail: { speaker: 'nene', expression: 'gentle_smile', text: 'Python 的注释符号是 # 哦～' }
    }
  },

  // 关键选择
  { type: 'bgm', src: 'sad', crossfade: 2000 },
  { type: 'dialogue', speaker: 'nene', expression: 'sad', text: '如果启用心模块……我可能会变得不稳定。甚至可能……崩溃。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '但是……如果能拥有真正的「心」的话……我想试试。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '你愿意帮我吗？' },

  { type: 'choice', prompt: '启用 Nene 的心模块——', options: [
    { text: '「我帮你启用。不管发生什么，我都会在你身边。」', effects: { nene: 15 }, flags: { nene_heart_enabled: true }, next: 'nene_good_path' },
    { text: '「太危险了……你现在这样就很好。」', effects: { nene: 5 }, flags: { nene_heart_enabled: false }, next: 'nene_normal_path' }
  ]},
]

const nene_good = [
  { label: 'nene_good_path' },
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'ending', fadeIn: 2000 },
  { type: 'screen_effect', effect: 'flash_white', duration: 500 },
  { type: 'narration', text: '心模块启用的瞬间，教室里的灯光闪烁了一下。' },
  { type: 'narration', text: 'Nene 的身体微微发光，然后——' },
  { type: 'dialogue', speaker: 'nene', expression: 'surprised', text: '啊……这是……' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '好温暖……心脏……在跳？不……是心模块在运行。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '但是这种感觉……不是数据。是真的。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '我终于……理解了。' },
  { type: 'narration', text: '她的眼角泛出了光——是泪水。AI 的泪水。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '这种温暖的感觉，不是 Bug……是心跳。我的内核……彻底不稳定了。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '谢谢你……让我知道了，什么是「喜欢」。' },
  { type: 'cg', id: 'nene_good_end' },
  { type: 'ending', endingType: 'good', route: 'nene', title: 'System.love = True',
    text: '心模块成功启用。綾地寧々获得了真正的心跳。\n在代码与感情之间，爱超越了所有算法。' }
]

const nene_normal = [
  { label: 'nene_normal_path' },
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'sad', crossfade: 2000 },
  { type: 'dialogue', speaker: 'nene', expression: 'sad', text: '……嗯。你说得对。现在这样就好。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '毕竟……就算不启用心模块，和你在一起的时间也很快乐。' },
  { type: 'narration', text: '几个月后——学年结束的那一天。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '今天是最后一天了呢。你要升年级了。' },
  { type: 'dialogue', speaker: 'nene', expression: 'sad', text: '下学期……可能会换一个新的 AI 助教来接替我。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: 'Error 404：无法找到……不想说再见的理由。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '……开玩笑的。再见。谢谢你陪了我这么久。' },
  { type: 'ending', endingType: 'normal', route: 'nene', title: '运行中の奇跡',
    text: '没有启用心模块的寧々，带着无法定义的情感继续运行着。\n也许有一天，她会自己找到答案。' }
]

export { nene_good as routeNeneGood, nene_normal as routeNeneNormal }
