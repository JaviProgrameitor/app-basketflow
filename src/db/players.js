const db = require('../database.js');
const { v4: uuidv4 } = require('uuid');

// Handle IPC for player operations
const getPlayersByTeamIdAndFolderId = (teamId, folderId) => {
  try {
    const stmt = db.prepare('SELECT * FROM players WHERE team_id = ? AND folder_id = ? AND deleted = 0');
    const players = stmt.all(teamId, folderId);
    return players;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch players');
  }
};

const addPlayer = (team_id, folder_id, playerData) => {
  try {
    const id = uuidv4()
    const stmt = db.prepare('INSERT INTO players (id, team_id, folder_id, number, name, position, updated_at, pending_sync) VALUES (?, ?, ?, ?, ?, ?, ?, 1)');
    const info = stmt.run(id, team_id, folder_id, playerData.number, playerData.name, playerData.position, new Date().toISOString());
    return id;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to add player');
  }
};

const updatePlayer = (playerData) => {
  try {
    const stmt = db.prepare('UPDATE players SET number = ?, name = ?, position = ?, updated_at = ?, pending_sync = 1 WHERE id = ?');
    const info = stmt.run(playerData.number, playerData.name, playerData.position, new Date().toISOString(), playerData.id);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to update player');
  }
};

const deletePlayer = (playerId) => {
  try {
    const stmt = db.prepare('DELETE FROM players WHERE id = ?');
    const info = stmt.run(playerId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to delete player');
  }
};

const softDeletePlayer = (playerId) => {
  try {
    const stmt = db.prepare('UPDATE players SET deleted = 1, pending_sync = 1, updated_at = ? WHERE id = ?');
    const info = stmt.run(new Date().toISOString(), playerId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to soft delete player');
  }
};

module.exports = {
  getPlayersByTeamIdAndFolderId,
  addPlayer,
  updatePlayer,
  deletePlayer,
  softDeletePlayer
};