const { ObjectId } = require('mongodb');

// Create Category
const createCategory = (db, category) =>
  db.collection('categories').insertOne({
    name: category.name,
    image: category.image,
    createdAt: new Date()
  });

// Get All Categories
const getAllCategories = (db) =>
  db.collection('categories').find({}).toArray();

// Get Category by ID
const getCategoryById = (db, id) =>
  db.collection('categories').findOne({ _id: new ObjectId(id) });

// Update Category by ID
const updateCategory = (db, id, data) => {
  const updateData = { name: data.name };
  if (data.image !== undefined) {
    updateData.image = data.image;
  }

  return db.collection('categories').updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
};

// Delete Category by ID
const deleteCategory = (db, id) =>
  db.collection('categories').deleteOne({ _id: new ObjectId(id) });

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
