const { ipcMain } = require('electron');
const foldersDb = require('../db/folders.js');

ipcMain.handle('getFolders', () => {
  return foldersDb.getFolders();
});

ipcMain.handle('getFolderById', (event, folderId) => {
  return foldersDb.getFolderById(folderId);
});

ipcMain.handle('addFolder', (event, folderData) => {
  return foldersDb.addFolder(folderData);
});

ipcMain.handle('updateFolder', (event, folderData) => {
  return foldersDb.updateFolder(folderData);
});

ipcMain.handle('deleteFolder', (event, folderId) => {
  return foldersDb.deleteFolder(folderId);
});

ipcMain.handle('softDeleteFolder', (event, folderId) => {
  return foldersDb.softDeleteFolder(folderId);
});

ipcMain.handle('activatePlayoffs', (event, folderId) => {
  return foldersDb.activatePlayoffs(folderId);
});