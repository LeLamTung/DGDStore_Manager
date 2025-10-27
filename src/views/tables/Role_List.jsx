import React, { useState, useEffect } from 'react';
import { Card, Table, Button, message, Popconfirm } from "antd";

import { useNavigate } from 'react-router-dom';
import axiosIntance from '../../utils/axiosInstance';

const BootstrapTable = () => {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5
  });
  useEffect(() => {
    fetchRoles();
  }, []);
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await axiosIntance.get(`${API_URL}/api/admin/role/list`);
      if (res.data && Array.isArray(res.data.data)) {
        setRoles(res.data.data);
      } else {
        throw new Error('Dữ liệu API không hợp lệ');
      }
    } catch (err) {
      setError('Lỗi kết nối server hoặc dữ liệu không hợp lệ!');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi nhấn nút Sửa
  const handleEdit = (roleId) => {
    console.log('Navigating to edit role with ID:', roleId, typeof roleId);

    if (!roleId || (typeof roleId !== 'string' && typeof roleId !== 'number')) {
      console.error('Lỗi: roleId không hợp lệ!', roleId);
      return;
    }

    navigate(`/role/edit/${roleId}`);
  };

  // Xử lý khi nhấn nút Xóa
  const handleDelete = async (roleId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chức vụ này không?')) {
      try {
        await axiosIntance.delete(`${API_URL}/api/admin/role/delete/${roleId}`);
        setRoles((prevRoles) => prevRoles.filter((role) => role.idRole !== roleId));
      } catch (err) {
        alert('Lỗi khi xóa tài khoản!');
      }
    }
  };

  // Xử lý khi nhấn nút Thêm
  const handleAddUser = () => {
    navigate('/role/add');
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
      title: 'Tên chức vụ',
      dataIndex: 'NameRole',
      key: 'NameRole'
    },
    {
      title: 'Actions',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record.idRole)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa chức vụ này?"
            onConfirm={() => handleDelete(record.idRole)}
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
      title="Danh sách chức vụ"
      extra={
        <Button type="primary" onClick={handleAddUser}>
          + Thêm chức vụ
        </Button>
      }
      style={{
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Table
        rowKey="idRole"
        columns={columns}
        dataSource={roles}
        loading={loading}
        pagination={{
          ...pagination,
          total: roles.length,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (total) => `Tổng ${total} chức vụ`,
          position: ['bottomCenter']
        }}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default BootstrapTable;
