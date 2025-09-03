const db = require('../database.js');

// Handler for folders_teams operations
const getFoldersTeams = () => {
  try {
    const result = db.prepare('SELECT * FROM folders_teams WHERE deleted = 0').all();
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch folders_teams');
  }
};

const getFoldersTeamsByFolderId = (folderId) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        t.id,
        COALESCE(NULLIF(TRIM(ft.custom_name), ''), t.name) AS name,
        ft.coach,
        ft.assistant_coach,
        ft.primary_color,
        ft.pending_sync,
        ft.updated_at,
        ft.deleted,
        ft.created_at
      FROM folders_teams ft
      JOIN teams t ON ft.team_id = t.id
      WHERE ft.folder_id = ?
        AND ft.deleted = 0;
    `);
    const foldersTeams = stmt.all(folderId);
    return foldersTeams;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch folders_teams');
  }
};

const getFoldersTeamsByFolderIdAndTeamId = (foldersTeamsData) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        ft.*,
        f.name AS folder_name,
        t.name AS team_name
      FROM folders_teams ft
      JOIN folders f ON ft.folder_id = f.id
      JOIN teams t ON ft.team_id = t.id
      WHERE ft.folder_id = ? AND ft.team_id = ? AND ft.deleted = 0
    `);
    const foldersTeams = stmt.get(foldersTeamsData.folderId, foldersTeamsData.teamId);
    return foldersTeams;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch folders_teams');
  }
};

const addFoldersTeams = (foldersTeamsData) => {
  try {
    const stmt = db.prepare('INSERT INTO folders_teams (folder_id, team_id, custom_name, coach, assistant_coach, primary_color, updated_at, pending_sync) VALUES (?, ?, ?, ?, ?, ?, ?, 1)');
    const info = stmt.run(
      foldersTeamsData.folderId,
      foldersTeamsData.teamId,
      foldersTeamsData.custom_name,
      foldersTeamsData.coach,
      foldersTeamsData.assistant_coach,
      foldersTeamsData.primary_color,
      new Date().toISOString()
    );
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to add folders_teams');
  }
};

const updateFoldersTeams = (foldersTeamsData) => {
  try {
    const stmt = db.prepare(`
        UPDATE folders_teams 
        SET 
          custom_name = ?, 
          coach = ?, 
          assistant_coach = ?, 
          primary_color = ?,
          updated_at = ?, 
          pending_sync = 1
        WHERE folder_id = ? AND team_id = ? AND deleted = 0
      `);
    const info = stmt.run(
      foldersTeamsData.custom_name,
      foldersTeamsData.coach,
      foldersTeamsData.assistant_coach,
      foldersTeamsData.primary_color,
      new Date().toISOString(),
      foldersTeamsData.folderId,
      foldersTeamsData.teamId
    );
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to update folders_teams');
  }
};

const deleteFoldersTeams = (foldersTeamsData) => {
  try {
    const stmt = db.prepare('DELETE FROM folders_teams WHERE folder_id = ? AND team_id = ?');
    const info = stmt.run(foldersTeamsData.folderId, foldersTeamsData.teamId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to delete folders_teams');
  }
};

const softDeleteFoldersTeams = (foldersTeamsData) => {
  try {
    const stmt = db.prepare(`
      UPDATE folders_teams 
      SET deleted = 1, updated_at = ?, pending_sync = 1 
      WHERE folder_id = ? AND team_id = ? AND deleted = 0
    `);
    const info = stmt.run(new Date().toISOString(), foldersTeamsData.folderId, foldersTeamsData.teamId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to soft delete folders_teams');
  }
};

module.exports = {
  getFoldersTeams,
  getFoldersTeamsByFolderId,
  getFoldersTeamsByFolderIdAndTeamId,
  addFoldersTeams,
  updateFoldersTeams,
  deleteFoldersTeams,
  softDeleteFoldersTeams
};