"use strict";


import { app, protocol, BrowserWindow, ipcMain } from "electron";
const path = require("path");
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
import { autoUpdater } from "electron-updater";


// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

//creates a new window with options like fullscreen and stuff passed in
let win;
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    frame: true,
    //used to read stored storeData from file
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js") // use a preload script
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html"); // When app starts loads the index html page
  }

  win.removeMenu();
  //this is used for printing, when we create new window, line 66 creates the printing window
  win.webContents.on(
    "new-window",
    (event, url, frameName, disposition, options) => {
      if (frameName === "modal") {
        // open window as modal
        event.preventDefault();
        Object.assign(options, {
          modal: true,
          parent: win,
          width: 100,
          height: 100
        });
        event.newGuest = new BrowserWindow(options);
      }
    }
  );
  let needsFocusFix = false;
  let triggeringProgrammaticBlur = false;
  let isMinimized = false;

  win.on("minimize", () => {
    isMinimized = true;
  });

  win.on("blur", () => {
    if (!triggeringProgrammaticBlur) {
      needsFocusFix = true;
    }
  });

  win.on("focus", () => {
    if (isMinimized) {
      isMinimized = false;
      if (needsFocusFix) {
        needsFocusFix = false;
        triggeringProgrammaticBlur = true;
        setTimeout(function() {
          win.blur();
          win.focus();
          setTimeout(function() {
            triggeringProgrammaticBlur = false;
          }, 100);
        }, 100);
      }
    }
  });

  autoUpdater.autoDownload = false;
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}


autoUpdater.on("download-progress", progressObj => {
  if (progressObj.percent === 100) {
    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 1000);
  }
  win.webContents.send("progress", progressObj.percent);
});

//prettier-ignore
ipcMain.on("clientMessage", (event, args) => {
  if (args === "checkForUpdates") {
    try {
      autoUpdater
        .checkForUpdates()
        .then(response => {
          win.webContents.send("electronMessage", response.updateInfo.version);
        })
        .catch(error => {
          win.webContents.send("electronMessage", "ERROR: " + error);
        });
    }
    catch (error) {
      win.webContents.send("electronMessage", "ERROR: " + error);
    }
  }
});

ipcMain.on("downloadUpdate", () => {
  try {
    autoUpdater
      .checkForUpdates()
      .then(() => {
        win.webContents.send("startingDownload", "started");
        autoUpdater.downloadUpdate().catch(error => {
          win.webContents.send("electronMessage", "ERROR: " + error);
        });
      })
      .catch(error => {
        win.webContents.send("electronMessage", "ERROR: " + error);
      });
  } catch (error) {
    win.webContents.send("electronMessage", "ERROR: " + error);
  }
});


