const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { ipcMain } = require('electron');
const { createLicense, getLicense } = require('../api/license.js');
const { storeLicense } = require('../db/license.js');
const { getDevice } = require('../db/device.js');
const { getActiveSession } = require('../db/session.js');
const { hasAccessToApp } = require('../helpers/license.js');

ipcMain.handle('decodeLicenseToken', (event, licenseToken) => {
  const publicKeyPath = path.join(__dirname, 'public.key'); // <-- ruta correcta
  const publicKey = fs.readFileSync(publicKeyPath);
  const decoded = jwt.verify(licenseToken, publicKey, { algorithms: ['RS256'] });
  return decoded;
});

ipcMain.handle('hasAccessToApp', async (event) => {
  return await hasAccessToApp();
});

ipcMain.handle('createLicense', async (event) => {
  try {
    const session = await getActiveSession();
    const device = await getDevice();
    const newLicense = await createLicense(session.user_id, device.device_id);
    storeLicense(session.user_id, device.device_id, 'new_license_token');
    return { ok: true, license: newLicense, device, session };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

ipcMain.handle('getLicense', async (event) => {
  try {
    const session = await getActiveSession();
    const device = await getDevice();
    const license = await getLicense(session.user_id, device.device_id);
    if (!license) {
      throw new Error('License not found');
    }
    storeLicense(license.user_id, license.device_id, 'new_license_token');
    console.log('License stored successfully');
    return { ok: true, license };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});