import { AxiosErrorWithData, ErrorData } from "@/types/error";
import axios, { AxiosHeaders, AxiosError } from "axios";
/**
 * The core Axios instance configured for the Django API.
 */
export const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    withCredentials: true,
    // Automated CSRF Configuration
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    headers: {
        "Content-Type": "application/json",
    },

});


let logoutFn: () => void = () => { };

export const setLogoutFunction = (fn: () => void) => {
    logoutFn = fn;
};

// --- REQUEST INTERCEPTOR: Add Authorization Token ---
axiosInstance.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem("access_token");
        if (token) {
            // Ensure headers exist in a TS-safe way
            if (!config.headers) {
                config.headers = new AxiosHeaders();
            }

            // Set the Authorization header
            if (config.headers instanceof AxiosHeaders) {
                config.headers.set("Authorization", `Bearer ${token}`);
            } else {
                (config.headers as any)["Authorization"] = `Bearer ${token}`;
            }
        }
    } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
        // Optionally clear storage or log out if user data is corrupted
    }


    return config;
});

// --- RESPONSE INTERCEPTOR: Handle Errors and Rejections ---
axiosInstance.interceptors.response.use(
    // Success Handler (Status 2xx)
    (response) => response,

    // Error Handler (Status 4xx/5xx or network issues)
    async (error: AxiosError) => {

        if (error.response) {
            const status = error.response.status;

            let responseData: unknown = error.response.data;
            console.log(responseData)
            let detail = "Server error occurred";

            const errorBody = responseData as ErrorData;

            detail = errorBody.detail || errorBody.message || errorBody.error || detail;

            // HANDLE SPECIFIC STATUS CODES (401/403)
            if (status === 401) {
                console.log('401 Unauthorized: Initiating logout...');
                logoutFn();
                return Promise.reject(new Error(detail || "Session expired. Please log in again."));

            } else if (status === 403) {
                console.log('403 Forbidden: Access denied.');
                return Promise.reject(new Error("You do not have permission to perform this action."));

            }

            // HANDLE OTHER SERVER ERRORS (400, 500, etc.)
            else {
                console.error(`General Server Error (${status}):`, responseData);

                // Create the custom, detailed error object
                const customError: AxiosErrorWithData = {
                    // To maintain compatibility with Error
                    ...new Error(detail),
                    name: 'API_SERVER_ERROR',
                    message: detail,
                    status: status,
                    responseData: responseData,

                };

                // Reject the promise with the new, detailed object
                return Promise.reject(customError);
            }

        } else if (error.request) {
            // --- NETWORK ERRORS (Request made but no response received) ---
            console.error("Network Error: No response received.", error.request);

            // Create a detailed network error
            const networkError: AxiosErrorWithData = {
                ...new Error("Network error. Please check your connection or server status."),
                name: 'API_NETWORK_ERROR',
                message: "Network error. Please check your connection or server status.",
                isNetworkError: true,
            };

            return Promise.reject(networkError);

        } else {
            // --- UNEXPECTED ERRORS (Request setup failed) ---
            console.error("Unexpected Request Error:", error.message);
            return Promise.reject(new Error("An unexpected error occurred during request setup."));
        }
    }
);