const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { Op } = require('sequelize');
const { Channel, User } = require('../models');
const router = require('express').Router();

// Get all channels with filters
router.get('/', async (req, res) => {
  try {
    const { subscribersMin, subscribersMax, monetization, priceMin, priceMax, mbMin, mbMax, title, sellerId } = req.query;

    const where = {};

    if (subscribersMin) where.subscribers = { [Op.gte]: parseInt(subscribersMin) };
    if (subscribersMax) where.subscribers = { ...where.subscribers, [Op.lte]: parseInt(subscribersMax) };

    if (monetization !== undefined) {
      if (monetization === 'true') where.monetizationAvailable = true;
      else if (monetization === 'false') where.monetizationAvailable = false;
    }

    if (priceMin) where.price = { [Op.gte]: parseFloat(priceMin) };
    if (priceMax) where.price = { ...where.price, [Op.lte]: parseFloat(priceMax) };

    if (mbMin) where.mb = { [Op.gte]: parseFloat(mbMin) };
    if (mbMax) where.mb = { ...where.mb, [Op.lte]: parseFloat(mbMax) };

    if (title) where.title = { [Op.like]: `%${title}%` };

    if (sellerId) where.sellerId = sellerId;

    const channels = await Channel.findAll({
      where,
      include: [{ model: User, as: 'seller', attributes: ['id', 'nickname', 'avatar'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json(channels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get channel by id
router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findByPk(req.params.id, {
      include: [{ model: User, as: 'seller', attributes: ['id', 'nickname', 'avatar', 'profileDescription'] }],
    });
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }
    res.json(channel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new channel (seller only) with file upload
router.post(
  '/',
  authenticateUser,
  authorizeRoles('seller'),
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'analyticsScreenshots', maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const sellerId = req.user.id;
      const {
        title,
        subscribers,
        monetizationAvailable,
        price,
        mb,
        description,
      } = req.body;

      if (!title || !price) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      let coverImageUrl = null;
      if (req.files['coverImage'] && req.files['coverImage'][0]) {
        coverImageUrl = `/uploads/${req.files['coverImage'][0].filename}`;
      }

      let analyticsScreenshotsUrls = [];
      if (req.files['analyticsScreenshots']) {
        analyticsScreenshotsUrls = req.files['analyticsScreenshots'].map(
          (file) => `/uploads/${file.filename}`
        );
      }

      const channel = await Channel.create({
        coverImage: coverImageUrl,
        title,
        subscribers: subscribers ? parseInt(subscribers) : 0,
        monetizationAvailable: monetizationAvailable === 'true',
        price: parseFloat(price),
        mb: mb ? parseFloat(mb) : null,
        description,
        analyticsScreenshots: analyticsScreenshotsUrls,
        sellerId,
      });

      res.status(201).json(channel);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Admin route to delete channel
router.delete('/:id', authenticateUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const channel = await Channel.findByPk(req.params.id);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    await channel.destroy();
    res.json({ message: 'Channel deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
