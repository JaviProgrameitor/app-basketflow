const db = require('../database.js');

// Handle IPC for match - players operations
const getMatchPlayers = (matchId) => {
  try {
    const stmt = db.prepare(`
      SELECT
        mp.*,
        p.name AS player_name,
        t.id AS team_id,
        COALESCE(NULLIF(TRIM(mp.jersey_number), ''), p.number) AS jersey_number
      FROM match_players mp
      JOIN players p ON mp.player_id = p.id AND p.deleted = 0
      JOIN teams t ON p.team_id = t.id AND t.deleted = 0
      WHERE mp.match_id = ? AND mp.deleted = 0;
    `);
    const matchPlayers = stmt.all(matchId);
    return matchPlayers;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch match players');
  }
};

const addMatchPlayer = (matchId, playerId, jerseyNumber) => {
  try {
    const stmt = db.prepare('INSERT INTO match_players (match_id, player_id, jersey_number, updated_at, pending_sync) VALUES (?, ?, ?, ?, 1)');
    const info = stmt.run(matchId, playerId, jerseyNumber, new Date().toISOString());
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to add match player');
  }
};

const removeMatchPlayer = (matchId, playerId) => {
  try {
    const stmt = db.prepare('DELETE FROM match_players WHERE match_id = ? AND player_id = ?');
    const info = stmt.run(matchId, playerId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to remove match player');
  }
};

const softDeleteMatchPlayer = (matchId, playerId) => {
  try {
    const stmt = db.prepare('UPDATE match_players SET deleted = 1, updated_at = ?, pending_sync = 1 WHERE match_id = ? AND player_id = ?');
    const info = stmt.run(new Date().toISOString(), matchId, playerId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to soft delete match player');
  }
};

const changeParticipationPlayer = (matchId, playerId, newParticipation) => {
  try {
    const stmt = db.prepare('UPDATE match_players SET participation = ?, updated_at = ?, pending_sync = 1 WHERE match_id = ? AND player_id = ?');
    const info = stmt.run(newParticipation, new Date().toISOString(), matchId, playerId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to change participation status');
  }
}

module.exports = {
  getMatchPlayers,
  addMatchPlayer,
  removeMatchPlayer,
  softDeleteMatchPlayer,
  changeParticipationPlayer
};