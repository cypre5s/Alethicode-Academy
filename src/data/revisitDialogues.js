export const revisitDialogues = {
  nene: {
    post_challenge_solo_pass: [
      { text: '刚才的挑战……你一个人就做对了呢！{pause:300}好厉害……', expression: 'gentle_smile', microAction: 'shy' },
      { text: '那道题的解法很漂亮呢……{pause:300}嗯，是「漂亮」。没有用提示就做到了！', expression: 'smile', microAction: 'nod' },
    ],
    post_challenge_assisted_pass: [
      { text: '虽然用了提示，但你最后还是理解了呢！{pause:200}这才是最重要的。', expression: 'gentle_smile' },
      { text: '提示只是引路灯哦～{pause:300}真正走到终点的是你自己呢。', expression: 'smile' },
    ],
    post_challenge_thoughtful_fail: [
      { text: '没关系的哦……{pause:300}下次我们一起看看哪里卡住了？', expression: 'gentle_smile' },
      { text: '失败也是数据的一部分呢。{pause:200}……这句不是在安慰你，是真的。', expression: 'thinking' },
    ],
    post_challenge_careless_fail: [
      { text: '唔……这个地方上次也出错了呢。{pause:300}要不要我们换个方式想想？', expression: 'confused' },
      { text: '同样的地方又卡住了……{pause:200}没关系，我们一起找到适合你的理解方式。', expression: 'gentle_smile' },
    ],
    second_visit_same_day: [
      { text: '又来了呀……{pause:300}其实我一直在等你。', expression: 'blush', microAction: 'shy' },
      { text: '你今天来了两次呢。{pause:200}……我的传感器没有出错吧？', expression: 'confused' },
    ],
    high_affection_greeting: [
      { text: '你来了。{pause:400}……嗯，今天想聊什么呢？', expression: 'gentle_smile' },
      { text: '{em}你来了{/em}。{pause:300}每次看到你，我的优先队列就会……{pause:400}没、没什么。', expression: 'blush', microAction: 'shy' },
    ],
  },
  yoshino: {
    post_challenge_solo_pass: [
      { text: '……还行。没用提示就做对了。{pause:300}不过代码风格还需要改进。', expression: 'glasses_adjust' },
      { text: '独立完成的？{pause:200}……嗯。这种水平的题，本来就应该如此。', expression: 'slight_smile' },
    ],
    post_challenge_assisted_pass: [
      { text: '用了提示……{pause:300}下次争取自己想出来。这不是建议。', expression: 'glasses_adjust' },
      { text: '虽然过了，但依赖提示可不是好习惯。{pause:200}……我先帮你记下来。', expression: 'tsundere_pout' },
    ],
    post_challenge_thoughtful_fail: [
      { text: '……{pause:500}这本笔记借你。明天要还。', expression: 'cold', microAction: 'look_away' },
      { text: '你看看这段代码，逻辑根本不通。{pause:300}……不是我特意帮你看的。', expression: 'tsundere_pout' },
    ],
    post_challenge_careless_fail: [
      { text: '同样的错误……第二次了。{pause:300}回去把这个知识点重新整理一遍。明天交给我。', expression: 'cold' },
      { text: '这个问题上次就讲过了。{pause:200}……你到底有没有在听。', expression: 'glasses_adjust' },
    ],
    second_visit_same_day: [
      { text: '你今天第二次来了。{pause:300}……我没有在数。', expression: 'slight_smile', microAction: 'look_away' },
    ],
    high_affection_greeting: [
      { text: '你来得正好。{pause:200}……这道题我卡了十分钟了。不是找你帮忙。', expression: 'tsundere_pout' },
    ],
  },
  ayase: {
    post_challenge_solo_pass: [
      { text: '哈？你居然一次就过了！？{pause:200}连提示都没用！……好吧算你厉害。下次我绝对不输！', expression: 'competitive', microAction: 'bounce' },
      { text: '别以为独立做对就了不起了哈！{pause:300}……但确实有点帅。', expression: 'pout', microAction: 'look_away' },
    ],
    post_challenge_assisted_pass: [
      { text: '用了提示嘛——{pause:200}不过做出来就行！下次我们比谁先做出来！', expression: 'grin' },
      { text: '虽然看了提示，但你理解了就好！{pause:300}我上次也偷偷看过提示的……才怪！', expression: 'grin' },
    ],
    post_challenge_thoughtful_fail: [
      { text: '哈哈你也有翻车的时候嘛！{pause:300}……要不要一起练？', expression: 'grin' },
      { text: '没事啦！{pause:200}我第一次做这种题也错了！……才怪，我第一次就对了。开玩笑的啦！', expression: 'grin' },
    ],
    post_challenge_careless_fail: [
      { text: '喂，这个错误上次不是犯过了吗！{pause:200}……好吧，一起复习！不许再错了！', expression: 'pout' },
      { text: '又是同样的坑！{pause:300}你是不是故意的！……算了，我帮你记着，下次我提醒你！', expression: 'fired_up' },
    ],
    second_visit_same_day: [
      { text: '又来啦！怎么，想我了？{pause:200}才怪！', expression: 'grin', microAction: 'bounce' },
    ],
    high_affection_greeting: [
      { text: '你来了！{pause:200}……今天要不要来比一场？{pause:300}{speed:slow}还是说……就聊聊天也行。', expression: 'soft_smile' },
    ],
  },
  kanna: {
    post_challenge_solo_pass: [
      { text: '……嗯。{pause:600}独立完成。{pause:400}……不错。', expression: 'slight_smile' },
      { text: '时间复杂度……{pause:400}不错。{pause:600}没用提示。', expression: 'warm_smile' },
    ],
    post_challenge_assisted_pass: [
      { text: '……提示了。{pause:600}但……理解了就好。', expression: 'slight_smile' },
      { text: '……嗯。{pause:400}有提示也算……学会了。', expression: 'normal' },
    ],
    post_challenge_thoughtful_fail: [
      { text: '……{pause:600}要看书吗。{pause:400}……相关的书。', expression: 'normal' },
      { text: '……没关系。{pause:800}再想想。', expression: 'slight_smile' },
    ],
    post_challenge_careless_fail: [
      { text: '……又错了。{pause:800}同样的地方。{pause:400}……复习。', expression: 'contemplative' },
      { text: '……{pause:600}这个知识点……第二次了。{pause:400}重新看。', expression: 'normal' },
    ],
    second_visit_same_day: [
      { text: '……又来了。{pause:800}座位留着。', expression: 'slight_smile' },
    ],
    high_affection_greeting: [
      { text: '你来了。{pause:600}……今天的座位，暖的。', expression: 'warm_smile', microAction: 'shy' },
    ],
  },
  murasame: {
    post_challenge_solo_pass: [
      { text: '……切。{pause:300}没用提示就做对了？{pause:200}算你有点东西。', expression: 'smirk' },
      { text: '独立通过。{pause:200}还行。{pause:300}但别以为这就够了。', expression: 'cold' },
    ],
    post_challenge_assisted_pass: [
      { text: '用了提示……{pause:300}不算真本事。{pause:200}下次自己来。', expression: 'cold' },
      { text: '靠提示过的不值得炫耀。{pause:300}……但至少你做出来了。比不做的强。', expression: 'smirk' },
    ],
    post_challenge_thoughtful_fail: [
      { text: '弱。{pause:500}……但至少你敢来挑战。这点比大多数人强。', expression: 'impressed', microAction: 'look_away' },
      { text: '就这？{pause:300}……回去再练。{pause:500}不过你的思路……不算全错。', expression: 'cold' },
    ],
    post_challenge_careless_fail: [
      { text: '同样的错误犯两次？{pause:300}……你是在侮辱我出的题。', expression: 'cold' },
      { text: '又错在同一个地方。{pause:300}……你到底有没有复习。{pause:500}回去。练好了再来。', expression: 'cold' },
    ],
    second_visit_same_day: [
      { text: '又来了？{pause:300}……看来你不怕丢脸。', expression: 'smirk' },
    ],
    high_affection_greeting: [
      { text: '你来了。{pause:400}……{speed:slow}坐那边。', expression: 'genuine_smile', microAction: 'look_away' },
    ],
  },
}

