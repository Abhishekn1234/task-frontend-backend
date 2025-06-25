const { ObjectId } = require('mongodb');

const createProduct = (db, product) =>
  db.collection('products').insertOne({
    name: product.name,
    basePrice: product.basePrice,
    imageUrl: product.imageUrl,
    categoryId: new ObjectId(product.categoryId),
    createdAt: new Date()
  });

const getAllProducts = (db) => db.collection('products').find({}).toArray();

const getProductsByCategory = (db, categoryId) =>
  db.collection('products').find({ categoryId: new ObjectId(categoryId) }).toArray();

const getProductById = (db, id) =>
  db.collection('products').findOne({ _id: new ObjectId(id) });

const updateProduct = (db, id, data) =>
  db.collection('products').updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );

const deleteProduct = (db, id) =>
  db.collection('products').deleteOne({ _id: new ObjectId(id) });

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory
};
