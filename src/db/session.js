const db = require('../database');

// Guarda la sesión del usuario
function saveSession(sessionData) {
  db.prepare(`
    INSERT OR REPLACE INTO session (user_id, username, email, login_at)
    VALUES (?, ?, ?, ?)
  `).run(sessionData.user_id, sessionData.username, sessionData.email, new Date().toISOString());
}

// Recupera usuario activo
function getActiveSession() {
  return db.prepare(`SELECT * FROM session LIMIT 1`).get();
}

// Borra sesión (logout)
function deleteSession() {
  db.prepare(`DELETE FROM session`).run();
}

module.exports = {
  saveSession,
  getActiveSession,
  deleteSession
};
