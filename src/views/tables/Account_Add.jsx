import React, { useState } from "react";
import { Row, Col, Card, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosIntance from "../../utils/axiosInstance";

const AccountAdd = () => {
    const [UserName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate(`/account/list`);
    };
    // Xử lý khi nhấn nút "Thêm Tài Khoản"
    const handleAddUser = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
    
        console.log("Sending data:", { UserName, email, password });
    
        if (!UserName || !email || !password) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
    
        try {
            const res = await axiosIntance.post(`${API_URL}/api/admin/user/create`, {
                UserName,
                email,
                password,
            });
    
            console.log("API Response:", res); // Debug phản hồi từ API
    
            // Kiểm tra phản hồi từ API
            if (res.status === 201 || res.status === 200) {
                setSuccess("Thêm tài khoản thành công!");
                setUserName("");
                setEmail("");
                setPassword("");
    
                // Điều hướng về danh sách tài khoản sau 1 giây
                setTimeout(() => {
                    navigate("/account/list");
                }, 1000);
            } else {
                throw new Error("Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch (err) {
            console.error("API Error:", err.response || err.message);
    
            if (err.response) {
                if (err.response.status === 400) {
                    setError(`Email đã tồn tại. Vui lòng nhập email khác.`);
                } else {
                    setError(`Lỗi từ server: ${err.response.data.message || "Không xác định"}`);
                }
            } else {
                setError("Không thể thêm tài khoản. Kiểm tra lại kết nối server.");
            }
        }
    };
    

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Thêm tài khoản</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form onSubmit={handleAddUser}>
                                <Form.Group className="mb-3" controlId="formUserName">
                                    <Form.Label>UserName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập UserName"
                                        value={UserName}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Nhập Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Password"
                                        value={password} 
                                        onChange={(e)=> setPassword(e.target.value)}
                                        />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Thêm tài khoản
                                </Button>
                                <Button variant="secondary" type="" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </Form>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default AccountAdd;
