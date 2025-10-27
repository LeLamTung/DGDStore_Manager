import React, { useState } from "react";
import { Row, Col, Card, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosIntance from "../../utils/axiosInstance";

const AccountAdd = () => {
    const [NameRole, setNameRole] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate(`/role/list`);
    };
    // Xử lý khi nhấn nút "Thêm chức vụ"
    const handleAddRole = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
    
        console.log("Sending data:", { NameRole });
    
        if (!NameRole) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
    
        try {
            const res = await axiosIntance.post(`${API_URL}/api/admin/role/create`, {
                NameRole,
            });
    
            console.log("API Response:", res); // Debug phản hồi từ API
    
            // Kiểm tra phản hồi từ API
            if (res.status === 201 || res.status === 200) {
                setSuccess("Thêm chức vụ thành công!");
                setNameRole("");
    
                // Điều hướng về danh sách chức vụ sau 1 giây
                setTimeout(() => {
                    navigate("/role/list");
                }, 1000);
            } else {
                throw new Error("Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch (err) {
            console.error("API Error:", err.response || err.message);
    
            if (err.response) {
                if (err.response.status === 500) {
                    setError(`Lỗi từ server: ${err.response.data.message || "Không xác định"}`);                   
                }
            } else {
                setError("Không thể thêm chức vụ. Kiểm tra lại kết nối server.");
            }
        }
    };
    

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Thêm chức vụ</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form onSubmit={handleAddRole}>
                                <Form.Group className="mb-3" controlId="formNNameRole">
                                    <Form.Label>Tên chức vụ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập tên chức vụ"
                                        value={NameRole}
                                        onChange={(e) => setNameRole(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Thêm chức vụ
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
