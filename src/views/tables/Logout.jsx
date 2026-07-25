import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toast } from 'react-bootstrap';
const API_URL = import.meta.env.VITE_APP_API_URL;

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        // Gọi API logout
        await axios.post(`${API_URL}/api/admin/auth/logout`, {}, { withCredentials: true });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        // Sau khi logout thành công, chuyển hướng về trang login
        navigate('/auth/signin');
        Toast.success({ message: 'Đăng xuất thành công!' });
      } catch (err) {
        console.error('Logout error:', err);
        navigate('/auth/signin');  // Nếu có lỗi, vẫn chuyển hướng đến trang login
      }
    };

    logout();
  }, [navigate]);

  return <div>Logging out...</div>;  // Hiển thị thông báo đang đăng xuất
};

export default Logout;
