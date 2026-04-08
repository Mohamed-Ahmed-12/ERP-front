import { axiosInstance } from "@/lib/network";
import { VacancyWrite, VacancyRead } from "@/modules/hr/types/vacancies";
export const VacancyService = {
    getVacancies: async () => {
        try {
            const response = await axiosInstance.get("hr/vacancies/");
            return response.data;
        } catch (error) {
            console.error("Error fetching vacancies:", error);
            throw error;
        }
    },
    getVacancyById: async (id: string) => {
        try {
            const response = await axiosInstance.get(`hr/vacancies/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching vacancy with ID ${id}:`, error);
            throw error;
        }
    },
    createVacancy: async (data: VacancyWrite) => {
        try {
            const response = await axiosInstance.post("hr/vacancies/", data);
            return response.data;
        } catch (error) {
            console.error("Error creating vacancy:", error);
            throw error;
        }
    },
    updateVacancy: async (id: string, data: VacancyWrite) => {
        try {
            const response = await axiosInstance.put(`hr/vacancies/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating vacancy with ID ${id}:`, error);
            throw error;
        }
    },
    deleteVacancy: async (id: string) => {
        try {
            await axiosInstance.delete(`hr/vacancies/${id}/`);
        } catch (error) {
            console.error(`Error deleting vacancy with ID ${id}:`, error);
            throw error;
        }
    },
}