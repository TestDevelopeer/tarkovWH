const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');
const server = require('./app.js');

let win;

function createWindow() {
    win = new BrowserWindow({width: 1280, height: 720, titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#f8f9fa',
            symbolColor: '#E0040B'
        }, icon: __dirname + '/icon.ico'});

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.on('closed', () => {
        win = null;
    });

    win.on('will-resize', (event) => {
        event.preventDefault();
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});