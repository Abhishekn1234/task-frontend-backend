// models/userModel.js
const bcrypt = require('bcryptjs');

function createUserModel(db) {
  const collection = db.collection('users');

  async function createUser(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, email, password: hashedPassword };
    await collection.insertOne(newUser);
    return { success: true };
  }

  async function findUserByEmail(email) {
    return await collection.findOne({ email });
  }

  return {
    createUser,
    findUserByEmail,
  };
}

module.exports = createUserModel;
