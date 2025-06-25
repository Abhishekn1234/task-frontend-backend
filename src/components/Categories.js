import React, { useState } from "react";
import {
  Container,
  Button,
  Modal,
  Form
} from "react-bootstrap";
import { PencilSquare, Trash3, PlusCircle } from "react-bootstrap-icons";
import axios from "axios";
import { useEffect } from "react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", image: "" });
  const [addFormData, setAddFormData] = useState({ name: "", image: null });
 const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/category");
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  // Helpers
  const convertToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  // Add Handlers
  const openAddModal = () => {
    setAddFormData({ name: "", image: "" });
    setShowAddModal(true);
  };
  const closeAddModal = () => setShowAddModal(false);
  const handleAddSubmit = async () => {
  try {
    const formData = new FormData();
    formData.append("name", addFormData.name);
    if (addFormData.image) {
      formData.append("image", addFormData.image);
    }

    const response = await axios.post("http://localhost:5000/category", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

   
    setCategories([...categories, response.data]);
    closeAddModal();
    fetchCategories();
  } catch (error) {
    console.error("Add Category Failed:", error);
    alert("Failed to add category.");
  }
};


 const handleAddImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setAddFormData({ ...addFormData, image: file });
  }
};


  // Edit Handlers
  const openEditModal = (index) => {
    setEditIndex(index);
    setEditFormData(categories[index]);
    setShowEditModal(true);
  };
  const closeEditModal = () => setShowEditModal(false);
  const handleEditSubmit = async () => {
  try {
    const formData = new FormData();
    formData.append("name", editFormData.name);
    if (editFormData.image instanceof File) {
      formData.append("image", editFormData.image);
    }

    await axios.put(
      `http://localhost:5000/category/${editFormData._id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    closeEditModal();
    fetchCategories();
  } catch (err) {
    console.error("Update failed", err);
    alert("Failed to update category.");
  }
};


  const handleEditImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setEditFormData({ ...editFormData, image: file });
  }
};



  const handleDelete = async (index) => {
  const category = categories[index];

  const confirmDelete = window.confirm(`Are you sure you want to delete "${category.name}"?`);
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:5000/category/${category._id}`);


    const updated = [...categories];
    updated.splice(index, 1);
    setCategories(updated);
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Failed to delete category.");
  }
};


  const containerStyle = {
    marginTop: "30px",
    marginBottom: "30px",
    maxWidth: "100%",
    paddingLeft: "0",
    paddingRight: "0",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    padding: "0 10px",
  };

  const scrollRowStyle = {
  display: "flex",
  overflowX: "auto",
  padding: "10px",
  gap: "16px",
};

const categoryCardStyle = {
  flex: "0 0 auto",
  width: "160px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "10px",
  textAlign: "center",
  background: "#fff",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const imageContainerStyle = {
  height: "100px",
  overflow: "hidden",
  borderRadius: "8px",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "8px",
};

const iconRowStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginTop: "8px",
};

const iconButtonStyle = {
  cursor: "pointer",
  color: "#333",
};


  return (
    <Container fluid style={containerStyle}>
          <div style={{ padding: "0 10px", marginBottom: "10px" }}>
  <Form.Control
    type="text"
    placeholder="Search categories..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>


      <div style={headerStyle}>
        <h4 style={{ margin: 0 }}>Categories</h4>
        <Button variant="primary" size="sm" onClick={openAddModal}>
          <PlusCircle size={18} style={{ marginRight: "5px" }} />
          Add Category
        </Button>
      </div>

      <div style={scrollRowStyle}>
  {categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).length === 0 ? (
    <div style={{ padding: "10px", fontStyle: "italic", color: "#888" }}>
      No categories found.
    </div>
  ) : (
    categories
      .filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((category, index) => (
        <div key={category._id} style={categoryCardStyle}>
          <div style={imageContainerStyle}>
            <img
              src={`http://localhost:5000${category.image}`}
              alt={category.name}
              style={imageStyle}
            />
          </div>

          <div style={iconRowStyle}>
            <PencilSquare
              size={18}
              style={iconButtonStyle}
              title="Edit"
              onClick={() => openEditModal(index)}
            />
            <Trash3
              size={18}
              style={iconButtonStyle}
              title="Delete"
              onClick={() => handleDelete(index)}
            />
          </div>

          <div style={{ marginTop: "8px", fontWeight: "500" }}>{category.name}</div>
        </div>
      ))
  )}
</div>



      {/* ADD MODAL */}
     <Modal show={showAddModal} onHide={closeAddModal} centered>
  <Modal.Header closeButton>
    <Modal.Title>Add Category</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group>
        <Form.Label>Category Name</Form.Label>
        <Form.Control
          type="text"
          value={addFormData.name}
          onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
          placeholder="Enter category name"
        />
      </Form.Group>
      <Form.Group className="mt-3">
        <Form.Label>Image File</Form.Label>
        <Form.Control type="file" accept="image/*" onChange={handleAddImageChange} />
        {addFormData.image && (
          <img
            src={URL.createObjectURL(addFormData.image)}
            alt="Preview"
            style={{
              width: "100px",
              height: "100px",
              marginTop: "10px",
              borderRadius: "10px",
              objectFit: "cover",
              border: "1px solid #ccc"
            }}
          />
        )}
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={closeAddModal}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleAddSubmit}>
      Add
    </Button>
  </Modal.Footer>
</Modal>


      {/* EDIT MODAL */}
     <Modal show={showEditModal} onHide={closeEditModal} centered>

      <Modal.Header closeButton>
        <Modal.Title>Edit Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={editFormData.name}
              onChange={(e) =>
                setEditFormData({ ...editFormData, name: e.target.value })
              }
              placeholder="Enter category name"
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Image File</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleEditImageChange}
            />

            {/* Show preview */}
            {editFormData.image && (
              <img
                src={
                  typeof editFormData.image === "string"
                    ? `http://localhost:5000${editFormData.image}`
                    : URL.createObjectURL(editFormData.image)
                }
                alt="Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  marginTop: "10px",
                  borderRadius: "10px",
                }}
              />
            )}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeEditModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleEditSubmit}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
    </Container>
  );
}
