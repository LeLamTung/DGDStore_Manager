import React, { useState, useEffect } from "react";
import { Card, Table, Button, message, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import axiosIntance from "../../utils/axiosInstance";

const BootstrapTable = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const API_URL = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosIntance.get(`${API_URL}/api/admin/user/list`);
      if (res.data && Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      } else {
        throw new Error("Dữ liệu API không hợp lệ");
      }
    } catch (err) {
      setError("Lỗi kết nối server hoặc dữ liệu không hợp lệ!");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (userId) => {
    navigate(`/account/edit/${userId}`);
  };

  const handleDelete = async (userId) => {
    try {
      await axiosIntance.delete(`${API_URL}/api/admin/user/delete/${userId}`);
      message.success("Đã xóa tài khoản thành công!");
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.idUser !== userId)
      );
    } catch (err) {
      message.error("Lỗi khi xóa tài khoản!");
    }
  };

  // const handleAddUser = () => {
  //   navigate("/account/add");
  // };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // Cấu hình cột cho bảng antd
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Username",
      dataIndex: "UserName",
      key: "UserName",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
    },
    {
      title: "Role",
      dataIndex: ["Role", "NameRole"],
      key: "Role",
    },
    {
      title: "Active",
      dataIndex: "IsActive",
      render: (isActive) =>
        isActive ? (
          <span style={{ color: "green", fontWeight: 500 }}>Có</span>
        ) : (
          <span style={{ color: "red", fontWeight: 500 }}>Không</span>
        ),
      align: "center",
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleEdit(record.idUser)}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa tài khoản này?"
            onConfirm={() => handleDelete(record.idUser)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Card
      title="Danh sách tài khoản"
      // extra={
      //   <Button type="primary" onClick={handleAddUser}>
      //     + Thêm tài khoản
      //   </Button>
      // }
      style={{
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Table
        rowKey="idUser"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{
          ...pagination,
          total: users.length,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total) => `Tổng ${total} tài khoản`,
          position: ["bottomCenter"],
        }}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default BootstrapTable;
