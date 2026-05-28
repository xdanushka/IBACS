import api from './axiosConfig';

// Ensure you have a central axios instance or use base axios
const API_BASE_URL = '/api/equipment';

// Fetch all equipment
export const getAllEquipment = async (): Promise<Equipment[]> => {
  try {
    const response = await axios.get<Equipment[]>(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching all equipment:", error);
    throw error;
  }
};

// Fetch a single piece of equipment by ID
export const getEquipmentById = async (id: number): Promise<Equipment> => {
  try {
    const response = await axios.get<Equipment>(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment with ID ${id}:`, error);
    throw error;
  }
};

// Add new equipment
export const createEquipment = async (equipment: Equipment): Promise<Equipment> => {
  try {
    const response = await axios.post<Equipment>(API_BASE_URL, equipment);
    return response.data;
  } catch (error) {
    console.error("Error creating equipment:", error);
    throw error;
  }
};