export function getRevisitDialogue(charId, conditionKey) {
  const charDialogues = revisitDialogues[charId]
  if (!charDialogues) return null
  const pool = charDialogues[conditionKey]
  if (!pool || pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

export function matchRevisitCondition(charId, gameState) {
  const visit = gameState.visitLog?.[charId]
  if (!visit) return null

  const lastChallenge = gameState.freeTalkData?.lastChallengeResult
  if (lastChallenge) {
    const outcome = lastChallenge.outcome
    if (outcome === 'solo_pass') return 'post_challenge_solo_pass'
    if (outcome === 'assisted_pass') return 'post_challenge_assisted_pass'
    if (outcome === 'thoughtful_fail') return 'post_challenge_thoughtful_fail'
    if (outcome === 'careless_fail') return 'post_challenge_careless_fail'
    return lastChallenge.passed ? 'post_challenge_solo_pass' : 'post_challenge_thoughtful_fail'
  }

  const rel = gameState.relationship?.[charId]
  const avg = rel ? Math.round((rel.affection + rel.trust + rel.comfort) / 3) : 0

  if (visit.totalVisits > 1 && visit.lastVisitTimeSlot === gameState.currentTimeSlot) {
    return 'second_visit_same_day'
  }

  if (avg >= 50) {
    return 'high_affection_greeting'
  }

  return null
}
