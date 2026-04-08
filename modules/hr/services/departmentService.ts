import { axiosInstance } from "@/lib/network";

export const DepartmentService = {
    getDepartments: async () => {
        try {
            const response = await axiosInstance.get("hr/departments/");
            return response.data;
        } catch (error) {
            console.error("Error fetching departments:", error);
            throw error;
        }
    },
    getDepartmentById: async (id: string) => {
        try {
            const response = await axiosInstance.get(`hr/departments/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching department with ID ${id}:`, error);
            throw error;
        }   
    },
    createDepartment: async (data: { name: string; description?: string }) => {
        try {
            const response = await axiosInstance.post("hr/departments/", data);
            return response.data;
        } catch (error) {
            console.error("Error creating department:", error);
            throw error;
        }
    },
    updateDepartment: async (id: string, data: { name?: string; description?: string }) => {
        try {
            const response = await axiosInstance.put(`hr/departments/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating department with ID ${id}:`, error);
            throw error;
        }   
    },
    deleteDepartment: async (id: string) => {
        try {
            await axiosInstance.delete(`hr/departments/${id}/`);
        } catch (error) {
            console.error(`Error deleting department with ID ${id}:`, error);
            throw error;
        }
    },
}