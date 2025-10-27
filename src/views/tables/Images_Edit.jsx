import React, { useEffect, useState } from 'react';
import axiosIntance from '../../utils/axiosInstance';
import { Form, Button, Image, Alert } from 'react-bootstrap';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_APP_API_URL;

const ImageEdit = () => {
  const { id } = useParams();
  const location = useLocation();
  const [allImages, setAllImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [isMainImage, setIsMainImage] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [newAddedFiles, setNewAddedFiles] = useState([]);
  const navigate = useNavigate();
  const productIdFromQuery = new URLSearchParams(location.search).get('productId');
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axiosIntance.get(`${API_URL}/api/admin/images/list`);
        const data = res.data.data;

        setAllImages(data);

        if (productIdFromQuery) {
          const filtered = data.filter((img) => img.Product?.idProduct.toString() === productIdFromQuery);
          setFilteredImages(filtered);

          const current = filtered.find((img) => img.idImage.toString() === id);
          setSelectedImage(current || null);
        } else {
          setFilteredImages(data);
          const current = data.find((img) => img.idImage.toString() === id);
          setSelectedImage(current || null);
        }
      } catch (err) {
        setError('Lỗi khi tải ảnh');
      }
    };

    fetchImages();
  }, [id, productIdFromQuery]);

  const handleSelectImage = (img) => {
    const relatedImages = allImages.filter((i) => i.Product?.idProduct === img.Product?.idProduct);
    setFilteredImages(relatedImages);
    setSelectedImage(img);
    setIsMainImage(img.MainImage);
    setNewFile(null);
    setSuccess('');
    setError('');
  };
  const handleCancel = () => {
    navigate('/images/list');
  };
  const handleChangeTarget = (img) => {
    setSelectedImage(img);
    setIsMainImage(img.MainImage);
    setNewFile(null);
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    try {
      // Nếu chỉ sửa ảnh hiện tại (main flag, ảnh mới)
      if (selectedImage) {
        const formData = new FormData();
        formData.append('idImage', selectedImage.idImage);
        formData.append('MainImage', isMainImage.toString());
        if (newFile) formData.append('Images', newFile);

        await axiosIntance.put(`${API_URL}/api/admin/images/edit`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // Nếu muốn thêm nhiều ảnh mới (upload từ input file mới)
      if (newAddedFiles.length > 0) {
        const formData = new FormData();
        formData.append('idProduct', selectedImage.Product?.idProduct);
        newAddedFiles.forEach((file) => {
          formData.append('Images', file);
        });

        await axiosIntance.put(`${API_URL}/api/admin/images/edit`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setSuccess('Cập nhật ảnh thành công');

      // Refresh images
      const updated = await axiosIntance.get(`${API_URL}/api/admin/images/list`);
      setAllImages(updated.data.data);

      const relatedImages = updated.data.data.filter((i) => i.Product?.idProduct === selectedImage.Product?.idProduct);
      setFilteredImages(relatedImages);
      const updatedImage = relatedImages.find((i) => i.idImage === selectedImage.idImage);
      if (updatedImage) setSelectedImage(updatedImage);
      setNewFile(null);
      setNewAddedFiles([]);
    } catch (err) {
      setError('Lỗi khi cập nhật hoặc thêm ảnh mới.');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Sửa ảnh sản phẩm</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {!selectedImage && (
        <>
          <h5>Chọn một ảnh để bắt đầu chỉnh sửa</h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {allImages.map((img) => (
              <div
                key={img.idImage}
                onClick={() => handleSelectImage(img)}
                style={{ cursor: 'pointer', border: '1px solid gray', padding: '5px' }}
              >
                <Image src={`${API_URL}/uploads/${img.ImageLink}`} thumbnail width={100} />
                <div>
                  <strong>{img.Product?.ProductName}</strong>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedImage && (
        <>
          <h5 className="mt-4">Các ảnh của sản phẩm: {selectedImage.Product?.ProductName}</h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {filteredImages.map((img) => (
              <div
                key={img.idImage}
                onClick={() => handleChangeTarget(img)}
                style={{
                  cursor: 'pointer',
                  border: selectedImage.idImage === img.idImage ? '2px solid blue' : '1px solid gray',
                  padding: '5px'
                }}
              >
                <Image src={`${API_URL}/uploads/${img.ImageLink}`} thumbnail width={100} />
                <div>{img.MainImage ? 'Ảnh chính' : 'Ảnh phụ'}</div>
              </div>
            ))}
          </div>

          <Form onSubmit={handleSubmit} className="mt-4">
            <Form.Group className="mb-3">
              <Form.Label>Ảnh mới (nếu muốn thay đổi)</Form.Label>
              <Form.Control type="file" onChange={(e) => setNewFile(e.target.files[0])} />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Đặt làm ảnh chính"
              checked={isMainImage}
              onChange={(e) => setIsMainImage(e.target.checked)}
            />

            <Button type="submit" variant="primary" className="mt-3">
              Cập nhật ảnh
            </Button>
            {/* <Button variant="secondary" className="mt-3 ms-2" onClick={() => setSelectedImage(null)}> */}
            <Button variant="secondary" className="mt-3 ms-2" onClick={() => handleCancel()}>
              Quay lại danh sách tất cả ảnh
            </Button>
          </Form>
        </>
      )}
    </div>
  );
};

export default ImageEdit;
