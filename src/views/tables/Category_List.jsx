import React, { useEffect, useState } from 'react';
import { Table, Button, Card, message, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosIntance from '../../utils/axiosInstance';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5
  });
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosIntance.get(`${API_URL}/api/admin/categories/list`);
      if (res.data && Array.isArray(res.data.data)) {
        setCategories(res.data.data);
      } else {
        throw new Error('Dữ liệu API không hợp lệ');
      }
    } catch (err) {
      setError('Lỗi kết nối server hoặc dữ liệu không hợp lệ!');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/category/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axiosIntance.delete(`${API_URL}/api/admin/categories/delete/${id}`);
      message.success('Đã xóa danh mục thành công!');
      setCategories((prev) => prev.filter((cat) => cat.idCategory !== id));
    } catch (err) {
      message.error('Lỗi khi xóa danh mục!');
    }
  };

  const handleAddCategory = () => {
    navigate('/category/add');
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
      title: 'Tên danh mục',
      dataIndex: 'CategoryName',
      key: 'CategoryName'
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'CategoryImage',
      key: 'CategoryImage',
      render: (images, record) => {
        if (!images) return <span>Không có ảnh</span>;
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {images.split(',').map((img, i) => (
              <img
                key={i}
                src={`${API_URL}/uploads/${img.trim()}`}
                alt={record.CategoryName}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: 'cover',
                  borderRadius: 8,
                  border: '1px solid #f0f0f0'
                }}
              />
            ))}
          </div>
        );
      }
    },
    {
      title: 'Actions',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record.idCategory)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record.idCategory)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <Card
      title="Danh sách danh mục"
      extra={
        <Button type="primary" onClick={handleAddCategory}>
          + Thêm danh mục
        </Button>
      }
      style={{
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Table
        rowKey="idCategory"
        columns={columns}
        dataSource={categories}
        loading={loading}
        pagination={{
          ...pagination,
          total: categories.length,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (total) => `Tổng ${total} danh mục`,
          position: ['bottomCenter']
        }}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default CategoryList;
