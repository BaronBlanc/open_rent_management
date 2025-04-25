import axios from "axios";
import { getUserTokenInformation } from "./session.service";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/v1', // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    response => {
    return response;
    },
    async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
            const tokenInfo = await getUserTokenInformation(originalRequest);
            if (tokenInfo?.refreshToken) {
            const response = await axiosInstance.post('/token/refresh', {
                refresh_token: tokenInfo.refreshToken,
            });
            const newToken = response.data.access_token;
            // Update the token in the session storage or cookie
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;