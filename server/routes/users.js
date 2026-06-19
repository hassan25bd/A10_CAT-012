const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Ebook = require('../models/Ebook');
const { protect, requireRole } = require('../middleware/auth');

// GET /api/users  — admin only
router.get('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/users/:id/role  — admin only
router.patch('/:id/role', protect, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'writer', 'admin'].includes(role))
      return res.status(400).json({ message: 'Invalid role' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/:id  — admin only
router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/purchases  — current user's purchases
router.get('/purchases', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id, type: 'purchase', status: 'completed' })
      .populate({ path: 'ebook', populate: { path: 'writer', select: 'name' } })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/bookmarks
router.get('/bookmarks', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'bookmarks',
      populate: { path: 'writer', select: 'name avatar' },
    });
    res.json(user.bookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/bookmark/:ebookId
router.post('/bookmark/:ebookId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const ebookId = req.params.ebookId;
    if (user.bookmarks.includes(ebookId)) {
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== ebookId);
    } else {
      user.bookmarks.push(ebookId);
    }
    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/writer/ebooks  — writer's own ebooks
router.get('/writer/ebooks', protect, requireRole('writer', 'admin'), async (req, res) => {
  try {
    const ebooks = await Ebook.find({ writer: req.user._id }).sort({ createdAt: -1 });
    res.json(ebooks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/writer/sales  — writer's sales history
router.get('/writer/sales', protect, requireRole('writer', 'admin'), async (req, res) => {
  try {
    const writerEbooks = await Ebook.find({ writer: req.user._id }).select('_id');
    const ebookIds = writerEbooks.map((e) => e._id);
    const sales = await Transaction.find({ ebook: { $in: ebookIds }, type: 'purchase', status: 'completed' })
      .populate('ebook', 'title price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
