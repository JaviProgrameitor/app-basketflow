const { getDevice } = require('../db/device.js');
const { getActiveSession } = require('../db/session.js');
const { getLicense: getLicenseApi } = require('../api/license.js')
const { getLicense, storeLicense } = require('../db/license.js');
const { getLastSyncAt } = require('../db/syncState.js')

// Valida la licencia localmente usando la clave pública y datos del dispositivo
async function validateLicense() {
  const dispositivo = await getDevice();
  const sesion = await getActiveSession();
  if (!dispositivo || !sesion) return false;

  const licencia = await getLicense(dispositivo.device_id, sesion.user_id);
  if (!licencia) return false;

  return true;
}

async function getPaidLicense(userId, deviceId) {
  try {
    const license = await getLicenseApi(userId, deviceId);
    if (!license) throw new Error("License not found");
    storeLicense(license.user_id, license.device_id, 'new_license_token');
    return {ok: true, license};
  } catch (error) {
    console.error("Error getting paid license:", error);
    return {ok: false, error: error.message};
  }
}

async function verifyLoginDate(lastLoginAt) {
  const overDate = new Date(Date.now() - (parseInt(4) || 10) * 60 * 1000);
  return lastLoginAt > overDate;
}

async function validateSyncState(userId) {
  const lastSyncAt = await getLastSyncAt(userId);
  const overDate = new Date(Date.now() - (parseInt(4) || 10) * 60 * 1000);

  return lastSyncAt < overDate;
}

// Ejemplo de función para validar acceso a la app usando la sesión y el dispositivo
async function hasAccessToApp () {
  const sesion = await getActiveSession();
  if (!sesion) {
    return { ok: false, error: "no-session" };
  }
  const dispositivo = await getDevice();
  if (!dispositivo) {
    return { ok: false, error: "device-not-registered" };
  }
  const licenciaValida = await validateLicense();
  if (!licenciaValida) {
    return { ok: false, error: "no-license" };
  }
  const loginDate = await verifyLoginDate(new Date(sesion.login_at));
  const syncStateValido = await validateSyncState(sesion.user_id);
  if (loginDate && syncStateValido) {
    return { ok: false, error: "not-current-sync" };
  }
  return { ok: true };
}

module.exports = {
  hasAccessToApp,
  getPaidLicense
};