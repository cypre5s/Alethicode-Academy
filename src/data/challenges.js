export const challenges = {
  // =====================================================================
  // 序章 (2 题) — Python 基础入门
  // 来源: PPT 第二章
  // =====================================================================

  tutorial_01_hello_world: {
    id: 'tutorial_01_hello_world', title: '圆面积计算', chapter: 'prologue', difficulty: 1,
    type: 'multiple_choice', related_character: 'nene',
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
    type: 'fill_blank', related_character: 'nene',
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
    type: 'multiple_choice', related_character: 'nene',
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
    type: 'fill_blank', related_character: 'nene',
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
    type: 'code_order', related_character: 'ayase',
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

  // =====================================================================
  // 第二章 (4 题) — 循环与分支
  // 来源: PPT 第四章
  // =====================================================================

  ch2_for_loop: {
    id: 'ch2_for_loop', title: '自然数求和', chapter: 2, difficulty: 2,
    type: 'multiple_choice', related_character: 'yoshino',
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
    type: 'fill_blank', related_character: 'kanna',
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
    type: 'code_order', related_character: 'ayase',
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
    type: 'multiple_choice', related_character: 'yoshino',
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

  // =====================================================================
  // 第三章 (4 题) — 函数与模块化
  // 来源: PPT 第七章
  // =====================================================================

  ch3_function_def: {
    id: 'ch3_function_def', title: '几何面积函数', chapter: 3, difficulty: 2,
    type: 'fill_blank', related_character: 'nene',
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
    type: 'multiple_choice', related_character: 'yoshino',
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
    type: 'code_order', related_character: 'ayase',
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
    type: 'multiple_choice', related_character: 'murasame',
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
    type: 'fill_blank', related_character: 'nene',
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
    type: 'multiple_choice', related_character: 'nene',
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
    type: 'fill_blank', related_character: 'nene',
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
    type: 'code_order', related_character: 'yoshino',
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
    type: 'multiple_choice', related_character: 'yoshino',
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
    type: 'fill_blank', related_character: 'yoshino',
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
    type: 'multiple_choice', related_character: 'ayase',
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
    type: 'fill_blank', related_character: 'ayase',
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
    type: 'code_order', related_character: 'ayase',
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
    type: 'multiple_choice', related_character: 'kanna',
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
    type: 'fill_blank', related_character: 'kanna',
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
    type: 'multiple_choice', related_character: 'kanna',
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
    type: 'fill_blank', related_character: 'murasame',
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
    type: 'code_order', related_character: 'murasame',
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
    type: 'multiple_choice', related_character: 'murasame',
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
  // 兼容旧 ID — 重定向到新题
  // =====================================================================
  hello_world: {
    id: 'hello_world', title: '第一个程序', chapter: 'prologue', difficulty: 1,
    type: 'multiple_choice', related_character: 'nene',
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
  }
}
