const PATTERNS = {
  function_def: /\bdef\s+(\w+)\s*\(/g,
  class_def: /\bclass\s+(\w+)/g,
  for_loop: /\bfor\s+\w+\s+in\b/g,
  while_loop: /\bwhile\b/g,
  if_statement: /\bif\b/g,
  list_comprehension: /\[\s*\w+.*\bfor\b.*\bin\b/g,
  try_except: /\btry\s*:/g,
  import_statement: /\b(?:import|from)\s+\w+/g,
  f_string: /f["']/g,
  print_call: /\bprint\s*\(/g,
  comment: /#[^\n]*/g,
  variable_assign: /^\s*\w+\s*=/gm,
  recursion: null,
  magic_number: /(?<!=)\b\d{2,}\b(?!\s*[=:])/g,
}

const STYLE_RULES = [
  { id: 'has_functions', check: c => (c.match(PATTERNS.function_def) || []).length > 0, weight: 2, label: '使用了函数' },
  { id: 'has_comments', check: c => (c.match(PATTERNS.comment) || []).length > 0, weight: 1, label: '有注释' },
  { id: 'uses_comprehension', check: c => (c.match(PATTERNS.list_comprehension) || []).length > 0, weight: 2, label: '使用列表推导' },
  { id: 'has_error_handling', check: c => (c.match(PATTERNS.try_except) || []).length > 0, weight: 2, label: '有异常处理' },
  { id: 'uses_f_strings', check: c => (c.match(PATTERNS.f_string) || []).length > 0, weight: 1, label: '使用f-string' },
  { id: 'no_magic_numbers', check: c => (c.match(PATTERNS.magic_number) || []).length === 0, weight: 1, label: '无魔法数字' },
  { id: 'short_functions', check: c => {
    const fns = c.split(/\ndef\s+/); return fns.every(f => f.split('\n').length < 20)
  }, weight: 1, label: '函数精简' },
  { id: 'good_naming', check: c => {
    const vars = c.match(/^\s*([a-z_]\w{2,})\s*=/gm) || []
    return vars.length >= 2
  }, weight: 1, label: '有意义的变量名' },
]

function analyzeCode(code) {
  const lines = code.split('\n')
  const nonEmptyLines = lines.filter(l => l.trim())

  const structure = {
    totalLines: lines.length,
    codeLines: nonEmptyLines.length,
    functions: (code.match(PATTERNS.function_def) || []).length,
    classes: (code.match(PATTERNS.class_def) || []).length,
    loops: (code.match(PATTERNS.for_loop) || []).length + (code.match(PATTERNS.while_loop) || []).length,
    conditionals: (code.match(PATTERNS.if_statement) || []).length,
    imports: (code.match(PATTERNS.import_statement) || []).length,
    comments: (code.match(PATTERNS.comment) || []).length,
    variables: (code.match(PATTERNS.variable_assign) || []).length,
  }

  let qualityScore = 50
  const passedRules = []
  const failedRules = []

  for (const rule of STYLE_RULES) {
    if (rule.check(code)) {
      qualityScore += rule.weight * 5
      passedRules.push({ id: rule.id, label: rule.label })
    } else {
      failedRules.push({ id: rule.id, label: rule.label })
    }
  }

  const commentRatio = nonEmptyLines.length > 0 ? structure.comments / nonEmptyLines.length : 0
  if (commentRatio > 0.1 && commentRatio < 0.4) qualityScore += 5

  const complexity = structure.loops + structure.conditionals + structure.functions * 2
  const complexityLabel = complexity <= 3 ? 'simple' : complexity <= 8 ? 'moderate' : 'complex'

  qualityScore = Math.min(100, Math.max(0, qualityScore))

  const suggestions = []
  if (structure.functions === 0 && nonEmptyLines.length > 10) {
    suggestions.push({ type: 'refactor', text: '代码较长，考虑用函数拆分？' })
  }
  if (structure.comments === 0 && nonEmptyLines.length > 5) {
    suggestions.push({ type: 'style', text: '加几行注释会更清晰' })
  }
  if (code.match(PATTERNS.magic_number)?.length > 2) {
    suggestions.push({ type: 'style', text: '有些数字可以用有意义的变量名替代' })
  }

  return {
    structure,
    qualityScore,
    complexity: complexityLabel,
    passedRules,
    failedRules,
    suggestions,
  }
}

if (typeof self !== 'undefined' && typeof self.onmessage !== 'undefined') {
  self.onmessage = function(e) {
    const { id, code } = e.data
    const result = analyzeCode(code)
    self.postMessage({ id, result })
  }
}

export { analyzeCode }
