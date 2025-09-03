const db = require('../database.js');
const { v4: uuidv4 } = require('uuid');

// Handler for folders operations
const getFolders = () => {
  try {
    const result = db.prepare('SELECT * FROM folders WHERE deleted = 0').all();
    console.log('Folders retrieved:', result.length);
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch folders');
  }
};

const getFolderById = (folderId) => {
  try {
    const stmt = db.prepare('SELECT * FROM folders WHERE id = ? AND deleted = 0');
    const folder = stmt.get(folderId);
    return folder;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch folder');
  }
};

const addFolder = (folderData) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO folders (id, name, name_tournament, pending_sync, updated_at) VALUES (?, ?, ?, 1, ?)
    `);
    const info = stmt.run(uuidv4(), folderData.name, folderData.name_tournament, new Date().toISOString());
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to add folder');
  }
};

const updateFolder = (folderData) => {
  try {
    const stmt = db.prepare('UPDATE folders SET name = ?, name_tournament = ?, pending_sync = 1, updated_at = ? WHERE id = ?');
    const info = stmt.run(folderData.name, folderData.name_tournament, new Date().toISOString(), folderData.id);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to update folder');
  }
};

const deleteFolder = (folderId) => {
  try {
    const stmt = db.prepare('DELETE FROM folders WHERE id = ?');
    const info = stmt.run(folderId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to delete folder');
  }
};

const softDeleteFolder = (folderId) => {
  try {
    const stmt = db.prepare('UPDATE folders SET deleted = 1, pending_sync = 1, updated_at = ? WHERE id = ?');
    const info = stmt.run(new Date().toISOString(), folderId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to soft delete folder');
  }
};

const activatePlayoffs = (folderId) => {
  try {
    const stmt = db.prepare('UPDATE folders SET activated_playoffs = 1, pending_sync = 1, updated_at = ? WHERE id = ?');
    const info = stmt.run(new Date().toISOString(), folderId);
    return info.changes;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to activate playoffs');
  }
};

module.exports = {
  getFolders,
  getFolderById,
  addFolder,
  updateFolder,
  deleteFolder,
  softDeleteFolder,
  activatePlayoffs
};