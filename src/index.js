const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const { menuTemplate } = require('./lib/menu.js');
const { globalShortcuts } = require('./lib/global-shortcuts.js');
const { readFileSync, writeFileSync } = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Live Reload
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
    awaitWriteFinish: true
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../public/index.html'));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
};

function createAppMenu() {
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();
    createAppMenu();
});

// Simulate local shortcuts; register when app has focus
app.on('browser-window-focus', () => globalShortcuts.register(mainWindow));

// Release shortcuts when app loses focus
app.on('browser-window-blur', () => globalShortcuts.unregisterAll());

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain
    // Open the file select dialog
    .on('openFile', () => {
        const selectedFiles = dialog.showOpenDialogSync({
            title: "Select a file",
            filters: [
                {
                    name: "SVG Files",
                    extensions: ["svg"]
                }
            ],
            properties: ["openFile"]
        });

        // If the user cancels out, selectedFile will be undefined
        if (typeof selectedFiles === "undefined") return;

        const selectedFile = selectedFiles.pop();

        const fileContent = readFileSync(selectedFile).toString(); // buffer -> string

        // Now we need to send the content to the renderer process via IPC (inter-process communication)
        mainWindow.webContents.send("fileSelected", {
            selectedFile,
            fileContent
        });
    })

    // The SVG was saved (contents modified)
    .on('saveSvg', (events, args) => {
        const filePath = args.selectedFile.fullPath;
        const fileContent = args.fileContent.trim();

        if (!filePath) return;

        // Warn if trying to save empty SVG content
        if (!fileContent) {
            const dialogResponse = dialog.showMessageBoxSync({
                title: `Empty SVG content`,
                type: "warning",
                message: "Are you sure you want to save empty content?",
                detail: `I wouldn't recommend overwriting\n${filePath}\nwith empty content, but go ahead if that's what you want.`,
                buttons: [
                    "Save - I know what I'm doing",
                    "Cancel",
                ]
            });

            if (dialogResponse === 1) return; // Cancel
        };

        // Write the file to disk
        writeFileSync(filePath, fileContent, 'utf8');

        mainWindow.webContents.send('fileSaved');
    })

    // The image was exported (SVG, PNG, etc)
    .on('imageAvailableForExport', (events, args) => {
        const { fileName, filePath, type, imgContent } = { ...args }
        const encoding = type === 'png' ? 'base64' : 'utf8';
        const DIR_SEPARATOR = process.platform === "win32" ? "\\" : "/"; // TODO this should be module.exports from utils.js

        // Show the file save dialog - pick the save location
        const dialogFilePath = dialog.showSaveDialogSync({
            title: `Save file as ${type.toUpperCase()}`,
            defaultPath: fileName || `Untitled.${type}`,
            filters: [
                {
                    title: type,
                    extensions: [type]
                }
            ]
        });

        // The user cancels out
        if (typeof dialogFilePath === 'undefined') return;

        // The file name chosen by the user in the dialog; may be different than the original fileName
        // TODO for Linux @see https://nodejs.org/api/path.html#path_windows_vs_posix
        const dialogFileName = path.basename(dialogFilePath);

        // Write the file to disk
        writeFileSync(`${dialogFilePath}`, imgContent, encoding);

        mainWindow.webContents.send('fileExported');
    })

    // Toggle the Edit > Revert menu option depending if the file was modified
    .on('originalFileModified', (events, args) => {
        Menu.getApplicationMenu().getMenuItemById('revert-changes').enabled = args.originalFileModified;
    })

    // Forward events to Renderer process (Notifier, etc)
    .on('fileMissing', () => {
        mainWindow.webContents.send('fileMissing'); // The selectedFile persisted in localStorage was deleted/moved/renamed on disk
    })
    .on('svgParseOk', () => {
        mainWindow.webContents.send('svgParseOk'); // The SVG markup is valid (this is evaluated as the user types during editing)
    })
    .on('svgParseError', (events, args) => {
        mainWindow.webContents.send('svgParseError', { message: args.message }); // The SVG markup is invalid (usually happens during editing)
    })
    .on('markupCopied', () => {
        mainWindow.webContents.send('markupCopied'); // SVG markup was copied to the clipboard
    })
    .on('innerMarkupCopied', () => {
        mainWindow.webContents.send('innerMarkupCopied'); // Inner SVG markup was copied to the clipboard
    })
    .on('saveFile', () => {
        mainWindow.webContents.send('saveFile'); // Save the SVG file in the editor
    })
    .on('revertChanges', () => {
        mainWindow.webContents.send('revertChanges'); // Discard the code changes
    })
    .on('needDocsFolderPermissions', () => {
        if (process.platform === 'darwin') {
            dialog.showMessageBoxSync(mainWindow, {
                title: "File permission error",
                message: "Please give SVGX permission to access the Documents folder.",
                detail: "Open Preferences > Security & Privacy > Files and Folders, then find SVGX in the list, and make sure the Documents Folder box is checked.",
            })
        }
    })
    ;
