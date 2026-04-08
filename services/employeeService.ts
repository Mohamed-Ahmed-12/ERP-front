import { axiosInstance } from "@/lib/network";
import { Employee, EmployeeWrite } from "@/types/employees";

export const EmployeeService = {
    getEmployees: async () => {
        try {
            const response = await axiosInstance.get("hr/employees/");
            return response.data;
        } catch (error) {
            console.error("Error fetching employees:", error);
            throw error;
        }
    },
    getEmployeeById: async (id: string) => {
        try {
            const response = await axiosInstance.get(`hr/employees/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching employee with ID ${id}:`, error);
            throw error;
        }   
    },
    createEmployee: async (data: Employee) => {
        try {
            const response = await axiosInstance.post("hr/employees/", data);
            return response.data;
        } catch (error) {
            console.error("Error creating employee:", error);
            throw error;
        }
    },
    updateEmployee: async (id: string, data: Employee) => {
        try {
            const response = await axiosInstance.put(`hr/employees/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating employee with ID ${id}:`, error);
            throw error;
        }   
    },
    deleteEmployee: async (id: string) => {
        try {
            await axiosInstance.delete(`hr/employees/${id}/`);
        } catch (error) {
            console.error(`Error deleting employee with ID ${id}:`, error);
            throw error;
        }
    },
}