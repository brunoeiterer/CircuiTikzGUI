'use strict';
const electron = require('electron');
const Menu = require('electron');
const fs = require('fs');
const app = electron.app;
const {ipcMain} = require('electron');
const webContents = require('electron');
// Prevent window being garbage collected
let mainWindow;

// ipcMain.on("export", getComponents(event, args));

function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400,
		webPreferences: {
			nodeIntegration: true
		}
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
	setMainMenu();
});

function setMainMenu() {
	const template = [
		{
		  label: 'File',
		  submenu: [
			{
			  label: 'Save',
			  click() {
			  }
			},
			{
				label: 'Open',
				click() {
				}
			},
			{
				label: 'Export',
				click() {
					fs.writeFile("C:\\Users\\Bruno\\Desktop\\test.txt", "test", (err) => {
						if (err) throw err;
					});
					exportCode();
				}
			}
		  ]
		}
	  ];
	  electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate(template));
}

function exportCode() {
	mainWindow.webContents.send('export', 'components');
}

/* listener to receive the components from the renderer process */
ipcMain.on('export', (event, data) => {

})
