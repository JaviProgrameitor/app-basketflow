const { ipcMain } = require('electron');
const matchEventsDb = require('../db/matchEvents.js');

ipcMain.handle('getMatchEventsByMatchId', (event, matchId) => {
  return matchEventsDb.getMatchEventsByMatchId(matchId);
});

ipcMain.handle('getDeletedMatchEventsByMatchId', (event, matchId) => {
  return matchEventsDb.getDeletedMatchEventsByMatchId(matchId);
});

ipcMain.handle('addPointsEvent', (event, pointsEvent) => {
  return matchEventsDb.addPointsEvent(pointsEvent);
});

ipcMain.handle('addFoulEvent', (event, foulEvent) => {
  return matchEventsDb.addFoulEvent(foulEvent);
});

ipcMain.handle('addTimeoutEvent', (event, timeoutEvent) => {
  return matchEventsDb.addTimeoutEvent(timeoutEvent);
});

ipcMain.handle('deleteMatchEvent', (event, eventId) => {
  return matchEventsDb.deleteMatchEvent(eventId);
});

ipcMain.handle('softDeleteMatchEvent', (event, eventData) => {
  return matchEventsDb.softDeleteMatchEvent(eventData);
});