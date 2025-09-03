
const { ipcMain } = require('electron');
const { deleteSession, getActiveSession } = require('../db/session.js')

ipcMain.handle('getActiveSession', async () => {
  return getActiveSession();
});

ipcMain.handle('deleteSession', async () => {
  deleteSession();
});