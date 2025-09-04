const { app, BrowserWindow } = require('electron')
const createWindow = () => {
  const win = new BrowserWindow({
    width: 950,
    height: 700,
    frame: false
  })

  win.loadURL("http://localhost:5173/")
}
app.whenReady().then(() => {
  createWindow()
})