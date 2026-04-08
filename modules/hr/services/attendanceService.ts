import { axiosInstance } from "@/lib/network";
import { AttendanceWrite, AttendanceRead } from "@/modules/hr/types/attendance";

export const AttendanceService = {
    getAttendance: async () => {
        try {
            const response = await axiosInstance.get("hr/attendance/");
            return response.data;
        } catch (error) {
            console.error("Error fetching attendances:", error);
            throw error;
        }
    },
    getAttendanceById: async (id: string) => {
        try {
            const response = await axiosInstance.get(`hr/attendance/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching attendance with ID ${id}:`, error);
            throw error;
        }
    },
    createAttendance: async (data: AttendanceWrite) => {
        try {
            const response = await axiosInstance.post("hr/attendance/", data);
            return response.data;
        } catch (error) {
            console.error("Error creating attendance:", error);
            throw error;
        }
    },
    updateAttendance: async (id: string, data: AttendanceWrite) => {
        try {
            const response = await axiosInstance.put(`hr/attendance/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating attendance with ID ${id}:`, error);
            throw error;
        }
    },
    deleteAttendance: async (id: string) => {
        try {
            await axiosInstance.delete(`hr/attendance/${id}/`);
        } catch (error) {
            console.error(`Error deleting attendance with ID ${id}:`, error);
            throw error;
        }
    },
}