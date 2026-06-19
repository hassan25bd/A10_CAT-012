const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['publishing_fee', 'purchase'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ebook: { type: mongoose.Schema.Types.ObjectId, ref: 'Ebook' },
  amount: { type: Number, required: true },
  stripeSessionId: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
