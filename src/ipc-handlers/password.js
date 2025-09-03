const { ipcMain } = require('electron');
const axios = require('axios');
const db = require('../database');

const API_BASE_URL = process.env.API_BASE_URL || 'https://backend-basketflow-production.up.railway.app/api';

ipcMain.handle('requestPasswordReset', async (event, email) => {
  try {
    const resp = await axios.post(`${API_BASE_URL}/auth/password/request-code`, { email }, { timeout: 30000 });
    return resp.data || { ok: true };
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'No se pudo solicitar el código';
    throw new Error(msg);
  }
});

ipcMain.handle('verifyPasswordResetCode', async (event, { email, code }) => {
  try {
    const resp = await axios.post(`${API_BASE_URL}/auth/password/verify-code`, { email, code }, { timeout: 30000 });
    return resp.data; // { reset_token }
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'Código inválido o expirado';
    throw new Error(msg);
  }
});

ipcMain.handle('resetPassword', async (event, { reset_token, new_password }) => {
  try {
    const resp = await axios.post(`${API_BASE_URL}/auth/password/reset`, { reset_token, new_password }, { timeout: 30000 });
    return resp.data; // { ok: true }
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'No se pudo restablecer la contraseña';
    throw new Error(msg);
  }
});