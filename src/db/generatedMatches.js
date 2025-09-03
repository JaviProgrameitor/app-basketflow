const db = require('../database.js');
const { v4: uuidv4 } = require('uuid');

const getGeneratedMatchesByFolderId = (folderId) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        gm.*,
        COALESCE(NULLIF(TRIM(fth.custom_name), ''), th.name) AS home_team_name,
        COALESCE(NULLIF(TRIM(fta.custom_name), ''), ta.name) AS away_team_name
      FROM generated_matches gm
      JOIN teams th ON gm.home_team_id = th.id AND th.deleted = 0
      JOIN folders_teams fth ON gm.folder_id = fth.folder_id AND gm.home_team_id = fth.team_id AND fth.deleted = 0
      JOIN teams ta ON gm.away_team_id = ta.id AND ta.deleted = 0
      JOIN folders_teams fta ON gm.folder_id = fta.folder_id AND gm.away_team_id = fta.team_id AND fta.deleted = 0
      WHERE gm.folder_id = ?
        AND gm.deleted = 0
      ORDER BY gm.date ASC, gm.time_start ASC
    `);
    const generatedMatches = stmt.all(folderId);
    return generatedMatches;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch generated matches');
  }
};

const addGeneratedMatches = (matches) => {
  try {
    const insertStmt = db.prepare(`
      INSERT INTO generated_matches 
        (id, folder_id, home_team_id, away_team_id, date, time_start, location, round, published, updated_at, pending_sync) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    // Inicia la transacción
    const insertMany = db.transaction((matchesArray) => {
      for (const match of matchesArray) {
        insertStmt.run(
          uuidv4(),
          match.folder_id,
          match.home_team_id,
          match.away_team_id,
          match.date,
          match.time_start,
          match.location,
          match.round,
          match.published || 0,
          new Date().toISOString()
        );
      }
    });

    insertMany(matches);

    return { success: true, count: matches.length };
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to add generated matches');
  }
};

const updateGeneratedMatch = (matchData) => {
  try {
    const stmt = db.prepare(`
      UPDATE generated_matches 
      SET 
        home_team_id = ?, 
        away_team_id = ?, 
        date = ?, 
        time_start = ?, 
        location = ?, 
        round = ?, 
        updated_at = ?, 
        pending_sync = 1
      WHERE id = ?
    `);
    const info = stmt.run(
      matchData.home_team_id,
      matchData.away_team_id,
      matchData.date,
      matchData.time_start,
      matchData.location,
      matchData.round,
      new Date().toISOString(),
      matchData.id,
    );
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to update generated match');
  }
};

const deleteGeneratedMatch = (matchId) => {
  try {
    const stmt = db.prepare('DELETE FROM generated_matches WHERE id = ?');
    const info = stmt.run(matchId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to delete generated match');
  }
};

const softDeleteGeneratedMatch = (matchId) => {
  try {
    const stmt = db.prepare('UPDATE generated_matches SET deleted = 1, pending_sync = 1, updated_at = ? WHERE id = ?');
    const info = stmt.run(new Date().toISOString(), matchId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to soft delete generated match');
  }
};

const deleteAllGeneratedMatchesByFolderId = (folderId) => {
  try {
    const stmt = db.prepare('DELETE FROM generated_matches WHERE folder_id = ?');
    const info = stmt.run(folderId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to delete generated matches by folder');
  }
};

const softDeleteAllGeneratedMatchesByFolderId = (folderId) => {
  try {
    const stmt = db.prepare('UPDATE generated_matches SET deleted = 1, pending_sync = 1, updated_at = ? WHERE folder_id = ?');
    const info = stmt.run(new Date().toISOString(), folderId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to soft delete generated matches by folder');
  }
};

const publishGeneratedMatch = (matchId) => {
  try {
    const stmt = db.prepare('UPDATE generated_matches SET published = 1 WHERE id = ?');
    const info = stmt.run(matchId);
    if (info.changes === 0) {
      throw new Error('Generated match not found or already published');
    }
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to publish generated match');
  }
};

module.exports = {
  getGeneratedMatchesByFolderId,
  addGeneratedMatches,
  updateGeneratedMatch,
  deleteGeneratedMatch,
  softDeleteGeneratedMatch,
  deleteAllGeneratedMatchesByFolderId,
  softDeleteAllGeneratedMatchesByFolderId,
  publishGeneratedMatch
};