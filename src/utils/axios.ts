
// utils/axiosInstance.ts
import axios from 'axios';
import { AxiosError, type AxiosInstance, type AxiosRequestConfig,type AxiosResponse } from 'axios';

// ✅ Tạo instance mặc định
const axiosInstance: AxiosInstance = axios.create({
  baseURL: '', // 👑 Có thể gán baseURL mặc định ở đây nếu cần
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Interceptor xử lý request
axiosInstance.interceptors.request.use(
  (config) => {
    // Nếu cần thêm token: config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// ✅ Interceptor xử lý response
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('❌ Server responded with error:', error.response.data);
    } else if (error.request) {
      console.error('❌ No response received:', error.request);
    } else {
      console.error('❌ Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ✅ Method helper có sẵn try-catch
export const api = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T | null> {
    try {
      const res = await axiosInstance.get<T>(url, config);
      return res.data;
    } catch (error) {
      console.log("🚀 ~ error:", error)
      return null;
    }
  },

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T | null> {
    try {
      const res = await axiosInstance.post<T>(url, data, config);
      return res.data;
    } catch (error) {
      console.log("🚀 ~ error:", error)
      return null;
    }
  },

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T | null> {
    try {
      const res = await axiosInstance.put<T>(url, data, config);
      return res.data;
    } catch (error) {
      console.log("🚀 ~ error:", error)
      return null;
    }
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T | null> {
    try {
      const res = await axiosInstance.delete<T>(url, config);
      return res.data;
    } catch (error) {
      console.log("🚀 ~ error:", error)
      return null;
    }
  },
};

export default axiosInstance;
