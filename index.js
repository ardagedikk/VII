'use strict';
/*
================================================================================
  Variables & Consts
================================================================================
*/

const { app, BrowserWindow } = require('electron');
const url  = require('url');
const path = require('path');

// Prevent window being garbage collected
let mainWindow;

/*
================================================================================
  Window Options
================================================================================
*/

function createMainWindow() {

	const win = new BrowserWindow({

    width    : 700,
    height   : 237,
    width    : 700,
		height   : 237,
		minWidth : 700,
		height   : 237,
		maxWidth : 700,
		maxHeight: 237

	});

	win.loadURL(url.format({

    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes : true

  }));

  win.setMenu(null);
	win.on('closed', onClosed);

	return win;

}

/*
================================================================================
  App Options
================================================================================
*/

function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
}

app.on('window-all-closed', () => {
	if(process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if(!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});
