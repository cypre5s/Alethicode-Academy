let pyodide = null
let loading = false

export function usePythonRunner() {

  async function initialize() {
    if (pyodide) return
    if (loading) {
      while (loading) await new Promise(r => setTimeout(r, 200))
      return
    }
    loading = true
    try {
      const { loadPyodide } = await import('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs')
      pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      })
      window._pyodide = pyodide
    } finally {
      loading = false
    }
  }

  async function runCode(code, timeoutMs = 5000) {
    if (!pyodide) {
      await initialize()
    }
    if (!pyodide) {
      return { stdout: '', stderr: 'Pyodide 加载失败', success: false, executionTime: 0 }
    }

    const start = Date.now()
    try {
      pyodide.runPython(`
import sys, io
_capture_out = io.StringIO()
_capture_err = io.StringIO()
sys.stdout = _capture_out
sys.stderr = _capture_err
`)

      const timer = setTimeout(() => {
        try { pyodide.interruptExecution() } catch {}
      }, timeoutMs)

      pyodide.runPython(code)
      clearTimeout(timer)

      const stdout = pyodide.runPython('_capture_out.getvalue()')
      const stderr = pyodide.runPython('_capture_err.getvalue()')

      pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`)

      return {
        stdout: String(stdout).slice(0, 2000),
        stderr: String(stderr).slice(0, 500),
        success: true,
        executionTime: Date.now() - start,
      }
    } catch (e) {
      try {
        pyodide.runPython(`
import sys
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`)
      } catch {}

      return {
        stdout: '',
        stderr: String(e.message || e).slice(0, 500),
        success: false,
        executionTime: Date.now() - start,
      }
    }
  }

  function isReady() {
    return !!pyodide
  }

  return {
    initialize,
    runCode,
    isReady,
  }
}
