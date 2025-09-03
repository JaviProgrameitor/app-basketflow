const { ipcMain } = require('electron');
const teamsDb = require('../db/teams.js');

// Handler for adding a team
ipcMain.handle('addTeam', (event, teamName) => {
  return teamsDb.addTeam(teamName);
});