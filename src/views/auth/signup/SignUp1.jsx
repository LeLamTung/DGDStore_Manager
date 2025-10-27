import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';


const SignUp1 = () => {
  const [UserName, setUsername] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Password1, setPassword1] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();
  const handleRegistration = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!UserName || !Email || !Password) {
      setError('Please fill all fields');
      return;
    }
    if (Password !== Password1) {
      setError('Passwords do not match');
      return;
    }
    console.log(UserName, Email, Password);
    try {
      const res = await axios.post(`${API_URL}/api/admin/auth/register`, {
        UserName,
        Email,
        Password,
      });
      if (res.status === 201 || res.status === 200) {
        setSuccess("Registration successful!");
        setUsername('');
        setEmail('');
        setPassword('');
        setTimeout(() => {
          navigate('/auth/signin');
        }, 1000);
      } else {
        throw new Error("Có lỗi xảy ra khi đăng ký, vui lòng thử lại");
      }
    } catch (err) {
      console.error("API Error:", err.response || err.message);
      if (err.response) {
        if (err.response.status === 500) {
          setError(`Lỗi từ server: ${err.response.data.message || "Không xác định"}`);
        }
      } else {
        setError("Không thể đăng ký. Kiểm tra lại kết nối server.");
      }
    }

  };
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
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                  <h3 className="mb-4">Sign up</h3>
                  {error && <p className="text-danger">{error}</p>}
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      value={UserName}
                      onChange={(e) => setUsername(e.target.value)}
                    />                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email address"
                      value={Email}
                      onChange={(e) => setEmail(e.target.value)}
                    />                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={Password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-4">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Nhập lại mật khẩu"
                      value={Password1}
                      onChange={(e) => setPassword1(e.target.value)}
                    />
                  </div>
                  <div className="form-check  text-start mb-4 mt-2">
                    <input type="checkbox" className="form-check-input" id="customCheck1" defaultChecked={false} />
                    <label className="form-check-label" htmlFor="customCheck1">
                      Send me the <Link to="#"> Newsletter</Link> weekly.
                    </label>
                  </div>
                  <button className="btn btn-primary mb-4" onClick={handleRegistration}>Sign up</button>
                  <p className="mb-2">
                    Already have an account?{' '}
                    <NavLink to={'/auth/signin'} className="f-w-400">
                      Login
                    </NavLink>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignUp1;
