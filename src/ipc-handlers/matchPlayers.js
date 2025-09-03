const { ipcMain } = require('electron');
const matchPlayersDb = require('../db/matchPlayers.js');

// Handle IPC for match - players operations
ipcMain.handle('getMatchPlayers', (event, matchId) => {
  return matchPlayersDb.getMatchPlayers(matchId);
});

ipcMain.handle('addMatchPlayer', (event, matchId, playerId, jerseyNumber) => {
  return matchPlayersDb.addMatchPlayer(matchId, playerId, jerseyNumber);
});

ipcMain.handle('removeMatchPlayer', (event, matchId, playerId) => {
  return matchPlayersDb.removeMatchPlayer(matchId, playerId);
});

ipcMain.handle('softDeleteMatchPlayer', (event, matchId, playerId) => {
  return matchPlayersDb.softDeleteMatchPlayer(matchId, playerId);
});

ipcMain.handle('changeParticipationPlayer', (event, matchId, playerId, newStatus) => {
  return matchPlayersDb.changeParticipationPlayer(matchId, playerId, newStatus);
});
