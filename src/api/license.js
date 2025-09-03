
import api from "./axiosConfig";

const getLicense = async (user_id, device_id) => {
  try {
    const response = await api.get(`/licenses/${user_id}/${device_id}`);
    return response.license;
  } catch (error) {
    console.error("Error fetching license:", error);
    throw error;
  }
};

const createLicense = async (user_id, device_id) => {
  try {
    const response = await api.post("/licenses/create", { user_id, device_id });
    return response.license;
  } catch (error) {
    console.error("Error creating license:", error);
    throw error;
  }
};

export {
  getLicense,
  createLicense
};
