const express = require('express');
const router = express.Router();
const Ebook = require('../models/Ebook');
const Transaction = require('../models/Transaction');
const { protect, requireRole } = require('../middleware/auth');

// GET /api/ebooks  — public, supports search/filter/sort/pagination
router.get('/', async (req, res) => {
  try {
    const { search, genre, minPrice, maxPrice, availability, sort, page = 1, limit = 12 } = req.query;
    const filter = { status: 'published' };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        // writer name search handled via populate below
      ];
    }
    if (genre) filter.genre = genre;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (availability === 'sold') filter.salesCount = { $gt: 0 };
    if (availability === 'available') filter.salesCount = 0;

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Ebook.countDocuments(filter);

    let ebooks = await Ebook.find(filter)
      .populate('writer', 'name avatar')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    if (search) {
      ebooks = ebooks.filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.writer?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({ ebooks, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/ebooks/featured  — latest 6 published
router.get('/featured', async (req, res) => {
  try {
    const ebooks = await Ebook.find({ status: 'published' })
      .populate('writer', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(ebooks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/ebooks/top-writers  — 3 writers with most sales
router.get('/top-writers', async (req, res) => {
  try {
    const User = require('../models/User');
    const result = await Transaction.aggregate([
      { $match: { type: 'purchase', status: 'completed' } },
      { $lookup: { from: 'ebooks', localField: 'ebook', foreignField: '_id', as: 'ebookData' } },
      { $unwind: '$ebookData' },
      { $group: { _id: '$ebookData.writer', sales: { $sum: 1 } } },
      { $sort: { sales: -1 } },
      { $limit: 3 },
    ]);
    const writers = await Promise.all(
      result.map(async (r) => {
        const writer = await User.findById(r._id).select('name avatar email');
        return { writer, sales: r.sales };
      })
    );
    res.json(writers.filter((w) => w.writer));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/ebooks/:id  — public
router.get('/:id', async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id).populate('writer', 'name avatar email');
    if (!ebook) return res.status(404).json({ message: 'Ebook not found' });
    res.json(ebook);
  } catch (err) {
    res.status(404).json({ message: 'Ebook not found' });
  }
});

// POST /api/ebooks  — writer only
router.post('/', protect, requireRole('writer', 'admin'), async (req, res) => {
  try {
    const { title, description, content, price, genre, coverImage } = req.body;
    if (!title || !description || !content || price == null || !genre || !coverImage)
      return res.status(400).json({ message: 'All fields required' });

    const ebook = await Ebook.create({
      title, description, content, price, genre, coverImage,
      writer: req.user._id,
    });
    res.status(201).json(ebook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/ebooks/:id  — writer (own) or admin
router.put('/:id', protect, requireRole('writer', 'admin'), async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id);
    if (!ebook) return res.status(404).json({ message: 'Ebook not found' });
    if (req.user.role === 'writer' && ebook.writer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your ebook' });

    const { title, description, content, price, genre, coverImage } = req.body;
    Object.assign(ebook, { title, description, content, price, genre, coverImage });
    await ebook.save();
    res.json(ebook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/ebooks/:id  — writer (own) or admin
router.delete('/:id', protect, requireRole('writer', 'admin'), async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id);
    if (!ebook) return res.status(404).json({ message: 'Ebook not found' });
    if (req.user.role === 'writer' && ebook.writer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your ebook' });
    await ebook.deleteOne();
    res.json({ message: 'Ebook deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/ebooks/:id/publish  — writer (own) or admin
router.patch('/:id/publish', protect, requireRole('writer', 'admin'), async (req, res) => {
  try {
    const ebook = await Ebook.findById(req.params.id);
    if (!ebook) return res.status(404).json({ message: 'Ebook not found' });
    if (req.user.role === 'writer' && ebook.writer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your ebook' });
    ebook.status = ebook.status === 'published' ? 'unpublished' : 'published';
    await ebook.save();
    res.json(ebook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
