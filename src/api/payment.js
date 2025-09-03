
import api from "./axiosConfig";

const createPayment = async (payment_method_id) => {
  try {
    const response = await api.post("/payment/create-payment", {payment_method_id});
    return response.license
  } catch (error) {
    console.log(error.response.data);
    throw new Error(error.response?.data.msg || 'Error al realizar el pago');
  }
}

export {
  createPayment
}