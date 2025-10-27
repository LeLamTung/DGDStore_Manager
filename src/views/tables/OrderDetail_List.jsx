import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Card, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosIntance from "../../utils/axiosInstance";

const ProductList = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axiosIntance.get(`${API_URL}/api/admin/order/orderdetail/list`);
        if (res.data && Array.isArray(res.data.data)) {
          // Nhóm dữ liệu theo idOrder
          const groupedOrders = res.data.data.reduce((acc, item) => {
            const orderId = item.Order?.idOrder;
            if (!acc[orderId]) {
              acc[orderId] = { ...item.Order, orderDetails: [] };  // Khởi tạo đối tượng cho mỗi đơn hàng
            }
            acc[orderId].orderDetails.push(item);  // Thêm chi tiết đơn hàng vào đơn hàng tương ứng
            return acc;
          }, {});

          setOrders(Object.values(groupedOrders)); // Chuyển object thành array để render
        } else {
          throw new Error('Dữ liệu API không hợp lệ');
        }
      } catch (err) {
        setError('Lỗi kết nối server hoặc dữ liệu không hợp lệ!');
      }
    };
    fetchOrderDetails();
  }, []);

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return <span style={{ backgroundColor: 'gray', color: 'white', padding: '5px 10px', borderRadius: '4px' }}>Cancelled</span>;
      case 1:
        return <span style={{ backgroundColor: 'lightblue', color: 'black', padding: '5px 10px', borderRadius: '4px' }}>Đã thanh toán</span>;
      case 2:
        return <span style={{ backgroundColor: 'gray', color: 'white', padding: '5px 10px', borderRadius: '4px' }}>Chưa thanh toán</span>;
      case 3:
        return <span style={{ backgroundColor: 'lightgreen', color: 'black', padding: '5px 10px', borderRadius: '4px' }}>Đơn đã hoàn thành</span>;
      default:
        return <span style={{ padding: '5px 10px', borderRadius: '4px' }}>Unknown</span>;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (parseInt(method, 10)) {
      case 0:
        return <span style={{ backgroundColor: 'gray', color: 'white', padding: '5px 10px', borderRadius: '4px' }}>COD</span>;
      case 1:
        return <span style={{ backgroundColor: 'lightpink', color: 'black', padding: '5px 10px', borderRadius: '4px' }}>MoMo</span>;
      default:
        return <span style={{ padding: '5px 10px', borderRadius: '4px' }}>Unknown</span>;
    }
  };

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title as="h5">Chi tiết đơn hàng</Card.Title>
          </Card.Header>
          <Card.Body>
            {error && <p className="text-danger">{error}</p>}
            <Table responsive bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên khách hàng</th>
                  <th>SĐT</th>
                  <th>Sản phẩm</th>
                  <th>Ảnh</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
                  {/* <th>Phương thức thanh toán</th>
                  <th>Trạng thái</th> */}
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order, orderIndex) => (
                    <React.Fragment key={order.idOrder}>
                      {/* Hiển thị thông tin đơn hàng một lần */}
                      <tr>
                        <td colSpan="10" className="text-center font-weight-bold">
                          Đơn hàng #{order.idOrder} - {order.CustomerName} - {order.PhoneNumber} - {getStatusLabel(order.Status)}
                          <br>
                          </br>
                          Ngày đặt hàng: {new Date(order.CreatedAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })}
                          <br>
                          </br>
                          Tổng tiền: {order.TotalPrice?.toLocaleString()}đ - Phương thức thanh toán: {getPaymentMethodLabel(order.PaymentMethod)}
                        </td>
                      </tr>
                      {/* Hiển thị chi tiết đơn hàng */}
                      {order.orderDetails.map((item, index) => (
                        <tr key={item.idOrderDetail}>
                          <td>{orderIndex + 1}.{index + 1}</td>
                          <td>{item.Order?.CustomerName}</td>
                          <td>{item.Order?.PhoneNumber}</td>
                          <td>{item.ProductName}</td>
                          <td>
                            <Image
                              src={`${API_URL}/uploads/${item.ProductImage}`}
                              alt={item.ProductName}
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              rounded
                            />
                          </td>
                          <td>{item.Price?.toLocaleString()}đ</td>
                          <td>{item.Quantity}</td>
                          <td>{item.TotalPrice?.toLocaleString()}đ</td>
                          
                          {/* <td>{getPaymentMethodLabel(item.Order?.PaymentMethod)}</td>
                          <td>{getStatusLabel(item.Order?.Status)}</td> */}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ProductList;
