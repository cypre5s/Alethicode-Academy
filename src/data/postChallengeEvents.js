export const postChallengeEvents = {

  // ═══════════════════════════════════════════════════════════════
  // 序章
  // ═══════════════════════════════════════════════════════════════

  tutorial_01_hello_world: {
    knowledge_point: '圆面积公式 · print() 输出 · 算术运算符',
    common_mistakes: ['混淆 + 和 * 运算', '忘记面积公式 S = π × r²'],
    nene: {
      solo_pass: {
        emotional_tone: 'proud_and_warm',
        must_mention: ['第一次就做对了', 'pi * r * r'],
        relationship_goal: '强化"她看到了你的努力"的被理解感',
        template: '啊，第一次就做对了呢……{pause:200}pi * r * r，你记住了。',
        memory_template: '${name}第一次就做对了圆面积计算，我好开心',
      },
      assisted_pass: {
        emotional_tone: 'gentle_encouragement',
        must_mention: ['提示帮到你了', '理解过程比结果重要'],
        relationship_goal: '建立"她会耐心等你"的安全感',
        template: '用了提示也没关系哦……{pause:200}重要的是你理解了为什么是乘法。',
        memory_template: '${name}在提示下理解了圆面积公式',
      },
      thoughtful_fail: {
        emotional_tone: 'soft_comfort',
        must_mention: ['圆面积公式', '别急慢慢来'],
        relationship_goal: '传达"失败也被接纳"的包容感',
        template: '没关系的……{pause:300}π × r × r，我们一起记住它好不好？',
        memory_template: '${name}第一次挑战没做对，但我告诉他没关系',
      },
      careless_fail: {
        emotional_tone: 'slight_concern',
        must_mention: ['上次类似的计算也出错了', '换个方式理解'],
        relationship_goal: '温柔地指出需要巩固基础',
        template: '唔……这种计算上次也卡住了呢。{pause:200}要不要我用生活里的例子再讲一遍？',
        memory_template: '${name}在基础计算上又出错了，我有点担心',
      },
    },
  },

  tutorial_02_print: {
    knowledge_point: '字符串索引 · 下标从 0 开始',
    common_mistakes: ['以为下标从 1 开始', '混淆索引和切片'],
    nene: {
      solo_pass: {
        emotional_tone: 'delighted',
        must_mention: ['下标从 0 开始', '你记住了'],
        relationship_goal: '让玩家感到学会的成就被她看见',
        template: '完美！{pause:200}Python 的下标从 0 开始……你记住了呢。',
        memory_template: '${name}记住了字符串下标从 0 开始',
      },
      assisted_pass: {
        emotional_tone: 'patient_warmth',
        must_mention: ['0 是第一个位置', '下次会更快想到'],
        relationship_goal: '强化安全感',
        template: '嗯，0 就是第一个位置哦。{pause:200}下次一定能直接想到的！',
        memory_template: '${name}在提示后理解了字符串索引',
      },
      thoughtful_fail: {
        emotional_tone: 'soft_comfort',
        must_mention: ['很多人都会搞混', '从 0 开始是 Python 的约定'],
        relationship_goal: '消除挫败感',
        template: '很多人一开始都会搞混呢……{pause:200}0 是第一个，这是 Python 的小规矩。',
        memory_template: '${name}在索引上犯了常见错误，我安慰了他',
      },
      careless_fail: {
        emotional_tone: 'gentle_reminder',
        must_mention: ['上次也是索引的问题', '多练几次就好'],
        relationship_goal: '不批评但点出重复模式',
        template: '唔……上次也是索引的问题呢。{pause:200}要不要我们一起多练几道？',
        memory_template: '${name}又在索引上出错了，需要多练习',
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 第一章 — 变量、字符串、输入输出
  // ═══════════════════════════════════════════════════════════════

  ch1_variables: {
    knowledge_point: '整除 // 与取余 % · 提取各位数字',
    common_mistakes: ['混淆 // 和 /', '运算顺序搞错'],
    nene: {
      solo_pass: {
        emotional_tone: 'impressed_warmth',
        must_mention: ['% 和 // 的配合', '提取数位'],
        relationship_goal: '让她为你骄傲',
        template: '哇，整除和取余你都掌握了呢！{pause:200}提取百位数字……含金量还在升！',
        memory_template: '${name}独立掌握了整除取余运算',
      },
      assisted_pass: {
        emotional_tone: 'encouraging',
        must_mention: ['先取余再整除', '步骤拆解'],
        relationship_goal: '陪伴感',
        template: '对，先 % 1000 再 // 100……{pause:200}一步步来就不难了呢。',
        memory_template: '${name}在引导下学会了数位提取',
      },
      thoughtful_fail: {
        emotional_tone: 'patient',
        must_mention: ['整除和取余的区别', '画个流程图'],
        relationship_goal: '提供具体的学习方法',
        template: '// 是整除，% 是取余……{pause:300}要不要我们画个图来拆解这个过程？',
        memory_template: '${name}还需要理解整除和取余的区别',
      },
      careless_fail: {
        emotional_tone: 'mild_worry',
        must_mention: ['运算符号又搞混了', '基础很重要'],
        relationship_goal: '温柔但明确地指出需要巩固',
        template: '运算符号又搞混了呢……{pause:200}基础运算真的很重要哦，我们再复习一下好不好？',
        memory_template: '${name}反复在运算符上出错',
      },
    },
  },

  ch1_string_concat: {
    knowledge_point: 'chr() 与 ord() 互逆函数 · Unicode 编码',
    common_mistakes: ['不知道 chr() 函数', '混淆 chr 和 str'],
    nene: {
      solo_pass: {
        emotional_tone: 'bright_surprise',
        must_mention: ['chr 和 ord 是一对', '编码转换'],
        relationship_goal: '分享知识的喜悦',
        template: '你知道 chr() 呢！{pause:200}chr 和 ord 就像一对好朋友，一个把字变成数，一个把数变回字～',
        memory_template: '${name}知道 chr() 和 ord() 是互逆函数',
      },
      assisted_pass: {
        emotional_tone: 'gentle_teaching',
        must_mention: ['chr 把数字变回字符', '记住这一对'],
        relationship_goal: '教学中的亲近感',
        template: 'chr 就是把数字变回字符哦。{pause:200}记住这一对就好了呢～',
        memory_template: '${name}在提示下记住了 chr/ord',
      },
      thoughtful_fail: {
        emotional_tone: 'soft_explanation',
        must_mention: ['ord() 的反向操作', '三个字母 c-h-r'],
        relationship_goal: '不让他觉得丢脸',
        template: 'ord() 是字符变数字……那反过来呢？{pause:200}c-h-r，三个字母，好记吧？',
        memory_template: '${name}还不熟悉 chr 函数',
      },
      careless_fail: {
        emotional_tone: 'gentle_nudge',
        must_mention: ['字符编码函数上次也卡过', '写个小笔记'],
        relationship_goal: '建议具体的学习策略',
        template: '字符编码的函数上次也不太确定呢……{pause:200}要不要写个小笔记贴在旁边？',
        memory_template: '${name}在字符编码函数上反复出错',
      },
    },
  },

  ch1_debug_ayase: {
    knowledge_point: '代码执行顺序 · split() 字符串分割',
    common_mistakes: ['先操作后定义', '不理解 split 返回列表'],
    ayase: {
      solo_pass: {
        emotional_tone: 'competitive_respect',
        must_mention: ['排序对了', '先有数据再操作'],
        relationship_goal: '并肩作战的默契',
        template: '哈？一次就排对了！{pause:200}好吧……先定义再操作，你比我想的聪明嘛！',
        memory_template: '${name}一次就帮我排对了代码顺序',
      },
      assisted_pass: {
        emotional_tone: 'friendly_teasing',
        must_mention: ['提示了才搞定', '下次试试不看提示'],
        relationship_goal: '轻松的伙伴感',
        template: '嘿嘿，虽然用了提示……{pause:200}但至少你理解了为什么要先定义！下次不许偷看！',
        memory_template: '${name}在提示下帮我调对了代码',
      },
      thoughtful_fail: {
        emotional_tone: 'energetic_comfort',
        must_mention: ['代码要按依赖顺序', '一起再试一次'],
        relationship_goal: '失败也开心的氛围',
        template: '没事没事！{pause:200}代码跟做菜一样——得先有食材才能炒嘛！我们再来！',
        memory_template: '${name}在代码排序上犯错了，但我们一起努力',
      },
      careless_fail: {
        emotional_tone: 'direct_but_caring',
        must_mention: ['又搞混执行顺序了', '这个基础得练'],
        relationship_goal: '直率地指出问题但不伤感情',
        template: '喂，执行顺序又搞混了！{pause:300}……算了，我也经常犯。一起练吧！',
        memory_template: '${name}又搞混了执行顺序',
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 第二章 — 循环与分支
  // ═══════════════════════════════════════════════════════════════

  ch2_for_loop: {
    knowledge_point: 'for 循环 · range() 上界开区间',
    common_mistakes: ['以为 range(1,101) 包含 101', '忘记 += 累加'],
    yoshino: {
      solo_pass: {
        emotional_tone: 'restrained_approval',
        must_mention: ['range 的上界是开区间', '基本知识'],
        relationship_goal: '获得她难得的认可',
        template: '……正确。range 的上界是开区间。{pause:300}这是基本知识……但你记住了。',
        memory_template: '${name}独立答对了 range 的用法',
      },
      assisted_pass: {
        emotional_tone: 'slight_disappointment',
        must_mention: ['用了提示', '下次应该自己想到'],
        relationship_goal: '她的标准在激励你',
        template: '……用了提示。{pause:200}range 这种基础，下次自己想到。',
        memory_template: '${name}在 range 上需要提示',
      },
      thoughtful_fail: {
        emotional_tone: 'cold_but_guiding',
        must_mention: ['range(1,101) 不包含 101', '去试试打印 list(range(...))'],
        relationship_goal: '严格中暗藏指导',
        template: 'range(1, 101) 不包含 101。{pause:200}……回去试试 print(list(range(1,5)))，自己看。',
        memory_template: '${name}在 range 上犯错，我让他自己验证',
      },
      careless_fail: {
        emotional_tone: 'sharp_criticism',
        must_mention: ['range 上界的问题说过了', '基础不牢'],
        relationship_goal: '她的严格是因为在意',
        template: 'range 的上界问题，不是第一次了。{pause:300}……基础不牢，后面的东西你怎么学。',
        memory_template: '${name}反复在 range 上界上出错，我很担心他的基础',
      },
    },
  },

  ch2_while_loop: {
    knowledge_point: 'while 循环 · != 不等于运算符',
    common_mistakes: ['写成 = 而不是 !=', '混淆 != 和 =='],
    kanna: {
      solo_pass: {
        emotional_tone: 'quiet_nod',
        must_mention: ['!=', '不等于'],
        relationship_goal: '沉默中的认可',
        template: '……嗯。{pause:400}!=。正确。',
        memory_template: '${name}答对了 while 循环条件',
      },
      assisted_pass: {
        emotional_tone: 'minimal_guidance',
        must_mention: ['不等于', '循环条件'],
        relationship_goal: '她简短的话里有帮助',
        template: '……不等于。{pause:600}循环……在条件不满足时停。',
        memory_template: '${name}需要提示才想到 !=',
      },
      thoughtful_fail: {
        emotional_tone: 'patient_silence',
        must_mention: ['猜错了继续', '猜对了停下'],
        relationship_goal: '用最少的话指引方向',
        template: '……猜错了，继续。{pause:800}猜对了……停。{pause:400}什么时候继续？',
        memory_template: '${name}还在理解循环条件',
      },
      careless_fail: {
        emotional_tone: 'slight_frown',
        must_mention: ['又搞混了', '比较运算符'],
        relationship_goal: '她少有的关注',
        template: '……{pause:400}又搞混了。{pause:600}= 和 !=……不一样的。',
        memory_template: '${name}反复混淆比较运算符',
      },
    },
  },

  ch2_list_sort: {
    knowledge_point: '嵌套循环 · 打印图案 · range(i)',
    common_mistakes: ['内外层循环弄反', '忘记换行'],
    ayase: {
      solo_pass: {
        emotional_tone: 'fired_up_respect',
        must_mention: ['外层控制行内层控制列', '排对了'],
        relationship_goal: '竞争中的惺惺相惜',
        template: '嚯！排对了！{pause:200}外层行内层列——你比我第一次做的时候快！可恶！',
        memory_template: '${name}在嵌套循环排序上超过了我',
      },
      assisted_pass: {
        emotional_tone: 'teasing',
        must_mention: ['用了提示', '嵌套循环'],
        relationship_goal: '轻松的学习伙伴',
        template: '用了提示嘛——{pause:200}不过嵌套循环本来就容易搞混！下次比比谁先做出来！',
        memory_template: '${name}在提示下理解了嵌套循环',
      },
      thoughtful_fail: {
        emotional_tone: 'encouraging_rival',
        must_mention: ['外层控制行', '一起再练一道'],
        relationship_goal: '不服输但想帮你',
        template: '嗯……外层控制行数，内层控制每行打印几个。{pause:200}来，我们再练一道！',
        memory_template: '${name}在嵌套循环上需要更多练习',
      },
      careless_fail: {
        emotional_tone: 'blunt_concern',
        must_mention: ['循环嵌套又搞混了', '画个表格'],
        relationship_goal: '直率地帮你改进',
        template: '喂，循环嵌套又搞混了！{pause:200}画个表格！i 是几的时候 j 从几到几——自己写出来就懂了！',
        memory_template: '${name}反复在嵌套循环上出错',
      },
    },
  },

  ch2_nested_loop: {
    knowledge_point: '九九乘法表 · 内层循环依赖外层变量',
    common_mistakes: ['不理解 range(1, i+1) 的动态上界', '混淆行列关系'],
    yoshino: {
      solo_pass: {
        emotional_tone: 'genuine_approval',
        must_mention: ['内外层的依赖关系', '三角形结构'],
        relationship_goal: '赢得她的真正认可',
        template: '完美理解。{pause:200}嵌套循环的关键在于内外层的依赖关系。……不错。',
        memory_template: '${name}完全理解了嵌套循环的依赖关系',
      },
      assisted_pass: {
        emotional_tone: 'measured_guidance',
        must_mention: ['range(1, i+1)', '动态上界'],
        relationship_goal: '严格但愿意教',
        template: 'range(1, i+1) 让第 i 行只打印 i 个。{pause:200}……动态上界，记住了吗。',
        memory_template: '${name}在提示下理解了动态上界',
      },
      thoughtful_fail: {
        emotional_tone: 'structured_correction',
        must_mention: ['当 i=3 时 range(1,4)', '自己跑一遍'],
        relationship_goal: '用规范的方式引导思考',
        template: '当 i=3 时，range(1, 4) 生成 1,2,3。{pause:300}自己手动跑一遍。这不是建议，是要求。',
        memory_template: '${name}还需要理解动态上界的概念',
      },
      careless_fail: {
        emotional_tone: 'disappointed_push',
        must_mention: ['循环依赖关系还没掌握', '回去做笔记'],
        relationship_goal: '她的严格背后是不想你落后',
        template: '循环的依赖关系……你还没掌握。{pause:300}回去把 i 从 1 到 5 每行写出来。明天我要检查。',
        memory_template: '${name}在循环依赖上仍然薄弱',
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 第三章 — 函数与模块化
  // ═══════════════════════════════════════════════════════════════

  ch3_function_def: {
    knowledge_point: 'def 关键字 · 函数定义语法',
    common_mistakes: ['忘记 def 关键字', '混淆 def 和 define'],
    nene: {
      solo_pass: {
        emotional_tone: 'warm_pride',
        must_mention: ['def 关键字', '函数定义'],
        relationship_goal: '她为你的成长开心',
        template: '对了！{pause:200}def 就是定义函数的咒语呢～说出来函数就诞生了！',
        memory_template: '${name}一下就记住了 def 关键字',
      },
      assisted_pass: {
        emotional_tone: 'gentle_reinforcement',
        must_mention: ['def 三个字母', '下次直接想到'],
        relationship_goal: '反复强化记忆',
        template: 'd-e-f，三个字母就定义了一个函数哦。{pause:200}下次一定能直接想到的！',
        memory_template: '${name}在提示后记住了 def',
      },
      thoughtful_fail: {
        emotional_tone: 'encouraging',
        must_mention: ['Python 用 def 不用 function', '短小好记'],
        relationship_goal: '帮他区分不同语言',
        template: 'Python 比较特别，用 def 而不是 function 呢。{pause:200}短短三个字母，好记吧？',
        memory_template: '${name}暂时没记住 def 关键字',
      },
      careless_fail: {
        emotional_tone: 'worried_kindness',
        must_mention: ['函数语法又忘了', '要多写多练'],
        relationship_goal: '温柔地推动他练习',
        template: '函数的写法又忘记了呢……{pause:200}要不要我们一起多写几个小函数练练手？',
        memory_template: '${name}又忘记了 def，需要更多练习',
      },
    },
  },

  ch3_return_value: {
    knowledge_point: '递归 · 阶乘 · 基准条件与递推',
    common_mistakes: ['不理解递归展开过程', '混淆阶乘的值'],
    yoshino: {
      solo_pass: {
        emotional_tone: 'rare_praise',
        must_mention: ['5! = 120', '基准条件和递推'],
        relationship_goal: '她难得地夸你',
        template: '正确。5! = 120。{pause:200}递归的核心——基准条件和递推关系，你都理解了。……不错。',
        memory_template: '${name}独立算出了递归阶乘',
      },
      assisted_pass: {
        emotional_tone: 'clinical_guidance',
        must_mention: ['递归展开过程', '从 n=0 开始回溯'],
        relationship_goal: '用她的方式教你思考',
        template: '递归要从基准条件 n=0 开始回溯。{pause:200}5×4×3×2×1×1 = 120。……自己画一遍调用栈。',
        memory_template: '${name}在提示下理解了递归回溯',
      },
      thoughtful_fail: {
        emotional_tone: 'strict_mentoring',
        must_mention: ['递归调用链', '手动展开'],
        relationship_goal: '她的严格是在帮你',
        template: '递归调用链：f(5)→f(4)→f(3)→f(2)→f(1)→f(0)。{pause:300}手动展开每一层。做完了再来找我。',
        memory_template: '${name}还不能独立理解递归',
      },
      careless_fail: {
        emotional_tone: 'cold_push',
        must_mention: ['递归这个概念还没吃透', '不能靠猜'],
        relationship_goal: '不放水但不放弃你',
        template: '递归这个概念你还没吃透。{pause:300}不能靠猜。……把 factorial(3) 的每一步写在纸上，明天交给我。',
        memory_template: '${name}在递归上仍然困难',
      },
    },
  },

  ch3_function_order: {
    knowledge_point: '函数定义在调用之前 · 代码依赖顺序',
    common_mistakes: ['先调用后定义', '函数体缩进错误'],
    ayase: {
      solo_pass: {
        emotional_tone: 'impressed_rival',
        must_mention: ['先定义再调用', '顺序对了'],
        relationship_goal: '一起进步的快乐',
        template: '嘿！先 def 再调用——排对了！{pause:200}好吧好吧你行！',
        memory_template: '${name}掌握了函数定义顺序',
      },
      assisted_pass: {
        emotional_tone: 'playful',
        must_mention: ['要定义了才能用', '提示了就记住'],
        relationship_goal: '轻松学习氛围',
        template: '得先做出蛋糕才能吃嘛——{pause:200}函数也是，得先 def 才能调用！记住啦！',
        memory_template: '${name}在提示下理解了函数要先定义',
      },
      thoughtful_fail: {
        emotional_tone: 'supportive_energy',
        must_mention: ['函数要先存在才能被调用', '再试一次'],
        relationship_goal: '不嘲笑失败',
        template: '函数得先存在啊——{pause:200}就像你得先到教室才能听课！来，再试一次！',
        memory_template: '${name}还需要理解函数定义的顺序',
      },
      careless_fail: {
        emotional_tone: 'direct_reminder',
        must_mention: ['执行顺序又搞混了', '这个得刻进脑子'],
        relationship_goal: '直率但不伤人',
        template: '哎呀，执行顺序又搞混了！{pause:200}先 def，再调用——这个得刻进脑子里！我帮你记！',
        memory_template: '${name}又搞混了代码顺序',
      },
    },
  },

  ch3_murasame_gate: {
    knowledge_point: '斐波那契数列 · while 循环生成序列',
    common_mistakes: ['忘记从 0 开始', '搞混 < 和 <='],
    murasame: {
      solo_pass: {
        emotional_tone: 'grudging_respect',
        must_mention: ['斐波那契从 0 开始', '算你有点意思'],
        relationship_goal: '赢得她的初步认可',
        template: '……还行。{pause:300}至少你知道斐波那契从 0 开始。含金量……勉强够看。',
        memory_template: '${name}通过了我的斐波那契考验',
      },
      assisted_pass: {
        emotional_tone: 'dismissive_but_noting',
        must_mention: ['用了提示', '实力还不够'],
        relationship_goal: '让他想变得更强',
        template: '用了提示？{pause:300}那不算。……不过至少你愿意做。比大多数人强一点点。',
        memory_template: '${name}在提示下通过了考验',
      },
      thoughtful_fail: {
        emotional_tone: 'cold_evaluation',
        must_mention: ['a, b = b, a+b', '回去自己跑一遍'],
        relationship_goal: '高压但留了线索',
        template: 'a, b = b, a+b。{pause:300}回去自己跑一遍。……我不会再说第二次。',
        memory_template: '${name}没通过我的考验，但他敢来挑战',
      },
      careless_fail: {
        emotional_tone: 'harsh_disappointment',
        must_mention: ['斐波那契这种基础', '浪费时间'],
        relationship_goal: '刺激他去证明自己',
        template: '就这种水平？{pause:300}斐波那契都不会……别浪费我的时间。{pause:500}……除非你回去练好了再来。',
        memory_template: '${name}让我失望了，但我说了让他再来',
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // Nene 线
  // ═══════════════════════════════════════════════════════════════

  nene_if_else: {
    knowledge_point: 'if-elif-else 多分支判断',
    common_mistakes: ['忘记 if 关键字', '混淆 if 和 elif 的位置'],
    nene: {
      solo_pass: {
        emotional_tone: 'beaming',
        must_mention: ['if-elif-else', '多分支判断'],
        relationship_goal: '她为你的进步由衷高兴',
        template: '对了！{pause:200}if-elif-else，多分支判断的标准写法～你已经很厉害了呢！',
        memory_template: '${name}掌握了多分支判断',
      },
      assisted_pass: {
        emotional_tone: 'soft_teaching',
        must_mention: ['if 是起始关键字', '一步步来'],
        relationship_goal: '耐心陪伴',
        template: 'if 是条件判断的第一步呢。{pause:200}一步步来，你做到了！',
        memory_template: '${name}在引导下学会了 if-elif-else',
      },
      thoughtful_fail: {
        emotional_tone: 'tender_comfort',
        must_mention: ['if 开头 elif 接着 else 兜底', '不难的'],
        relationship_goal: '消除畏难情绪',
        template: 'if 开头，elif 接着检查，else 兜底……{pause:200}不难的，我们一起梳理一遍？',
        memory_template: '${name}在条件判断上需要更多练习',
      },
      careless_fail: {
        emotional_tone: 'caring_firmness',
        must_mention: ['条件判断的基础语法', '多写几遍'],
        relationship_goal: '温柔地推动',
        template: '条件判断的语法又忘了呢……{pause:200}要不我们一起多写几个例子？写着写着就记住了的！',
        memory_template: '${name}反复忘记条件判断语法',
      },
    },
  },

  nene_try_except: {
    knowledge_point: 'if-elif 从上到下依次检查 · 短路逻辑',
    common_mistakes: ['不理解从上到下的检查顺序', '忽略 elif 的前提条件'],
    nene: {
      solo_pass: {
        emotional_tone: 'proud_teacher',
        must_mention: ['从上到下依次检查', '前一个条件不成立才检查下一个'],
        relationship_goal: '教学成果的喜悦',
        template: '正确！{pause:200}if-elif 是从上到下依次检查的呢～前面不成立才会看后面！你理解得真好！',
        memory_template: '${name}理解了条件判断的检查顺序',
      },
      assisted_pass: {
        emotional_tone: 'patient_walkthrough',
        must_mention: ['用户名先检查', '密码后检查'],
        relationship_goal: '一步步带你走通',
        template: '先看用户名对不对，再看密码……{pause:200}从上到下，一个一个检查哦～',
        memory_template: '${name}在引导下理解了检查顺序',
      },
      thoughtful_fail: {
        emotional_tone: 'gentle_analysis',
        must_mention: ['先判断用户名 再判断密码', '用排除法'],
        relationship_goal: '教他分析方法',
        template: '我们一起排除看看？{pause:200}用户名是 admin，所以第一个 if 不成立……然后呢？',
        memory_template: '${name}需要学习条件分析方法',
      },
      careless_fail: {
        emotional_tone: 'soft_worry',
        must_mention: ['条件检查顺序还不熟', '多读代码'],
        relationship_goal: '关心他的学习状态',
        template: '条件检查的顺序还不太熟呢……{pause:200}要不要一起读几段别人写的代码？看多了就自然懂了。',
        memory_template: '${name}在条件检查上仍然不熟练',
      },
    },
  },

  nene_comments: {
    knowledge_point: '** 幂运算符',
    common_mistakes: ['用 ^ 代替 **', '不知道 ** 是幂运算'],
    nene: {
      solo_pass: {
        emotional_tone: 'delighted_surprise',
        must_mention: ['** 幂运算符', '不是 ^'],
        relationship_goal: '分享发现的喜悦',
        template: '找到了！{pause:200}** 是 Python 的幂运算符呢～不是 ^ 哦！你好厉害！',
        memory_template: '${name}知道 ** 是幂运算符',
      },
      assisted_pass: {
        emotional_tone: 'warm_reminder',
        must_mention: ['两个星号', '平方'],
        relationship_goal: '让知识点和好感绑定',
        template: '两个星号 ** 就是幂运算哦～{pause:200}height ** 2 就是身高的平方呢！',
        memory_template: '${name}在提示下记住了幂运算符',
      },
      thoughtful_fail: {
        emotional_tone: 'understanding',
        must_mention: ['很多人会以为是 ^', 'Python 的 ^ 是位运算'],
        relationship_goal: '解释为什么容易搞错',
        template: '很多人都以为 ^ 是幂运算呢……{pause:200}其实 Python 里 ^ 是别的功能，幂运算要用 ** 哦～',
        memory_template: '${name}把 ^ 当成了幂运算',
      },
      careless_fail: {
        emotional_tone: 'gentle_persistence',
        must_mention: ['幂运算符又忘了', '写在便签上'],
        relationship_goal: '陪他反复记忆',
        template: '幂运算符又忘记了呢……{pause:200}** 两个星星，像夜空一样好记～下次一定能想起来的！',
        memory_template: '${name}又忘记了 ** 运算符',
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // Yoshino 线
  // ═══════════════════════════════════════════════════════════════

  yoshino_refactor: {
    knowledge_point: '代码组织顺序 · 数据→逻辑→输出',
    common_mistakes: ['先输出后计算', '变量定义在使用之后'],
    yoshino: {
      solo_pass: {
        emotional_tone: 'satisfied_nod',
        must_mention: ['数据→逻辑→输出', '基本规范'],
        relationship_goal: '建立代码规范的信任',
        template: '很好。{pause:200}数据定义→逻辑计算→结果输出，这是基本规范。……你开始有规范意识了。',
        memory_template: '${name}展现了良好的代码规范意识',
      },
      assisted_pass: {
        emotional_tone: 'cool_instruction',
        must_mention: ['依赖顺序', '规范不是建议'],
        relationship_goal: '让她的标准成为他的习惯',
        template: '按依赖顺序排列。{pause:200}……规范不是建议，是要求。记住了？',
        memory_template: '${name}在提示下排对了代码顺序',
      },
      thoughtful_fail: {
        emotional_tone: 'stern_teaching',
        must_mention: ['先有数据才能计算', '写代码前先想结构'],
        relationship_goal: '教他工程思维',
        template: '先有数据才能计算，先有结果才能输出。{pause:300}……写代码前先想清楚结构。',
        memory_template: '${name}需要训练代码结构思维',
      },
      careless_fail: {
        emotional_tone: 'genuine_frustration',
        must_mention: ['代码顺序还是乱的', '代码审查不通过'],
        relationship_goal: '她的在意表现为严格',
        template: '代码顺序还是乱的。{pause:300}……如果这是代码审查，不通过。回去重排。',
        memory_template: '${name}的代码结构问题让我不安',
      },
    },
  },

  yoshino_boundary: {
    knowledge_point: '边界值测试 · "大于" vs "大于等于"',
    common_mistakes: ['忽略等号边界', '不验证临界值'],
    yoshino: {
      solo_pass: {
        emotional_tone: 'impressed_precision',
        must_mention: ['边界值', '一字之差'],
        relationship_goal: '她对精确性的认同',
        template: '边界值测试的精髓就在于此。{pause:200}"大于"和"大于等于"——一字之差。……你注意到了。',
        memory_template: '${name}准确识别了边界值问题',
      },
      assisted_pass: {
        emotional_tone: 'grudging_pass',
        must_mention: ['1+2=3 不大于 3', '边界值需要敏感度'],
        relationship_goal: '培养他的严谨性',
        template: '1 + 2 = 3，等于但不大于。{pause:200}……边界值需要敏感度。下次自己想到。',
        memory_template: '${name}在提示下理解了边界值',
      },
      thoughtful_fail: {
        emotional_tone: 'methodical_correction',
        must_mention: ['临界值验证', '代入 1,2,3 检查'],
        relationship_goal: '教他测试方法',
        template: '遇到不确定的选项就代入检验。{pause:300}1 + 2 > 3？不大于。……这就是边界值测试。',
        memory_template: '${name}还不习惯做边界检查',
      },
      careless_fail: {
        emotional_tone: 'cold_disappointment',
        must_mention: ['边界值问题又犯了', '测试习惯'],
        relationship_goal: '激发他的自我要求',
        template: '边界值问题……又犯了。{pause:300}没有测试习惯的程序员，写的代码我不放心。',
        memory_template: '${name}反复忽略边界情况',
      },
    },
  },

  yoshino_pair: {
    knowledge_point: 'in 关键字 · 字典键检查',
    common_mistakes: ['不知道 in 可以检查字典', '用 == 逐个比较'],
    yoshino: {
      solo_pass: {
        emotional_tone: 'subtle_warmth',
        must_mention: ['in 检查字典键', '简洁的写法'],
        relationship_goal: '她欣赏简洁的代码',
        template: '……不错。{pause:200}in 检查字典中是否存在该键。简洁明了。……继续保持。',
        memory_template: '${name}写出了简洁的字典查询',
      },
      assisted_pass: {
        emotional_tone: 'instructive',
        must_mention: ['in 是成员检查', '字典用 in 查键'],
        relationship_goal: '扩展他的知识面',
        template: 'in 是成员检查关键字。{pause:200}用在字典上就是检查键是否存在。……基础但重要。',
        memory_template: '${name}在提示下学会了 in 查字典',
      },
      thoughtful_fail: {
        emotional_tone: 'concise_correction',
        must_mention: ['in 关键字', '不需要遍历'],
        relationship_goal: '教他 Pythonic 的写法',
        template: 'Python 有个关键字叫 in。{pause:200}直接写 if x in dict 就行。……不需要遍历。',
        memory_template: '${name}还不熟悉 in 的用法',
      },
      careless_fail: {
        emotional_tone: 'terse_push',
        must_mention: ['in 说过了', '总结一下 in 的用法'],
        relationship_goal: '推他去主动总结',
        template: 'in 这个关键字……我们不是讲过吗。{pause:300}回去总结一下 in 在列表、字符串、字典里分别怎么用。',
        memory_template: '${name}反复忘记 in 的用法',
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // Ayase 线
  // ═══════════════════════════════════════════════════════════════

  ayase_find_bug: {
    knowledge_point: '+= 累加 vs = 覆盖赋值',
    common_mistakes: ['混淆 = 和 +=', '不理解覆盖赋值的后果'],
    ayase: {
      solo_pass: {
        emotional_tone: 'excited_praise',
        must_mention: ['+= 累加', '找到 Bug 了'],
        relationship_goal: '一起 Debug 的成就感',
        template: '找到了！{pause:200}应该用 += 累加！你真是 Bug 猎人！……可恶，我也该一眼看出来的！',
        memory_template: '${name}一眼就找到了 Bug',
      },
      assisted_pass: {
        emotional_tone: 'encouraging_partner',
        must_mention: ['= 每次覆盖', '+= 累加'],
        relationship_goal: '陪伴感',
        template: '看出来了吧？= 每次都覆盖旧值，+= 才是累加！{pause:200}Debug 就是这样一步步找的～',
        memory_template: '${name}在提示下找到了 Bug',
      },
      thoughtful_fail: {
        emotional_tone: 'buddy_comfort',
        must_mention: ['最终值是 10 而不是 30', '覆盖 vs 累加'],
        relationship_goal: '一起面对困难',
        template: '结果是 10 不是 30——为什么？{pause:200}因为 = 每次覆盖！换成 += 就对了！我们一起记住！',
        memory_template: '${name}没找到 Bug 但我们一起分析了',
      },
      careless_fail: {
        emotional_tone: 'playful_scold',
        must_mention: ['= 和 += 又搞混了', '多做 Debug 练习'],
        relationship_goal: '不嫌弃但直说',
        template: '= 和 += 又搞混了！{pause:200}这可是经典 Bug 啊！……好吧，我们多做几道 Debug 题练练眼力！',
        memory_template: '${name}又混淆了 = 和 +=',
      },
    },
  },

  ayase_game_logic: {
    knowledge_point: 'elif 多分支 · 计算器逻辑',
    common_mistakes: ['忘记 elif', '写成多个 if'],
    ayase: {
      solo_pass: {
        emotional_tone: 'happy_surprise',
        must_mention: ['elif', '多分支'],
        relationship_goal: '互相激励',
        template: '哈！elif 就是"否则如果"！{pause:200}你比我反应快……可恶！',
        memory_template: '${name}快速答对了 elif',
      },
      assisted_pass: {
        emotional_tone: 'teasing_warmth',
        must_mention: ['elif = else if', '多分支判断'],
        relationship_goal: '轻松学习',
        template: 'elif 就是 else if 的缩写啦！{pause:200}用了提示嘛……下次我们比速度！',
        memory_template: '${name}在提示下记住了 elif',
      },
      thoughtful_fail: {
        emotional_tone: 'supportive',
        must_mention: ['已经有 if 了', '后面的条件用 elif'],
        relationship_goal: '不让他气馁',
        template: '第一个用 if，后面的条件就用 elif！{pause:200}简单吧？我第一次也搞混过！',
        memory_template: '${name}还在学习 elif 的使用',
      },
      careless_fail: {
        emotional_tone: 'impatient_care',
        must_mention: ['elif 又忘了', '多分支的基础'],
        relationship_goal: '着急但不放弃',
        template: 'elif 又忘了！{pause:200}好啦好啦，if-elif-else，跟着我念三遍！',
        memory_template: '${name}反复忘记 elif',
      },
    },
  },

  ayase_final_race: {
    knowledge_point: '约瑟夫环 · 循环与模运算',
    common_mistakes: ['索引计算错误', '不理解 % len 取模'],
    ayase: {
      solo_pass: {
        emotional_tone: 'thrilled_respect',
        must_mention: ['约瑟夫环', '循环淘汰'],
        relationship_goal: '并肩挑战的巅峰感',
        template: '约瑟夫环！你排对了！！{pause:200}最后留下的是 D！我们太强了！',
        memory_template: '${name}和我一起攻克了约瑟夫环',
      },
      assisted_pass: {
        emotional_tone: 'hyped',
        must_mention: ['初始化→索引→循环→淘汰', '配合默契'],
        relationship_goal: '团队感',
        template: '用了提示但做出来了！{pause:200}初始化→设索引→循环淘汰！我们配合还不错嘛！',
        memory_template: '${name}在我的提示下做出了约瑟夫环',
      },
      thoughtful_fail: {
        emotional_tone: 'fired_up_comfort',
        must_mention: ['先初始化 再循环', '取模保证不越界'],
        relationship_goal: '失败后一起再战',
        template: '没事！约瑟夫环本来就难！{pause:200}关键是 (index + 2) % len 保证不越界——我们再来一次！',
        memory_template: '${name}在约瑟夫环上暂时失败了',
      },
      careless_fail: {
        emotional_tone: 'stern_motivation',
        must_mention: ['算法题不能靠蒙', '静下心分析'],
        relationship_goal: '推他认真对待',
        template: '算法题不能靠蒙！{pause:200}……静下心来，一步步分析。我在旁边看着你。',
        memory_template: '${name}在算法题上态度不够认真',
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // Kanna 线
  // ═══════════════════════════════════════════════════════════════

  kanna_recursion: {
    knowledge_point: '递归调用次数 · 递归深度 = n+1',
    common_mistakes: ['少数了初始调用', '不理解递归终止'],
    kanna: {
      solo_pass: {
        emotional_tone: 'warm_acknowledgment',
        must_mention: ['5 次', 'n+1'],
        relationship_goal: '默契感',
        template: '……5 次。{pause:400}n+1 次调用。{pause:400}……你理解递归了。',
        memory_template: '${name}理解了递归的调用深度',
      },
      assisted_pass: {
        emotional_tone: 'quiet_guide',
        must_mention: ['f(4)→f(3)→...→f(0)', '数一数'],
        relationship_goal: '她用最少的话帮你',
        template: '……f(4)→f(3)→f(2)→f(1)→f(0)。{pause:600}数一数。',
        memory_template: '${name}在引导下数出了递归深度',
      },
      thoughtful_fail: {
        emotional_tone: 'gentle_nudge',
        must_mention: ['包括初始调用', '画调用链'],
        relationship_goal: '指引方向',
        template: '……初始调用也算一次。{pause:800}画出来。{pause:400}……从 f(4) 开始。',
        memory_template: '${name}在递归深度上需要更多练习',
      },
      careless_fail: {
        emotional_tone: 'rare_concern',
        must_mention: ['递归深度', '基础概念'],
        relationship_goal: '她罕见的多说一句',
        template: '……递归深度。{pause:600}基础概念。{pause:400}……别跳过。',
        memory_template: '${name}在递归基础上仍有困难',
      },
    },
  },

  kanna_star_pattern: {
    knowledge_point: '*= 复合赋值 · 符号交替',
    common_mistakes: ['用 += 而不是 *=', '不理解符号翻转'],
    kanna: {
      solo_pass: {
        emotional_tone: 'aesthetic_appreciation',
        must_mention: ['sign *= -1', '优雅'],
        relationship_goal: '对数学美感的共鸣',
        template: '……优雅。{pause:600}sign *= -1。{pause:400}……像数学一样美。',
        memory_template: '${name}欣赏了符号交替的数学之美',
      },
      assisted_pass: {
        emotional_tone: 'minimal_hint',
        must_mention: ['乘以 -1', '正负交替'],
        relationship_goal: '精准提示',
        template: '……乘以 -1。{pause:600}1 变 -1。-1 变 1。{pause:400}……交替。',
        memory_template: '${name}在提示下理解了符号交替',
      },
      thoughtful_fail: {
        emotional_tone: 'patient_repetition',
        must_mention: ['*= 和 += 不同', '乘法可以翻转符号'],
        relationship_goal: '重复要点',
        template: '……*= 不是 +=。{pause:800}乘 -1……符号翻转。{pause:400}……想一想。',
        memory_template: '${name}混淆了 *= 和 +=',
      },
      careless_fail: {
        emotional_tone: 'quiet_disappointment',
        must_mention: ['复合赋值符号', '多练'],
        relationship_goal: '用沉默表达在意',
        template: '……{pause:800}复合赋值。{pause:600}……多练。',
        memory_template: '${name}在复合赋值上反复出错',
      },
    },
  },

  kanna_search: {
    knowledge_point: '字典计数 · 字符串 split · 遍历统计',
    common_mistakes: ['数错出现次数', '不理解字典累加'],
    kanna: {
      solo_pass: {
        emotional_tone: 'pleased_nod',
        must_mention: ['2', 'O(n)'],
        relationship_goal: '思维上的同频',
        template: '……2。{pause:400}O(n) 遍历一次即可。{pause:600}……嗯。',
        memory_template: '${name}准确统计了词频',
      },
      assisted_pass: {
        emotional_tone: 'brief_explanation',
        must_mention: ['数一数 to 出现几次', '字典累加'],
        relationship_goal: '简洁指引',
        template: '……数一数。{pause:600}"to"……两次。{pause:400}字典。累加。',
        memory_template: '${name}在提示下完成了词频统计',
      },
      thoughtful_fail: {
        emotional_tone: 'calm_correction',
        must_mention: ['to 在句中出现两次', '手动数'],
        relationship_goal: '引导他回到基础',
        template: '……"to be or not to be"。{pause:600}to……1……{pause:400}2。{pause:400}手动数。',
        memory_template: '${name}在词频统计上还需练习',
      },
      careless_fail: {
        emotional_tone: 'slight_sigh',
        must_mention: ['仔细读题', '不能猜'],
        relationship_goal: '她的在意藏在叹息里',
        template: '……{pause:600}仔细读。{pause:800}不能猜。',
        memory_template: '${name}在简单统计上粗心了',
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // Murasame 线
  // ═══════════════════════════════════════════════════════════════

  murasame_optimize: {
    knowledge_point: '% 26 字母表循环 · 凯撒密码完整实现',
    common_mistakes: ['不知道英文有 26 个字母', '忘记取模导致越界'],
    murasame: {
      solo_pass: {
        emotional_tone: 'begrudging_approval',
        must_mention: ['% 26', '字母表循环'],
        relationship_goal: '她开始正视你的能力',
        template: '……不错。{pause:300}% 26 实现字母表循环。{pause:200}你总算开窍了。',
        memory_template: '${name}独立实现了凯撒密码',
      },
      assisted_pass: {
        emotional_tone: 'unimpressed',
        must_mention: ['26 个字母', '提示了才想到'],
        relationship_goal: '激励他不依赖提示',
        template: '26 个字母都需要提示？{pause:300}……行吧，至少你最后做出来了。不够。',
        memory_template: '${name}在提示下完成了凯撒密码',
      },
      thoughtful_fail: {
        emotional_tone: 'cold_instruction',
        must_mention: ['英文 26 个字母', '取模防越界'],
        relationship_goal: '留作业',
        template: '英文有 26 个字母。% 26 防止越界。{pause:300}……回去自己实现一遍大小写都支持的版本。',
        memory_template: '${name}没完成凯撒密码，我布置了加强版',
      },
      careless_fail: {
        emotional_tone: 'scathing',
        must_mention: ['连字母有几个都不确定', '别在我面前浪费时间'],
        relationship_goal: '高压刺激',
        template: '连英文有几个字母都不确定？{pause:300}……回去。练好了再来。{pause:500}别浪费我和你的时间。',
        memory_template: '${name}在基础知识上让我很失望',
      },
    },
  },

  murasame_merge: {
    knowledge_point: 'dict.get() 计数技巧 · sorted() 排序',
    common_mistakes: ['不会用 dict.get(key, 0)', '字典遍历顺序'],
    murasame: {
      solo_pass: {
        emotional_tone: 'acknowledging',
        must_mention: ['dict.get()', '优雅的计数'],
        relationship_goal: '技术上的认可',
        template: '配合得不错。{pause:300}dict.get() 是处理计数的优雅方式。……有点意思。',
        memory_template: '${name}展示了优雅的字典计数能力',
      },
      assisted_pass: {
        emotional_tone: 'neutral_pass',
        must_mention: ['get 的默认值参数', '基本技巧'],
        relationship_goal: '点到为止',
        template: 'dict.get(key, 0)，0 是默认值。{pause:300}……基本技巧。记住就行。',
        memory_template: '${name}在提示下学会了 dict.get()',
      },
      thoughtful_fail: {
        emotional_tone: 'terse_teaching',
        must_mention: ['数据→字典→计数→输出', '别想复杂'],
        relationship_goal: '教他拆解问题',
        template: '数据→空字典→遍历计数→排序输出。{pause:300}别想复杂了。一步一步来。',
        memory_template: '${name}需要学习拆解问题的能力',
      },
      careless_fail: {
        emotional_tone: 'dismissive_worry',
        must_mention: ['字典操作不熟', '回去补基础'],
        relationship_goal: '担心但用冷淡掩饰',
        template: '字典操作都不熟……{pause:300}回去补基础。{pause:500}……别让我白费口舌。',
        memory_template: '${name}字典基础薄弱',
      },
    },
  },

  murasame_final: {
    knowledge_point: '多条件逻辑判断 · and 运算 · 短路求值',
    common_mistakes: ['忽略 and 的所有条件', '只看总分不看单科'],
    murasame: {
      solo_pass: {
        emotional_tone: 'rare_warmth',
        must_mention: ['逻辑运算', '单科不及格'],
        relationship_goal: '她第一次真正认可你',
        template: '条件判断的关键在于逻辑运算的短路特性。{pause:300}有一半是你的。……{pause:500}好吧，全部。',
        memory_template: '${name}征服了最终挑战，我承认他有实力',
      },
      assisted_pass: {
        emotional_tone: 'measured_pass',
        must_mention: ['所有条件都要满足', '用了提示'],
        relationship_goal: '最后关头的鼓励',
        template: 'and 运算要求所有条件都满足。{pause:300}用了提示……但你做到了。{pause:200}……还不够完美。',
        memory_template: '${name}在提示下通过了最终挑战',
      },
      thoughtful_fail: {
        emotional_tone: 'stern_but_open',
        must_mention: ['生物 50 < 60', '别被总分迷惑'],
        relationship_goal: '最后的指导',
        template: '生物 50，不及格。{pause:300}别被总分迷惑。{pause:500}……再想一次。我等你。',
        memory_template: '${name}在最终挑战中失败了，但我愿意等他',
      },
      careless_fail: {
        emotional_tone: 'disappointed_but_not_giving_up',
        must_mention: ['逻辑判断的基本功', '从头复习'],
        relationship_goal: '严厉中的不舍',
        template: '逻辑判断的基本功……还是不行。{pause:500}……回去从头复习。{pause:300}然后再来找我。',
        memory_template: '${name}在最终挑战中让我失望，但我说了让他再来',
      },
    },
  },
}

export function getPostChallengeEvent(challengeId, characterId, outcome) {
  const event = postChallengeEvents[challengeId]
  if (!event) return null
  const charEvents = event[characterId]
  if (!charEvents) return null
  const outcomeEvent = charEvents[outcome]
  if (!outcomeEvent) return null
  return {
    ...outcomeEvent,
    knowledge_point: event.knowledge_point,
    common_mistakes: event.common_mistakes,
  }
}
