import api from './axiosConfig.js';

const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    return response.user;
  } catch (error) {
    console.log(error.response.data);
    throw new Error(error.response?.data.msg || 'Error al iniciar sesión');
  }
};

export {
  login
};
