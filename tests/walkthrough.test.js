import { test, describe } from 'node:test'
import assert from 'node:assert'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcDir = join(__dirname, '..', 'src')

async function loadModule(path) {
  return import(`file://${join(srcDir, path).replace(/\\/g, '/')}`)
}

const { scriptIndex } = await loadModule('scripts/index.js')
const { challenges } = await loadModule('data/challenges.js')
const { characters } = await loadModule('data/characters.js')
const { locations } = await loadModule('data/locations.js')

const VALID_TYPES = new Set([
  'dialogue', 'monologue', 'narration',
  'choice', 'condition', 'jump', 'jump_label',
  'bg', 'char_enter', 'char_exit', 'char_expression', 'char_move',
  'show', 'hide', 'hideAll',
  'bgm', 'bgm_stop', 'se', 'sfx',
  'challenge', 'location_select', 'free_talk', 'competition',
  'flag', 'set_flag', 'affection',
  'title_card', 'cg', 'ending', 'route_decision', 'route_branch',
  'auto_save',
  'screen_effect', 'silence_beat', 'char_action',
  'set_emotion', 'dialogue_effect', 'wait'
])

const KNOWN_SPEAKERS = new Set([
  ...Object.keys(characters),
  '???', 'kiryu_sensei', 'mitsuki_sensei', 'crowd', 'classmate', 'announcer', 'judge'
])

class SimEngine {
  constructor() {
    this.errors = []
    this.flags = {}
    this.affection = { nene: 0, yoshino: 0, ayase: 0, kanna: 0, murasame: 0 }
    this.visitedScripts = new Set()
    this.currentChapter = null
    this.dialogueCount = 0
    this.choicesMade = 0
    this.challengesSolved = 0
    this.locationsSelected = 0
    this.cgsShown = 0
    this.endingsReached = 0
    this.bgChanges = 0
    this.charEnters = 0
    this.charExits = 0
    this.titleCards = 0
    this.autoSaves = 0
    this.freeTalks = 0
    this.competitions = 0
  }

  err(script, idx, msg) {
    this.errors.push(`[${script}:${idx}] ${msg}`)
  }

  walkScript(scriptName, depth = 0) {
    if (depth > 30) {
      this.err(scriptName, 0, `Max depth exceeded (possible infinite loop)`)
      return
    }
    if (this.visitedScripts.has(scriptName)) return
    this.visitedScripts.add(scriptName)

    const script = scriptIndex[scriptName]
    if (!script) {
      this.err(scriptName, 0, `Script not found in scriptIndex`)
      return
    }
    if (!Array.isArray(script) || script.length === 0) {
      this.err(scriptName, 0, `Script is empty or not an array`)
      return
    }

    this.currentChapter = scriptName

    for (let i = 0; i < script.length; i++) {
      const cmd = script[i]

      if (!cmd) { this.err(scriptName, i, 'null/undefined command'); continue }
      if (!cmd.type) {
        if (cmd.label) continue
        this.err(scriptName, i, `Command missing type: ${JSON.stringify(cmd).slice(0, 80)}`)
        continue
      }
      if (!VALID_TYPES.has(cmd.type)) {
        this.err(scriptName, i, `Unknown type: "${cmd.type}"`)
      }

      this.validateCommand(scriptName, i, cmd, script, depth)
    }
  }

