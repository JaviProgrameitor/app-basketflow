
const { ipcMain } = require('electron');
const axios = require('axios');
const db = require('../database');
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api';
const { getActiveSession } = require('../db/session.js'); 
const { registerUser } = require('../api/user.js');
const { saveSession, deleteSession } = require('../db/session.js');
const { getDeviceInfo } = require('../helpers/device.js');

ipcMain.handle('registerUser', async (event, dataUser = {}) => {
  try {
    let user = await registerUser(dataUser);
    user.user_id = user.id;
    saveSession(user);
    const deviceInfo = await getDeviceInfo();
    if (!deviceInfo.ok) {
      deleteSession();
      throw new Error(deviceInfo.message || "Hubo un error al obtener la información. Inténtalo de nuevo más tarde.");
    }

    return { ok: true, user };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});


// Update username on server and local session
ipcMain.handle('updateUsername', async (event, newUsername) => {
  const session = getActiveSession();
  if (!session?.user_id) {
    throw new Error('No hay usuario en sesión.');
  }

  const name = String(newUsername || '').trim();
  if (name.length < 3 || name.length > 30) {
    throw new Error('El nombre de usuario debe tener entre 3 y 30 caracteres.');
  }

  try {
    const resp = await axios.patch(`${API_BASE_URL}/users/username`, {
      user_id: session.user_id,
      username: name
    }, { timeout: 30000 });

    const updated = resp.data?.user;
    if (!updated?.username) {
      throw new Error('Respuesta del servidor inválida.');
    }

    // Update local session
    db.prepare(`UPDATE session SET username = ? WHERE user_id = ?`).run(updated.username, session.user_id);

    return { username: updated.username };
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'No se pudo actualizar el nombre de usuario.';
    throw new Error(msg);
  }
});