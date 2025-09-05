const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 950,
    height: 700,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })

  win.loadURL("http://localhost:5173/")
  
  // 监听窗口最小化请求
  ipcMain.on('window-minimize', () => {
    win.minimize()
  })
  
  // 监听窗口关闭请求
  ipcMain.on('window-close', () => {
    win.close()
  })
}

app.whenReady().then(() => {
  createWindow()
})

// 当所有窗口都关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 当应用激活时创建窗口（macOS）
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})