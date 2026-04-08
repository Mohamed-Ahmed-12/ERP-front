import { axiosInstance } from "@/lib/network";
import {JobChangeRequestRead , JobChangeRequestWrite } from "@/types/jobChangeRequest";

export const JobPositionChangeReqService = {
    getPositionsChangeReqs: async () => {
        try {
            const response = await axiosInstance.get("hr/job-change-requests/");
            return response.data;
        } catch (error) {
            console.error("Error fetching job positions req:", error);
            throw error;
        }
    },
    getJobPositionById: async (id: string) => {
        try {
            const response = await axiosInstance.get(`hr/job-change-requests/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching job position req with ID ${id}:`, error);
            throw error;
        }   
    },
    createJobPosition: async (data: JobChangeRequestWrite) => {
        try {
            const response = await axiosInstance.post("hr/job-change-requests/", data);
            return response.data;
        } catch (error) {
            console.error("Error creating job position:", error);
            throw error;
        }
    },
    updateJobPosition: async (id: string, data: JobChangeRequestWrite) => {
        try {
            const response = await axiosInstance.put(`hr/job-change-requests/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating job position with ID ${id}:`, error);
            throw error;
        }   
    },
    deleteJobPosition: async (id: string) => {
        try {
            await axiosInstance.delete(`hr/job-change-requests/${id}/`);
        } catch (error) {
            console.error(`Error deleting job position with ID ${id}:`, error);
            throw error;
        }
    },
}