const db = require('../database.js');
const { v4: uuidv4 } = require('uuid');

// Handler for teams operations
const addTeam = (teamName) => {
  try {
    const id = uuidv4();
    const stmt = db.prepare('INSERT INTO teams (id, name, updated_at, pending_sync) VALUES (?, ?, ?, ?)');
    const info = stmt.run(id, teamName, new Date().toISOString(), 1);
    return id;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to add team');
  }
};

module.exports = {
  addTeam,
};