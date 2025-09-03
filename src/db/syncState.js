
const db = require('../database.js');

function getLastSyncAt(userId) {
  const row = db.prepare(`SELECT last_sync_at FROM sync_state WHERE user_id = ?`).get(userId);
  return row?.last_sync_at || '1970-01-01T00:00:00.000Z';
}

function setLastSyncAt(userId, isoString) {
  const up = db.prepare(`
    INSERT INTO sync_state (user_id, last_sync_at)
    VALUES (?, ?)
    ON CONFLICT(user_id) DO UPDATE SET last_sync_at = excluded.last_sync_at
  `);
  up.run(userId, isoString);
}

module.exports = {
  getLastSyncAt,
  setLastSyncAt
};
