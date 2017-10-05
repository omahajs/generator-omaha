const {app, BrowserWindow, Menu} = require('electron');
const {join} = require('path');

//
// Add debug features like hotkeys for triggering dev tools and reload
//
require('electron-debug')();

const menu = Menu.buildFromTemplate([
    {
        label: 'Application',
        submenu: [{
            label: 'Quit',
            accelerator: `${(process.platform === 'darwin') ? 'Command' : 'Control'}+Q`,
            click: () => app.quit()
        }]
    },
    {
        label: 'Debug',
        submenu: [{
            label: 'Toggle DevTools',
            click: () => mainWindow.toggleDevTools()
        }]
    }
]);

let mainWindow;
let preload = join(__dirname, 'bin', 'preload.js');

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {preload}
    });
    Menu.setApplicationMenu(menu);
    mainWindow.loadURL(`file://${__dirname}/renderer/<%= rendererIndexPath %>`);
    //
    // Open dev console
    //
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};
app.on('ready', createWindow);
app.on('window-all-closed', () => {
    //
    // On OS X it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
    //
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    //
    // On OS X it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
    //
    if (mainWindow === null) {
        createWindow();
    }
});
