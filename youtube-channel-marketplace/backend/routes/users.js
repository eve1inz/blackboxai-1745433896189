// Added admin middleware and admin routes for banning, warning users

const express = require('express');
const { User, Channel, Review } = require('../models');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret'; // Use env variable in production

// Middleware to authenticate and authorize admin
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user profile by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'nickname', 'avatar', 'profileDescription', 'role', 'banned', 'warnings'],
      include: [
        {
          model: Channel,
          as: 'channels',
        },
        {
          model: Review,
          as: 'reviews',
        },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile (for simplicity, no auth middleware yet)
router.put('/:id', async (req, res) => {
  try {
    const { nickname, avatar, profileDescription } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.nickname = nickname || user.nickname;
    user.avatar = avatar || user.avatar;
    user.profileDescription = profileDescription || user.profileDescription;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin route to ban/unban user
router.put('/:id/ban', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.banned = !user.banned;
    await user.save();
    res.json({ message: `User ${user.banned ? 'banned' : 'unbanned'}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin route to warn user (increment warnings)
router.put('/:id/warn', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.warnings += 1;
    await user.save();
    res.json({ message: 'User warned', warnings: user.warnings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
