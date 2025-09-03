
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-basketflow-production.up.railway.app/api', // URL base
  timeout: 5000, // Tiempo máximo de espera
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para errores globales (opcional)
api.interceptors.response.use(
  (response) => response.data, // Extrae solo los datos
  (error) => {
    console.error('Error en la petición:', error.message);
    return Promise.reject(error);
  }
);

export default api;