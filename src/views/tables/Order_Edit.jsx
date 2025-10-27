import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axiosIntance from "../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_APP_API_URL;

const OrderEdit = () => {
    const [CustomerName, setCustomerName] = useState("");
    const [PhoneNumber, setPhoneNumber] = useState("");
    const [Address, setAddress] = useState("");
    const [Notes, setNotes] = useState("");
    const [TotalPrice, setTotalPrice] = useState("");
    const [PaymentMethod, setPaymentMethod] = useState("");
    const [Status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { id } = useParams(); // Lấy id từ URL
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axiosIntance.get(`${API_URL}/api/admin/order/list`);
                const order = res.data.data.find((order) => order.idOrder === parseInt(id, 10));
                if (order) {
                    setCustomerName(order.CustomerName);
                    setPhoneNumber(order.PhoneNumber);
                    setAddress(order.Address);
                    setNotes(order.Notes);
                    setTotalPrice(order.TotalPrice);
                    setPaymentMethod(order.PaymentMethod);
                    setStatus(order.Status);
                }
            } catch (err) {
                setError("Không thể tải dữ liệu đơn hàng.");
            }
        };
        fetchOrder();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const updatedOrder = {
                idOrder: parseInt(id, 10),
                CustomerName,
                PhoneNumber,
                Address,
                Notes,
                TotalPrice,
                PaymentMethod,
                Status,
            };
            console.log("updateordersend", updatedOrder);
            const res = await axiosIntance.put(`${API_URL}/api/admin/order/edit`, updatedOrder);

            if (res.data.cod === 200) {
                setSuccess("Cập nhật đơn hàng thành công!");
                setTimeout(() => navigate("/order/list"), 1000);
            } else {
                throw new Error(res.data.message);
            }
        } catch (err) {
            setError("Không thể cập nhật đơn hàng. Kiểm tra lại kết nối server.");
        }
    };

    return (
        <div>
            <h2>Chỉnh sửa đơn hàng</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formCustomerName">
                    <Form.Label>Tên khách hàng</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập tên khách hàng"
                        value={CustomerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhoneNumber">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập số điện thoại"
                        value={PhoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAddress">
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập địa chỉ"
                        value={Address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formNotes">
                    <Form.Label>Ghi chú</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập ghi chú"
                        value={Notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formTotalPrice">
                    <Form.Label>Tổng giá</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Nhập tổng giá"
                        value={TotalPrice}
                        onChange={(e) => setTotalPrice(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPaymentMethod">
                    <Form.Label>Phương thức thanh toán</Form.Label>
                    <Form.Control
                        as='select'
                        value={PaymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                    <option value="0">Cod</option>
                    <option value="1">MoMo</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formStatus">
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Control
                        as="select"
                        value={Status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="0">Đã hủy đơn</option>
                        <option value="1">Đã thanh toán</option>
                        <option value="2">Chưa thanh toán</option>
                        <option value="3">Đơn đã hoàn thành</option>
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Lưu thay đổi
                </Button>
                <Button variant="secondary" onClick={() => navigate("/order/list")} className="ms-2">
                    Hủy
                </Button>
            </Form>
        </div>
    );
};

export default OrderEdit;
