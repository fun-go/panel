const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => {
      // 白名单 channels
      let validChannels = ['window-minimize', 'window-close']
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
      }
    }
  }
})