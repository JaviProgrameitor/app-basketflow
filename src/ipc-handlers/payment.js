
const { ipcMain } = require('electron');
const { createPayment } = require('../api/payment.js');

ipcMain.handle('createPayment', async (event, paymentId) => {
  const result = await createPayment(paymentId);
  return result;
});