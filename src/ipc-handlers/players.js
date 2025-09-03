
const { ipcMain } = require('electron');
const playersDb = require('../db/players.js');

// Handle IPC for player operations
ipcMain.handle('getPlayersByTeamIdAndFolderId', (event, teamId, folderId) => {
  return playersDb.getPlayersByTeamIdAndFolderId(teamId, folderId);
});

ipcMain.handle('addPlayer', (event, team_id, folder_id, playerData) => {
  return playersDb.addPlayer(team_id, folder_id, playerData);
});

ipcMain.handle('updatePlayer', (event, playerData) => {
  return playersDb.updatePlayer(playerData);
});

ipcMain.handle('deletePlayer', (event, playerId) => {
  return playersDb.deletePlayer(playerId);
});

ipcMain.handle('softDeletePlayer', (event, playerId) => {
  return playersDb.softDeletePlayer(playerId);
});