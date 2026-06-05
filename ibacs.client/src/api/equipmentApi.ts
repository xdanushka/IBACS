import api from './axiosConfig';

export interface EquipmentCategory {
  equipmentCategoryKey: number;
  category: string;
}

export interface Point {
  pointKey?: number;
  equipmentKey: number;
  name: string;
  address?: string | null;
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
  points?: Point[] | null;
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

// Points API
const POINTS_BASE_URL = '/points';

export const createPoint = async (point: Point): Promise<Point> => {
  const response = await api.post<Point>(POINTS_BASE_URL, point);
  return response.data;
};

export const updatePoint = async (id: number, point: Point): Promise<any> => {
  const response = await api.put(`${POINTS_BASE_URL}/${id}`, point);
  return response.data;
};

export const deletePoint = async (id: number): Promise<any> => {
  const response = await api.delete(`${POINTS_BASE_URL}/${id}`);
  return response.data;
};

export const getAllPoints = async (): Promise<(Point & { equipment?: Equipment })[]> => {
  const response = await api.get<(Point & { equipment?: Equipment })[]>(POINTS_BASE_URL);
  return response.data;
};