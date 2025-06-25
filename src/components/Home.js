// src/components/Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from './Navbar';
import Filter from './Filter';
import Categories from './Categories';
import Products from './Products';

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:5000/product');
    setProducts(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []); 

  return (
    <>
      <NavigationBar />
    
      <Categories />
      <Products products={products} setProducts={setProducts} />
    </>
  );
}

export default Home;
