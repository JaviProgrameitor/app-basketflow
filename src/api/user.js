import api from './axiosConfig.js';

const registerUser = async (dataUser = {}) => {
  try {
    const response = await api.post('/users', dataUser);

    return response.user;
  } catch (error) {
    console.log(error.response.data);
    throw new Error(error.response?.data.msg || 'Error al registrar usuario');
  }
};

export {
  registerUser
}