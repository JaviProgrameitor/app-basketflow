
const db = require('../database');

function getLicense(device_id, user_id) {
  return db.prepare(`SELECT * FROM licenses WHERE device_id = ? AND user_id = ?`).get(device_id, user_id);
}

// Guarda el token de licencia recibido del backend
function storeLicense(user_id, device_id, license_token) {
  db.prepare(`
    INSERT OR REPLACE INTO licenses (user_id, device_id, license_token, issued_at)
    VALUES (?, ?, ?, ?)
  `).run(user_id, device_id, license_token, new Date().toISOString());
}

module.exports = {
  storeLicense,
  getLicense
};