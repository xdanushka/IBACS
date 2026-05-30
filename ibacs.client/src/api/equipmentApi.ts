import api from './axiosConfig';

export interface EquipmentCategory {
  equipmentCategoryKey: number;
  category: string;
}

export interface Equipment {
  equipmentKey?: number;
  locationKey: number;
  equipmentCategoryKey: number;
  name: string;
  description?: string | null;
  rtPageKey?: number | null;
  location?: { locationName: string; fullName?: string } | null;
  equipmentCategory?: { category: string } | null;
}

const EQUIPMENT_BASE_URL = '/equipment';
const CATEGORY_BASE_URL = '/equipmentcategory';

export const getAllEquipment = async (): Promise<Equipment[]> => {
  const response = await api.get<Equipment[]>(EQUIPMENT_BASE_URL);
  return response.data;
};

export const getEquipmentById = async (id: number): Promise<Equipment> => {
  const response = await api.get<Equipment>(`${EQUIPMENT_BASE_URL}/${id}`);
  return response.data;
};

export const createEquipment = async (equipment: Equipment): Promise<Equipment> => {
  const response = await api.post<Equipment>(EQUIPMENT_BASE_URL, equipment);
  return response.data;
};

export const updateEquipment = async (id: number, equipment: Equipment): Promise<any> => {
  const response = await api.put(`${EQUIPMENT_BASE_URL}/${id}`, equipment);
  return response.data;
};

export const deleteEquipment = async (id: number): Promise<any> => {
  const response = await api.delete(`${EQUIPMENT_BASE_URL}/${id}`);
  return response.data;
};

// Categories API
export const getEquipmentCategories = async (): Promise<EquipmentCategory[]> => {
  const response = await api.get<EquipmentCategory[]>(CATEGORY_BASE_URL);
  return response.data;
};

export const createEquipmentCategory = async (category: Partial<EquipmentCategory>): Promise<EquipmentCategory> => {
  const response = await api.post<EquipmentCategory>(CATEGORY_BASE_URL, category);
  return response.data;
};