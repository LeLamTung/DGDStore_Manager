import React from 'react';
import { Card, Alert, Button } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AuthLogin from './JWTLogin'; // Đã tích hợp login
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const Signin1 = () => {
  const navigate = useNavigate(); // Khởi tạo navigate

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Gửi access_token về Backend
        const result = await axios.post(
          `${API_URL}/api/admin/auth/login-google`,
          { gg_token: tokenResponse.access_token }, // Chú ý: dùng access_token
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        );

        // 1. Phải lấy cả accessToken ra nữa
        const { user, accessToken, redirect } = result.data;
        // 2. [QUAN TRỌNG NHẤT] Lưu Token vào LocalStorage
        // Nếu thiếu dòng này là coi như chưa đăng nhập!
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));

        // 3. Kiểm tra Role
        if (!user || !user.Role?.NameRole) {
          alert('Không thể xác định role');
          return;
        }
        if (user.IsActive === false) {
          alert('Tài khoản đã bị khóa.');
          return;
        }

        // 4. Điều hướng thông minh (Tránh reload trang nếu cùng domain)
        // Nếu Backend trả về link điều hướng cụ thể
        if (redirect) {
          // Nếu redirect URL chứa http (khác domain/port) -> dùng window.location
          if (redirect.startsWith('http')) {
            window.location.href = redirect;
          } else {
            // Nếu là link nội bộ -> dùng navigate cho mượt (không bị mất state)
            navigate(redirect);
          }
        } else {
          // Fallback nếu backend không trả link
          if (user.Role.NameRole === 'Admin' || user.Role.NameRole === 'Staff') {
            navigate('/dashboard'); // Dùng navigate thay vì window.location
          } else {
            // Nếu nhảy sang trang Customer (port 3001) thì bắt buộc reload
            window.location.href = `http://localhost:3001/?token=${accessToken}`;
          }
        }
      } catch (error) {
        console.error('Google login error:', error);
        alert('Đăng nhập thất bại: ' + (error.response?.data?.message || 'Lỗi hệ thống'));
      }
    },
    onError: () => alert('Đăng nhập bằng Google thất bại')
  });
  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless text-center">
            <Card.Body>
              <div className="mb-4">
                <i className="feather icon-unlock auth-icon" />
              </div>
              {/* Gọi form login */}
              <AuthLogin />

              <p className="mb-2 text-muted">
                Quên mật khẩu?{' '}
                <NavLink to={'#'} className="f-w-400">
                  Đặt lại mật khẩu
                </NavLink>
              </p>
              <p className="mb-0 text-muted">
                Chưa có tài khoản?{' '}
                <NavLink to="/auth/signup" className="f-w-400">
                  Đăng ký
                </NavLink>
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outline-danger"
                  onClick={() => loginWithGoogle()}
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <i className="fa fa-google" /> Đăng nhập bằng Google
                </Button>
              </div>
              {/* Thông tin demo tài khoản
              <Alert variant="primary" className="text-start mt-3">
                User:
                <CopyToClipboard text="info@codedthemes.com">
                  <Button variant="outline-primary" as={Link} to="#" className="badge mx-2 mb-2" size="sm">
                    <i className="fa fa-user" /> info@codedthemes.com
                  </Button>
                </CopyToClipboard>
                <br />
                Password:
                <CopyToClipboard text="123456">
                  <Button variant="outline-primary" as={Link} to="#" className="badge mx-2" size="sm">
                    <i className="fa fa-lock" /> 123456
                  </Button>
                </CopyToClipboard>
              </Alert> */}
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
