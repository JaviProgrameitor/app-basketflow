
const { ipcMain } = require('electron');
const { login } = require('../api/auth.js'); 
const { saveSession, deleteSession } = require('../db/session.js');
const { getDeviceInfo } = require('../helpers/device.js');
const { getPaidLicense } = require('../helpers/license.js');

ipcMain.handle('login', async (event, { email, password }) => {
  try {
    let user = await login(email, password);
    user.user_id = user.id;
    saveSession(user);
    const deviceInfo = await getDeviceInfo();
    if (!deviceInfo.ok) {
      deleteSession();
      throw new Error("Hubo un error al crear la cuenta. Inténtalo de nuevo más tarde.");
    }
    const licenseInfo = await getPaidLicense(user.user_id, deviceInfo.device.device_id);
    return { ok: true, user };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});