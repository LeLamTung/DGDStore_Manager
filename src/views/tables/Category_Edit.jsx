import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axiosIntance from "../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_APP_API_URL;

const CategoryEdit = () => {
    const [CategoryName, setCategoryName] = useState("");
    const [CategoryImages, setCategoryImages] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();
    console.log(`Extracted roleId: ${typeof(id)}`, id);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axiosIntance.get(`${API_URL}/api/admin/categories/list`);
                const category = res.data.data.find((cat) => cat.idCategory === parseInt(id,10));
                console.log(category)
                if (category) {
                    setCategoryName(category.CategoryName);
                    setCategoryImages(category.CategoryImage ? category.CategoryImage.split(",") : []); // ✅ Fix lỗi
                }
            } catch (err) {
                setError("Không thể tải dữ liệu danh mục.");
            }
        };
        fetchCategory();
    }, [id]);

    const handleImageChange = (e) => {
        setCategoryImages([...e.target.files]); // ✅ Lưu ảnh mới
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append("idCategory", id);
        formData.append("CategoryName", CategoryName);
        if (CategoryImages.length > 0) {
            CategoryImages.forEach((file) => formData.append("Images", file));
        }

        try {
            const res = await axiosIntance.put(`${API_URL}/api/admin/categories/edit`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.cod === 200) {
                setSuccess("Cập nhật danh mục thành công!");
                setTimeout(() => navigate("/category/list"), 1000);
            } else {
                throw new Error(res.data.message);
            }
        } catch (err) {
            setError("Không thể cập nhật danh mục. Kiểm tra lại kết nối server.");
        }
    };

    return (
        <div>
            <h2>Chỉnh sửa danh mục</h2>
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

                <Form.Group className="mb-3" controlId="formCategoryImage">
                    <Form.Label>Hình ảnh</Form.Label>
                    <Form.Control type="file" multiple onChange={handleImageChange} />
                </Form.Group>

                {CategoryImages.length > 0 && (
                    <Form.Group className="mb-3" controlId="prevImages">
                        <Form.Label>Hình ảnh hiện tại</Form.Label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                            {Array.isArray(CategoryImages) && CategoryImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={`${API_URL}/uploads/${typeof image === "string" ? image.trim() : image}`}
                                    alt="Category"
                                    width={100}
                                    height={100}
                                    style={{ objectFit: "cover", borderRadius: "5px" }}
                                />
                            ))}


                        </div>
                    </Form.Group>
                )}

                <Button variant="primary" type="submit">Lưu thay đổi</Button>
                <Button variant="secondary" onClick={() => navigate("/category/list")} className="ms-2">Hủy</Button>
            </Form>
        </div>
    );
};

export default CategoryEdit;
