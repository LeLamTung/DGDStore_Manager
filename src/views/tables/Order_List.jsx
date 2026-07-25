import React, { useEffect, useState } from 'react';
import { Table, Button, message, Card, Tag, Space, Tooltip } from 'antd'; 
import { useNavigate } from 'react-router-dom';
import axiosIntance from '../../utils/axiosInstance';
import moment from 'moment'; 

const OrderList = () => {
  const [Orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10, // Tăng mặc định lên 10 cho dễ nhìn
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axiosIntance.get(`${API_URL}/api/admin/order/list`);
        if (res.data && Array.isArray(res.data.data)) {
          // Sắp xếp đơn mới nhất lên đầu (nếu API chưa sort)
          const sortedOrders = res.data.data.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
          setOrders(sortedOrders);
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

  // --- HÀM RENDER TRẠNG THÁI (Dựa theo Entity) ---

  // 1. OrderStatus: 1: Pending, 2: Processing, 3: Shipping, 4: Completed, 5: Cancelled
  const renderOrderStatus = (status) => {
    switch (status) {
      case 1:
        return <Tag color="orange">Chờ xử lý</Tag>;
      case 2:
        return <Tag color="blue">Đang xử lý</Tag>;
      case 3:
        return <Tag color="cyan">Đang giao (GHN)</Tag>;
      case 4:
        return <Tag color="green">Hoàn thành</Tag>;
      case 5:
        return <Tag color="red">Đã hủy</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  // 2. PaymentStatus: 0: Unpaid, 1: Paid, 2: Refunded
  const renderPaymentStatus = (status) => {
    switch (status) {
      case 0:
        return <Tag color="default" style={{ border: '1px solid #d9d9d9' }}>Chưa TT</Tag>;
      case 1:
        return <Tag color="success">Đã TT</Tag>;
      case 2:
        return <Tag color="purple">Hoàn tiền</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  // 3. Phương thức thanh toán
  const renderPaymentMethod = (method) => {
    const m = String(method); // Chuyển về string để so sánh cho chắc
    if (m === '0') return <Tag color="magenta">COD</Tag>;
    if (m === '1') return <Tag color="#a50064">MoMo</Tag>; // Màu đặc trưng MoMo
    return <span>{method}</span>;
  };

  const handleEdit = (id) => {
    navigate(`/order/edit/${id}`);
  };

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

  // --- CẤU HÌNH CỘT ---
  const columns = [
    {
      title: 'ID',
      dataIndex: 'idOrder',
      key: 'idOrder',
      width: 60,
      align: 'center',
      fixed: 'left', // Cố định cột ID bên trái
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
      width: 110,
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm'), // Format ngày giờ
      sorter: (a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt),
    },
    {
      title: 'Khách hàng',
      key: 'customerInfo',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.CustomerName}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.PhoneNumber}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái đơn',
      dataIndex: 'OrderStatus', // Map với Entity
      key: 'OrderStatus',
      width: 120,
      align: 'center',
      filters: [
        { text: 'Chờ xử lý', value: 1 },
        { text: 'Đang giao', value: 3 },
        { text: 'Hoàn thành', value: 4 },
        { text: 'Đã hủy', value: 5 },
      ],
      onFilter: (value, record) => record.OrderStatus === value,
      render: renderOrderStatus,
    },
    {
      title: 'Thanh toán',
      key: 'paymentInfo',
      width: 140,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          {renderPaymentMethod(record.PaymentMethod)}
          <div style={{ marginTop: 4 }}>{renderPaymentStatus(record.PaymentStatus)}</div>
        </Space>
      ),
    },
    {
      title: 'Vận chuyển (GHN)',
      key: 'ghn',
      width: 150,
      render: (_, record) => (
        <div>
           {record.GhnOrderCode ? (
             <a 
               href={`https://donhang.ghn.vn/?order_code=${record.GhnOrderCode}`} 
               target="_blank" 
               rel="noopener noreferrer"
               style={{ fontWeight: 'bold', color: '#1677ff', textDecoration: 'underline' }}
               title="Bấm để theo dõi đơn hàng trên GHN"
             >
                {record.GhnOrderCode} <span style={{fontSize: '10px'}}>↗</span>
             </a>
           ) : (
             <span>-</span>
           )}
           
           {/* Hiển thị phí ship */}
           <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
              Ship: {record.ShippingFee ? record.ShippingFee.toLocaleString() : 0} đ
           </div>
        </div>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'TotalPrice',
      key: 'TotalPrice',
      width: 120,
      align: 'right',
      render: (price) => (
        <span style={{ color: '#d4380d', fontWeight: 'bold' }}>
          {price?.toLocaleString()} đ
        </span>
      ),
      sorter: (a, b) => a.TotalPrice - b.TotalPrice,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'Address',
      key: 'Address',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      fixed: 'right', // Cố định bên phải
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleEdit(record.idOrder)}>
            Sửa
          </Button>
          {/* Chỉ cho xóa nếu đơn đã hủy hoặc mới tạo (tùy logic) */}
          <Button type="text" danger size="small" onClick={() => handleDelete(record.idOrder)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý Đơn hàng" bordered={false}>
      <Table
        dataSource={Orders}
        columns={columns}
        rowKey="idOrder"
        loading={loading}
        scroll={{ x: 1300 }} // Cho phép cuộn ngang nếu bảng quá rộng
        pagination={{
          ...pagination,
          total: Orders.length,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} đơn hàng`,
        }}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default OrderList;