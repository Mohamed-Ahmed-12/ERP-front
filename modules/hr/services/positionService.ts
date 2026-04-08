import { axiosInstance } from "@/lib/network";
import { Position, PositionCreate, PositionUpdate } from "@/modules/hr/types/position";

export const JobPositionService = {
    getJobPositions: async () => {
        try {
            const response = await axiosInstance.get("hr/positions/");
            return response.data;
        } catch (error) {
            console.error("Error fetching job positions:", error);
            throw error;
        }
    },
    getJobPositionById: async (id: string) => {
        try {
            const response = await axiosInstance.get(`hr/positions/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching job position with ID ${id}:`, error);
            throw error;
        }
    },
    createJobPosition: async (data: PositionCreate) => {
        try {
            const response = await axiosInstance.post("hr/positions/", data);
            return response.data;
        } catch (error) {
            console.error("Error creating job position:", error);
            throw error;
        }
    },
    updateJobPosition: async (id: string, data: PositionUpdate) => {
        try {
            const response = await axiosInstance.put(`hr/positions/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating job position with ID ${id}:`, error);
            throw error;
        }
    },
    deleteJobPosition: async (id: string) => {
        try {
            await axiosInstance.delete(`hr/positions/${id}/`);
        } catch (error) {
            console.error(`Error deleting job position with ID ${id}:`, error);
            throw error;
        }
    },
}