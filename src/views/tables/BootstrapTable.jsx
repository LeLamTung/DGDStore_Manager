import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosIntance from "../../utils/axiosInstance";

const BootstrapTable = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/user/list`);
        if (res.data && Array.isArray(res.data.data)) {
          setUsers(res.data.data);
        } else {
          throw new Error("Dữ liệu API không hợp lệ");
        }
      } catch (err) {
        setError("Lỗi kết nối server hoặc dữ liệu không hợp lệ!");
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  // Xử lý khi nhấn nút Sửa
  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  // Xử lý khi nhấn nút Xóa
  const handleDelete = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) {
      try {
        await axios.delete(`${API_URL}/api/admin/user/delete/${userId}`);
        setUsers(users.filter((user) => user.idUser !== userId));
      } catch (err) {
        alert("Lỗi khi xóa tài khoản!");
      }
    }
  };

  // Xử lý khi nhấn nút Thêm
  const handleAddUser = () => {
    navigate("/add-user");
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title as="h5">Danh sách tài khoản</Card.Title>
              <Button variant="primary" onClick={handleAddUser}>
                + Thêm tài khoản
              </Button>
            </Card.Header>
            <Card.Body>
              {error && <p className="text-danger">{error}</p>}
              <Table responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(users) && users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user.idUser}>
                        <th scope="row">{index + 1}</th>
                        <td>{user.UserName}</td>
                        <td>{user.email}</td>
                        <td>
                          <Button
                            variant="success"
                            className="mx-1"
                            onClick={() => handleEdit(user.idUser)}
                          >
                            Sửa
                          </Button>
                          <Button
                            variant="danger"
                            className="mx-1"
                            onClick={() => handleDelete(user.idUser)}
                          >
                            Xóa
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BootstrapTable;
