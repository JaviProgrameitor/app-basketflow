const { ipcMain } = require('electron');
const playoffsDb = require('../db/playoffs');

ipcMain.handle('getTopSeeds', (event, folderId, limit) => {
  return playoffsDb.getTopSeeds(folderId, limit);
});

ipcMain.handle('getSeriesByFolder', (event, folderId) => {
  return playoffsDb.getSeriesByFolder(folderId);
});

ipcMain.handle('ensureSemifinals', (event, folderId) => {
  return playoffsDb.ensureSemifinals(folderId);
});

ipcMain.handle('getMatchesBySeries', (event, seriesId) => {
  return playoffsDb.getMatchesBySeries(seriesId);
});

ipcMain.handle('createMatchForSeries', (event, seriesId, options) => {
  return playoffsDb.createMatchForSeries(seriesId, options);
});

ipcMain.handle('updateSeriesFromMatches', (event, seriesId) => {
  return playoffsDb.updateSeriesFromMatches(seriesId);
});

ipcMain.handle('ensureFinal', (event, folderId) => {
  return playoffsDb.ensureFinal(folderId);
});
