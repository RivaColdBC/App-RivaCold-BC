const { app, BrowserWindow, ipcMain } = require("electron");
const os = require("os")

function createWindow(url) {
    win = new BrowserWindow({
        height: 600, width: 1200, center: true, show: true,
        webPreferences: {
            plugins: true, nodeIntegration: true,
            enableRemoteModule: true, contextIsolation: false,
            backgroundThrottling: false, webSecurity: false, sandbox: false
        },
    });
    !process.defaultApp && os.userInfo().username != "YYZ" ? win.removeMenu() : null
    win.maximize();
    win.setTitle("App-RivaCold-BC");
    url ? win.loadFile(url) : win.loadFile("./app/index.html");
}



ipcMain.on('newWindow', (event, data) => createWindow(data))
app.on('ready', () => createWindow())
app.on("window-all-closed", () => app.quit());