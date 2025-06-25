import React, { useEffect, useState } from "react";
import { Form, Card, Row, Col, Button, Alert } from "react-bootstrap";
import axios from "axios";

export default function Filter({ onResults }) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false);

  const priceOptions = [
    { label: "₹0 – ₹100", value: "0-100" },
    { label: "₹100 – ₹500", value: "100-500" },
    { label: "₹500 – ₹1000", value: "500-1000" },
    { label: "₹1000 – ₹5000", value: "1000-5000" },
    { label: "₹5000 – ₹10000", value: "5000-10000" },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchFilteredProducts();
  }, [search, selectedCategories, selectedPriceRanges]);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/category");
    setAllCategories(res.data);
  };

  const fetchFilteredProducts = async () => {
    const res = await axios.get("http://localhost:5000/product/products", {
      params: {
        search,
        categories: selectedCategories.join(","),
        priceRanges: selectedPriceRanges.join(","),
      },
    });
    setProducts(res.data);
    setShowNoResults(res.data.length === 0);
    onResults(res.data);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setSelectedPriceRanges((prev) =>
      prev.includes(value)
        ? prev.filter((p) => p !== value)
        : [...prev, value]
    );
  };

  const handleReset = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setShowNoResults(false);
  };

  return (
    <>
      <Card className="p-3 mb-3" style={{ background: "#f8f9fa" }}>
        <Form>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search products"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Price Range</Form.Label>
                <div className="d-flex flex-column">
                  {priceOptions.map((price) => (
                    <Form.Check
                      key={price.value}
                      type="checkbox"
                      label={price.label}
                      value={price.value}
                      checked={selectedPriceRanges.includes(price.value)}
                      onChange={handlePriceChange}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Categories</Form.Label>
                <div className="d-flex flex-column">
                  {allCategories.map((cat) => (
                    <Form.Check
                      key={cat._id}
                      type="checkbox"
                      label={cat.name}
                      value={cat._id}
                      checked={selectedCategories.includes(cat._id)}
                      onChange={handleCategoryChange}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3 text-end">
            <Button variant="secondary" onClick={handleReset}>
              Reset Filters
            </Button>
          </div>
        </Form>
      </Card>

      {showNoResults && (
        <Alert  className="text-center">
          No products found.
        </Alert>
      )}
    </>
  );
}
