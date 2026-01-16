import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Image, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axiosIntance from '../../utils/axiosInstance';

const API_URL = import.meta.env.VITE_APP_API_URL;

const ProductEdit = ({productId, onSuccess, onCancel}) => {
  // const { id } = useParams();
  const [ProductName, setProductName] = useState('');
  const [Stock, setStock] = useState('1');
  const [OriginalPrice, setOriginalPrice] = useState('');
  const [SalePrice, setSalePrice] = useState('');
  const [SalePercentage, setSalePercentage] = useState('');
  const [Description, setDescription] = useState('');
  const [IsSales, setIsSales] = useState(true);
  const [IsHome, setIsHome] = useState(true);
  const [categoryId, setCategoryId] = useState('');
  const [currentImages, setCurrentImages] = useState([]);
  const [ProductImages, setProductImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(1);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  // --- STATE MỚI CHO AI ---
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiReason, setAiReason] = useState('');

  useEffect(() => {
    if(!productId) return;
    const fetchProductAndCategories = async () => {
      try {
        const res = await axiosIntance.get(`${API_URL}/api/admin/product/list/${productId}`);
        // Kiểm tra an toàn dữ liệu
        const product = res.data?.data || {}; 
        
        setProductName(product.ProductName || '');
        setStock(product.Stock || '0');
        setOriginalPrice(product.OriginalPrice || '');
        setSalePrice(product.SalePrice || '');
        setSalePercentage(product.SalePercentage || '');
        setDescription(product.Description || '');
        setIsSales(product.IsSales);
        setIsHome(product.IsHome);
        setCategoryId(product.Category || '');
        setCurrentImages(product.Images || []);
        
        if(product.Images && product.Images.length > 0) {
            const mainIndex = product.Images.findIndex((img) => img.MainImage);
            setMainImageIndex(mainIndex !== -1 ? mainIndex + 1 : 1);
        }

        const catRes = await axiosIntance.get(`${API_URL}/api/admin/categories/list`);
        setCategories(catRes.data?.data || []);
      } catch (err) {
        setError('Không thể tải dữ liệu sản phẩm hoặc danh mục.');
      }
    };
    fetchProductAndCategories();
  }, [productId]);

  const handleSuggestPrice = async () => {
    // 1. Validate dữ liệu đầu vào cơ bản
    if (!ProductName || !OriginalPrice) {
      alert("Vui lòng nhập Tên sản phẩm và Giá gốc để AI có thể tính toán!");
      return;
    }

    // 2. Lấy tên danh mục từ ID
    const selectedCategory = categories.find(cat => String(cat.idCategory) === String(categoryId));
    const categoryName = selectedCategory ? selectedCategory.CategoryName : "";

    setLoadingAI(true);
    setAiReason('');
    setError(''); // Clear lỗi cũ nếu có

    try {
      // 3. Gọi Backend
      const res = await axiosIntance.post(`${API_URL}/api/admin/product/suggest-price`, {
        ProductName: ProductName,
        OriginalPrice: Number(OriginalPrice),
        Description: Description,
        CategoryName: categoryName
      });

      // 4. Xử lý kết quả (Thêm check an toàn)
      if (res.data && (res.data.cod === 200 || res.status === 200)) {
        // Một số backend trả data trực tiếp, một số bọc trong .data.data, hãy log ra để chắc chắn
        // console.log("AI Response:", res.data); 
        
        const aiData = res.data.data || res.data; // Fallback nếu cấu trúc khác

        if (aiData && aiData.suggestedPrice !== undefined) {
            // Tự động điền giá vào ô SalePrice
            setSalePrice(aiData.suggestedPrice);
    
            // Hiển thị lý do
            setAiReason(aiData.reason);
    
            // Tính lại phần trăm
            const origPrice = Number(OriginalPrice);
            if (origPrice > 0) {
              const discount = ((origPrice - aiData.suggestedPrice) / origPrice) * 100;
              setSalePercentage(discount > 0 ? discount.toFixed(2) : 0);
            }
        }
      }
    } catch (err) {
      console.error(err);
      alert("AI đang bận hoặc có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formData = {
        idProduct: productId,
        ProductName,
        Stock,
        OriginalPrice,
        SalePrice,
        SalePercentage,
        Description,
        IsSales,
        IsHome,
        Category: categoryId,
        mainImage: currentImages[mainImageIndex - 1]?.ImageLink 
      };
      
      const res = await axiosIntance.put(`${API_URL}/api/admin/product/edit/${productId}`, formData);

      if (res.data.message || res.status === 200) {
        setSuccess('Cập nhật sản phẩm thành công!');
        // setTimeout(() => navigate('/product/list'), 1000);
        if(onSuccess) onSuccess();
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
      {/* <h2>Cập nhật sản phẩm</h2> */}
      {error && <Alert variant="danger">{error}</Alert>}
      {/* {success && <Alert variant="success">{success}</Alert>} */}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tên sản phẩm</Form.Label>
          <Form.Control type="text" value={ProductName} onChange={(e) => setProductName(e.target.value)} />
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
          <Form.Label>Mô tả (Nhập chi tiết để AI gợi ý chuẩn hơn)</Form.Label>
          <Form.Control as="textarea" rows={3} value={Description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Group>

        <div className="row">
          <div className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label>Số lượng nhập</Form.Label>
              <Form.Control type="number" min={1} value={Stock} onChange={(e) => setStock(e.target.value)} />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label>Giá gốc (VNĐ)</Form.Label>
              <Form.Control type="number" min={1} value={OriginalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
            </Form.Group>
          </div>
        </div>

        {/* --- PHẦN NÚT BẤM AI (ĐÃ SỬA IMPORT SPINNER) --- */}
        <div className="mb-3 p-3 bg-light rounded border">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="fw-bold">Hỗ trợ định giá:</label>
            <Button
              variant="info"
              size="sm"
              onClick={handleSuggestPrice}
              disabled={loadingAI}
              className="text-white"
            >
              {loadingAI ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Đang tính toán...
                </>
              ) : (
                <>✨ Dùng AI gợi ý giá bán</>
              )}
            </Button>
          </div>
          {aiReason && (
            <Alert variant="info" className="mb-0 small">
              <strong>🤖 AI Phân tích:</strong> {aiReason}
            </Alert>
          )}
        </div>
        {/* ----------------------- */}

        <div className="row">
          <div className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label>Giá bán (Sale Price)</Form.Label>
              <Form.Control type="number" value={SalePrice} onChange={(e) => setSalePrice(e.target.value)} />
              <Form.Text className="text-muted">Có thể chỉnh sửa sau khi AI gợi ý</Form.Text>
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group className="mb-3">
              <Form.Label>Phần trăm giảm giá (%)</Form.Label>
              <Form.Control type="number" min={0} max={100} value={SalePercentage} onChange={(e) => setSalePercentage(e.target.value)} />
            </Form.Group>
          </div>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Ảnh hiện tại</Form.Label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {currentImages.map((img, index) => (
              <div key={index}>
                <Image src={`${img.ImageLink}`} thumbnail width={100} height={100} />
              </div>
            ))}
          </div>
        </Form.Group>

        <Button type="submit" variant="primary">
          Cập nhật
        </Button>
        <Button variant="secondary" className="ms-2" onClick={onCancel}>
          Hủy
        </Button>
      </Form>
    </div>
  );
};

export default ProductEdit;