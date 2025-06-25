// routes/products.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { ObjectId } = require('mongodb');

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} = require('../models/Product');

module.exports = (db) => {
  const router = express.Router();

  // Middleware for visit tracking
  router.use((req, res, next) => {
    let visits = parseInt(req.cookies?.visits);
    if (isNaN(visits)) visits = 0;
    visits += 1;
    res.cookie("visits", visits, { maxAge: 86400000 * 7 });
    req.visits = visits;
    next();
  });

  // Multer for image upload
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/products/'),
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage });

  // CREATE Product
  router.post('/', upload.single('image'), async (req, res) => {
    try {
      const { name, basePrice, categoryId } = req.body;
      const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;

      const result = await createProduct(db, {
        name,
        basePrice: parseFloat(basePrice),
        imageUrl,
        categoryId: new ObjectId(categoryId)
      });

      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Error creating product', details: err.message });
    }
  });

  // GET All Products
  router.get('/', async (req, res) => {
    try {
      const products = await getAllProducts(db);
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching products' });
    }
  });

  // GET Product by ID
       
  // GET Products by Category ID
  router.get('/category/:categoryId', async (req, res) => {
    try {
      const products = await getProductsByCategory(db, new ObjectId(req.params.categoryId));
      res.json(products);
    } catch (err) {
      res.status(400).json({ error: 'Error fetching products by category' });
    }
  });

  // UPDATE Product
  router.put('/:id', upload.single('image'), async (req, res) => {
    try {
      const updateData = {
        name: req.body.name,
        basePrice: parseFloat(req.body.basePrice),
        categoryId: new ObjectId(req.body.categoryId)
      };
      if (req.file) {
        updateData.imageUrl = `/uploads/products/${req.file.filename}`;
      }
      const result = await updateProduct(db, new ObjectId(req.params.id), updateData);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: 'Error updating product', details: err.message });
    }
  });

  // DELETE Product
  router.delete('/:id', async (req, res) => {
    try {
      const result = await deleteProduct(db, new ObjectId(req.params.id));
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: 'Error deleting product' });
    }
  });

  

router.get("/products", async (req, res) => {
  const { search = "", categories = "", priceRanges = "" } = req.query;

  const categoryArray = categories ? categories.split(",") : [];
  const priceArray = priceRanges ? priceRanges.split(",") : [];

  const query = {
    name: { $regex: search, $options: "i" },
  };

  // Convert to ObjectId if stored that way
  if (categoryArray.length > 0) {
    query.categoryId = {
      $in: categoryArray.map((id) => new ObjectId(id)),
    };
  }

  if (priceArray.length > 0) {
    query.$or = priceArray.map((range) => {
      const [min, max] = range.split("-").map(Number);
      return {
        basePrice: { $gte: min, $lte: max },
      };
    });
  }

  try {
    const products = await db.collection("products").find(query).toArray();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Validate ObjectId before using
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });

    if (!product) return res.status(404).json({ error: "Product not found" });
    console.log(product);
    res.json(product);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
});

  return router;
};