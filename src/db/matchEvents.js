const db = require('../database.js');
const { v4: uuidv4 } = require('uuid');

// Handle IPC for match events operations
const getMatchEventsByMatchId = (matchId) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        me.*,
        p.name,
        p.position,
        COALESCE(NULLIF(TRIM(mp.jersey_number), ''), p.number) AS jersey_number,
        COALESCE(NULLIF(TRIM(ft.custom_name), ''), t.name) AS team_name,
        ft.primary_color AS team_color
      FROM match_events me
      LEFT JOIN players p ON p.id = me.player_id AND p.deleted = 0
      LEFT JOIN match_players mp ON mp.match_id = me.match_id AND mp.player_id = me.player_id AND mp.deleted = 0
      LEFT JOIN teams t ON t.id = me.team_id AND t.deleted = 0
      LEFT JOIN matches m ON m.id = me.match_id AND m.deleted = 0
      LEFT JOIN folders_teams ft ON ft.team_id = me.team_id AND ft.folder_id = m.folder_id AND ft.deleted = 0
      WHERE me.match_id = ? 
        AND me.deleted = 0 
      ORDER BY me.created_at ASC;
    `);
    const events = stmt.all(matchId);
    return events;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch match events');
  }
};

const getDeletedMatchEventsByMatchId = (matchId) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        me.*,
        p.name,
        p.position,
        COALESCE(NULLIF(TRIM(mp.jersey_number), ''), p.number) AS jersey_number,
        COALESCE(NULLIF(TRIM(ft.custom_name), ''), t.name) AS team_name,
        ft.primary_color AS team_color
      FROM match_events me
      LEFT JOIN players p ON p.id = me.player_id AND p.deleted = 0
      LEFT JOIN match_players mp ON mp.match_id = me.match_id AND mp.player_id = me.player_id AND mp.deleted = 0
      LEFT JOIN teams t ON t.id = me.team_id AND t.deleted = 0
      LEFT JOIN matches m ON m.id = me.match_id AND m.deleted = 0
      LEFT JOIN folders_teams ft ON ft.team_id = me.team_id AND ft.folder_id = m.folder_id AND ft.deleted = 0
      WHERE me.match_id = ? 
        AND me.deleted = 1 
      ORDER BY me.created_at ASC;
    `);
    const events = stmt.all(matchId);
    return events;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch match events');
  }
}

const addPointsEvent = (pointsEvent) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO match_events 
        (id, match_id, player_id, event_type, point_type, point_value, team_id, period, updated_at, pending_sync) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    const info = stmt.run(uuidv4(), pointsEvent.match_id, pointsEvent.player_id, pointsEvent.event_type, pointsEvent.point_type, pointsEvent.point_value, pointsEvent.team_id, pointsEvent.period, new Date().toISOString());
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to add match event');
  }
};

const addFoulEvent = (foulEvent) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO match_events 
        (id, match_id, player_id, event_type, foul_type, team_id, period, updated_at, pending_sync) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    const info = stmt.run(uuidv4(), foulEvent.match_id, foulEvent.player_id, foulEvent.event_type, foulEvent.foul_type, foulEvent.team_id, foulEvent.period, new Date().toISOString());
    return info.changes;
  } catch (error) {
    console.error('Database error:', error); 
    throw new Error('Failed to add foul event');
  }
};

const addTimeoutEvent = (timeoutEvent) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO match_events 
        (id, match_id, team_id, event_type, period, minute, updated_at, pending_sync) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);
    const info = stmt.run(uuidv4(), timeoutEvent.match_id, timeoutEvent.team_id, 'timeout', timeoutEvent.period, timeoutEvent.minute, new Date().toISOString());
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to add timeout event');
  }
};

const deleteMatchEvent = (eventId) => {
  try {
    const stmt = db.prepare('DELETE FROM match_events WHERE id = ?');
    const info = stmt.run(eventId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to delete match event');
  }
};

const softDeleteMatchEvent = (eventData) => {
  try {
    const stmt = db.prepare(`
      UPDATE match_events 
      SET 
        deleted = 1, 
        pending_sync = 1, 
        updated_at = ?,
        cause = ?
      WHERE id = ?
    `);
    const info = stmt.run(new Date().toISOString(), eventData.cause, eventData.id);
    if (info.changes === 0) {
      throw new Error('Match event not found or already deleted');
    }
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to soft delete match event');
  }
};

module.exports = {
  getMatchEventsByMatchId,
  getDeletedMatchEventsByMatchId,
  addPointsEvent,
  addFoulEvent,
  addTimeoutEvent,
  deleteMatchEvent,
  softDeleteMatchEvent
};