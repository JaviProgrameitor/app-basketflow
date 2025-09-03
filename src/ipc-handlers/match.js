const { ipcMain } = require('electron');
const matchDb = require('../db/match.js');

// handler for matches operations
ipcMain.handle('getMatchById', (event, matchId) => {
  return matchDb.getMatchById(matchId);
});

ipcMain.handle('getMatchesByFolderId', (event, folderId) => {
  return matchDb.getMatchesByFolderId(folderId);
});

ipcMain.handle('addMatch', (event, matchData) => {
  return matchDb.addMatch(matchData);
});

ipcMain.handle('updateMatch', (event, matchData) => {
  return matchDb.updateMatch(matchData);
});

ipcMain.handle('nextPeriod', (event, matchId) => {
  return matchDb.nextPeriod(matchId);
});

ipcMain.handle('activateLastFourMinutes', (event, matchId) => {
  return matchDb.activateLastFourMinutes(matchId);
});

ipcMain.handle('deleteMatch', (event, matchId) => {
  return matchDb.deleteMatch(matchId);
});

ipcMain.handle('softDeleteMatch', (event, matchId) => {
  return matchDb.softDeleteMatch(matchId);
});