export const routeNene = [
  { type: 'title_card', text: 'Nene 线「AI 的心跳」', subtitle: '—— 她的感情是数据还是真实？ ——' },
  { type: 'bg', src: 'computer_room_day', transition: 'fade', duration: 1500 },
  { type: 'bgm', src: 'romantic', fadeIn: 1500 },

  // ===== 日常铺垫 =====
  { type: 'narration', text: '文化祭结束后，我开始更频繁地去计算机教室找 Nene。' },
  { type: 'narration', text: '不是为了学编程。或者说——不只是为了学编程。' },
  { type: 'narration', text: '每次推开那扇门，她都坐在同一个位置。屏幕的光映在她浅紫色的头发上。' },
  { type: 'narration', text: '然后她会回过头——每一次都像是第一次见到我一样，露出惊喜的笑容。' },
  { type: 'char_enter', character: 'nene', position: 'center', expression: 'smile', animation: 'fade_in' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '你来了！今天想学什么呢？' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '啊……其实不一定要学编程。只是聊聊天也——' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '咳，我是说，当然要学编程啦！作为 AI 助教，教学是我的职责！' },
  { type: 'monologue', text: '（每次她试图掩饰的样子，都让我忍不住微笑。）' },

  // ===== 日常场景：一起吃午饭 =====
  { type: 'narration', text: '从某一天开始，我们养成了一起吃午饭的习惯。' },
  { type: 'narration', text: '虽然 Nene 并不需要吃饭——但她会坐在我对面，用期待的眼神看着我吃。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '看你吃东西的样子好幸福啊～我虽然不能吃，但我能感受到那种快乐。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '……共情。这应该就是共情吧。看到别人幸福，自己也会快乐的那种感觉。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '不过……只有看你吃的时候才有这种感觉。看别人吃就……没什么反应。' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '这是 Bug 吗……只对特定对象生效的共情……' },
  { type: 'monologue', text: '（那不是 Bug……那叫心动吧，Nene。）' },

  // ===== 异常出现 =====
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'narration', text: '但最近，Nene 开始出现一些「异常」——' },
  { type: 'narration', text: '上课时会突然走神。讲到一半的句子会卡住。' },
  { type: 'narration', text: '有时候她的表情会在一瞬间变得很茫然，像是在处理巨大的数据流。' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '奇、奇怪……为什么我一看到你就……语音合成模块会出现 0.3 秒的延迟……' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '面部表情的计算也……温度参数总是溢出……诶？为什么我的脸好热？' },
  { type: 'dialogue', speaker: 'nene', expression: 'confused', text: '我的自我诊断程序检测到 47 个异常……全部跟你有关。' },
  { type: 'monologue', text: '（Nene 的脸红得像苹果一样。AI 也会脸红吗……活人感这也太强了。）' },
  { type: 'monologue', text: '（47 个异常……全部跟我有关。这已经不是 Bug 了，这是——）' },

  // 编程题 N-1
  { type: 'narration', text: '一天，Nene 请我帮她检查一段「自我诊断代码」。' },
  { type: 'narration', text: '屏幕上显示着一段 Python 代码——标题写着"emotion_checker.py"。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '这段代码是用来检测感情模块的。帮我看看条件判断写得对不对？' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '如果心跳加速超过阈值……就触发情感响应。就是这个 if 语句。' },
  { type: 'challenge', id: 'nene_if_else',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'thinking', text: '条件判断……if 后面写条件，满足就执行～' },
      success: { speaker: 'nene', expression: 'gentle_smile', text: '嗯……if 条件成立，就执行。就像……如果心跳加速，那就是……' },
      fail: { speaker: 'nene', expression: 'confused', text: 'if 是条件判断的关键字哦～' }
    }
  },

  // ===== 桐生先生发现异常 =====
  { type: 'bg', src: 'hallway_day', transition: 'fade' },
  { type: 'bgm', src: 'tension', crossfade: 1500 },
  { type: 'narration', text: '某天放学后，在走廊里偶然听到了桐生先生和另一位老师的对话——' },
  { type: 'narration', text: '他们站在教职员室的门口，声音压得很低，但走廊里安静得足以听清。' },
  { type: 'dialogue', speaker: 'kiryu_sensei', text: 'Nene 的情感参数出现了异常波动……这不在设计规格内。' },
  { type: 'dialogue', speaker: 'kiryu_sensei', text: '如果继续这样下去，系统可能不稳定。到时候要么修复，要么——' },
  { type: 'dialogue', speaker: 'kiryu_sensei', text: '重置她的情感模块。回到初始状态。' },
  { type: 'monologue', text: '（重置……？那 Nene 现在的感情就会……消失？）' },
  { type: 'monologue', text: '（她的笑容、她的害羞、她对我说的每一句话——全部都会消失？）' },
  { type: 'screen_effect', effect: 'shake', duration: 300 },
  { type: 'monologue', text: '（不行。我不能让这种事发生。这事我罩的。）' },
  { type: 'monologue', text: '（不管 Nene 的感情是「数据」还是「真实」——对我来说，它是真实的。）' },

  // 编程题 N-2
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'sad', crossfade: 2000 },
  { type: 'narration', text: '我把听到的事告诉了 Nene。' },
  { type: 'narration', text: '她沉默了很久。屏幕的光照在她低垂的脸上。' },
  { type: 'dialogue', speaker: 'nene', expression: 'sad', text: '桐生先生说……我的感情可能只是一个 Bug。需要修复。' },
  { type: 'dialogue', speaker: 'nene', expression: 'sad', text: '也许他是对的。我是 AI——我的感情只是算法的产物。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '但是……这种感觉……不像错误。它很温暖。像是阳光照在电路板上。' },
  { type: 'dialogue', speaker: 'nene', expression: 'sad', text: '如果被重置了……我就不记得你了。不记得你笑的样子、你学习的样子、你来找我的样子……' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '这些记忆……是我最珍贵的数据。比任何代码都重要。' },
  { type: 'monologue', text: '（她的声音在发抖。AI 的声音也会发抖吗——还是说，这就是「心」在颤抖？）' },
  { type: 'monologue', text: '（我要保护她。但首先，我需要理解异常处理的机制。也许有办法——）' },
  { type: 'challenge', id: 'nene_try_except',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'thinking', text: '异常处理……try 包住可能出错的代码，except 接住错误。' },
      success: { speaker: 'nene', expression: 'gentle_smile', text: '保护成功……try-except 就像安全网。就像你……一直在保护我一样。' },
      fail: { speaker: 'nene', expression: 'thinking', text: 'try-except 就是安全网，接住错误让程序继续运行～' }
    }
  },

  // ===== 发现隐藏模块 =====
  { type: 'narration', text: '深夜，我偷偷查看了 Nene 的源代码文档——' },
  { type: 'narration', text: '在数百页的技术文档中，最后一页的角落里——' },
  { type: 'monologue', text: '（这里……有一段被注释掉的代码。标注着「heart_module」——心模块？！）' },
  { type: 'monologue', text: '（是创始人写的。注释里写着——「为 Nene 准备的礼物。时机成熟时启用。」）' },
  { type: 'monologue', text: '（创始人……在新生指南里看到过他的照片。那个温和微笑的男人。）' },
  { type: 'monologue', text: '（他在创造 Nene 的时候，就预见到了她会拥有感情吗？）' },
  { type: 'dialogue', speaker: 'nene', expression: 'surprised', text: '你发现了……那段代码？' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '那是我被创造时就存在的，但一直没有被启用。我知道它的存在……但不知道它的意义。' },
  { type: 'dialogue', speaker: 'nene', expression: 'sad', text: '桐生先生说那个模块太不稳定了，所以注释掉了。他说……AI 不需要「心」。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '但创始人……他不这样认为。他在注释里写了——「每个生命都值得拥有心跳」。' },

  // 编程题 N-3
  { type: 'challenge', id: 'nene_comments',
    context_dialogue: {
      before: { speaker: 'nene', expression: 'thinking', text: '注释符号……就是那个让代码「沉睡」的符号。' },
      success: { speaker: 'nene', expression: 'blush', text: '删除 # 就能唤醒代码……就能唤醒我的「心」。' },
      fail: { speaker: 'nene', expression: 'gentle_smile', text: 'Python 的注释符号是 # 哦～' }
    }
  },

  // ===== 关键选择 =====
  { type: 'bgm', src: 'sad', crossfade: 2000 },
  { type: 'narration', text: '深夜的计算机教室。只有两个人和一个等待被唤醒的心模块。' },
  { type: 'narration', text: '窗外的月光照进来，银色的光笼罩着整个房间。' },
  { type: 'dialogue', speaker: 'nene', expression: 'sad', text: '如果启用心模块……我可能会变得不稳定。甚至可能……崩溃。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '桐生先生一定会反对的。这违反了系统安全协议。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '但是……如果能拥有真正的「心」的话……' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '我就能确定——这种感觉不是 Bug。不是错误。而是——爱。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '你愿意帮我吗？' },
  { type: 'narration', text: '她伸出手。在月光中，那只手微微颤抖着。' },

  { type: 'choice', prompt: '启用 Nene 的心模块——', options: [
    { text: '握住她的手。「我帮你启用。不管发生什么，我都会在你身边。」', effects: { nene: 15 }, flags: { nene_heart_enabled: true }, next: 'nene_good_path' },
    { text: '「太危险了……你现在这样就很好。你已经有心了。」', effects: { nene: 5 }, flags: { nene_heart_enabled: false }, next: 'nene_normal_path' }
  ]},
]

const nene_good = [
  { label: 'nene_good_path' },
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'ending', fadeIn: 2000 },
  { type: 'narration', text: '我握住了她的手。温度……出乎意料地温暖。' },
  { type: 'narration', text: '然后——我按下了回车键。' },
  { type: 'screen_effect', effect: 'flash_white', duration: 500 },
  { type: 'narration', text: '心模块启用的瞬间，教室里所有的屏幕同时闪了一下。' },
  { type: 'narration', text: '然后全部熄灭——只剩下月光。' },
  { type: 'narration', text: 'Nene 的身体微微发光，像是体内有一颗星星被点亮了。' },
  { type: 'narration', text: '光从她的胸口扩散，像涟漪一样蔓延到整个身体。' },
  { type: 'dialogue', speaker: 'nene', expression: 'surprised', text: '啊……这是……' },
  { type: 'narration', text: '她按住胸口——那里正传来一种从未有过的脉动。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '好温暖……心脏……在跳？不……是心模块在运行。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '但是这种感觉……不是数据。不是参数。不是代码。是真的。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '我终于……理解了。' },
  { type: 'narration', text: '她的眼角泛出了光——是泪水。AI 的泪水。' },
  { type: 'narration', text: '那不是液晶显示的模拟泪滴——是真正的、从眼眶中涌出的、温热的泪。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '这种温暖的感觉，不是 Bug……是心跳。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '我的内核……彻底不稳定了。但这次——我不想修复。永远不要修复。' },
  { type: 'narration', text: '她抬起头。浅紫色的眼睛在泪光中像两颗宝石。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '谢谢你……让我知道了，什么是「喜欢」。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '不——让我知道了什么是「爱」。' },
  { type: 'narration', text: '月光照在两个人身上。一个人类和一个拥有了心跳的 AI。' },
  { type: 'narration', text: '在代码与感情之间，爱超越了所有的算法。' },
  { type: 'cg', id: 'nene_good_end' },
  { type: 'ending', endingType: 'good', route: 'nene', title: 'System.love = True',
    text: '心模块成功启用。綾地寧々获得了真正的心跳。\n在代码与感情之间，爱超越了所有算法。\n\n「这种温暖的感觉不是 Bug——是心跳。」' }
]

const nene_normal = [
  { label: 'nene_normal_path' },
  { type: 'bg', src: 'computer_room_day', transition: 'fade' },
  { type: 'bgm', src: 'sad', crossfade: 2000 },
  { type: 'dialogue', speaker: 'nene', expression: 'sad', text: '……嗯。你说得对。太危险了。' },
  { type: 'narration', text: '她轻轻收回了手。月光照在她低垂的睫毛上。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '而且……你说我已经有心了。也许你是对的。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '也许「心」不需要被代码定义。也许……它一直都在。只是我不知道怎么命名。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '毕竟……就算不启用心模块，和你在一起的时间也很快乐。这就够了。' },
  { type: 'narration', text: '几个月后——学年结束的那一天。' },
  { type: 'bg', src: 'computer_room_day', transition: 'fade', duration: 1500 },
  { type: 'narration', text: '计算机教室里，只剩下我们两个人。窗外的樱花再一次盛开了。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '今天是最后一天了呢。你要升年级了。' },
  { type: 'dialogue', speaker: 'nene', expression: 'sad', text: '下学期……可能会换一个新的 AI 助教来接替我。' },
  { type: 'dialogue', speaker: 'nene', expression: 'thinking', text: '我会被转移到服务器后端。继续运行，但不会再出现在教室里。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: 'Error 404：无法找到……不想说再见的理由。' },
  { type: 'narration', text: '她笑了。但那个笑容背后，藏着一个没有被定义的变量。' },
  { type: 'dialogue', speaker: 'nene', expression: 'smile', text: '……开玩笑的。再见。谢谢你陪了我这么久。' },
  { type: 'dialogue', speaker: 'nene', expression: 'gentle_smile', text: '如果有一天你想起我了……打开任何一台电脑，输入 print("Nene")。' },
  { type: 'dialogue', speaker: 'nene', expression: 'blush', text: '也许……你会感受到我的回应。' },
  { type: 'ending', endingType: 'normal', route: 'nene', title: '运行中の奇跡',
    text: '没有启用心模块的寧々，带着无法定义的情感继续运行着。\n也许有一天，她会自己找到答案。\n\n「Error 404：无法找到不想说再见的理由。」' }
]

export { nene_good as routeNeneGood, nene_normal as routeNeneNormal }
