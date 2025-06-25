import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Form, Container, Row, Col, Card } from "react-bootstrap";
import { PlusCircle, PencilSquare, Trash3 } from "react-bootstrap-icons";
import Filter from "./Filter";

export default function Products({ products, setProducts }) {

  
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [addFormData, setAddFormData] = useState({ name: '', basePrice: '', image: null, categoryId: '' });
  const [editFormData, setEditFormData] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:5000/product');
    setProducts(response.data);
  };

  const fetchCategories = async () => {
    const response = await axios.get('http://localhost:5000/category');
    setCategories(response.data);
  };

  const openAddModal = () => {
    setAddFormData({ name: '', basePrice: '', image: null, categoryId: '' });
    setShowAddModal(true);
  };

  const closeAddModal = () => setShowAddModal(false);

  const openEditModal = (index) => {
    setEditIndex(index);
    setEditFormData(products[index]);
    setShowEditModal(true);
  };

  const closeEditModal = () => setShowEditModal(false);

  const handleAddImageChange = (e) => setAddFormData({ ...addFormData, image: e.target.files[0] });
  const handleEditImageChange = (e) => setEditFormData({ ...editFormData, image: e.target.files[0] });

  const handleAddSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", addFormData.name);
      formData.append("basePrice", addFormData.basePrice);
      formData.append("categoryId", addFormData.categoryId);
      if (addFormData.image) formData.append("image", addFormData.image);

      await axios.post("http://localhost:5000/product", formData);
      fetchProducts();
      closeAddModal();
    } catch (err) {
      alert("Add product failed.");
    }
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editFormData.name);
      formData.append("basePrice", editFormData.basePrice);
      formData.append("categoryId", editFormData.categoryId);
      if (editFormData.image instanceof File) formData.append("image", editFormData.image);

      await axios.put(`http://localhost:5000/product/${editFormData._id}`, formData);
      fetchProducts();
      closeEditModal();
    } catch (err) {
      alert("Edit product failed.");
    }
  };

  const handleDelete = async (index) => {
    const id = products[index]._id;
    await axios.delete(`http://localhost:5000/product/${id}`);
    fetchProducts();
  };

  return (
    <Container fluid className="mt-4">
        <Filter onResults={setProducts} />
      <Row className="mb-3">
  <Col>
    <div className="d-flex justify-content-between align-items-center">
      <h4 className="mb-0">Products</h4>
      <Button variant="primary" size="sm" onClick={openAddModal}>
        <PlusCircle size={18} className="me-1" />
        Add Product
      </Button>
    </div>
  </Col>
</Row>


      <Row>
  {products.map((product, index) => (
    <Col key={product._id} md={3} sm={6} xs={12} className="mb-4" style={{  width:'250px'}}>
      <Card style={{ borderRadius: "12px", boxShadow: "0 0 12px rgba(0,0,0,0.08)" }}>
        <Card.Img
          variant="top"
          src={`http://localhost:5000${product.imageUrl}`}
          style={{
            height: '140px',
            width:'200px',
            objectFit: 'cover',
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px"
          }}
        />
        <Card.Body style={{ padding: "12px" }}>
          <Card.Title style={{ fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>
            {product.name}
          </Card.Title>
          <Card.Text style={{ fontSize: "15px", fontWeight: "bold", color: "#28a745" }}>
            ₹{parseFloat(product.basePrice).toFixed(2)}
          </Card.Text>
          <div className="d-flex justify-content-between mt-2">
            <PencilSquare
              size={18}
              title="Edit"
              style={{ cursor: "pointer", color: "#007bff" }}
              onClick={() => openEditModal(index)}
            />
            <Trash3
              size={18}
              title="Delete"
              style={{ cursor: "pointer", color: "#dc3545" }}
              onClick={() => handleDelete(index)}
            />
          </div>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>


      {/* Add Modal */}
      <Modal show={showAddModal} onHide={closeAddModal} centered>
        <Modal.Header closeButton><Modal.Title>Add Product</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" value={addFormData.name} onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Base Price</Form.Label>
              <Form.Control type="number" value={addFormData.basePrice} onChange={(e) => setAddFormData({ ...addFormData, basePrice: e.target.value })} />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Category</Form.Label>
              <Form.Select value={addFormData.categoryId} onChange={(e) => setAddFormData({ ...addFormData, categoryId: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleAddImageChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAddModal}>Cancel</Button>
          <Button variant="primary" onClick={handleAddSubmit}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={closeEditModal} centered>
        <Modal.Header closeButton><Modal.Title>Edit Product</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Base Price</Form.Label>
              <Form.Control type="number" value={editFormData.basePrice} onChange={(e) => setEditFormData({ ...editFormData, basePrice: e.target.value })} />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Category</Form.Label>
              <Form.Select value={editFormData.categoryId} onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleEditImageChange} />
              {editFormData.image && typeof editFormData.image === 'string' && (
                <img
                  src={`http://localhost:5000${editFormData.image}`}
                  alt="Preview"
                  style={{ width: '100px', height: '100px', marginTop: '10px', borderRadius: '10px' }}
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>Cancel</Button>
          <Button variant="primary" onClick={handleEditSubmit}>Update</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}