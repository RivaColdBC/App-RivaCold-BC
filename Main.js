const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const os = require("os")

function createWindow(url) {
    win = new BrowserWindow({
        height: 600, width: 1200, center: true, show: true,
        webPreferences: {
            plugins: true, nodeIntegration: true,
            enableRemoteModule: true, contextIsolation: false,
            backgroundThrottling: false, webSecurity: false
        },
    });
    !process.defaultApp && os.userInfo().username != "YYZ" ? win.removeMenu() : null
    win.maximize();
    win.setTitle("RivaColdSelect");
    url ? win.loadFile(url) : win.loadFile("./app/main/index.html");
    return
}
ipcMain.on('newWindow', function (event, data) {
    createWindow(data)
})

const { autoUpdater } = require('electron-updater')
const log = require('electron-log')
app.on('ready', () => {
    createWindow()
    autoUpdater.checkForUpdatesAndNotify()
})

app.on("window-all-closed", () => { app.quit() });

autoUpdater.on("update-available", () => {
    log.info("update-available")
})
autoUpdater.on("checking-for-update", () => {
    log.info("checking-for-update")
})
autoUpdater.on("download-progress", () => {
    log.info("download-progress")
})
autoUpdater.on("update-downloaded", () => {
    log.info("update-downloaded")
})

async function checkfs() {
    const fs = require("fs");
    if (fs.existSync("\\\\call-bc\\Carpetas Publicas\\TECNIC\\RivaColdSelect\\rivacoldselect Setup 1.2.9.exe")) {
        options = { message: 'Actualización disponible en \\\\call-bc\\Carpetas Publicas\\TECNIC\\RivaColdSelect.', };
        dialog.showMessageBox(null, options);
    }
}