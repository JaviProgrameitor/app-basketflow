
const { ipcMain } = require('electron');
const { getDeviceInfo } = require('../helpers/device.js');

ipcMain.handle('getDeviceInfo', async (event) => {
  try {
    const deviceInfo = getDeviceInfo();
    return deviceInfo;
  } catch (error) {
    console.error("Error fetching device info:", error);
    throw error;
  }
});
