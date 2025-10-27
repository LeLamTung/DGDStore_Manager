import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Form, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axiosIntance from "../../utils/axiosInstance";

const AccountEdit = () => {
    const [UserName, setUserName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [IsActive, setIsActive] = useState(true); // ✅ Trạng thái hoạt động
    const [RoleId, setRoleId] = useState(""); // Role được chọn
    const [roles, setRoles] = useState([]);   // Danh sách tất cả role
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosIntance.get(`${API_URL}/api/admin/user/${id}`);
                if (res.data && res.data.data) {
                    setUserName(res.data.data.UserName || "");
                    setEmail(res.data.data.Email || "");
                    setIsActive(res.data.data.IsActive ?? true);
                    setRoleId(res.data.data.RoleId || "");
                }
            } catch (err) {
                setError("Không thể tải dữ liệu tài khoản.");
            }
        };

        const fetchRoles = async () => {
            try {
                const res = await axiosIntance.get(`${API_URL}/api/admin/role/list`);
                if (res.data && res.data.data) {
                    setRoles(res.data.data);
                }
            } catch (err) {
                setError("Không thể tải danh sách quyền.");
            }
        };

        if (id) {
            fetchUser();
            fetchRoles();
        }
    }, [id, API_URL]);

    const handleCancel = () => {
        navigate(`/account/list`);
    };

    const handleEditUser = async (e) => {
        e.preventDefault();
        console.log("Form submitted"); // Debug line
        setError("");
        setSuccess("");

        try {
            const payload = {
                idUser: id,
                UserName,
                Email,
                IsActive, // ✅ Gửi lên backend
                Role: RoleId // Chuyển đổi tên biến cho đúng với backend
            };
            console.log("Payload:", payload); // Debugging
            if (Password.trim() !== "") {
                payload.Password = Password;
            }

            const res = await axiosIntance.put(`${API_URL}/api/admin/user/edit`, payload);

            if (res.status === 200) {
                setSuccess("Cập nhật tài khoản thành công!");
                setTimeout(() => {
                    navigate("/account/list");
                }, 1000);
            } else {
                throw new Error("Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch (err) {
            setError("Không thể cập nhật tài khoản. Kiểm tra lại kết nối server.");
        }
    };

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Chỉnh sửa tài khoản</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form onSubmit={handleEditUser}>
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
                                        value={Email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Để trống nếu không đổi mật khẩu"
                                        value={Password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formRole">
                                    <Form.Label>Quyền tài khoản</Form.Label>
                                    <Form.Select
                                        value={RoleId}
                                        onChange={(e) => setRoleId(e.target.value)}
                                    >
                                        <option value="">-- Chọn quyền --</option>
                                        {roles.map(role => (
                                            <option key={role.idRole} value={role.idRole}>{role.NameRole}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formIsActive">
                                    <Form.Label>Trạng thái hoạt động</Form.Label>
                                    <Form.Select
                                        value={IsActive ? "true" : "false"}
                                        onChange={(e) => setIsActive(e.target.value === "true")}
                                    >
                                        <option value="true">Có</option>
                                        <option value="false">Không</option>
                                    </Form.Select>
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

export default AccountEdit;
