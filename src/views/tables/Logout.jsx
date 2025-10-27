import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        // Gọi API logout
        await axios.post('http://localhost:5000/api/admin/auth/logout', {}, { withCredentials: true });
        
        // Sau khi logout thành công, chuyển hướng về trang login
        navigate('/auth/signin');
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
