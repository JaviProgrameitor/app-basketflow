
const db = require('../database');

// Registrar dispositivo
function saveDevice(deviceData) {
  db.prepare(`
    INSERT OR REPLACE INTO device (device_id, device_name, registered_at)
    VALUES (?, ?, ?)
  `).run(deviceData.device_id, deviceData.device_name, new Date().toISOString());
}

// Obtener información de dispositivo
function getDevice() {
  return db.prepare(`SELECT * FROM device LIMIT 1`).get();
}

// Actualizar información de dispositivo
function updateDevice(deviceData) {
  db.prepare(`
    UPDATE device
    SET device_name = ?
    WHERE device_id = ?
  `).run(deviceData.device_name, deviceData.device_id);
}

// Eliminar dispositivo
function deleteDevice(device_id) {
  db.prepare(`DELETE FROM device WHERE device_id = ?`).run(device_id);
}

module.exports = {
  saveDevice,
  getDevice,
  updateDevice,
  deleteDevice
};