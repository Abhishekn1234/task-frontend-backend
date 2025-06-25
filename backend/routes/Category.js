const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const categoryModel = require('../models/Category');

const router = express.Router();
let db;

// Ensure upload folder exists
const uploadDir = 'uploads/categories/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// CREATE
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    const imagePath = req.file ? `/uploads/categories/${req.file.filename}` : null;

    const result = await categoryModel.createCategory(db, { name, image: imagePath });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// READ All
router.get('/', async (req, res) => {
  try {
    const result = await categoryModel.getAllCategories(db);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// READ One
router.get('/:id', async (req, res) => {
  try {
    const result = await categoryModel.getCategoryById(db, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// UPDATE
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    const imagePath = req.file ? `/uploads/categories/${req.file.filename}` : undefined;

    const result = await categoryModel.updateCategory(db, req.params.id, { name, image: imagePath });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const result = await categoryModel.deleteCategory(db, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = (database) => {
  db = database;
  return router;
};
