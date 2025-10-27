import React, { useEffect, useState } from "react";
import { Table, Button, Card, Row, Col, Space, Image, message } from "antd";
import { useNavigate } from "react-router-dom";
import axiosIntance from "../../utils/axiosInstance";

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
  useEffect(() => {
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
    fetchProducts();
  }, []);

  const handleEdit = (id) => {
    navigate(`/product/edit/${id}`);
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

  const handleAdd = () => {
    navigate("/product/add");
  };
   const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  //  Định nghĩa cột cho bảng
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
      align: 'center'
    },
    // {
    //   title: "Tên sản phẩm",
    //   dataIndex: "ProductName",
    //   key: "ProductName",
    //   width: 200,
    // },
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
        const images = image?.split(",") || [];
        return (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            {images.map((img, idx) => (
              <Image
                key={idx}
                src={`${API_URL}/uploads/${img.trim()}`}
                alt={record.ProductName}
                width={80}
                height={80}
                style={{
                  objectFit: "cover",
                  borderRadius: 8,
                }}
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
      title: "Giá gốc",
      dataIndex: "OriginalPrice",
      key: "OriginalPrice",
      render: (price) => `${price.toLocaleString()} đ`,
      width: 120,
    },
    {
      title: "% Sale",
      dataIndex: "SalePercentage",
      key: "SalePercentage",
      width: 100,
    },
    {
      title: "Giá Bán",
      dataIndex: "SalePrice",
      key: "SalePrice",
      render: (price) => `${price.toLocaleString()} đ`,
      width: 120,
      disable: true,
    },
    {
      title: "Mô tả",
      dataIndex: "Description",
      key: "Description",
      render: (desc) => (desc && desc.length > 50 ? desc.slice(0, 50) + "..." : desc),
      width: 250,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record.idProduct)}>
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record.idProduct)}>
            Xóa
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
      </Col>
    </Row>
  );
};

export default ProductList;
