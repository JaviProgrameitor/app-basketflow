const {  ipcMain } = require('electron');
const generatedMatchesDb = require('../db/generatedMatches.js');

// Handle IPC for generated matches operations
ipcMain.handle('getGeneratedMatchesByFolderId', (event, folderId) => {
  return generatedMatchesDb.getGeneratedMatchesByFolderId(folderId);
});

ipcMain.handle('addGeneratedMatches', (event, matches) => {
  return generatedMatchesDb.addGeneratedMatches(matches);
});

ipcMain.handle('updateGeneratedMatch', (event, matchData) => {
  return generatedMatchesDb.updateGeneratedMatch(matchData);
});

ipcMain.handle('deleteGeneratedMatch', (event, matchId) => {
  return generatedMatchesDb.deleteGeneratedMatch(matchId);
});

ipcMain.handle('softDeleteGeneratedMatch', (event, matchId) => {
  return generatedMatchesDb.softDeleteGeneratedMatch(matchId);
});

ipcMain.handle('deleteAllGeneratedMatchesByFolderId', (event, folderId) => {
  return generatedMatchesDb.deleteAllGeneratedMatchesByFolderId(folderId);
});

ipcMain.handle('softDeleteAllGeneratedMatchesByFolderId', (event, folderId) => {
  return generatedMatchesDb.softDeleteAllGeneratedMatchesByFolderId(folderId);
});

ipcMain.handle('publishGeneratedMatch', (event, matchId) => {
  return generatedMatchesDb.publishGeneratedMatch(matchId);
});
