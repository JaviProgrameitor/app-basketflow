const db = require('../database.js');
const { v4: uuidv4 } = require('uuid');

// handler for matches operations
const getMatchById = (matchId) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        m.*,
        th.name AS home_team_name,
        fth.custom_name AS home_team_custom_name,
        fth.coach AS home_team_coach,
        fth.assistant_coach AS home_team_assistant_coach,
        fth.primary_color AS home_team_primary_color,
        ta.name AS away_team_name,
        fta.custom_name AS away_team_custom_name,
        fta.coach AS away_team_coach,
        fta.assistant_coach AS away_team_assistant_coach,
        fta.primary_color AS away_team_primary_color
      FROM matches m
      JOIN teams th ON m.home_team_id = th.id AND th.deleted = 0
      JOIN folders_teams fth ON m.folder_id = fth.folder_id AND m.home_team_id = fth.team_id AND fth.deleted = 0
      JOIN teams ta ON m.away_team_id = ta.id AND ta.deleted = 0
      JOIN folders_teams fta ON m.folder_id = fta.folder_id AND m.away_team_id = fta.team_id AND fta.deleted = 0
      WHERE m.id = ? AND m.deleted = 0
    `);
    const match = stmt.get(matchId);
    return match;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch match');
  }
};

const getMatchesByFolderId = (folderId) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        m.*,
        COALESCE(NULLIF(TRIM(fth.custom_name), ''), th.name) AS home_team_name,
        fth.coach AS home_team_coach,
        fth.assistant_coach AS home_team_assistant_coach,
        fth.primary_color AS home_team_primary_color,
        COALESCE(NULLIF(TRIM(fta.custom_name), ''), ta.name) AS away_team_name,
        fta.coach AS away_team_coach,
        fta.assistant_coach AS away_team_assistant_coach,
        fta.primary_color AS away_team_primary_color
      FROM matches m
      JOIN teams th
        ON th.id = m.home_team_id AND th.deleted = 0
      JOIN folders_teams fth
        ON fth.folder_id = m.folder_id AND fth.team_id = m.home_team_id AND fth.deleted = 0
      JOIN teams ta
        ON ta.id = m.away_team_id AND ta.deleted = 0
      JOIN folders_teams fta
        ON fta.folder_id = m.folder_id AND fta.team_id = m.away_team_id AND fta.deleted = 0
      WHERE m.folder_id = ?
        AND m.deleted = 0
      ORDER BY m.date ASC, m.time_start ASC;
    `);

    const matches = stmt.all(folderId);
    return matches;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch matches');
  }
};

const addMatch = (matchData) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO matches 
        (id, home_team_id, away_team_id, folder_id, date, time_start, location, updated_at, pending_sync) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    const info = stmt.run(
      uuidv4(),
      matchData.home_team_id,
      matchData.away_team_id,
      matchData.folder_id,
      matchData.date,
      matchData.time_start,
      matchData.location,
      new Date().toISOString()
    );
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to add match');
  }
};

const updateMatch = (matchData) => {
  try {
    const stmt = db.prepare(`
      UPDATE matches 
      SET 
        home_team_id = ?, 
        away_team_id = ?, 
        number_game = ?, 
        date = ?, 
        time_start = ?, 
        time_end = ?,
        location = ?, 
        referee_main = ?, 
        referee1 = ?,
        referee2 = ?,
        anotator = ?,
        assistant_anotator = ?,
        timekeeper = ?,
        clock_operator = ?,
        status = ?,
        updated_at = ?,
        password_crew_chief = ?,
        pending_sync = 1,
        home_score = ?,
        away_score = ?,
        winner_team_id = ?
      WHERE id = ?
    `);
    const info = stmt.run(
      matchData.home_team_id,
      matchData.away_team_id,
      matchData.number_game,
      matchData.date,
      matchData.time_start,
      matchData.time_end,
      matchData.location,
      matchData.referee_main,
      matchData.referee1,
      matchData.referee2,
      matchData.anotator,
      matchData.assistant_anotator,
      matchData.timekeeper,
      matchData.clock_operator,
      matchData.status,
      new Date().toISOString(),
      matchData.password_crew_chief,
      matchData.home_score,
      matchData.away_score,
      matchData.winner_team_id,
      matchData.id
    );
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to update match');
  }
};

const nextPeriod = (matchId) => {
  try {
    const stmt = db.prepare('UPDATE matches SET period = period + 1, updated_at = ?, pending_sync = 1 WHERE id = ?');
    const info = stmt.run(new Date().toISOString(), matchId);
    if (info.changes === 0) {
      throw new Error('Match not found or period already at maximum');
    }
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to advance to next period');
  }
};

const activateLastFourMinutes = (matchId) => {
  try {
    const stmt = db.prepare('UPDATE matches SET last_four_minutes = 1, updated_at = ?, pending_sync = 1 WHERE id = ?');
    const info = stmt.run(new Date().toISOString(), matchId);
    if (info.changes === 0) {
      throw new Error('Match not found or last four minutes already activated');
    }
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to activate last four minutes');
  }
};

const deleteMatch = (matchId) => {
  try {
    const stmt = db.prepare('DELETE FROM matches WHERE id = ?');
    const info = stmt.run(matchId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to delete match');
  }
};

const softDeleteMatch = (matchId) => {
  try {
    const stmt = db.prepare('UPDATE matches SET deleted = 1, pending_sync = 1, updated_at = ? WHERE id = ?');
    const info = stmt.run(new Date().toISOString(), matchId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to soft delete match');
  }
};

module.exports = {
  getMatchById,
  getMatchesByFolderId,
  addMatch,
  updateMatch,
  nextPeriod,
  activateLastFourMinutes,
  deleteMatch,
  softDeleteMatch
};