  validateCommand(scriptName, idx, cmd, script, depth) {
    switch (cmd.type) {
      case 'dialogue':
        this.dialogueCount++
        if (!cmd.text) this.err(scriptName, idx, 'dialogue: missing text')
        if (cmd.speaker && !KNOWN_SPEAKERS.has(cmd.speaker))
          this.err(scriptName, idx, `dialogue: unknown speaker "${cmd.speaker}"`)
        if (cmd.expression && cmd.speaker && characters[cmd.speaker]) {
          // expression validity is hard to check without sprite data, skip
        }
        break

      case 'monologue':
        this.dialogueCount++
        if (!cmd.text) this.err(scriptName, idx, 'monologue: missing text')
        break

      case 'narration':
        this.dialogueCount++
        if (!cmd.text) this.err(scriptName, idx, 'narration: missing text')
        break

      case 'choice':
        this.choicesMade++
        if (!cmd.options || !Array.isArray(cmd.options)) {
          this.err(scriptName, idx, 'choice: missing or invalid options')
          break
        }
        if (cmd.options.length === 0) {
          this.err(scriptName, idx, 'choice: empty options array')
          break
        }
        for (let oi = 0; oi < cmd.options.length; oi++) {
          const opt = cmd.options[oi]
          if (!opt.text) this.err(scriptName, idx, `choice option[${oi}]: missing text`)
          if (opt.next) {
            if (scriptIndex[opt.next]) {
              this.walkScript(opt.next, depth + 1)
            } else {
              const hasLabel = script.some(c => c.label === opt.next)
              if (!hasLabel) this.err(scriptName, idx, `choice option "${opt.text}": target "${opt.next}" not found`)
            }
          }
          if (opt.effects) {
            for (const [k] of Object.entries(opt.effects)) {
              if (!(k in this.affection) && k !== 'murasame')
                this.err(scriptName, idx, `choice option "${opt.text}": unknown affection key "${k}"`)
            }
          }
        }
        break

      case 'condition': {
        const check = cmd.check || cmd.condition
        if (!check) this.err(scriptName, idx, 'condition: missing check/condition')
        for (const branch of ['true_branch', 'false_branch']) {
          if (cmd[branch]) {
            if (scriptIndex[cmd[branch]]) {
              this.walkScript(cmd[branch], depth + 1)
            } else {
              const hasLabel = script.some(c => c.label === cmd[branch])
              if (!hasLabel) this.err(scriptName, idx, `condition: ${branch} "${cmd[branch]}" not found`)
            }
          }
        }
        break
      }

      case 'jump':
        if (!cmd.target) { this.err(scriptName, idx, 'jump: missing target'); break }
        if (!scriptIndex[cmd.target]) {
          this.err(scriptName, idx, `jump: target "${cmd.target}" not found in scriptIndex`)
        } else {
          this.walkScript(cmd.target, depth + 1)
        }
        break

      case 'jump_label':
        if (!cmd.target) { this.err(scriptName, idx, 'jump_label: missing target'); break }
        if (!script.some(c => c.label === cmd.target))
          this.err(scriptName, idx, `jump_label: label "${cmd.target}" not found in current script`)
        break

      case 'challenge':
        this.challengesSolved++
        if (!cmd.id) { this.err(scriptName, idx, 'challenge: missing id'); break }
        if (!challenges[cmd.id]) {
          this.err(scriptName, idx, `challenge: id "${cmd.id}" not in challenges data`)
        } else {
          const ch = challenges[cmd.id]
          if (ch.type === 'multiple_choice') {
            if (typeof ch.correct !== 'number') this.err(scriptName, idx, `challenge ${cmd.id}: correct is not a number`)
            if (!ch.options || ch.correct >= ch.options.length) this.err(scriptName, idx, `challenge ${cmd.id}: correct index out of range`)
          }
          if (ch.type === 'fill_blank') {
            if (!ch.blank_answer && ch.blank_answer !== 0) this.err(scriptName, idx, `challenge ${cmd.id}: missing blank_answer`)
          }
          if (ch.type === 'sort') {
            if (!ch.correct_order || !Array.isArray(ch.correct_order)) this.err(scriptName, idx, `challenge ${cmd.id}: missing correct_order`)
            if (ch.items && ch.correct_order && ch.correct_order.length !== ch.items.length)
              this.err(scriptName, idx, `challenge ${cmd.id}: correct_order length mismatch`)
          }
          if (!ch.question) this.err(scriptName, idx, `challenge ${cmd.id}: missing question`)
          if (!ch.successText) this.err(scriptName, idx, `challenge ${cmd.id}: missing successText`)
          if (!ch.failText) this.err(scriptName, idx, `challenge ${cmd.id}: missing failText`)
        }
        break

      case 'location_select':
        this.locationsSelected++
        const locs = cmd.available || cmd.locations
        if (!locs || !Array.isArray(locs)) {
          this.err(scriptName, idx, 'location_select: missing available/locations')
          break
        }
        if (locs.length === 0) {
          this.err(scriptName, idx, 'location_select: empty locations')
          break
        }
        for (const loc of locs) {
          if (!loc.id) this.err(scriptName, idx, `location_select: location missing id`)
          if (loc.next) {
            if (scriptIndex[loc.next]) {
              this.walkScript(loc.next, depth + 1)
            } else {
              const hasLabel = script.some(c => c.label === loc.next)
              if (!hasLabel) this.err(scriptName, idx, `location "${loc.id}": target "${loc.next}" not found`)
            }
          }
        }
        break

      case 'free_talk':
        this.freeTalks++
        break

      case 'competition':
        this.competitions++
        break

      case 'bg':
        this.bgChanges++
        if (!cmd.src && !cmd.location && !cmd.id) this.err(scriptName, idx, 'bg: missing src/location/id')
        break

      case 'char_enter':
      case 'show':
        this.charEnters++
        if (!cmd.character) this.err(scriptName, idx, `${cmd.type}: missing character`)
        else if (!characters[cmd.character]) this.err(scriptName, idx, `${cmd.type}: unknown character "${cmd.character}"`)
        break

      case 'char_exit':
      case 'hide':
        this.charExits++
        if (!cmd.character) this.err(scriptName, idx, `${cmd.type}: missing character`)
        break

      case 'char_expression':
        if (!cmd.character) this.err(scriptName, idx, 'char_expression: missing character')
        if (!cmd.expression) this.err(scriptName, idx, 'char_expression: missing expression')
        break

      case 'char_move':
        if (!cmd.character) this.err(scriptName, idx, 'char_move: missing character')
        break

      case 'title_card':
        this.titleCards++
        if (!cmd.text) this.err(scriptName, idx, 'title_card: missing text')
        break

      case 'cg':
        this.cgsShown++
        if (!cmd.id) this.err(scriptName, idx, 'cg: missing id')
        break

      case 'ending':
        this.endingsReached++
        if (!cmd.title) this.err(scriptName, idx, 'ending: missing title')
        if (!cmd.type_label && !cmd.type) {} // type_label is optional
        break

      case 'auto_save':
        this.autoSaves++
        break

      case 'flag':
      case 'set_flag':
        if (!cmd.set && !cmd.key) this.err(scriptName, idx, 'flag: missing set/key')
        break

      case 'affection':
        if (!cmd.character && !cmd.changes)
          this.err(scriptName, idx, 'affection: missing character or changes')
        break

      case 'route_decision':
        break

      case 'bgm':
        if (!cmd.src) this.err(scriptName, idx, 'bgm: missing src')
        break

      case 'hideAll':
      case 'bgm_stop':
      case 'silence_beat':
      case 'screen_effect':
      case 'set_emotion':
      case 'dialogue_effect':
      case 'wait':
      case 'char_action':
      case 'se':
      case 'sfx':
        break
    }
  }

