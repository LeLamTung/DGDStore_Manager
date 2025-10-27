import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosIntance from '../../utils/axiosInstance';
const API_URL = import.meta.env.VITE_APP_API_URL;

const ProductAdd = () => {
  const [ProductName, setProductName] = useState('');
  const [Stock, setStock] = useState('1');
  const [OriginalPrice, setOriginalPrice] = useState('');
  const [SalePrice, setSalePrice] = useState('');
  const [SalePercentage, setSalePercentage] = useState('0');
  const [Description, setDescription] = useState('');
  const [IsSales, setIsSales] = useState(true);
  const [IsHome, setIsHome] = useState(true);
  const [ProductImages, setProductImages] = useState([]);
  const [defaultImageIndex, setDefaultImageIndex] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API lấy danh mục
    const fetchCategories = async () => {
      try {
        const res = await axiosIntance.get(`${API_URL}/api/admin/categories/list`);
        setCategories(res.data.data); // cập nhật nếu backend trả ra `data.data`
      } catch (err) {
        setError('Không thể tải danh sách danh mục!');
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!categoryId) {
      setError('Vui lòng chọn danh mục sản phẩm.');
      return;
    }

    const formData = new FormData();
    formData.append('ProductName', ProductName);
    formData.append('Stock', Stock);
    formData.append('OriginalPrice', OriginalPrice);
    formData.append('SalePrice', SalePrice);
    formData.append('SalePercentage', SalePercentage);
    formData.append('Description', Description);
    formData.append('IsSales', IsSales ? 1 : 0);
    formData.append('IsHome', IsHome ? 1 : 0);
    formData.append('categoryIdCategory', categoryId); // tên field này cần giống bên backend
    formData.append('rDefault', defaultImageIndex ?? 0);
    ProductImages.forEach((image) => formData.append('Images', image));

    try {
      const res = await axiosIntance.post(`${API_URL}/api/admin/product/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.cod === 200) {
        setSuccess('Thêm sản phẩm thành công!');
        setTimeout(() => navigate('/product/list'), 1000);
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      setError('Không thể thêm sản phẩm. Kiểm tra lại kết nối server.');
    }
  };

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setProductImages(files);
    setDefaultImageIndex(null);
  };

  return (
    <div>
      <h2>Thêm sản phẩm</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tên sản phẩm</Form.Label>
          <Form.Control type="text" value={ProductName} onChange={(e) => setProductName(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Số lượng nhập</Form.Label>
          <Form.Control type="number" min={1} value={Stock} onChange={(e) => setStock(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Giá gốc</Form.Label>
          <Form.Control type="number"min={1} value={OriginalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phần trăm giảm giá</Form.Label>
          <Form.Control type="number" min={0} max={100} value={SalePercentage} onChange={(e) => setSalePercentage(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Giá bán</Form.Label>
          <Form.Control type="number" value={SalePrice} onChange={(e) => setSalePrice(e.target.value)} disabled={true} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control as="textarea" rows={3} value={Description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Danh mục sản phẩm</Form.Label>
          <Form.Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.idCategory} value={cat.idCategory}>
                {cat.CategoryName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* <Form.Group className="mb-3">
          <Form.Check label="Đang giảm giá" checked={IsSales} onChange={(e) => setIsSales(e.target.checked)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check label="Hiển thị trên trang chủ" checked={IsHome} onChange={(e) => setIsHome(e.target.checked)} />
        </Form.Group> */}

        <Form.Group className="mb-3">
          <Form.Label>Hình ảnh</Form.Label>
          <Form.Control type="file" multiple onChange={handleImageChange} />
          {ProductImages.length > 0 && (
            <div className="mt-3">
              <p>Chọn ảnh chính:</p>
              {ProductImages.map((file, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <input
                    type="radio"
                    name="rDefault"
                    value={index}
                    checked={defaultImageIndex === index}
                    onChange={() => setDefaultImageIndex(index)}
                    className="me-2"
                  />
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover', borderRadius: '5px' }}
                  />
                  <span className="ms-2">{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit">
          Thêm sản phẩm
        </Button>
        <Button variant="secondary" onClick={() => navigate('/product/list')} className="ms-2">
          Hủy
        </Button>
      </Form>
    </div>
  );
};

export default ProductAdd;
