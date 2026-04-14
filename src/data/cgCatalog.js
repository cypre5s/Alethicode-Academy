import { assetPath } from '../utils/assetPath.js'

const CG_BASE = assetPath('assets/cg')

function cgPath(id) {
  return `${CG_BASE}/${id}.webp`
}

export const cgCatalog = {
  prologue_school_gate: { id: 'prologue_school_gate', title: '校门前的春风', route: '序章', effectPreset: 'spring_day', image: cgPath('prologue_school_gate'), thumbnail: cgPath('prologue_school_gate') },
  ch1_nene_teaching: { id: 'ch1_nene_teaching', title: 'Nene 的编程课', route: '第一章', effectPreset: 'spring_day', image: cgPath('ch1_nene_teaching'), thumbnail: cgPath('ch1_nene_teaching') },
  ch1_night_shadow: { id: 'ch1_night_shadow', title: '夜间的金色眼眸', route: '第一章', effectPreset: 'lab_night_glow', image: cgPath('ch1_night_shadow'), thumbnail: cgPath('ch1_night_shadow') },
  ch2_competition: { id: 'ch2_competition', title: '编程赛的对决', route: '第二章', effectPreset: 'golden_hour', image: cgPath('ch2_competition'), thumbnail: cgPath('ch2_competition') },
  ch2_kanna_fractal: { id: 'ch2_kanna_fractal', title: 'Kanna 的分形图案', route: '第二章', effectPreset: 'blue_night', image: cgPath('ch2_kanna_fractal'), thumbnail: cgPath('ch2_kanna_fractal') },
  ch3_festival: { id: 'ch3_festival', title: '文化祭的灯火', route: '第三章', effectPreset: 'festival_lantern', image: cgPath('ch3_festival'), thumbnail: cgPath('ch3_festival') },
  ch3_firework: { id: 'ch3_firework', title: '烟火下的约定', route: '第三章', effectPreset: 'fireworks_bloom', image: cgPath('ch3_firework'), thumbnail: cgPath('ch3_firework') },
  nene_heart_module: { id: 'nene_heart_module', title: '心模块的启动', route: 'Nene 线', effectPreset: 'lab_night_glow', image: cgPath('nene_heart_module'), thumbnail: cgPath('nene_heart_module') },
  nene_good_end: { id: 'nene_good_end', title: 'System.love = True', route: 'Nene Good End', effectPreset: 'golden_hour', image: cgPath('nene_good_end'), thumbnail: cgPath('nene_good_end') },
  yoshino_imperfect_code: { id: 'yoshino_imperfect_code', title: '不完美的爱心代码', route: 'Yoshino 线', effectPreset: 'golden_hour', image: cgPath('yoshino_imperfect_code'), thumbnail: cgPath('yoshino_imperfect_code') },
  yoshino_good_end: { id: 'yoshino_good_end', title: '不完全なコード', route: 'Yoshino Good End', effectPreset: 'golden_hour', image: cgPath('yoshino_good_end'), thumbnail: cgPath('yoshino_good_end') },
  ayase_final_match: { id: 'ayase_final_match', title: '最终对决', route: 'Ayase 线', effectPreset: 'spring_day', image: cgPath('ayase_final_match'), thumbnail: cgPath('ayase_final_match') },
  ayase_good_end: { id: 'ayase_good_end', title: 'Winner Takes All', route: 'Ayase Good End', effectPreset: 'golden_hour', image: cgPath('ayase_good_end'), thumbnail: cgPath('ayase_good_end') },
  kanna_starry_program: { id: 'kanna_starry_program', title: '星空程序', route: 'Kanna 线', effectPreset: 'blue_night', image: cgPath('kanna_starry_program'), thumbnail: cgPath('kanna_starry_program') },
  kanna_good_end: { id: 'kanna_good_end', title: 'return \"好きです\"', route: 'Kanna Good End', effectPreset: 'blue_night', image: cgPath('kanna_good_end'), thumbnail: cgPath('kanna_good_end') },
  murasame_championship: { id: 'murasame_championship', title: '全国赛的搭档', route: 'Murasame 线', effectPreset: 'lab_night_glow', image: cgPath('murasame_championship'), thumbnail: cgPath('murasame_championship') },
  murasame_good_end: { id: 'murasame_good_end', title: 'Champion\'s Heart', route: 'Murasame Good End', effectPreset: 'fireworks_bloom', image: cgPath('murasame_good_end'), thumbnail: cgPath('murasame_good_end') },
  murasame_true_end: { id: 'murasame_true_end', title: 'Source Code', route: 'Murasame True End', effectPreset: 'fireworks_bloom', image: cgPath('murasame_true_end'), thumbnail: cgPath('murasame_true_end') },

  nene_defeat: { id: 'nene_defeat', title: '崩溃的心模块', route: 'Nene Bad End', category: 'defeat', effectPreset: 'lab_night_glow', image: cgPath('nene_defeat'), thumbnail: cgPath('nene_defeat') },
  yoshino_defeat: { id: 'yoshino_defeat', title: '碎裂的完美主义', route: 'Yoshino Bad End', category: 'defeat', effectPreset: 'golden_hour', image: cgPath('yoshino_defeat'), thumbnail: cgPath('yoshino_defeat') },
  ayase_defeat: { id: 'ayase_defeat', title: '没有对手的擂台', route: 'Ayase Bad End', category: 'defeat', effectPreset: 'spring_day', image: cgPath('ayase_defeat'), thumbnail: cgPath('ayase_defeat') },
  kanna_defeat: { id: 'kanna_defeat', title: '熄灭的星空', route: 'Kanna Bad End', category: 'defeat', effectPreset: 'blue_night', image: cgPath('kanna_defeat'), thumbnail: cgPath('kanna_defeat') },
  murasame_defeat: { id: 'murasame_defeat', title: '独行的剑士', route: 'Murasame Bad End', category: 'defeat', effectPreset: 'lab_night_glow', image: cgPath('murasame_defeat'), thumbnail: cgPath('murasame_defeat') },
  generic_defeat: { id: 'generic_defeat', title: '未竟的代码', route: '共通 Bad End', category: 'defeat', effectPreset: 'golden_hour', image: cgPath('generic_defeat'), thumbnail: cgPath('generic_defeat') },
}

export const cgList = Object.values(cgCatalog)

export function getCgEntry(cgId) {
  return cgCatalog[cgId] || null
}