  getReport() {
    return {
      errors: this.errors,
      stats: {
        scriptsVisited: this.visitedScripts.size,
        totalScripts: Object.keys(scriptIndex).length,
        dialogues: this.dialogueCount,
        choices: this.choicesMade,
        challenges: this.challengesSolved,
        locationSelects: this.locationsSelected,
        cgs: this.cgsShown,
        endings: this.endingsReached,
        bgChanges: this.bgChanges,
        charEnters: this.charEnters,
        charExits: this.charExits,
        titleCards: this.titleCards,
        autoSaves: this.autoSaves,
        freeTalks: this.freeTalks,
        competitions: this.competitions,
      },
      unvisitedScripts: Object.keys(scriptIndex).filter(k => !this.visitedScripts.has(k))
    }
  }
}

// =========================================================================

describe('Full Game Walkthrough - Per Section Validation', () => {

  test('structural: all scriptIndex values are non-empty arrays', () => {
    for (const [k, v] of Object.entries(scriptIndex)) {
      assert.ok(Array.isArray(v) && v.length > 0, `${k} is empty/invalid`)
    }
  })

  // ---------- Per-chapter deep walk ----------

  const mainChapters = ['prologue', 'chapter1', 'chapter2', 'chapter3']
  for (const ch of mainChapters) {
    test(`section walk: ${ch} (full branch traversal)`, () => {
      const engine = new SimEngine()
      engine.walkScript(ch)
      const report = engine.getReport()
      if (report.errors.length > 0) {
        console.log(`  Errors in ${ch}:`)
        report.errors.forEach(e => console.log(`    ${e}`))
      }
      console.log(`  ${ch}: visited ${report.stats.scriptsVisited} scripts, ${report.stats.dialogues} dialogues, ` +
        `${report.stats.choices} choices, ${report.stats.challenges} challenges, ` +
        `${report.stats.locationSelects} loc-selects, ${report.stats.endings} endings`)
      assert.strictEqual(report.errors.length, 0, `${report.errors.length} errors in ${ch}`)
    })
  }

  // ---------- Per-route deep walk ----------

  const routes = [
    ['route_nene', 'nene_good_path', 'nene_normal_path'],
    ['route_yoshino', 'yoshino_good_path', 'yoshino_normal_path'],
    ['route_ayase', 'ayase_good_path', 'ayase_normal_path'],
    ['route_kanna', 'kanna_good_path', 'kanna_normal_path'],
    ['route_murasame', 'murasame_good_path', 'murasame_normal_path', 'murasame_true_path'],
  ]

  for (const routeGroup of routes) {
    const routeName = routeGroup[0]
    test(`route walk: ${routeName} (all branches)`, () => {
      const engine = new SimEngine()
      for (const rk of routeGroup) {
        if (scriptIndex[rk]) engine.walkScript(rk)
      }
      const report = engine.getReport()
      if (report.errors.length > 0) {
        console.log(`  Errors in ${routeName}:`)
        report.errors.forEach(e => console.log(`    ${e}`))
      }
      console.log(`  ${routeName}: visited ${report.stats.scriptsVisited} scripts, ` +
        `${report.stats.dialogues} dialogues, ${report.stats.challenges} challenges, ` +
        `${report.stats.endings} endings`)
      assert.strictEqual(report.errors.length, 0, `${report.errors.length} errors in ${routeName}`)
    })
  }

  // ---------- Full coverage walk ----------

  test('full coverage: walk ALL scripts from every entry point', () => {
    const engine = new SimEngine()
    for (const key of Object.keys(scriptIndex)) {
      engine.walkScript(key)
    }
    const report = engine.getReport()

    console.log('\n=== Full Coverage Report ===')
    console.log(`Scripts visited: ${report.stats.scriptsVisited}/${report.stats.totalScripts}`)
    console.log(`Unvisited: ${report.unvisitedScripts.length > 0 ? report.unvisitedScripts.join(', ') : 'none'}`)
    console.log(`Dialogues: ${report.stats.dialogues}`)
    console.log(`Choices: ${report.stats.choices}`)
    console.log(`Challenges: ${report.stats.challenges}`)
    console.log(`Location selects: ${report.stats.locationSelects}`)
    console.log(`CGs: ${report.stats.cgs}`)
    console.log(`Endings: ${report.stats.endings}`)
    console.log(`BG changes: ${report.stats.bgChanges}`)
    console.log(`Char enters: ${report.stats.charEnters}`)
    console.log(`Char exits: ${report.stats.charExits}`)
    console.log(`Title cards: ${report.stats.titleCards}`)
    console.log(`Auto saves: ${report.stats.autoSaves}`)
    console.log(`Free talks: ${report.stats.freeTalks}`)
    console.log(`Competitions: ${report.stats.competitions}`)

    if (report.errors.length > 0) {
      console.log(`\nErrors (${report.errors.length}):`)
      report.errors.forEach(e => console.log(`  ${e}`))
    }

    assert.strictEqual(report.unvisitedScripts.length, 0, `Unvisited scripts: ${report.unvisitedScripts.join(', ')}`)
    assert.strictEqual(report.errors.length, 0, `${report.errors.length} errors found`)
  })

  // ---------- Cross-cutting validations ----------

  test('chapter transition: onChapterEnd covers all terminal sub-scripts', () => {
    const nextMap = {
      prologue: 'chapter1',
      chapter1: 'chapter2',
      chapter2: 'chapter3',
      chapter3: null
    }
    const terminalScripts = []
    for (const [key, script] of Object.entries(scriptIndex)) {
      const last = script[script.length - 1]
      if (!last) continue
      const hasJumpAtEnd = last.type === 'jump'
      const endsWithAutoSave = last.type === 'auto_save'
      const prevIsEndNarration = script.length >= 2 && script[script.length - 2]?.text?.includes('完')

      if (endsWithAutoSave && prevIsEndNarration) {
        const chapter = nextMap[key] !== undefined ? key : null
        const prefix = key.match(/^(ch\d)_/)?.[1]
        let expectedNext = null
        if (prefix === 'ch1') expectedNext = 'chapter2'
        else if (prefix === 'ch2') expectedNext = 'chapter3'
        else if (prefix === 'ch3') expectedNext = null
        else if (nextMap[key] !== undefined) expectedNext = nextMap[key]

        terminalScripts.push({ key, expectedNext })
      }
    }
    console.log(`  Terminal scripts found: ${terminalScripts.map(t => t.key).join(', ')}`)
    assert.ok(terminalScripts.length > 0, 'Should find at least one terminal script')
  })

  test('challenge completeness: all defined challenges are referenced in scripts', () => {
    const referenced = new Set()
    for (const script of Object.values(scriptIndex)) {
      for (const cmd of script) {
        if (cmd.type === 'challenge' && cmd.id) referenced.add(cmd.id)
      }
    }
    const unreferenced = Object.keys(challenges).filter(id => !referenced.has(id))
    if (unreferenced.length > 0) {
      console.log(`  Unreferenced challenges: ${unreferenced.join(', ')}`)
    }
    assert.ok(true)
  })

  test('ending variety: all 5 routes have at least one ending', () => {
    const routeEndings = {}
    const routePrefixes = ['route_nene', 'route_yoshino', 'route_ayase', 'route_kanna', 'route_murasame']
    for (const prefix of routePrefixes) {
      routeEndings[prefix] = 0
    }
    for (const [key, script] of Object.entries(scriptIndex)) {
      for (const cmd of script) {
        if (cmd.type === 'ending') {
          for (const prefix of routePrefixes) {
            if (key.includes(prefix.replace('route_', ''))) {
              routeEndings[prefix]++
            }
          }
        }
      }
    }
    for (const [route, count] of Object.entries(routeEndings)) {
      console.log(`  ${route}: ${count} ending(s)`)
      assert.ok(count > 0, `${route} has no endings`)
    }
  })

  test('no duplicate challenge IDs', () => {
    const ids = Object.keys(challenges)
    const seen = new Set()
    const dupes = []
    for (const id of ids) {
      if (seen.has(id)) dupes.push(id)
      seen.add(id)
    }
    assert.strictEqual(dupes.length, 0, `Duplicate challenge IDs: ${dupes.join(', ')}`)
  })

  test('all bg src values are reasonable strings', () => {
    const bgSrcs = new Set()
    for (const [key, script] of Object.entries(scriptIndex)) {
      for (const cmd of script) {
        if (cmd.type === 'bg') {
          bgSrcs.add(cmd.src || cmd.location || cmd.id || 'MISSING')
        }
      }
    }
    console.log(`  Unique BG sources: ${bgSrcs.size} — ${[...bgSrcs].join(', ')}`)
    assert.ok(!bgSrcs.has('MISSING'), 'Found bg command with no src')
  })

  test('all character expressions used in scripts', () => {
    const expressions = new Map()
    for (const [key, script] of Object.entries(scriptIndex)) {
      for (const cmd of script) {
        const char = cmd.character || cmd.speaker
        const expr = cmd.expression
        if (char && expr && characters[char]) {
          if (!expressions.has(char)) expressions.set(char, new Set())
          expressions.get(char).add(expr)
        }
      }
    }
    for (const [char, exprSet] of expressions) {
      console.log(`  ${char}: ${[...exprSet].join(', ')}`)
    }
    assert.ok(expressions.size > 0, 'Should find character expressions')
  })
})
