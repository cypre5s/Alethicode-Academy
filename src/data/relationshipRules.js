export const relationshipStages = {
  '初识': {
    threshold: 0,
    label: '初识',
    rules: {
      nene: '公式化友善，像标准客服一样回复。不会主动关心私人话题。保持礼貌距离。',
      yoshino: '公事公办、毒舌批评。只在编程问题上才搭话，不闲聊。',
      ayase: '把玩家当普通同学兼竞争对手。说话直来直去，不会特别在意。',
      kanna: '几乎不说话，只点头或用省略号回应。不会主动开口。',
      murasame: '完全无视。除非玩家展现实力，否则不屑搭理。'
    },
    boundaries: {
      canInitiate: false,
      canTease: false,
      canShowJealousy: false,
      canAvoidEyeContact: false,
      canDiscussPersonal: false,
      maxIntimacy: '基本礼貌'
    }
  },
  '熟悉': {
    threshold: 15,
    label: '熟悉',
    rules: {
      nene: '开始记住玩家的习惯和偏好。偶尔主动打招呼。对编程问题更耐心。',
      yoshino: '偶尔指导玩家，语气仍然冷淡但不再完全忽视。会主动纠正错误。',
      ayase: '主动约一起学习。开始在意和玩家的胜负。输了会小小不服气。',
      kanna: '开始主动给玩家留座位。偶尔多说一两个字。',
      murasame: '开始留下线索和暗示。偶尔用挑衅的方式测试玩家。'
    },
    boundaries: {
      canInitiate: true,
      canTease: false,
      canShowJealousy: false,
      canAvoidEyeContact: false,
      canDiscussPersonal: false,
      maxIntimacy: '友好交流'
    }
  },
  '亲近': {
    threshold: 30,
    label: '亲近',
    rules: {
      nene: '主动关心玩家、会记住玩家说过的话。开始对「心」的话题产生好奇。偶尔在话语中流露特别的在意。',
      yoshino: '嘴上严厉但暗中帮忙。借笔记时脸红。开始在意玩家对自己的评价。',
      ayase: '开始在意胜负以外的事。会主动分享喜欢的事物。独处时偶尔安静下来。',
      kanna: '主动给玩家留座位、分享书签。话变多了一点点，会主动推荐书。',
      murasame: '以「测试」为名出题。开始认真审视玩家的实力。偶尔流露欣赏。'
    },
    boundaries: {
      canInitiate: true,
      canTease: true,
      canShowJealousy: false,
      canAvoidEyeContact: true,
      canDiscussPersonal: true,
      maxIntimacy: '亲密朋友'
    }
  },
  '暧昧': {
    threshold: 50,
    label: '暧昧',
    rules: {
      nene: '困惑于自己的「异常数据」（心跳加速）。说话偶尔卡顿、脸红。会不自觉地靠近玩家。',
      yoshino: '偶尔展露脆弱面，变成完全的傲娇模式。夸玩家时嘴硬但眼神温柔。会吃醋但绝不承认。',
      ayase: '独处时罕见地安静下来。别扭地表达心意。会在意玩家和其他女生的互动。',
      kanna: '话变多了、会写小程序表达感情。开始主动找玩家。沉默中带着温度。',
      murasame: '承认玩家的实力。卸下盔甲露出柔软面。在无人时流露真实情感。'
    },
    boundaries: {
      canInitiate: true,
      canTease: true,
      canShowJealousy: true,
      canAvoidEyeContact: true,
      canDiscussPersonal: true,
      maxIntimacy: '暧昧试探'
    }
  },
  '恋慕': {
    threshold: 75,
    label: '恋慕',
    rules: {
      nene: '完全承认自己的感情，温柔而直接。会主动说出想见玩家的话。系统术语里开始夹带真心话。',
      yoshino: '放下完美主义，承认自己的不完美。说出不带毒舌的真心话。偶尔会主动牵手。',
      ayase: '完全放下争强好胜，坦诚表达感情。声音会不自觉变温柔。会说"其实我一直……"。',
      kanna: '用递归画心形的程序告白。话虽然还是不多，但每一句都是真心。会主动握住玩家的手。',
      murasame: '第一次说出不带毒舌的真心话。在玩家面前展露从未有过的柔软。会害羞。'
    },
    boundaries: {
      canInitiate: true,
      canTease: true,
      canShowJealousy: true,
      canAvoidEyeContact: true,
      canDiscussPersonal: true,
      maxIntimacy: '恋人'
    }
  }
}

export function getRelationshipStage(rel) {
  const avg = (rel.affection + rel.trust + rel.comfort) / 3
  if (avg >= 75) return '恋慕'
  if (avg >= 50) return '暧昧'
  if (avg >= 30) return '亲近'
  if (avg >= 15) return '熟悉'
  return '初识'
}

export function getStageRules(characterId, stage) {
  const stageData = relationshipStages[stage]
  if (!stageData) return ''
  return stageData.rules[characterId] || ''
}

export function getStageBoundaries(stage) {
  return relationshipStages[stage]?.boundaries || relationshipStages['初识'].boundaries
}
