import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosIntance from "../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_APP_API_URL;

const CategoryAdd = () => {
  const [CategoryName, setCategoryName] = useState("");
  const [CategoryImages, setCategoryImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("CategoryName", CategoryName);
    CategoryImages.forEach((image) => formData.append("Images", image));
    try {
      const res = await axiosIntance.post(`${API_URL}/api/admin/categories/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.cod === 200) {
        setSuccess("Thêm danh mục thành công!");
        setTimeout(() => navigate("/category/list"), 1000);
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      setError("Không thể thêm danh mục. Kiểm tra lại kết nối server.");
    }
  };

  const handleImageChange = (e) => {
    setCategoryImages([...e.target.files]);
  };

  return (
    <div>
      <h2>Thêm danh mục</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formCategoryName">
          <Form.Label>Tên danh mục</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập tên danh mục"
            value={CategoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCategoryImages">
          <Form.Label>Hình ảnh</Form.Label>
          <Form.Control type="file" multiple onChange={handleImageChange} />
        </Form.Group>
        
        <Button variant="primary" type="submit">Thêm danh mục</Button>
        <Button variant="secondary" onClick={() => navigate("/category/list")} className="ms-2">Hủy</Button>
      </Form>
    </div>
  );
};

export default CategoryAdd;
