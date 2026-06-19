const mongoose = require('mongoose');

const ebookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  genre: {
    type: String,
    required: true,
    enum: ['Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Horror', 'Biography', 'Self-Help', 'History', 'Poetry', 'Thriller', 'Adventure'],
  },
  coverImage: { type: String, required: true },
  writer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['published', 'unpublished'], default: 'unpublished' },
  salesCount: { type: Number, default: 0 },
}, { timestamps: true });

ebookSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Ebook', ebookSchema);
