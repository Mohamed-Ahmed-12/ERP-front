import { axiosInstance } from "@/lib/network";
import { EquipmentTypeWrite } from "../types/equipment";

const BASE_ENDPOINT = 'equipments/types/';
export const EquipmentTypeService = {
    getAll: async () => {
        try {
            const response = await axiosInstance.get(BASE_ENDPOINT);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getById: async (id: string) => {
        try {
            const response = await axiosInstance.get(`${BASE_ENDPOINT}${id}/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    create: async (data: EquipmentTypeWrite) => {
        try {
            const response = await axiosInstance.post(BASE_ENDPOINT, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    update: async (id: string, data: EquipmentTypeWrite) => {
        try {
            const response = await axiosInstance.put(`${BASE_ENDPOINT}${id}/`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    delete: async (id: string) => {
        try {
            await axiosInstance.delete(`${BASE_ENDPOINT}${id}/`);
        } catch (error) {
            throw error;
        }
    },
}