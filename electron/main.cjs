const { app, BrowserWindow, shell, session, globalShortcut } = require('electron')
const path = require('path')

const isDev = !app.isPackaged

function createWindow() {
  const iconExt = process.platform === 'win32' ? 'app-icon.ico' : 'app-icon.png'
  const win = new BrowserWindow({
    width: 1366,
    height: 800,
    minWidth: 1100,
    minHeight: 680,
    autoHideMenuBar: true,
    backgroundColor: '#f6efe8',
    icon: path.join(__dirname, '..', iconExt),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      allowRunningInsecureContent: false,
      enableRemoteModule: false,
      devTools: isDev,
    },
  })

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline'; " +
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
          "font-src 'self' https://fonts.gstatic.com; " +
          "img-src 'self' data: blob:; " +
          "media-src 'self' data: blob:; " +
          "connect-src 'self' https: http://127.0.0.1:* http://localhost:*"
        ]
      }
    })
  })

  if (isDev) {
    win.loadURL('http://127.0.0.1:3333')
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  if (!isDev) {
    win.webContents.on('before-input-event', (event, input) => {
      if (input.key === 'F12' ||
          (input.control && input.shift && (input.key === 'I' || input.key === 'J')) ||
          (input.control && input.key === 'u')) {
        event.preventDefault()
      }
    })
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
