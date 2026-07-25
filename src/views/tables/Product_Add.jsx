import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, InputGroup } from 'react-bootstrap'; // Thêm Spinner, InputGroup
// import { useNavigate } from 'react-router-dom';
import axiosIntance from '../../utils/axiosInstance';
const API_URL = import.meta.env.VITE_APP_API_URL;

const ProductAdd = ({onSuccess,onCancel}) => {
  const [ProductName, setProductName] = useState('');
  const [Stock, setStock] = useState('1');
  const [Weight, setWeight] = useState('2000');
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
  
  // --- STATE AI ---
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiReason, setAiReason] = useState('');
  // -----------------------

  // const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosIntance.get(`${API_URL}/api/admin/categories/list`);
        setCategories(res.data.data);
      } catch (err) {
        setError('Không thể tải danh sách danh mục!');
      }
    };
    fetchCategories();
  }, []);

  // --- HÀM GỌI AI ---
  const handleSuggestPrice = async () => {
    // 1. Validate dữ liệu đầu vào cơ bản
    if (!ProductName || !OriginalPrice) {
      alert("Vui lòng nhập Tên sản phẩm và Giá gốc để AI có thể tính toán!");
      return;
    }

    // 2. Lấy tên danh mục từ ID (để gửi cho AI hiểu rõ hơn)
    const selectedCategory = categories.find(cat => cat.idCategory == categoryId);
    const categoryName = selectedCategory ? selectedCategory.CategoryName : "";

    setLoadingAI(true);
    setAiReason(''); // Reset lý do cũ

    try {
      // 3. Gọi về Backend của bạn
      const res = await axiosIntance.post(`${API_URL}/api/admin/product/suggest-price`, {
        ProductName: ProductName,
        OriginalPrice: Number(OriginalPrice),
        Description: Description,
        CategoryName: categoryName
      });

      // 4. Xử lý kết quả trả về
      if (res.data.cod === 200) {
        const aiData = res.data.data;
        
        // Tự động điền giá vào ô SalePrice
        setSalePrice(aiData.suggestedPrice);
        
        // Hiển thị lý do
        setAiReason(aiData.reason);
        
        // Có thể tự tính lại phần trăm giảm giá nếu muốn
        if (Number(OriginalPrice) > 0) {
             const discount = ((Number(OriginalPrice) - aiData.suggestedPrice) / Number(OriginalPrice)) * 100;
             setSalePercentage(discount > 0 ? discount.toFixed(2) : 0);
        }
      }
    } catch (err) {
      console.error(err);
      alert("AI đang bận hoặc có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoadingAI(false);
    }
  };
  // ------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!categoryId) {
      setError('Vui lòng chọn danh mục sản phẩm.');
      return;
    }

    const formData = new FormData();
    formData.append('ProductName', ProductName);
    formData.append('Stock', Stock);
    formData.append('Weight', Weight);
    formData.append('OriginalPrice', OriginalPrice);
    formData.append('SalePrice', SalePrice);
    formData.append('SalePercentage', SalePercentage);
    formData.append('Description', Description);
    formData.append('IsSales', IsSales ? 1 : 0);
    formData.append('IsHome', IsHome ? 1 : 0);
    formData.append('categoryIdCategory', categoryId);
    formData.append('rDefault', defaultImageIndex ?? 0);
    ProductImages.forEach((image) => formData.append('Images', image));

    try {
      const res = await axiosIntance.post(`${API_URL}/api/admin/product/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.cod === 200) {
        // setSuccess('Thêm sản phẩm thành công!');
        // setTimeout(() => navigate('/product/list'), 1000);
        if(onSuccess) onSuccess();
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
      {/* <h2>Thêm sản phẩm</h2> */}
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
            {categories.map((cat) => (
              <option key={cat.idCategory} value={cat.idCategory}>
                {cat.CategoryName}
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
                  <Form.Label>Trọng lượng(gram)</Form.Label>
                  <Form.Control type="number" min={1} value={Weight} onChange={(e) => setWeight(e.target.value)} />
                </Form.Group>
            </div>
            <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Giá gốc (VNĐ)</Form.Label>
                  <Form.Control type="number" min={1} value={OriginalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
                </Form.Group>
            </div>
        </div>

        {/* --- PHẦN NÚT BẤM AI --- */}
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
                        <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Đang tính toán...</>
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
                  <Form.Control type="number" step="0.01" min={0} max={100} value={SalePercentage} onChange={(e) => setSalePercentage(e.target.value)} />
                </Form.Group>
            </div>
        </div>

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
        <Button variant="secondary" onClick={onCancel} className="ms-2">
          Hủy
        </Button>
      </Form>
    </div>
  );
};

export default ProductAdd;