// src/utils/axiosInstance.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  // withCredentials: true, // <-- Có thể giữ hoặc bỏ. Nếu dùng Bearer Token thì dòng này không bắt buộc, nhưng giữ cũng không sao.
  headers: {
    "Content-Type": "application/json",
  },
});

// 👉 REQUEST INTERCEPTOR: Tự động gắn Token vào Header trước khi gửi đi
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ kho lưu trữ
    const token = localStorage.getItem("accessToken"); 
    
    if (token) {
      // Gắn vào Header theo chuẩn Bearer
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 👉 RESPONSE INTERCEPTOR: Xử lý lỗi trả về
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response;

    // Nếu lỗi 401 (Hết hạn token) hoặc 403 (Cấm truy cập)
    if (res?.status === 401 || res?.status === 403) {
      const redirectUrl = res.data?.redirect || '/auth/signin';
      const message = res.data?.message || 'Phiên đăng nhập hết hạn hoặc bạn không có quyền.';

      // Xóa token cũ đi cho sạch sẽ
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      alert(message);
      window.location.href = redirectUrl;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;