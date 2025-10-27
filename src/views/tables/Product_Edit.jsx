import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Image } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axiosIntance from '../../utils/axiosInstance';

const API_URL = import.meta.env.VITE_APP_API_URL;

const ProductEdit = () => {
  const { id } = useParams(); // lấy ID từ URL
  const [ProductName, setProductName] = useState('');
  const [Stock, setStock] = useState('1');
  const [OriginalPrice, setOriginalPrice] = useState('');
  const [SalePrice, setSalePrice] = useState('');
  const [SalePercentage, setSalePercentage] = useState('');
  const [Description, setDescription] = useState('');
  const [IsSales, setIsSales] = useState(true);
  const [IsHome, setIsHome] = useState(true);
  const [categoryId, setCategoryId] = useState('');
  const [currentImages, setCurrentImages] = useState([]); // ảnh cũ
  const [ProductImages, setProductImages] = useState([]); // ảnh mới
  const [mainImageIndex, setMainImageIndex] = useState(1); // mặc định ảnh đầu tiên là ảnh chính
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        const res = await axiosIntance.get(`${API_URL}/api/admin/product/list/${id}`);
        const product = res.data.data;
        setProductName(product.ProductName);
        setStock(product.Stock);
        setOriginalPrice(product.OriginalPrice);
        setSalePrice(product.SalePrice);
        setSalePercentage(product.SalePercentage);
        setDescription(product.Description);
        setIsSales(product.IsSales);
        setIsHome(product.IsHome);
        setCategoryId(product.Category);
        setCurrentImages(product.Images || []);
        const mainIndex = product.Images.findIndex((img) => img.MainImage);
        setMainImageIndex(mainIndex + 1 || 1);

        const catRes = await axiosIntance.get(`${API_URL}/api/admin/categories/list`);
        setCategories(catRes.data.data); // tùy backend trả về danh sách
      } catch (err) {
        setError('Không thể tải dữ liệu sản phẩm hoặc danh mục.');
      }
    };
    fetchProductAndCategories();
  }, [id]);

  const handleImageChange = (e) => {
    setProductImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formData = {
        idProduct: id,
        ProductName,
        Stock,
        OriginalPrice,
        SalePrice,
        SalePercentage,
        Description,
        IsSales,
        IsHome,
        Category: categoryId,
        mainImage: currentImages[mainImageIndex - 1]?.ImageLink // Gửi tên ảnh chính
      };
      console.log(formData);
      const res = await axiosIntance.put(`${API_URL}/api/admin/product/edit`, formData);

      if (res.data.message === 'Cập nhật sản phẩm thành công!') {
        setSuccess('Cập nhật sản phẩm thành công!');
        setTimeout(() => navigate('/product/list'), 1000);
      } else {
        setError('Cập nhật thất bại.');
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi server khi cập nhật sản phẩm.');
    }
  };

  return (
    <div>
      <h2>Cập nhật sản phẩm</h2>
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
          <Form.Label>Danh mục sản phẩm</Form.Label>
          <Form.Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">-- Chọn danh mục --</option>
            {categories.map((category) => (
              <option key={category.idCategory} value={category.idCategory}>
                {category.CategoryName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Giá gốc</Form.Label>
          <Form.Control type="number" min={1} value={OriginalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Phần trăm giảm giá</Form.Label>
          <Form.Control type="number" min={0} value={SalePercentage} onChange={(e) => setSalePercentage(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Giá Bán</Form.Label>
          <Form.Control
            type="number"
            value={SalePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            // readOnly={true}
            disabled={true}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control as="textarea" rows={3} value={Description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Group>
        {/* <Form.Check
          className="mb-3"
          type="checkbox"
          label="Đang giảm giá"
          checked={IsSales}
          onChange={(e) => setIsSales(e.target.checked)}
        />
        <Form.Check
          className="mb-3"
          type="checkbox"
          label="Hiển thị trang chủ"
          checked={IsHome}
          onChange={(e) => setIsHome(e.target.checked)}
        /> */}
        <Form.Group className="mb-3">
          <Form.Label>Ảnh hiện tại</Form.Label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {currentImages.map((img, index) => (
              <div key={img.ImageLink}>
                <Image src={`${API_URL}/uploads/${img.ImageLink}`} thumbnail width={100} height={100} />
                {/* <Form.Check
                  type="radio"
                  label="Ảnh chính"
                  name="mainImage"
                  checked={mainImageIndex === index + 1}
                  onChange={() => setMainImageIndex(index + 1)}
                /> */}
              </div>
            ))}
          </div>
        </Form.Group>
        {/* <Form.Group className="mb-3">
          <Form.Label>Thêm ảnh mới</Form.Label>
          <Form.Control type="file" multiple onChange={handleImageChange} />
        </Form.Group> */}
        <Button type="submit" variant="primary">
          Cập nhật
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate('/product/list')}>
          Hủy
        </Button>
      </Form>
    </div>
  );
};

export default ProductEdit;
