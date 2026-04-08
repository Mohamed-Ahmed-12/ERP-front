import { axiosInstance } from "@/lib/network";
import { CandidateRead, CandidateWrite } from "@/modules/hr/types/candidates";

export const CandidateService = {
    getCandidates: async (): Promise<CandidateRead[]> => {
        try {
            const response = await axiosInstance.get("hr/candidates/");
            return response.data;
        } catch (error) {
            console.error("Error fetching candidates:", error);
            throw error;
        }
    },
    getCandidateById: async (id: string): Promise<CandidateRead> => {
        try {
            const response = await axiosInstance.get(`hr/candidates/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching candidate with ID ${id}:`, error);
            throw error;
        }
    },
    createCandidate: async (data: FormData): Promise<CandidateRead> => {
        try {
            const response = await axiosInstance.post("hr/candidates/", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating candidate:", error);
            throw error;
        }
    },
    updateCandidate: async (id: string, data: FormData) => {
        try {
            const response = await axiosInstance.put(`hr/candidates/${id}/`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating candidate with ID ${id}:`, error);
            throw error;
        }
    },
    deleteCandidate: async (id: string): Promise<void> => {
        try {
            await axiosInstance.delete(`hr/candidates/${id}/`);
        } catch (error) {
            console.error(`Error deleting candidate with ID ${id}:`, error);
            throw error;
        }
    },
}