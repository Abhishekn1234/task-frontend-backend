// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

let userModel;

function setupRoutes(db) {
  userModel = require('../models/User')(db);

  // Registration Route
  router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) return res.status(409).json({ error: 'User already exists' });

    await userModel.createUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully' });
  });

  // Login Route
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user._id, email: user.email }, 'secret123', { expiresIn: '1d' });
    res.json({ message: 'Login successful', token });
  });

  return router;
}

module.exports = setupRoutes;
