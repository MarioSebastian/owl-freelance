import {contextBridge, ipcRenderer} from "electron";

contextBridge.exposeInMainWorld('ipcRenderer', {
  //Render (Vue) to main (Electron)
  send: (channel, data) => {
    let validChannels = ["clientMessage", "downloadUpdate"]; // <-- Array of all ipcRenderer Channels used in the client
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  //Main (Electron) to Render (Vue)
  on: (channel, func) => {
    let validChannels = ["electronMessage", "progress", "version", "startingDownload"]; // <-- Array of all ipcMain Channels used in the electron
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, args) => func(args))
    }
  }
})
