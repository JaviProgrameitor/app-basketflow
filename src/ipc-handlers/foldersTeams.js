const {ipcMain} = require('electron');
const foldersTeamsDb = require('../db/foldersTeams.js');

// Handler for folders_teams operations
ipcMain.handle('getFoldersTeams', () => {
  return foldersTeamsDb.getFoldersTeams();
});

ipcMain.handle('getFoldersTeamsByFolderId', (event, folderId) => {
  return foldersTeamsDb.getFoldersTeamsByFolderId(folderId);
});

ipcMain.handle('getFoldersTeamsByFolderIdAndTeamId', (event, foldersTeamsData) => {
  return foldersTeamsDb.getFoldersTeamsByFolderIdAndTeamId(foldersTeamsData);
});

ipcMain.handle('addFoldersTeams', (event, foldersTeamsData) => {
  return foldersTeamsDb.addFoldersTeams(foldersTeamsData);
});

ipcMain.handle('updateFoldersTeams', (event, foldersTeamsData) => {
  return foldersTeamsDb.updateFoldersTeams(foldersTeamsData);
});

ipcMain.handle('deleteFoldersTeams', (event, foldersTeamsData) => {
  return foldersTeamsDb.deleteFoldersTeams(foldersTeamsData);
});

ipcMain.handle('softDeleteFoldersTeams', (event, foldersTeamsData) => {
  return foldersTeamsDb.softDeleteFoldersTeams(foldersTeamsData);
});