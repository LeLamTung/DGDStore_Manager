import React from "react";
import { Row, Col, Alert, Button } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
axios.defaults.withCredentials = true; // Đảm bảo gửi cookie
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_APP_API_URL;

const JWTLogin = () => {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Email không hợp lệ")
          .max(255)
          .required("Vui lòng nhập email"),
        password: Yup.string().max(255).required("Vui lòng nhập mật khẩu"),
      })}
      onSubmit={async (values, { setErrors, setSubmitting }) => {
        try {
          const res = await axios.post(`${API_URL}/api/admin/auth/login`, {
            Email: values.email,
            Password: values.password,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });
        // 1. Lấy dữ liệu từ Backend trả về
          const { user, accessToken, redirect } = res.data;
        // 2. Lưu Token và User vào LocalStorage (QUAN TRỌNG NHẤT)
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("user", JSON.stringify(user));


          if (!user || !user.Role?.NameRole) {
            setErrors({ submit: "Lỗi xác thực tài khoản hoặc role." });
            return;
          }
        
          if (user.Role.NameRole === "Admin" || user.Role.NameRole === "Staff") {
            // Nếu là Admin, dùng navigate của React Router để chuyển trang mượt mà
            // (Giả sử file này đang nằm trong project Admin)
            navigate(redirect || "/dashboard"); 
          } else {
            // Nếu là Customer, có thể phải nhảy sang trang web khác (port 3001)
            window.location.href = redirect || "http://localhost:3001";
          }
        
        } catch (err) {
          if (err.response?.status === 403) {
            setErrors({ submit: err.response.data.message || "Tài khoản bị khóa." });
          } else if (err.response?.status === 401) {
            setErrors({ submit: err.response.data.message || "Email hoặc mật khẩu không đúng." });
          } else {
            setErrors({ submit: "Đăng nhập thất bại. Vui lòng thử lại sau." });
          }
        }
      
        setSubmitting(false);
      }}
      
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              className="form-control"
              placeholder="Email"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              value={values.email}
            />
            {touched.email && errors.email && <small className="text-danger">{errors.email}</small>}
          </div>
          <div className="form-group mb-4">
            <input
              className="form-control"
              placeholder="Mật khẩu"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={values.password}
            />
            {touched.password && errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          <div className="custom-control custom-checkbox text-start mb-4 mt-2">
            <input type="checkbox" className="custom-control-input mx-2" id="customCheck1" />
            <label className="custom-control-label" htmlFor="customCheck1">
              Lưu đăng nhập
            </label>
          </div>

          {errors.submit && (
            <Col sm={12}>
              <Alert variant="danger">{errors.submit}</Alert>
            </Col>
          )}

          <Row>
            <Col mt={2}>
              <Button className="btn-block mb-4" color="primary" disabled={isSubmitting} size="large" type="submit" variant="primary">
                Đăng nhập
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
