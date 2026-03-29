import api from './axiosConfig';

export interface Location {
  locationKey?: number;
  locationName: string;
  locationTypeKey: number;
  locationType?: { name: string };
  fullName?: string;
  parentLocationKey?: number | null;
  parentLocation?: { locationName: string };
}

export interface LocationType {
  locationTypeKey: number;
  name: string;
}

const locationService = {
  getLocations: async () => {
    const response = await api.get<Location[]>('/locations');
    return response.data;
  },
  getLocation: async (id: number) => {
    const response = await api.get<Location>(`/locations/${id}`);
    return response.data;
  },
  addLocation: async (location: Location) => {
    const response = await api.post<Location>('/locations', location);
    return response.data;
  },
  updateLocation: async (id: number, location: Location) => {
    const response = await api.put(`/locations/${id}`, location);
    return response.data;
  },
  deleteLocation: async (id: number) => {
    const response = await api.delete(`/locations/${id}`);
    return response.data;
  },

  // Location Types
  getLocationTypes: async () => {
    const response = await api.get<LocationType[]>('/locationtypes');
    return response.data;
  },
  addLocationType: async (locationType: Partial<LocationType>) => {
    const response = await api.post<LocationType>('/locationtypes', locationType);
    return response.data;
  },
  deleteLocationType: async (id: number) => {
    const response = await api.delete(`/locationtypes/${id}`);
    return response.data;
  },
};

export default locationService;
