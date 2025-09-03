
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const os = require('os');
const { getDevice, saveDevice } = require('../db/device');
const { deviceGetOrCreate } = require('../api/device');

function getDeviceIdPath() {
  const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'TuApp');
  if (!fs.existsSync(appDataPath)) fs.mkdirSync(appDataPath, { recursive: true });
  return path.join(appDataPath, 'device_id.json');
}

function getOrCreateDeviceId() {
  const deviceIdPath = getDeviceIdPath();
  if (fs.existsSync(deviceIdPath)) {
    return JSON.parse(fs.readFileSync(deviceIdPath)).device_id;
  } else {
    const device_id = uuidv4();
    fs.writeFileSync(deviceIdPath, JSON.stringify({ device_id }));
    return device_id;
  }
}

async function getDeviceInfo() {
  const device_id = getOrCreateDeviceId();
  const device = await getDevice();
  if (device && device.device_id === device_id) {
    return {ok: true, device, message: "Device already exists"};
  } else {
    const deviceData = {
      device_id,
      device_name: os.hostname() || 'Unknown Device'
    };
    return deviceGetOrCreate(deviceData)
    .then(response => {
      saveDevice(deviceData);
      return {ok: true, device: deviceData, message: "Device created successfully"};
    })
    .catch(error => {
      console.error("Error creating device in API:", error);
      return {ok: false, device: null, message: error.message || "Error creating device"};
    });
  }
}

module.exports = {
  getDeviceInfo
}