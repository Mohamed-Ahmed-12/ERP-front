import { axiosInstance } from "@/lib/network";
import { Employee, EmployeeWrite } from "@/modules/hr/types/employees";

export const EmployeeService = {
    getEmployees: async () => {
        try {
            const response = await axiosInstance.get("hr/employees/");
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getEmployeeById: async (id: string) => {
        try {
            const response = await axiosInstance.get(`hr/employees/${id}/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createEmployee: async (data: FormData) => {
        try {
            const response = await axiosInstance.post("hr/employees/", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateEmployee: async (id: string, data: FormData) => {
        try {
            const response = await axiosInstance.put(`hr/employees/${id}/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteEmployee: async (id: string) => {
        try {
            await axiosInstance.delete(`hr/employees/${id}/`);
        } catch (error) {
            throw error;
        }
    },
}