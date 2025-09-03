import api from "./axiosConfig";

const deviceGetOrCreate = async (deviceData) => {
  try {
    const response = await api.post("/device/get-create-device", deviceData);
    return response.device;
  } catch (error) {
    console.error("Error fetching device info:", error);
    throw error;
  }
};

export {
  deviceGetOrCreate
}
