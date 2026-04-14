export const challenges = {
  // =====================================================================
  // 序章 (2 题) — Python 基础入门
  // 来源: PPT 第二章
  // =====================================================================

  tutorial_01_hello_world: {
    id: 'tutorial_01_hello_world', title: '圆面积计算', chapter: 'prologue', difficulty: 1,
    type: 'multiple_choice', related_character: 'nene', knowledge_domain: 'basics',
    question: '已知圆的半径 r = 5，π = 3.1415，下面哪行代码能正确计算并输出圆的面积？',
    code_display: 'r = 5\npi = 3.1415',
    options: [
      'print(pi * r * r)',
      'print(pi + r + r)',
      'print(pi * r)',
      'print(r * r)'
    ],
    correct: 0,
    explanation: '圆的面积公式是 π × r²。在 Python 中 r * r 就是 r²，所以 pi * r * r 就能算出面积 78.5375。',
    hints: ['圆面积公式是什么？S = π × r × r', 'r² 在 Python 里可以写成 r * r'],
    success_affection: { nene: 3 },
    successText: '太棒了！你已经会用 Python 做数学计算了！夯爆了！',
    failText: '圆面积 = π × r²，在 Python 中写成 pi * r * r 哦~ 别急别急，再想想～'
  },

  tutorial_02_print: {
    id: 'tutorial_02_print', title: '人名对话', chapter: 'prologue', difficulty: 1,
    type: 'fill_blank', related_character: 'nene', knowledge_domain: 'strings',
    question: '补全代码，让程序正确输出名字的第一个字。\n已知 name = "小明"，name[0] 就是 "小"。',
    code_template: 'name = "小明"\nprint(name[_____], "大侠，学好 Python，前途无量")',
    blank_answer: '0', accept_alternatives: [],
    hints: ['Python 中字符串下标从几开始？', '第一个字符的下标是 0 哦！'],
    success_affection: { nene: 3 },
    successText: '完美！Python 的下标从 0 开始！',
    failText: 'Python 中字符串下标从 0 开始，name[0] 就是第一个字~'
  },

  // =====================================================================
  // 第一章 (3 题) — 变量、字符串、输入输出
  // 来源: PPT 第二/三章
  // =====================================================================

  ch1_variables: {
    id: 'ch1_variables', title: '个十百千', chapter: 1, difficulty: 1,
    type: 'multiple_choice', related_character: 'nene', knowledge_domain: 'basics',
    question: '以下代码执行后，变量 b 的值是什么？\n（提取四位数 1314 的百位数字）',
    code_display: 'n = 1314\na = n // 1000        # 千位\nb = n % 1000 // 100  # 百位\nc = n % 100 // 10    # 十位\nd = n % 10           # 个位',
    options: ['1', '3', '13', '4'],
    correct: 1,
    explanation: 'n % 1000 = 314，314 // 100 = 3。所以百位数字是 3。整除 // 和取余 % 是提取各位数字的关键运算。',
    hints: ['先想 1314 % 1000 等于多少？', '1314 % 1000 = 314，然后 314 // 100 = ?'],
    success_affection: { nene: 3 },
    successText: '正确！用 % 和 // 就能提取任何位上的数字！含金量还在升！',
    failText: '1314 % 1000 = 314，314 // 100 = 3，所以百位是 3。你细品～'
  },

  ch1_string_concat: {
    id: 'ch1_string_concat', title: '凯撒密码', chapter: 1, difficulty: 1,
    type: 'fill_blank', related_character: 'nene', knowledge_domain: 'strings',
    question: '凯撒密码：将字母向后移 3 位。补全代码，把大写字母 ch 向后移 3 位：',
    code_template: 'ch = "A"\ncode = ord(ch)  # 获取字符编码 65\nnew_code = code + 3\nnew_ch = _____(new_code)  # 将编码转回字符\nprint(new_ch)  # 输出 "D"',
    blank_answer: 'chr', accept_alternatives: [],
    hints: ['ord() 把字符变成数字，那什么函数把数字变回字符？', '是三个字母的函数，c-h-r'],
    success_affection: { nene: 3 },
    successText: '答对了！chr() 和 ord() 是一对互逆函数！',
    failText: 'chr() 函数可以把 Unicode 编码数字转回对应的字符~'
  },

  ch1_debug_ayase: {
    id: 'ch1_debug_ayase', title: '日期格式化', chapter: 1, difficulty: 2,
    type: 'code_order', related_character: 'ayase', knowledge_domain: 'debug',
    question: 'Ayase 想从 "2026-03-18 15:30:45" 中分别提取日期和时间，但代码顺序搞混了！排列正确顺序：',
    lines: [
      'print("日期：", date_part)',
      'date_part = dt.split(" ")[0]',
      'time_part = dt.split(" ")[1]',
      'dt = "2026-03-18 15:30:45"'
    ],
    correct_order: [3, 1, 2, 0],
    hints: ['先要有原始数据，才能对它做操作', '定义字符串 → 提取日期 → 提取时间 → 打印'],
    success_affection: { ayase: 5 },
    successText: '排列正确！先有数据，再分割提取！格局打开了！',
    failText: '正确顺序：先定义字符串，再 split 分割，最后打印。别急，再捋一遍～'
  },

  ch1_string_format: {
    id: 'ch1_string_format', title: '字符串格式化', chapter: 'chapter1', difficulty: 2,
    type: 'multiple_choice', related_character: 'nene', knowledge_domain: 'strings',
    question: '已知 name = "Nene"，age = 17，以下哪个能正确输出 "Nene今年17岁"？',
    options: [
      'print(f"{name}今年{age}岁")',
      'print(name + "今年" + age + "岁")',
      'print("name今年age岁")',
      'print(name, "今年", age, "岁")'
    ],
    correct: 0,
    explanation: 'f-string（f"..."）可以直接在花括号里嵌入变量。第二个选项会报错因为 age 是 int 不能直接和 str 拼接。',
    hints: ['f-string 是最推荐的格式化方式', '注意 int 和 str 不能直接用 + 拼接'],
  },

  ch1_type_convert: {
    id: 'ch1_type_convert', title: '类型转换', chapter: 'chapter1', difficulty: 1,
    type: 'fill_blank', related_character: 'yoshino', knowledge_domain: 'basics',
    question: 'input() 返回的是字符串。要把用户输入的数字转成整数，应该用什么函数？',
    code_template: 'age_str = input("你几岁？")\nage = _____(age_str)\nprint(age + 1)',
    correct_answer: 'int',
    accept_patterns: ['int'],
    explanation: 'int() 函数可以把字符串转成整数。类似地，float() 转浮点数，str() 转字符串。',
    hints: ['int 是 integer（整数）的缩写'],
  },

  ch1_variable_swap: {
    id: 'ch1_variable_swap', title: '变量交换', chapter: 'chapter1', difficulty: 2,
    type: 'multiple_choice', related_character: 'ayase', knowledge_domain: 'basics',
    question: '以下哪种方式可以正确交换两个变量 a 和 b 的值？',
    code_display: 'a = 10\nb = 20',
    options: [
      'a, b = b, a',
      'a = b; b = a',
      'swap(a, b)',
      'a == b; b == a'
    ],
    correct: 0,
    explanation: 'Python 支持元组解包交换：a, b = b, a。第二个选项会让 a 和 b 都变成 20。',
    hints: ['Python 的元组解包是一个很优雅的特性'],
  },

  // =====================================================================
  // 第二章 (4+3 题) — 循环与分支
  // 来源: PPT 第四章
  // =====================================================================

  ch2_for_loop: {
    id: 'ch2_for_loop', title: '自然数求和', chapter: 2, difficulty: 2,
    type: 'multiple_choice', related_character: 'yoshino', knowledge_domain: 'loops',
    question: '使用 for 循环计算 1 到 100 的自然数之和，结果是多少？',
    code_display: 'total = 0\nfor i in range(1, 101):\n    total += i\nprint(total)',
    options: ['4950', '5050', '5000', '10000'],
    correct: 1,
    explanation: '高斯公式：1+2+...+100 = (1+100)×100/2 = 5050。注意 range(1, 101) 包含 1 但不包含 101，所以是 1 到 100。',
    hints: ['range(1, 101) 产生 1, 2, 3, ..., 100', '有个著名的故事——高斯小时候怎么算的？'],
    success_affection: { yoshino: 3 },
    successText: '正确。range 的上界是开区间，这是基本知识。',
    failText: 'range(1, 101) 生成 1 到 100，总和是 5050。'
  },

  ch2_while_loop: {
    id: 'ch2_while_loop', title: '猜数字游戏', chapter: 2, difficulty: 2,
    type: 'fill_blank', related_character: 'kanna', knowledge_domain: 'loops',
    question: '补全猜数字游戏：当猜测不等于目标时继续循环，猜对时跳出：',
    code_template: 'target = 7\nguess = int(input("猜一个数："))\nwhile guess _____ target:\n    if guess > target:\n        print("太大")\n    else:\n        print("太小")\n    guess = int(input("再猜："))\nprint("恭喜，猜对了！")',
    blank_answer: '!=', accept_alternatives: ['!= '],
    hints: ['什么条件下要继续循环？猜错的时候', '"不等于"在 Python 中怎么写？'],
    success_affection: { kanna: 3 },
    successText: '……正确。!= 是不等于。',
    failText: '当 guess 不等于 target 时继续循环，不等于写作 !=。'
  },

  ch2_list_sort: {
    id: 'ch2_list_sort', title: '三角形图案', chapter: 2, difficulty: 2,
    type: 'code_order', related_character: 'ayase', knowledge_domain: 'loops',
    question: '用双重循环打印左下三角形 *（5行），排列正确代码顺序：',
    lines: [
      '        print("*", end="")',
      'for i in range(1, 6):',
      '    for j in range(i):',
      '    print()  # 换行'
    ],
    correct_order: [1, 2, 0, 3],
    hints: ['外层循环控制行数，内层循环控制每行星号数', 'range(i) 生成 0 到 i-1，刚好 i 个'],
    success_affection: { ayase: 3 },
    successText: '正确！外层控制行，内层控制列！',
    failText: '先外层 for → 内层 for → 打印 * → 换行。'
  },

  ch2_nested_loop: {
    id: 'ch2_nested_loop', title: '九九乘法表', chapter: 2, difficulty: 3,
    type: 'multiple_choice', related_character: 'yoshino', knowledge_domain: 'loops',
    question: '这段九九乘法表代码中，内层循环 range(1, i+1) 的作用是什么？',
    code_display: 'for i in range(1, 10):\n    for j in range(1, i+1):\n        print(f"{j}*{i}={i*j}", end=" ")\n    print()',
    options: [
      '让每行打印 i 个乘法算式',
      '让每行打印 9 个乘法算式',
      '让每行打印 1 个乘法算式',
      '控制乘法表的列数固定为 9'
    ],
    correct: 0,
    explanation: 'range(1, i+1) 在第 i 行生成 1 到 i，所以第 1 行打印 1 个算式、第 2 行打印 2 个……第 9 行打印 9 个，形成三角形结构。',
    hints: ['当 i=3 时，range(1, 4) 生成什么？', '想想乘法表为什么是三角形的'],
    success_affection: { yoshino: 5, murasame: 2 },
    successText: '完美理解。嵌套循环的关键在于内外层的依赖关系。',
    failText: 'range(1, i+1) 让第 i 行只打印 i 个算式，形成三角形。'
  },

  ch2_while_loop: {
    id: 'ch2_while_loop', title: 'while 循环', chapter: 'chapter2', difficulty: 2,
    type: 'multiple_choice', related_character: 'ayase', knowledge_domain: 'loops',
    question: '以下 while 循环执行几次？\n\ncount = 0\nwhile count < 3:\n    print(count)\n    count += 1',
    code_display: 'count = 0\nwhile count < 3:\n    print(count)\n    count += 1',
    options: ['3 次', '4 次', '2 次', '无限次'],
    correct: 0,
    explanation: 'count 从 0 开始，每次 +1。当 count 为 0、1、2 时条件成立，共 3 次。count 变成 3 时循环结束。',
  },

  ch2_break_continue: {
    id: 'ch2_break_continue', title: 'break 和 continue', chapter: 'chapter2', difficulty: 2,
    type: 'multiple_choice', related_character: 'kanna', knowledge_domain: 'loops',
    question: '以下代码输出什么？',
    code_display: 'for i in range(5):\n    if i == 2:\n        continue\n    if i == 4:\n        break\n    print(i)',
    options: ['0 1 3', '0 1 2 3', '0 1 3 4', '0 1 2 3 4'],
    correct: 0,
    explanation: 'continue 跳过当前循环（跳过 2），break 终止循环（到 4 停止）。输出 0、1、3。',
    hints: ['continue 是跳过本次，break 是退出整个循环'],
  },

  ch2_elif: {
    id: 'ch2_elif', title: 'elif 多分支', chapter: 'chapter2', difficulty: 2,
    type: 'fill_blank', related_character: 'nene', knowledge_domain: 'conditionals',
    question: '补全代码，让分数 80-89 输出 "良好"。',
    code_template: 'score = 85\nif score >= 90:\n    print("优秀")\n_____ score >= 80:\n    print("良好")\nelse:\n    print("继续努力")',
    correct_answer: 'elif',
    accept_patterns: ['elif'],
    explanation: 'elif 是 else if 的缩写，用于多条件分支。',
    hints: ['Python 中 else if 写成 elif'],
  },

  // =====================================================================
  // 第三章 (4 题) — 函数与模块化
  // 来源: PPT 第七章
  // =====================================================================

  ch3_function_def: {
    id: 'ch3_function_def', title: '几何面积函数', chapter: 3, difficulty: 2,
    type: 'fill_blank', related_character: 'nene', knowledge_domain: 'functions',
    question: '补全函数定义关键字，让这个计算矩形面积的函数能正常工作：',
    code_template: '_____ rect_area(width, height):\n    return width * height\n\nprint(rect_area(4, 7))  # 输出 28',
    blank_answer: 'def', accept_alternatives: [],
    hints: ['Python 中定义函数用什么关键字？', '三个字母，d-e-f'],
    success_affection: { nene: 3 },
    successText: '正确！def 是定义函数的关键字！',
    failText: 'Python 中用 def 关键字来定义函数哦~'
  },

  ch3_return_value: {
    id: 'ch3_return_value', title: '阶乘计算', chapter: 3, difficulty: 2,
    type: 'multiple_choice', related_character: 'yoshino', knowledge_domain: 'functions',
    question: '这个递归阶乘函数 factorial(5) 的返回值是多少？',
    code_display: 'def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))',
    options: ['5', '25', '120', '720'],
    correct: 2,
    explanation: 'factorial(5) = 5 × 4 × 3 × 2 × 1 × 1 = 120。递归在 n=0 时返回 1，然后逐层乘回来。',
    hints: ['5! = 5 × 4 × 3 × 2 × 1', '递归的基准情况是 n=0 返回 1'],
    success_affection: { yoshino: 3 },
    successText: '正确。5! = 120。递归的核心是基准条件和递推关系。',
    failText: '5! = 5×4×3×2×1 = 120。递归会一直调用直到 n=0。'
  },

  ch3_function_order: {
    id: 'ch3_function_order', title: '生日歌函数', chapter: 3, difficulty: 3,
    type: 'code_order', related_character: 'ayase', knowledge_domain: 'functions',
    question: '把生日歌函数的代码排列成正确顺序：',
    lines: [
      'happy_birthday("Alethicode")',
      'def happy_birthday(name):',
      '    print("Happy birthday, dear " + name + "!")',
      '    print("Happy birthday to you!")'
    ],
    correct_order: [1, 3, 2, 0],
    hints: ['函数定义要在调用之前', '先 def，再写函数体，最后调用'],
    success_affection: { ayase: 3 },
    successText: '正确！先定义函数，再调用它！',
    failText: '函数必须先 def 定义好，才能调用。'
  },

  ch3_murasame_gate: {
    id: 'ch3_murasame_gate', title: 'Murasame 的考验', chapter: 3, difficulty: 3,
    type: 'multiple_choice', related_character: 'murasame', knowledge_domain: 'advanced',
    question: '斐波那契数列中所有小于 100 的数有哪些？以下哪个序列是正确的？',
    code_display: 'def fib_under(n):\n    a, b = 0, 1\n    result = []\n    while a < n:\n        result.append(a)\n        a, b = b, a + b\n    return result\n\nprint(fib_under(100))',
    options: [
      '0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89',
      '1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89',
      '0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 100',
      '1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144'
    ],
    correct: 0,
    explanation: '斐波那契数列从 0, 1 开始，每个数等于前两个数之和：0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89。下一个是 144 ≥ 100，所以停止。',
    hints: ['斐波那契：a, b = b, a+b，从 0, 1 开始', '0→1→1→2→3→5→8→13→21→34→55→89→144(≥100，停)'],
    success_affection: { murasame: 10 },
    successText: '……还行。至少你知道斐波那契从 0 开始。含金量勉强够看。',
    failText: '就这种水平？倒反天罡了。斐波那契：0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89。'
  },

  // =====================================================================
  // Nene 线 (3 题) — 条件判断与异常
  // 来源: PPT 4.4, 4.9, 4.12
  // =====================================================================

  nene_if_else: {
    id: 'nene_if_else', title: '成绩等级判断', chapter: 'nene', difficulty: 2,
    type: 'fill_blank', related_character: 'nene', knowledge_domain: 'basics',
    question: '补全条件关键字，实现成绩等级判断：90 以上优秀，75-89 良好，60-74 及格，否则不及格：',
    code_template: 'score = 82\n_____ score >= 90:\n    print("优秀")\nelif score >= 75:\n    print("良好")\nelif score >= 60:\n    print("及格")\nelse:\n    print("不及格")',
    blank_answer: 'if', accept_alternatives: [],
    hints: ['Python 中条件判断的第一个关键字是什么？', '两个字母，i-f'],
    success_affection: { nene: 5 },
    successText: '对了！if-elif-else 是多分支判断的标准写法！',
    failText: 'if 是条件判断的起始关键字哦~'
  },

  nene_try_except: {
    id: 'nene_try_except', title: '用户登录验证', chapter: 'nene', difficulty: 3,
    type: 'multiple_choice', related_character: 'nene', knowledge_domain: 'basics',
    question: '这段登录验证代码，当用户名 "admin"、密码 "abc" 时，输出什么？',
    code_display: 'username = "admin"\npassword = "abc"\n\nif username != "admin":\n    print("用户名输入有误")\nelif password != "123456":\n    print("密码输入有误")\nelse:\n    print("登录成功")',
    options: ['登录成功', '用户名输入有误', '密码输入有误', '报错'],
    correct: 2,
    explanation: '用户名是 "admin"，第一个 if 为 False，跳过。密码是 "abc" ≠ "123456"，elif 为 True，输出"密码输入有误"。',
    hints: ['先判断用户名，再判断密码', '用户名正确但密码错误时会走哪个分支？'],
    success_affection: { nene: 5 },
    successText: '正确！if-elif 是从上到下依次检查的！',
    failText: '用户名正确所以跳过第一个 if，密码错误所以进入 elif。'
  },

  nene_comments: {
    id: 'nene_comments', title: 'BMI 计算', chapter: 'nene', difficulty: 2,
    type: 'fill_blank', related_character: 'nene', knowledge_domain: 'basics',
    question: '补全 BMI 计算公式。BMI = 体重(kg) ÷ 身高(m) 的平方：',
    code_template: 'height = 1.75\nweight = 75\nbmi = weight / (height _____ 2)\nprint(f"BMI数值为：{bmi:.2f}")  # 输出 24.49',
    blank_answer: '**', accept_alternatives: [],
    hints: ['Python 中求幂运算用什么符号？', '不是 ^ 哦，Python 中幂运算是两个星号 **'],
    success_affection: { nene: 5 },
    successText: '找到了！** 是 Python 的幂运算符！',
    failText: 'Python 中 ** 表示幂运算，height ** 2 就是 height 的平方。'
  },

  // =====================================================================
  // Yoshino 线 (3 题) — 代码规范与协作
  // 来源: PPT 7.6, 4.8, 7.7
  // =====================================================================

  yoshino_refactor: {
    id: 'yoshino_refactor', title: '订单生成重构', chapter: 'yoshino', difficulty: 3,
    type: 'code_order', related_character: 'yoshino', knowledge_domain: 'conventions',
    question: '将电子商务订单计算的代码重构为正确顺序：',
    lines: [
      'print(f"订单总金额: {total}")',
      'total = sum(cart[item] * prices[item] for item in cart)',
      'prices = {"苹果": 3, "香蕉": 2}',
      'cart = {"苹果": 5, "香蕉": 3}'
    ],
    correct_order: [2, 3, 1, 0],
    hints: ['先定义数据，再计算，最后输出', '必须先有价格和购物车，才能算总金额'],
    success_affection: { yoshino: 5 },
    successText: '很好。数据定义→逻辑计算→结果输出，这是基本规范。',
    failText: '代码要按依赖顺序排列：定义价格→定义购物车→计算→输出。'
  },

  yoshino_boundary: {
    id: 'yoshino_boundary', title: '三角形判断', chapter: 'yoshino', difficulty: 3,
    type: 'multiple_choice', related_character: 'yoshino', knowledge_domain: 'conventions',
    question: '判断三边能否构成三角形的条件是"任意两边之和大于第三边"。以下哪组边不能构成三角形？',
    code_display: 'def is_triangle(a, b, c):\n    return a+b>c and a+c>b and b+c>a',
    options: ['3, 4, 5', '5, 5, 8', '1, 2, 3', '7, 10, 12'],
    correct: 2,
    explanation: '1 + 2 = 3，不大于 3（只是等于），所以不满足"任意两边之和大于第三边"的条件，不能构成三角形。这就是典型的边界值问题。',
    hints: ['边界情况：当两边之和刚好等于第三边时呢？', '1 + 2 > 3 吗？'],
    success_affection: { yoshino: 5 },
    successText: '边界值测试的精髓就在于此。"大于"和"大于等于"一字之差。',
    failText: '1 + 2 = 3，等于但不大于，所以不能构成三角形。'
  },

  yoshino_pair: {
    id: 'yoshino_pair', title: '用户系统协作', chapter: 'yoshino', difficulty: 2,
    type: 'fill_blank', related_character: 'yoshino', knowledge_domain: 'conventions',
    question: '补全用户注册系统——检查用户名是否已存在：',
    code_template: 'users = {"alice": "pwd123", "bob": "pwd456"}\nnew_user = "charlie"\n\nif new_user _____ users:\n    print("用户名已存在!")\nelse:\n    print(f"用户 {new_user} 注册成功!")',
    blank_answer: 'in', accept_alternatives: [],
    hints: ['检查一个键是否在字典中，用什么关键字？', 'Python 中判断成员关系用 in'],
    success_affection: { yoshino: 5 },
    successText: '……不错。in 检查字典中是否存在该键。基础但重要。',
    failText: 'in 关键字可以检查字典中是否存在某个键。'
  },

  // =====================================================================
  // Ayase 线 (3 题) — Debug 与竞赛
  // 来源: PPT 4.15, 4.11, 5.1
  // =====================================================================

  ayase_find_bug: {
    id: 'ayase_find_bug', title: '偶数求和 Bug', chapter: 'ayase', difficulty: 2,
    type: 'multiple_choice', related_character: 'ayase', knowledge_domain: 'debug',
    question: '这段代码想计算 1~10 的偶数之和（应为 30），但结果不对。Bug 在第几行？',
    code_display: '1. total = 0\n2. for i in range(1, 11):\n3.     if i % 2 == 0:\n4.         total = i\n5. print(total)',
    options: ['第 2 行', '第 3 行', '第 4 行', '第 5 行'],
    correct: 2,
    explanation: '第 4 行应该是 total += i（累加），而不是 total = i（覆盖）。用 = 的话每次循环都会覆盖之前的值，最终 total 只等于最后一个偶数 10。',
    hints: ['最终结果是 10 而不是 30……为什么？', '是累加还是赋值？+= 和 = 的区别？'],
    success_affection: { ayase: 5 },
    successText: '找到了！应该用 += 累加而不是 = 覆盖！Bug 猎人上线！',
    failText: '第 4 行 total = i 每次覆盖旧值，应改为 total += i 累加。大冤种就是这么诞生的～'
  },

  ayase_game_logic: {
    id: 'ayase_game_logic', title: '简易计算器', chapter: 'ayase', difficulty: 3,
    type: 'fill_blank', related_character: 'ayase', knowledge_domain: 'debug',
    question: '补全这个计算器——当运算符是 * 时执行乘法：',
    code_template: 'a = 3\nop = "*"\nb = 4\nif op == "+":\n    print(a + b)\nelif op == "-":\n    print(a - b)\n_____ op == "*":\n    print(a * b)\nelif op == "/":\n    print(a / b)',
    blank_answer: 'elif', accept_alternatives: [],
    hints: ['这里已经有了 if 和一个 elif，接下来还需要什么？', '多分支判断中，第二个及以后的条件用 elif'],
    success_affection: { ayase: 5 },
    successText: '哈！elif 就是"否则如果"！简单但我经常漏掉！',
    failText: 'elif 是 else if 的缩写，用于多分支条件判断。'
  },

  ayase_final_race: {
    id: 'ayase_final_race', title: '击鼓传花', chapter: 'ayase', difficulty: 3,
    type: 'code_order', related_character: 'ayase', knowledge_domain: 'algorithms',
    question: '限时挑战！约瑟夫环问题——5 人围圈，每数到 3 淘汰一人。排列代码顺序：',
    lines: [
      '    players.pop(index)',
      'players = ["A", "B", "C", "D", "E"]',
      'index = 0',
      'while len(players) > 1:\n    index = (index + 2) % len(players)'
    ],
    correct_order: [1, 2, 3, 0],
    hints: ['先初始化数据，再设起始位置，然后循环淘汰', '每次数 3 个就是索引 +2（因为从 0 开始）'],
    success_affection: { ayase: 5 },
    successText: '约瑟夫环经典问题！最后留下的是 D！',
    failText: '初始化列表 → 设索引 → 循环计算淘汰位置 → 移除。'
  },

  // =====================================================================
  // Kanna 线 (3 题) — 递归与算法
  // 来源: PPT 7.10, 4.16, 6.1
  // =====================================================================

  kanna_recursion: {
    id: 'kanna_recursion', title: '阶乘之美', chapter: 'kanna', difficulty: 3,
    type: 'multiple_choice', related_character: 'kanna', knowledge_domain: 'algorithms',
    question: '递归计算 factorial(4) 时，函数被调用了几次（包括初始调用）？',
    code_display: 'def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)',
    options: ['3 次', '4 次', '5 次', '6 次'],
    correct: 2,
    explanation: '调用链：factorial(4) → factorial(3) → factorial(2) → factorial(1) → factorial(0)，共 5 次。递归深度 = n + 1。',
    hints: ['从 factorial(4) 开始，追踪每次递归调用', 'factorial(4)→factorial(3)→factorial(2)→factorial(1)→factorial(0)'],
    success_affection: { kanna: 5 },
    successText: '……5 次。n+1 次调用。你理解递归了。',
    failText: '从 factorial(4) 到 factorial(0)，共 5 次调用。'
  },

  kanna_star_pattern: {
    id: 'kanna_star_pattern', title: 'π 的近似', chapter: 'kanna', difficulty: 3,
    type: 'fill_blank', related_character: 'kanna', knowledge_domain: 'algorithms',
    question: '莱布尼茨公式：π/4 = 1 - 1/3 + 1/5 - 1/7 + ...\n补全代码中的符号交替：',
    code_template: 'pi_quarter = 0\nsign = 1\nfor i in range(1000):\n    pi_quarter += sign / (2 * i + 1)\n    sign _____ -1  # 每次符号取反\nprint(pi_quarter * 4)',
    blank_answer: '*=', accept_alternatives: ['*= '],
    hints: ['符号需要在 +1 和 -1 之间交替', '乘以 -1 就能让 1 变成 -1、-1 变成 1'],
    success_affection: { kanna: 5 },
    successText: '……优雅。sign *= -1 实现符号交替。像数学一样美。',
    failText: 'sign *= -1 让符号在 +1 和 -1 之间交替切换。'
  },

  kanna_search: {
    id: 'kanna_search', title: '词频统计', chapter: 'kanna', difficulty: 3,
    type: 'multiple_choice', related_character: 'kanna', knowledge_domain: 'algorithms',
    question: '这段词频统计代码处理 "to be or not to be" 后，word_count["to"] 的值是？',
    code_display: 'text = "to be or not to be"\nwords = text.lower().split()\nword_count = {}\nfor w in words:\n    if w in word_count:\n        word_count[w] += 1\n    else:\n        word_count[w] = 1',
    options: ['1', '2', '3', '0'],
    correct: 1,
    explanation: '"to be or not to be" 中 "to" 出现 2 次。字典 word_count 通过遍历单词列表，逐个计数。',
    hints: ['数一数 "to" 在句子中出现了几次', '"to be or not to be" 中 to 出现在开头和第五个位置'],
    success_affection: { kanna: 5 },
    successText: '……2。O(n) 遍历一次即可。',
    failText: '"to" 在 "to be or not to be" 中出现 2 次。'
  },

  // =====================================================================
  // Murasame 线 (3 题) — 高级综合
  // 来源: PPT 4.17, 5.4, 6.2
  // =====================================================================

  murasame_optimize: {
    id: 'murasame_optimize', title: '凯撒密码完整版', chapter: 'murasame', difficulty: 4,
    type: 'fill_blank', related_character: 'murasame', knowledge_domain: 'advanced',
    question: '实现完整凯撒加密——小写字母后移 3 位并循环（z→c）。补全取余运算：',
    code_template: 'def caesar(text):\n    result = ""\n    for ch in text:\n        if ch.islower():\n            new = chr((ord(ch) - ord("a") + 3) % _____ + ord("a"))\n            result += new\n        else:\n            result += ch\n    return result\n\nprint(caesar("hello, zoo"))  # khoor, crr',
    blank_answer: '26', accept_alternatives: [],
    hints: ['英文字母一共有多少个？', '26 个字母，所以用 % 26 保证循环回来'],
    success_affection: { murasame: 5 },
    successText: '……不错。% 26 实现字母表循环。你总算开窍了。',
    failText: '英文有 26 个字母，% 26 确保 z+3 能循环回 c。'
  },

  murasame_merge: {
    id: 'murasame_merge', title: '成绩统计合并', chapter: 'murasame', difficulty: 3,
    type: 'code_order', related_character: 'murasame', knowledge_domain: 'advanced',
    question: '将成绩等级统计的代码合并为正确顺序：',
    lines: [
      'for grade in sorted(count.keys()):\n    print(f"{grade}有{count[grade]}个")',
      'grades = ["A", "A", "B", "B", "F", "F", "B", "A", "B", "F"]',
      'count = {}',
      'for g in grades:\n    count[g] = count.get(g, 0) + 1'
    ],
    correct_order: [1, 2, 3, 0],
    hints: ['先有数据，再建字典，然后统计，最后输出', 'dict.get(key, default) 是字典计数的常用技巧'],
    success_affection: { murasame: 5 },
    successText: '配合得不错。dict.get() 是处理计数的优雅方式。',
    failText: '数据定义 → 空字典 → 遍历计数 → 排序输出。'
  },

  murasame_final: {
    id: 'murasame_final', title: '学科等级评定', chapter: 'murasame', difficulty: 4,
    type: 'multiple_choice', related_character: 'murasame', knowledge_domain: 'advanced',
    question: '学生成绩：编程 100, 生物 50, 科学 100。\n规则：三门≥85且总分≥260为优秀；生物和科学≥60且总分≥180为及格；否则不及格。\n该学生的等级是？',
    code_display: 'prog, bio, sci = 100, 50, 100\ntotal = prog + bio + sci  # 250\n\nif bio >= 85 and sci >= 85 and prog >= 85 and total >= 260:\n    level = "优秀"\nelif bio >= 60 and sci >= 60 and total >= 180:\n    level = "及格"\nelse:\n    level = "不及格"',
    options: ['优秀', '及格', '不及格', '报错'],
    correct: 2,
    explanation: '总分 250 ≥ 180，但生物 50 < 60，不满足"生物和科学都≥60"的及格条件，所以是"不及格"。编程再高也救不了单科不及格。',
    hints: ['先检查是否优秀（三门都≥85）——生物 50 不行', '再检查及格条件——生物 50 < 60，也不满足'],
    success_affection: { murasame: 10 },
    successText: '条件判断的关键在于逻辑运算的短路特性。有一半是你的。',
    failText: '生物 50 < 60，不满足及格条件中"生物≥60"的要求，所以不及格。'
  },

  // =====================================================================
  // teach_back 教学反转挑战
  // =====================================================================

  ch1_teach_back_nene: {
    id: 'ch1_teach_back_nene',
    type: 'teach_back',
    title: '教 Nene 理解循环',
    chapter: 1,
    difficulty: 1,
    related_character: 'nene',
    knowledge_domain: 'loops',
    concept: 'for 循环',
    concept_detail: 'for i in range(n) 的执行流程',
    character_ask_style: 'curious',
    prompt_text: '那个……for 循环到底是怎么一步步执行的呀？你能用我能理解的方式讲给我听吗？',
    evaluation_rubric: {
      accuracy_keywords: ['range', '重复', '每次', '变量', '递增'],
      good_analogies: ['心跳', '数数', '排队'],
      min_length: 20,
    },
    success_affection: { nene: 5 },
  },

  ch2_teach_back_yoshino: {
    id: 'ch2_teach_back_yoshino',
    type: 'teach_back',
    title: '向 Yoshino 解释异常处理',
    chapter: 2,
    difficulty: 2,
    related_character: 'yoshino',
    knowledge_domain: 'basics',
    concept: 'try-except 异常处理',
    concept_detail: 'try 块中代码出错时跳转到 except 块执行，程序不会崩溃',
    character_ask_style: 'demanding',
    prompt_text: '解释一下 try-except 的执行流程。要准确。',
    evaluation_rubric: {
      accuracy_keywords: ['try', 'except', '异常', '捕获', '错误', '不会崩溃'],
      good_analogies: ['安全网', '保险', '备用方案'],
      min_length: 30,
    },
    success_affection: { yoshino: 5 },
  },

  ch3_teach_back_kanna: {
    id: 'ch3_teach_back_kanna',
    type: 'teach_back',
    title: '给 Kanna 讲递归',
    chapter: 3,
    difficulty: 3,
    related_character: 'kanna',
    knowledge_domain: 'algorithms',
    concept: '递归',
    concept_detail: '函数调用自身来解决子问题，需要基准条件防止无限递归',
    character_ask_style: 'silent',
    prompt_text: '……递归。{pause:400}用你的话说。',
    evaluation_rubric: {
      accuracy_keywords: ['调用自身', '基准条件', '子问题', '终止', '返回'],
      good_analogies: ['俄罗斯套娃', '镜子', '剥洋葱', '楼梯'],
      min_length: 25,
    },
    success_affection: { kanna: 5 },
  },

  // =====================================================================
  // pair_debug 配对调试挑战
  // =====================================================================

  ch2_pair_debug_ayase: {
    id: 'ch2_pair_debug_ayase',
    type: 'pair_debug',
    title: '帮 Ayase 找 Bug',
    chapter: 2,
    difficulty: 2,
    related_character: 'ayase',
    knowledge_domain: 'loops',
    setup_dialogue: '看看这段代码，明明逻辑没问题啊，为什么跑出来是 4950 不是 5050？',
    buggy_code: 'total = 0\nfor i in range(100):\n    total += i\nprint(total)',
    bug_description: 'range(100) 生成 0-99 而非 1-100，应改为 range(1, 101)',
    bug_type: 'off_by_one',
    character_personality_in_bug: 'Ayase 性急，直接写 range(100) 没仔细想上界',
    evaluation_rubric: {
      must_identify: ['range', '0', '99', '1', '101'],
      bonus_if_kind: true,
    },
    success_affection: { ayase: 5 },
  },

  ch1_pair_debug_nene: {
    id: 'ch1_pair_debug_nene',
    type: 'pair_debug',
    title: '帮 Nene 找变量名错误',
    chapter: 1,
    difficulty: 1,
    related_character: 'nene',
    knowledge_domain: 'basics',
    setup_dialogue: '唔……我的代码跑出来的结果好奇怪，你能帮我看看吗？',
    buggy_code: 'name = "Alice"\nprint("Hello, " + Name)',
    bug_description: 'Python 区分大小写，name 和 Name 是不同变量，Name 未定义',
    bug_type: 'name_error',
    character_personality_in_bug: 'Nene 不小心把变量名的大小写搞混了',
    evaluation_rubric: {
      must_identify: ['大小写', 'Name', 'name', '区分'],
      bonus_if_kind: true,
    },
    success_affection: { nene: 3 },
  },

  ch3_pair_debug_yoshino: {
    id: 'ch3_pair_debug_yoshino',
    type: 'pair_debug',
    title: '帮 Yoshino 重构',
    chapter: 3,
    difficulty: 3,
    related_character: 'yoshino',
    knowledge_domain: 'conventions',
    setup_dialogue: '这段代码功能正确，但我觉得可以写得更好。你觉得哪里可以优化？',
    buggy_code: 'result = []\nfor i in range(10):\n    if i % 2 == 0:\n        result.append(i * i)\nprint(result)',
    bug_description: '可以用列表推导式简化为一行：result = [i*i for i in range(10) if i%2==0]',
    bug_type: 'refactor',
    character_personality_in_bug: 'Yoshino 知道有更好的写法，但想看玩家是否也知道',
    evaluation_rubric: {
      must_identify: ['列表推导式', '简化', 'list comprehension'],
      bonus_if_kind: false,
    },
    success_affection: { yoshino: 5 },
  },

  ch3_pair_debug_murasame: {
    id: 'ch3_pair_debug_murasame',
    type: 'pair_debug',
    title: 'Murasame 的陷阱',
    chapter: 3,
    difficulty: 4,
    related_character: 'murasame',
    knowledge_domain: 'advanced',
    setup_dialogue: '这段代码有 Bug。找到它。',
    buggy_code: 'def is_palindrome(s):\n    return s == s[::-1]\n\nprint(is_palindrome("racecar"))',
    bug_description: '这段代码其实是正确的。这是 Murasame 的测试——看玩家是否知道 s[::-1] 可以反转字符串',
    bug_type: 'trick_question',
    character_personality_in_bug: 'Murasame 故意给出正确代码来测试玩家是否真正理解',
    evaluation_rubric: {
      must_identify: ['正确', '没有Bug', '[::-1]', '反转'],
      bonus_if_kind: false,
    },
    success_affection: { murasame: 8 },
  },

  // =====================================================================
  // creative_code 创意编程挑战
  // =====================================================================

  ch3_creative_lantern: {
    id: 'ch3_creative_lantern',
    type: 'creative_code',
    title: '祭典灯笼图案',
    chapter: 3,
    difficulty: 2,
    related_character: 'ayase',
    knowledge_domain: 'loops',
    prompt: '写一个函数，用 * 和空格打印出一个灯笼形状的图案（至少5行）',
    starter_code: 'def draw_lantern():\n    # 在这里写你的代码\n    pass\n\ndraw_lantern()',
    evaluation: {
      must_run: true,
      min_output_lines: 5,
      creativity_keywords: ['对称', '渐变', '花纹'],
    },
    scene_integration: 'festival_decoration',
    success_affection: { ayase: 5 },
  },

  ch2_creative_heart: {
    id: 'ch2_creative_heart',
    type: 'creative_code',
    title: '爱心图案',
    chapter: 2,
    difficulty: 2,
    related_character: 'nene',
    knowledge_domain: 'loops',
    prompt: '用 print 和循环打印一个爱心形状的图案',
    starter_code: '# 用 * 和空格画一个爱心\nfor i in range(6):\n    # 你的代码\n    pass',
    evaluation: {
      must_run: true,
      min_output_lines: 4,
      creativity_keywords: ['对称', '心形', '创意'],
    },
    success_affection: { nene: 5 },
  },

  ch3_creative_fractal: {
    id: 'ch3_creative_fractal',
    type: 'creative_code',
    title: '分形树',
    chapter: 3,
    difficulty: 3,
    related_character: 'kanna',
    knowledge_domain: 'algorithms',
    prompt: '用递归和字符画出一个简单的分形图案（如谢尔宾斯基三角形或分形树）',
    starter_code: 'def fractal(n, prefix=""):\n    # 递归画分形\n    pass\n\nfractal(4)',
    evaluation: {
      must_run: true,
      min_output_lines: 3,
      creativity_keywords: ['递归', '自相似', '分形'],
    },
    success_affection: { kanna: 5 },
  },

  // =====================================================================
  // 兼容旧 ID — 重定向到新题
  // =====================================================================
  hello_world: {
    id: 'hello_world', title: '第一个程序', chapter: 'prologue', difficulty: 1,
    type: 'multiple_choice', related_character: 'nene', knowledge_domain: 'basics',
    question: '以下哪行代码可以正确输出 "Hello, World!"？',
    options: [
      { id: 'a', text: 'print("Hello, World!")', correct: true },
      { id: 'b', text: 'echo "Hello, World!"', correct: false },
      { id: 'c', text: 'console.log("Hello, World!")', correct: false },
      { id: 'd', text: 'printf("Hello, World!")', correct: false }
    ],
    correct: 0,
    hints: ['在 Python 中，我们用 print() 函数来输出内容哦~'],
    successText: '太棒了！你已经迈出了编程的第一步！',
    failText: '这是其他语言的写法呢，Python 用的是 print() 哦~'
  },

  // =====================================================================
  // 第四章 — 列表与字典
  // =====================================================================

  ch4_list_basics: {
    id: 'ch4_list_basics', title: '列表的创建', chapter: 'chapter4', difficulty: 1,
    type: 'multiple_choice', related_character: 'nene', knowledge_domain: 'lists',
    question: '以下哪个是正确的 Python 列表创建方式？',
    options: [
      'fruits = ["苹果", "香蕉", "草莓"]',
      'fruits = ("苹果", "香蕉", "草莓")',
      'fruits = {"苹果", "香蕉", "草莓"}',
      'fruits = <"苹果", "香蕉", "草莓">'
    ],
    correct: 0,
    explanation: '列表用方括号 [] 创建。圆括号 () 是元组，花括号 {} 是集合或字典。',
    hints: ['列表的标志是方括号 []'],
  },

  ch4_list_index: {
    id: 'ch4_list_index', title: '列表索引', chapter: 'chapter4', difficulty: 1,
    type: 'multiple_choice', related_character: 'yoshino', knowledge_domain: 'lists',
    question: '已知 colors = ["红", "绿", "蓝", "黄"]，colors[2] 的值是什么？',
    options: ['绿', '蓝', '红', '黄'],
    correct: 1,
    explanation: 'Python 索引从 0 开始。colors[0]="红", colors[1]="绿", colors[2]="蓝"。',
    hints: ['索引从 0 开始数', 'colors[0] 是第一个元素'],
  },

  ch4_list_methods: {
    id: 'ch4_list_methods', title: '列表方法', chapter: 'chapter4', difficulty: 2,
    type: 'multiple_choice', related_character: 'nene', knowledge_domain: 'lists',
    question: '以下代码执行后，nums 的值是什么？\n\nnums = [1, 2, 3]\nnums.append(4)\nnums.insert(1, 10)',
    code_display: 'nums = [1, 2, 3]\nnums.append(4)\nnums.insert(1, 10)',
    options: [
      '[1, 10, 2, 3, 4]',
      '[1, 2, 3, 4, 10]',
      '[10, 1, 2, 3, 4]',
      '[1, 2, 10, 3, 4]'
    ],
    correct: 0,
    explanation: 'append(4) 在末尾加 4 → [1,2,3,4]。insert(1,10) 在索引 1 处插入 10 → [1,10,2,3,4]。',
    hints: ['append 在末尾添加', 'insert(位置, 值) 在指定位置插入'],
  },

  ch4_dict_access: {
    id: 'ch4_dict_access', title: '字典访问', chapter: 'chapter4', difficulty: 2,
    type: 'fill_blank', related_character: 'yoshino', knowledge_domain: 'dicts',
    question: '已知 student = {"name": "Leo", "age": 17, "score": 92}。\n要获取 score 的值，应该写什么？',
    code_template: 'student = {"name": "Leo", "age": 17, "score": 92}\nresult = student[_____]\nprint(result)  # 输出 92',
    correct_answer: '"score"',
    accept_patterns: ['"score"', "'score'", 'score'],
    explanation: '字典用 key 来获取 value。student["score"] 返回 92。',
    hints: ['字典用 key 获取值', 'key 是字符串时需要加引号'],
  },

  ch4_list_slice: {
    id: 'ch4_list_slice', title: '列表切片', chapter: 'chapter4', difficulty: 2,
    type: 'multiple_choice', related_character: 'ayase', knowledge_domain: 'lists',
    question: '已知 nums = [10, 20, 30, 40, 50]，nums[1:4] 的值是什么？',
    code_display: 'nums = [10, 20, 30, 40, 50]\nprint(nums[1:4])',
    options: [
      '[20, 30, 40]',
      '[10, 20, 30, 40]',
      '[20, 30, 40, 50]',
      '[10, 20, 30]'
    ],
    correct: 0,
    explanation: '切片 [1:4] 取索引 1、2、3 的元素（不包含 4）。所以是 [20, 30, 40]。',
    hints: ['切片不包含终止索引', 'nums[1] 是 20, nums[3] 是 40'],
  },

  // =====================================================================
  // 第五章 — 类与对象
  // =====================================================================

  ch5_class_basics: {
    id: 'ch5_class_basics', title: '类的定义', chapter: 'chapter5', difficulty: 2,
    type: 'multiple_choice', related_character: 'nene', knowledge_domain: 'oop',
    question: '以下哪个是正确的 Python 类定义语法？',
    options: [
      'class Cat:\n    pass',
      'def Cat:\n    pass',
      'create Cat:\n    pass',
      'object Cat:\n    pass'
    ],
    correct: 0,
    explanation: '用 class 关键字定义类，类名首字母大写。pass 是占位符。',
    hints: ['定义类用 class 关键字'],
  },

  ch5_init_method: {
    id: 'ch5_init_method', title: '构造函数', chapter: 'chapter5', difficulty: 2,
    type: 'fill_blank', related_character: 'yoshino', knowledge_domain: 'oop',
    question: '补全构造函数，让 Dog 类可以在创建时设置名字。',
    code_template: 'class Dog:\n    def _____(self, name):\n        self.name = name\n\ndog = Dog("小白")\nprint(dog.name)',
    correct_answer: '__init__',
    accept_patterns: ['__init__'],
    explanation: '__init__ 是 Python 的构造函数，创建对象时自动调用。',
    hints: ['构造函数是双下划线开头和结尾的特殊方法'],
  },

  ch5_class_method: {
    id: 'ch5_class_method', title: '类的方法', chapter: 'chapter5', difficulty: 2,
    type: 'multiple_choice', related_character: 'nene', knowledge_domain: 'oop',
    question: '以下代码输出什么？\n\nclass Cat:\n    def __init__(self, name):\n        self.name = name\n    def greet(self):\n        return f"喵～我是{self.name}"\n\ncat = Cat("小花")\nprint(cat.greet())',
    code_display: 'class Cat:\n    def __init__(self, name):\n        self.name = name\n    def greet(self):\n        return f"喵～我是{self.name}"\n\ncat = Cat("小花")\nprint(cat.greet())',
    options: ['喵～我是小花', '喵～我是Cat', '喵～我是self', '报错'],
    correct: 0,
    explanation: 'self.name 被设为 "小花"，greet 方法通过 self 访问 name 属性。',
  },

  ch5_inheritance: {
    id: 'ch5_inheritance', title: '继承', chapter: 'chapter5', difficulty: 3,
    type: 'multiple_choice', related_character: 'yoshino', knowledge_domain: 'oop',
    question: '以下代码中 Dog 继承了 Animal，创建 Dog 对象后调用 speak() 输出什么？',
    code_display: 'class Animal:\n    def speak(self):\n        return "..."\n\nclass Dog(Animal):\n    def speak(self):\n        return "汪！"\n\ndog = Dog()\nprint(dog.speak())',
    options: ['汪！', '...', '报错', 'None'],
    correct: 0,
    explanation: '子类 Dog 重写了 speak 方法（多态），所以调用的是 Dog 的版本。',
    hints: ['子类可以重写父类的方法', '这就是多态'],
  },
}
