import api from './axiosConfig';
import { type Location } from './locationService';

export interface SystemPoint {
  sysPointKey?: number;
  pointKey: number;
  point?: {
    pointKey: number;
    name: string;
    address?: string;
  };
  systemKey?: number;
}

export interface SystemModel {
  systemKey?: number;
  name: string;
  locationKey: number;
  location?: Location;
  description?: string;
  systemPoints?: SystemPoint[];
}

const systemService = {
  getSystems: async () => {
    const response = await api.get<SystemModel[]>('/systems');
    return response.data;
  },
  getSystem: async (id: number) => {
    const response = await api.get<SystemModel>(`/systems/${id}`);
    return response.data;
  },
  addSystem: async (system: SystemModel) => {
    const response = await api.post<SystemModel>('/systems', system);
    return response.data;
  },
  updateSystem: async (id: number, system: SystemModel) => {
    const response = await api.put(`/systems/${id}`, system);
    return response.data;
  },
  deleteSystem: async (id: number) => {
    const response = await api.delete(`/systems/${id}`);
    return response.data;
  },
  associatePoint: async (systemKey: number, pointKey: number) => {
    const response = await api.post<SystemPoint>('/systempoints', { systemKey, pointKey });
    return response.data;
  },
  disassociatePoint: async (sysPointKey: number) => {
    const response = await api.delete(`/systempoints/${sysPointKey}`);
    return response.data;
  },
};

export default systemService;
