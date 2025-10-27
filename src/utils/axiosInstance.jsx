// src/utils/axiosInstance.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ Cho phép gửi cookie theo mỗi request
});

// 👉 Interceptor cho response lỗi từ middleware
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response;

    // Nếu không đăng nhập
    if (res?.status === 401 || res?.status === 403) {
      const redirectUrl = res.data?.redirect || '/auth/signin';
      const message = res.data?.message || 'Bạn không có quyền truy cập';

      alert(message);
      window.location.href = redirectUrl;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
