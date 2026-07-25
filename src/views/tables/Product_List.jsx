import React, { useEffect, useState } from "react";
import { Table, Button, Card, Row, Col, Space, Image, message, Modal, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import axiosIntance from "../../utils/axiosInstance";
// Import các component vẽ biểu đồ
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import ProductAdd from "./Product_Add"; // Hãy chắc chắn tên file của bạn đúng là Product_Add
import ProductEdit from "./Product_Edit"; // Hãy chắc chắn tên file của bạn đúng là Product_Edit

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5
  });

  // --- SỬA LỖI STATE TẠI ĐÂY ---
  // 1. Sửa chính tả Ooen -> Open
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); 
  // 2. Thống nhất dùng tên 'formType' cho dễ hiểu
  const [formType, setFormType] = useState('add'); 
  const [editingProductId, setEditingProductId] = useState(null);

  // --- STATE CHO MODAL LỊCH SỬ GIÁ ---
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosIntance.get(`${API_URL}/api/admin/product/list`, {
        withCredentials: true,
      });
      if (res.data && Array.isArray(res.data.data)) {
        setProducts(res.data.data);
      } else {
        throw new Error("Dữ liệu API không hợp lệ");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.redirect) {
        alert(err.response.data.message || "Bạn không có quyền!");
        window.location.href = err.response.data.redirect;
      } else {
        setError("Lỗi kết nối server hoặc dữ liệu không hợp lệ!");
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM XỬ LÝ MODAL THÊM/SỬA ---
  const handleAdd = () => {
    setFormType('add');
    setEditingProductId(null);
    setIsFormModalOpen(true); // Đã sửa tên hàm
  };

  const handleEdit = (id) => {
    setFormType('edit');
    setEditingProductId(id);
    setIsFormModalOpen(true); // Đã sửa tên hàm
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false); 
    fetchProducts(); 
    message.success(formType === "add" ? "Thêm mới thành công" : "Cập nhật thành công");
  };

  const handleFormCancel = () => {
    setIsFormModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await axiosIntance.delete(`${API_URL}/api/admin/product/delete/${id}`);
        message.success("Xóa sản phẩm thành công!");
        setProducts((prev) => prev.filter((p) => p.idProduct !== id));
      } catch (err) {
        message.error("Lỗi khi xóa sản phẩm!");
      }
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // --- HÀM XỬ LÝ LỊCH SỬ GIÁ ---
  const handleViewHistory = async (record) => {
    setSelectedProductName(record.ProductName);
    setIsHistoryModalOpen(true);
    setLoadingHistory(true);
    setHistoryData([]); 

    try {
      const res = await axiosIntance.get(`${API_URL}/api/admin/product/price-history/${record.idProduct}`);
      if (res.data && res.data.data) {
        const formattedData = res.data.data.map(item => ({
          ...item,
          displayDate: new Date(item.ChangedAt).toLocaleDateString('vi-VN'), 
          fullTime: new Date(item.ChangedAt).toLocaleString('vi-VN'),
          SalePrice: Number(item.SalePrice),
          OriginalPrice: Number(item.OriginalPrice)
        }));
        setHistoryData(formattedData);
      }
    } catch (err) {
      console.error(err);
      message.error("Không thể tải lịch sử giá");
    } finally {
      setLoadingHistory(false);
    }
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
      title: "Tên sản phẩm",
      dataIndex: "ProductName",
      key: "ProductName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Hình ảnh chính",
      dataIndex: "ImageName",
      key: "ImageName",
      align: "center",
      width: 220,
      render: (image, record) => {
        if (!image) return "Chưa có hình";
        const images = image?.split(",") || [];
        return (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "5px" }}>
            {images.map((img, idx) => (
              <Image
                key={idx}
                src={`${img.trim()}`}
                alt={record.ProductName}
                width={80}
                height={80}
                style={{ objectFit: "cover", borderRadius: 8 }}
                preview={false}
              />
            ))}
          </div>
        );
      },
    },
    {
      title: "Danh mục",
      dataIndex: ["Category", "CategoryName"],
      key: "CategoryName",
      align: "center",
      width: 150,
      render: (name) => (
        <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>{name}</span>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "Stock",
      key: "Stock",
      width: 100,
    },
    {
      title:" Trọng lượng (gram)",
      dataIndex: "Weight",
      key: "Weight",
      width: 130,
    },
    {
      title: "Giá gốc",
      dataIndex: "OriginalPrice",
      key: "OriginalPrice",
      render: (price) => `${Number(price).toLocaleString()} đ`,
      width: 120,
    },
    {
      title: "% Sale",
      dataIndex: "SalePercentage",
      key: "SalePercentage",
      width: 100,
      render: (percent) => <Tag color="green">{percent}%</Tag>
    },
    {
      title: "Giá Bán",
      dataIndex: "SalePrice",
      key: "SalePrice",
      render: (price) => <span style={{color: 'red', fontWeight: 'bold'}}>{Number(price).toLocaleString()} đ</span>,
      width: 120,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 200, 
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
             {/* 3. SỬA LỖI: handleEdit phải nhận record.idProduct, không phải 'id' */}
             <Button type="primary" size="small" onClick={() => handleEdit(record.idProduct)}>
                Sửa
             </Button>
             <Button danger size="small" onClick={() => handleDelete(record.idProduct)}>
                Xóa
             </Button>
          </Space>
          <Button 
            size="small" 
            style={{ width: '100%', borderColor: '#1890ff', color: '#1890ff' }} 
            onClick={() => handleViewHistory(record)}
          >
            📉 Lịch sử giá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Row>
      <Col span={24}>
        <Card
          title="Danh sách sản phẩm"
          extra={
            <Button type="primary" onClick={handleAdd}>
              + Thêm sản phẩm
            </Button>
          }
        >
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Table
            rowKey="idProduct"
            columns={columns}
            dataSource={products}
            loading={loading}
            pagination={{
              ...pagination,
              total: products.length,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              showTotal: (total) => `Tổng ${total} sản phẩm`,
              position: ["bottomCenter"],
            }}
            scroll={{ x: 1200 }}
            onChange={handleTableChange}
          />
        </Card>

        {/* --- MODAL LỊCH SỬ GIÁ --- */}
        <Modal
            title={`Lịch sử biến động giá: ${selectedProductName}`}
            open={isHistoryModalOpen}
            onCancel={() => setIsHistoryModalOpen(false)}
            footer={[<Button key="back" onClick={() => setIsHistoryModalOpen(false)}>Đóng</Button>]}
            width={800}
        >
            {loadingHistory ? (
                <div style={{textAlign: 'center', padding: '20px'}}>Đang tải dữ liệu...</div>
            ) : historyData.length === 0 ? (
                <div style={{textAlign: 'center', padding: '20px'}}>Sản phẩm này chưa có lịch sử thay đổi giá.</div>
            ) : (
                <div style={{ width: '100%', height: 400, marginTop: 20 }}>
                    <ResponsiveContainer>
                        <LineChart data={historyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="displayDate" />
                            <YAxis tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact" }).format(value)} />
                            <Tooltip labelFormatter={(label, payload) => payload && payload.length > 0 ? payload[0].payload.fullTime : label} formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                            <Legend />
                            <Line type="monotone" dataKey="OriginalPrice" name="Giá Niêm Yết" stroke="#82ca9d" strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="SalePrice" name="Giá Bán Thực Tế" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                    <div style={{marginTop: 20, maxHeight: 150, overflowY: 'auto'}}>
                         <Table 
                            size="small"
                            dataSource={historyData}
                            rowKey="idPriceHistory"
                            pagination={false}
                            columns={[
                                { title: 'Thời gian', dataIndex: 'fullTime', width: 180 },
                                { title: 'Giá bán', dataIndex: 'SalePrice', render: v => v.toLocaleString() },
                                { title: 'Lý do', dataIndex: 'Reason' }
                            ]}
                         />
                    </div>
                </div>
            )}
        </Modal>

        {/* --- MODAL THÊM / SỬA SẢN PHẨM --- */}
        <Modal
            title={formType === 'add' ? "Thêm sản phẩm mới" : "Sửa thông tin sản phẩm"}
            open={isFormModalOpen}
            onCancel={handleFormCancel}
            footer={null}
            width={800}
            // 4. Bỏ destroyOnClose, thay bằng Logic điều kiện bên dưới để reset form sạch sẽ hơn
        >
            {/* Chỉ render nội dung khi Modal mở -> Tự động reset state của component con */}
            {isFormModalOpen && (
                formType === "add" ? (
                    <ProductAdd 
                        onSuccess={handleFormSuccess}
                        onCancel={handleFormCancel}
                    />
                ) : (
                    <ProductEdit
                        productId={editingProductId}
                        onSuccess={handleFormSuccess}
                        onCancel={handleFormCancel}
                    />
                )
            )}
        </Modal>
      </Col>
    </Row>
  );
};

export default ProductList;