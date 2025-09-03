// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  isElectron: true,
  platform: process.platform,

  // Folders
  getFolders: () => ipcRenderer.invoke('getFolders'),
  getFolderById: (folderId) => ipcRenderer.invoke('getFolderById', folderId),
  addFolder: (folderName) => ipcRenderer.invoke('addFolder', folderName),
  updateFolder: (folderId, newName) => ipcRenderer.invoke('updateFolder', folderId, newName),
  deleteFolder: (folderId) => ipcRenderer.invoke('deleteFolder', folderId),
  softDeleteFolder: (folderId) => ipcRenderer.invoke('softDeleteFolder', folderId),
  activatePlayoffs: (folderId) => ipcRenderer.invoke('activatePlayoffs', folderId),

  // Teams
  addTeam: (teamName) => ipcRenderer.invoke('addTeam', teamName),

  // Folders Teams
  getFoldersTeamsByFolderId: (folderId) => ipcRenderer.invoke('getFoldersTeamsByFolderId', folderId),
  getFoldersTeamsByFolderIdAndTeamId: (foldersTeamsData) => ipcRenderer.invoke('getFoldersTeamsByFolderIdAndTeamId', foldersTeamsData),
  addFoldersTeams: (foldersTeamsData) => ipcRenderer.invoke('addFoldersTeams', foldersTeamsData),
  updateFoldersTeams: (foldersTeamsData) => ipcRenderer.invoke('updateFoldersTeams', foldersTeamsData),
  deleteFoldersTeams: (foldersTeamsData) => ipcRenderer.invoke('deleteFoldersTeams', foldersTeamsData),
  softDeleteFoldersTeams: (foldersTeamsData) => ipcRenderer.invoke('softDeleteFoldersTeams', foldersTeamsData),

  // Matches
  getMatchById: (matchId) => ipcRenderer.invoke('getMatchById', matchId),
  getMatchesByFolderId: (folderId) => ipcRenderer.invoke('getMatchesByFolderId', folderId),
  addMatch: (homeTeamId, awayTeamId, folderId, date, timeStart, location) => ipcRenderer.invoke('addMatch', homeTeamId, awayTeamId, folderId, date, timeStart, location),
  updateMatch: (matchData) => ipcRenderer.invoke('updateMatch', matchData),
  deleteMatch: (matchId) => ipcRenderer.invoke('deleteMatch', matchId),
  softDeleteMatch: (matchId) => ipcRenderer.invoke('softDeleteMatch', matchId),
  nextPeriod: (matchId) => ipcRenderer.invoke('nextPeriod', matchId),
  activateLastFourMinutes: (matchId) => ipcRenderer.invoke('activateLastFourMinutes', matchId),
  getMatchesBySeries: (seriesId) => ipcRenderer.invoke('getMatchesBySeries', seriesId),
  createMatchForSeries: (seriesId, matchData) => ipcRenderer.invoke('createMatchForSeries', seriesId, matchData),
  updateSeriesFromMatches: (seriesId, matchData) => ipcRenderer.invoke('updateSeriesFromMatches', seriesId, matchData),

  // Playoffs
  getTopSeeds: (folderId, limit) => ipcRenderer.invoke('getTopSeeds', folderId, limit),
  getSeriesByFolder: (folderId) => ipcRenderer.invoke('getSeriesByFolder', folderId),
  ensureSemifinals: (folderId) => ipcRenderer.invoke('ensureSemifinals', folderId),
  ensureFinal: (folderId) => ipcRenderer.invoke('ensureFinal', folderId),

  // Players
  getPlayersByTeamIdAndFolderId: (teamId, folderId) => ipcRenderer.invoke('getPlayersByTeamIdAndFolderId', teamId, folderId),
  addPlayer: (teamId, folderId, playerData) => ipcRenderer.invoke('addPlayer', teamId, folderId, playerData),
  updatePlayer: (playerData) => ipcRenderer.invoke('updatePlayer', playerData),
  deletePlayer: (playerId) => ipcRenderer.invoke('deletePlayer', playerId),
  softDeletePlayer: (playerId) => ipcRenderer.invoke('softDeletePlayer', playerId),

  // Matches Players
  getMatchPlayers: (matchId) => ipcRenderer.invoke('getMatchPlayers', matchId),
  addMatchPlayer: (matchId, playerId, number) => ipcRenderer.invoke('addMatchPlayer', matchId, playerId, number),
  removeMatchPlayer: (matchId, playerId) => ipcRenderer.invoke('removeMatchPlayer', matchId, playerId),
  softDeleteMatchPlayer: (matchId, playerId) => ipcRenderer.invoke('softDeleteMatchPlayer', matchId, playerId),
  changeParticipationPlayer: (matchId, playerId, newStatus) => ipcRenderer.invoke('changeParticipationPlayer', matchId, playerId, newStatus),

  // Generated Matches
  getGeneratedMatchesByFolderId: (folderId) => ipcRenderer.invoke('getGeneratedMatchesByFolderId', folderId),
  addGeneratedMatches: (matches) => ipcRenderer.invoke('addGeneratedMatches', matches),
  updateGeneratedMatch: (matchId, matchData) => ipcRenderer.invoke('updateGeneratedMatch', matchId, matchData),
  deleteGeneratedMatch: (folderId) => ipcRenderer.invoke('deleteGeneratedMatch', folderId),
  softDeleteGeneratedMatch: (matchId) => ipcRenderer.invoke('softDeleteGeneratedMatch', matchId),
  deleteAllGeneratedMatchesByFolderId: (folderId) => ipcRenderer.invoke('deleteAllGeneratedMatchesByFolderId', folderId),
  softDeleteAllGeneratedMatchesByFolderId: (folderId) => ipcRenderer.invoke('softDeleteAllGeneratedMatchesByFolderId', folderId),
  publishGeneratedMatch: (matchId) => ipcRenderer.invoke('publishGeneratedMatch', matchId),

  // Match Events
  getMatchEventsByMatchId: (matchId) => ipcRenderer.invoke('getMatchEventsByMatchId', matchId),
  getDeletedMatchEventsByMatchId: (matchId) => ipcRenderer.invoke('getDeletedMatchEventsByMatchId', matchId),
  addPointsEvent: (pointsEvent) => ipcRenderer.invoke('addPointsEvent', pointsEvent),
  addFoulEvent: (foulEvent) => ipcRenderer.invoke('addFoulEvent', foulEvent),
  addTimeoutEvent: (timeoutEvent) => ipcRenderer.invoke('addTimeoutEvent', timeoutEvent),
  deleteMatchEvent: (eventId) => ipcRenderer.invoke('deleteMatchEvent', eventId),
  softDeleteMatchEvent: (eventData) => ipcRenderer.invoke('softDeleteMatchEvent', eventData),

  // Folders Stasts
  getStatsByFolder: (folderId) => ipcRenderer.invoke('getStatsByFolder', folderId),
  getPointsPerGameByFolder: (folderId) => ipcRenderer.invoke('getPointsPerGameByFolder', folderId),
  getThreePointersMadeByFolder: (folderId) => ipcRenderer.invoke('getThreePointersMadeByFolder', folderId),
  getTopScorersTeamsByFolder: (folderId) => ipcRenderer.invoke('getTopScorersTeamsByFolder', folderId),
  getFewerPointsAllowedTeamsByFolder: (folderId) => ipcRenderer.invoke('getFewerPointsAllowedTeamsByFolder', folderId),
  getFewerFoulsMadeTeamsByFolder: (folderId) => ipcRenderer.invoke('getFewerFoulsMadeTeamsByFolder', folderId),

  // Match Stats
  getStatsByMatch: (playerId) => ipcRenderer.invoke('getStatsByMatch', playerId),

  // Player Stats
  getTopFoulsMadePlayerByFolder: (folderId) => ipcRenderer.invoke('getTopFoulsMadePlayerByFolder', folderId),
  getFewerFoulsMadePlayerByFolder: (folderId) => ipcRenderer.invoke('getFewerFoulsMadePlayerByFolder', folderId),

  // License
  decodeLicenseToken: (licenseToken) => ipcRenderer.invoke('decodeLicenseToken', licenseToken),
  hasAccessToApp: () => ipcRenderer.invoke('hasAccessToApp'),
  createLicense: () => ipcRenderer.invoke('createLicense'),
  getLicense: () => ipcRenderer.invoke('getLicense'),

  // Pdfs
  generateOfficialGameReport: (matchId) => ipcRenderer.invoke('generateOfficialGameReport', matchId),
  getStatsMatchForReportByMatchId: (matchId) => ipcRenderer.invoke('getStatsMatchForReportByMatchId', matchId),
  
  // Bcrypt
  hashPassword: (password) => ipcRenderer.invoke('hashPassword', password),
  comparePassword: (password, hash) => ipcRenderer.invoke('comparePassword', password, hash),
  
  // Auth
  login: ({email, password}) => ipcRenderer.invoke('login', { email, password }),
  
  // Device
  getDeviceInfo: () => ipcRenderer.invoke('getDeviceInfo'),

  // Payments
  createPayment: (paymentId) => ipcRenderer.invoke('createPayment', paymentId),

  // User
  registerUser: (dataUser) => ipcRenderer.invoke('registerUser', dataUser),
  updateUsername: (newUsername) => ipcRenderer.invoke('updateUsername', newUsername),

  // Sync data
  syncData: () => ipcRenderer.invoke('syncData'),
  bootstrapSync: () => ipcRenderer.invoke('bootstrapSync'),
  getLastSyncAt: () => ipcRenderer.invoke('getLastSyncAt'),

  // Session
  getActiveSession: () => ipcRenderer.invoke('getActiveSession'),
  deleteSession: () => ipcRenderer.invoke('deleteSession'),

  // Password
  requestPasswordReset: (email) => ipcRenderer.invoke('requestPasswordReset', email),
  verifyPasswordResetCode: (email, code) => ipcRenderer.invoke('verifyPasswordResetCode', { email, code }),
  resetPassword: (reset_token, new_password) => ipcRenderer.invoke('resetPassword', { reset_token, new_password }),
});