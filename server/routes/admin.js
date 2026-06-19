const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Ebook = require('../models/Ebook');
const Transaction = require('../models/Transaction');
const { protect, requireRole } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', protect, requireRole('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalWriters = await User.countDocuments({ role: 'writer' });
    const totalEbooks = await Ebook.countDocuments({ status: 'published' });
    const revenueResult = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Monthly sales (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlySales = await Transaction.aggregate([
      { $match: { type: 'purchase', status: 'completed', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          sales: { $sum: 1 },
          revenue: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Ebooks by genre
    const genreData = await Ebook.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({ totalUsers, totalWriters, totalEbooks, totalRevenue, monthlySales, genreData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/transactions
router.get('/transactions', protect, requireRole('admin'), async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate('user', 'name email')
      .populate('ebook', 'title price')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/ebooks  — all ebooks
router.get('/ebooks', protect, requireRole('admin'), async (req, res) => {
  try {
    const ebooks = await Ebook.find({}).populate('writer', 'name email').sort({ createdAt: -1 });
    res.json(ebooks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
