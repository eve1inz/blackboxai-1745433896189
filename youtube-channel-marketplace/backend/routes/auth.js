const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

const JWT_SECRET = 'your_jwt_secret'; // In production, use env variable

// Register
router.post('/register', async (req, res) => {
  try {
    const { nickname, email, password, role } = req.body;
    if (!nickname || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!['buyer', 'seller'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const user = await User.create({
      nickname,
      email,
      passwordHash: password,
      role,
    });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, nickname: user.nickname, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const valid = await user.validatePassword(password);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (user.banned) {
      return res.status(403).json({ message: 'User is banned' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, nickname: user.nickname, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
