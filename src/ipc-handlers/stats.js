const { ipcMain } = require('electron');
const stats = require('../db/stats.js');

// Stats by Match
ipcMain.handle('getStatsByMatch', (event, match_id) => {
  return stats.getStatsByMatch(match_id);
});

// Stats by folders
ipcMain.handle('getStatsByFolder', (event, folder_id) => {
  return stats.getStatsByFolder(folder_id);
})

ipcMain.handle('getPointsPerGameByFolder', (event, folderId) => {
  return stats.getPointsPerGameByFolder(folderId);
})

ipcMain.handle('getThreePointersMadeByFolder', (event, folderId) => {
  return stats.getThreePointersMadeByFolder(folderId);
});

ipcMain.handle('getTopScorersTeamsByFolder', (event, folderId) => {
  return stats.getTopScorersTeamsByFolder(folderId);
});

ipcMain.handle('getFewerPointsAllowedTeamsByFolder', (event, folderId) => {
  return stats.getFewerPointsAllowedTeamsByFolder(folderId);
});

ipcMain.handle('getFewerFoulsMadeTeamsByFolder', (event, folderId) => {
  return stats.getFewerFoulsMadeTeamsByFolder(folderId);
});