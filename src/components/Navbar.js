// src/components/Navbar.js
import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function NavigationBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <i className="bi bi-bag me-2 fs-4"></i>
          <span style={{ fontWeight: "bold", fontSize: "1.25rem" }}>E-Shop</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar" className="justify-content-end">
          

          <Button variant="outline-light" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
