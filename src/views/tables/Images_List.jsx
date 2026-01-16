import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Space, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const { Title } = Typography;

const ImageList = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5
  });
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`${API_URL}/api/admin/images/list`);
      if (res.data && Array.isArray(res.data.data)) {
        setImages(res.data.data);
      } else {
        message.error('Dữ liệu API không hợp lệ!');
      }
    } catch (err) {
      message.error('Lỗi kết nối server!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (img) => {
    if (!img || !img.idImage || !img.Product?.idProduct) {
      message.error('Lỗi dữ liệu ảnh!');
      return;
    }
    navigate(`/images/edit/${img.idImage}?productId=${img.Product.idProduct}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này?')) {
      try {
        await axiosInstance.delete(`${API_URL}/api/admin/images/delete/${id}`);
        message.success('Đã xóa ảnh!');
        setImages((prev) => prev.filter((item) => item.idImage !== id));
      } catch (err) {
        message.error('Lỗi khi xóa ảnh!');
      }
    }
  };
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
      align: 'center'
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'ImageLink',
      key: 'ImageLink',
      render: (text) => (
        <img
          src={`${text}`}
          alt="Ảnh"
          style={{
            width: 100,
            height: 100,
            borderRadius: 8,
            objectFit: 'cover'
          }}
        />
      )
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: ['Product', 'ProductName'],
      key: 'ProductName',
      render: (text) => text || 'Không có sản phẩm'
    },
    {
      title: 'Loại ảnh',
      dataIndex: 'MainImage',
      key: 'MainImage',
      render: (main) => (main ? 'Ảnh chính' : 'Ảnh phụ')
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) =>
        !record.MainImage && (
          <Space>
            <Button type="primary" onClick={() => handleEdit(record)}>
              Sửa
            </Button>
            <Button danger onClick={() => handleDelete(record.idImage)}>
              Xóa
            </Button>
          </Space>
        )
    }
  ];

  return (
    <Card title="Danh sách tất cả hình ảnh" loading={loading}>
      <Table
        columns={columns}
        dataSource={images}
        rowKey="idImage"
        pagination={{
          ...pagination,
          total: images.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total} ảnh`,
          position: ['bottomCenter']
        }}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default ImageList;
