import React, { useEffect, useState } from 'react';
import { Table, Button, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosIntance from '../../utils/axiosInstance';

const OrderList = () => {
  const [Orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5
  });
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axiosIntance.get(`${API_URL}/api/admin/order/list`);
        if (res.data && Array.isArray(res.data.data)) {
          setOrders(res.data.data);
        } else {
          throw new Error('Dữ liệu API không hợp lệ');
        }
      } catch (err) {
        message.error('Lỗi kết nối server hoặc dữ liệu không hợp lệ!');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Hàm hiển thị trạng thái
  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return <span style={{ color: 'red' }}>Đã hủy</span>;
      case 1:
        return <span style={{ color: 'blue' }}>Đã thanh toán</span>;
      case 2:
        return <span style={{ color: 'orange' }}>Chưa thanh toán</span>;
      case 3:
        return <span style={{ color: 'green' }}>Hoàn thành</span>;
      default:
        return <span>Unknown</span>;
    }
  };

  // Hàm hiển thị phương thức thanh toán
  const getPaymentMethodLabel = (PaymentMethod) => {
    const method = parseInt(PaymentMethod, 10);
    switch (method) {
      case 0:
        return <span>COD</span>;
      case 1:
        return <span>MoMo</span>;
      default:
        return <span>Unknown</span>;
    }
  };

  // Xử lý khi nhấn nút Sửa
  const handleEdit = (id) => {
    console.log('Navigating to edit Order with ID:', id);
    navigate(`/order/edit/${id}`);
  };

  // Xử lý khi nhấn nút Xóa
  const handleDelete = async (idOrder) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      try {
        await axiosIntance.delete(`${API_URL}/api/admin/order/delete/${idOrder}`);
        setOrders((prev) => prev.filter((order) => order.idOrder !== idOrder));
        message.success('Đã xóa đơn hàng!');
      } catch (err) {
        message.error('Lỗi khi xóa đơn hàng!');
      }
    }
  };
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
      align: 'center'
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'CustomerName',
      key: 'CustomerName'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'PhoneNumber',
      key: 'PhoneNumber'
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'Address',
      key: 'Address'
    },
    {
      title: 'Ghi chú',
      dataIndex: 'Notes',
      key: 'Notes'
    },
    {
      title: 'Tổng giá',
      dataIndex: 'TotalPrice',
      key: 'TotalPrice',
      render: (price) => `${price?.toLocaleString()} đ`
    },
    {
      title: 'Thanh toán',
      dataIndex: 'PaymentMethod',
      key: 'PaymentMethod',
      render: getPaymentMethodLabel
    },
    {
      title: 'Trạng thái',
      dataIndex: 'Status',
      key: 'Status',
      render: getStatusLabel
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record.idOrder)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record.idOrder)}>
            Xóa
          </Button>
        </>
      )
    }
  ];

  return (
    <Card title="Danh sách Đơn hàng">
      <Table
        dataSource={Orders}
        columns={columns}
        rowKey="idOrder"
        loading={loading}
        pagination={{
          ...pagination,
          total: Orders.length,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (total) => `Tổng ${total} đơn hàng`,
          position: ['bottomCenter']
        }}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default OrderList;
