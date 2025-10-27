import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Form, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axiosIntance from "../../utils/axiosInstance";

const RoleEdit = () => {
    const [NameRole, setNameRole] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const navigate = useNavigate();
    const { id } = useParams();


    useEffect(() => {
        const fetchRole = async () => {
            try {
                console.log("Fetching role with ID:", id);
                const res = await axiosIntance.get(`${API_URL}/api/admin/role/${id}`);
                console.log("API Response:", res.data);

                if (res.data && res.data.data) {
                    setNameRole(res.data.data.NameRole || "");  
                }
            } catch (err) {
                setError("Không thể tải dữ liệu chức vụ.");
                console.error("API Error:", err);
            }
        };

        if (id) fetchRole(); 
    }, [id, API_URL]); // Chạy lại nếu id hoặc API_URL thay đổi

    const handleCancel = () => {
        navigate(`/role/list`);
    };

    const handleEditRole = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const payload = {
                idRole: id,
                NameRole
            };

            const res = await axiosIntance.put(`${API_URL}/api/admin/role/edit`, payload);

            if (res.status === 200) {
                setSuccess("Cập nhật chức vụ thành công!");
                setTimeout(() => {
                    navigate("/role/list");
                }, 1000);
            } else {
                throw new Error("Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch (err) {
            setError("Không thể cập nhật chức vụ. Kiểm tra lại kết nối server.");
        }
    };

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Chỉnh sửa chức vụ</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form onSubmit={handleEditRole}>
                                <Form.Group className="mb-3" controlId="formNameRole">
                                    <Form.Label>Têm chức vụ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập tên chức vụ"
                                        value={NameRole}
                                        onChange={(e) => setNameRole(e.target.value)}
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Lưu thay đổi
                                </Button>
                                <Button variant="secondary" onClick={handleCancel} className="ms-2">
                                    Hủy
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default RoleEdit;
