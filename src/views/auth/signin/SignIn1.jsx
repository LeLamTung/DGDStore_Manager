import React from "react";
import { Card, Alert, Button } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import Breadcrumb from "../../../layouts/AdminLayout/Breadcrumb";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AuthLogin from "./JWTLogin"; // Đã tích hợp login
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";



const handleSucces = async (credentialResponse) => {
  try {
    const result = await axios.post(
      `http://localhost:5000/api/admin/auth/login-google`,
      {
        gg_token: credentialResponse.credential,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const { user } = result.data;
    if (!user || !user.Role?.NameRole) {
      alert("Không thể xác định role");
      return;
    }
    if (user.IsActive === false) {
      alert("Tài khoản đã bị khóa.");
      return;
    }
    if (user.Role.NameRole === "Admin" || user.Role.NameRole === "Staff") {
      window.location.href = "http://localhost:3000/dashboard";
    } else {
      window.location.href = "http://localhost:3001";
    }

  } catch (error) {
    console.error("Google login error:", error);
    alert("Đăng nhập thất bại");
  }
};
const handleError = () => {
  alert("Đăng nhập thất bại");
};
const Signin1 = () => {
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
                Quên mật khẩu?{" "}
                <NavLink to={"#"} className="f-w-400">
                  Đặt lại mật khẩu
                </NavLink>
              </p>
              <p className="mb-0 text-muted">
                Chưa có tài khoản?{" "}
                <NavLink to="/auth/signup" className="f-w-400">
                  Đăng ký
                </NavLink>
              </p>
              <div>
                <GoogleLogin
                  onSuccess={handleSucces}
                  onError={handleError}
                />
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
