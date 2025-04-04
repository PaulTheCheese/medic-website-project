import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form, Input, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import './AdminProducts.css'; // Assuming you have a CSS file for styling

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [form] = Form.useForm();

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      message.error('Failed to fetch products');
    }
  };

  // Search functionality
  useEffect(() => {
    const filtered = products.filter(product =>
      product.brand.toLowerCase().includes(searchText.toLowerCase()) ||
      product.generic.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchText, products]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // CRUD Operations
  const handleAdd = () => {
    setCurrentProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleDelete = (product) => {
    setCurrentProduct(product);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/products/${currentProduct._id}`);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
    }
    setIsDeleteModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (currentProduct) {
        // Update existing product
        await axios.put(`/api/products/${currentProduct._id}`, values);
        message.success('Product updated successfully');
      } else {
        // Add new product
        await axios.post('/api/products', values);
        message.success('Product added successfully');
      }
      fetchProducts();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Error submitting form');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Brand Name',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Generic Name',
      dataIndex: 'generic',
      key: 'generic',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Pain Relief', value: 'Pain Relief' },
        { text: 'Cold & Flu', value: 'Cold & Flu' },
        { text: 'Vitamins', value: 'Vitamins' },
        { text: 'Digestive Health', value: 'Digestive Health' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="admin-products-container">
      <div className="admin-products-header">
        <h2>Product Management</h2>
        <div className="admin-products-actions">
          <Input
            placeholder="Search products..."
            prefix={<SearchOutlined />}
            onChange={handleSearch}
            style={{ width: 300, marginRight: 16 }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAdd}
          >
            Add Product
          </Button>
        </div>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredProducts} 
        rowKey="_id"
        bordered
        pagination={{ pageSize: 10 }}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={currentProduct ? 'Edit Product' : 'Add Product'}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="id"
            label="ID"
            rules={[{ required: true, message: 'Please input product ID' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="brand"
            label="Brand Name"
            rules={[{ required: true, message: 'Please input brand name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="generic"
            label="Generic Name"
            rules={[{ required: true, message: 'Please input generic name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select product type' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="manufacturer"
            label="Manufacturer"
            rules={[{ required: true, message: 'Please input manufacturer' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please input price' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image URL"
            rules={[{ required: true, message: 'Please input image URL' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="requiresPrescription"
            label="Requires Prescription"
            valuePropName="checked"
            labelCol={{ span: 18 }} // Adjust these values
            wrapperCol={{ span: 6 }} // to get the spacing you want
          >
            <Input type="checkbox" />
          </Form.Item>
          <Form.Item
            name="rating"
            label="Rating (0-5)"
            valuePropName="valueAsNumber"
            rules={[
              { required: true, message: 'Please input rating' },
              { type: 'number', min: 0, max: 5, message: 'Rating must be between 0-5' }
            ]}
          >
            <Input type="number" step="0.1" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete {currentProduct?.brand}?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};
