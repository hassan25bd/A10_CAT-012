const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Ebook = require('../models/Ebook');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// POST /api/stripe/checkout
router.post('/checkout', protect, async (req, res) => {
  try {
    const { ebookId } = req.body;
    const ebook = await Ebook.findById(ebookId).populate('writer', 'name');
    if (!ebook) return res.status(404).json({ message: 'Ebook not found' });

    if (ebook.writer._id.toString() === req.user._id.toString())
      return res.status(400).json({ message: 'You cannot purchase your own ebook' });

    // Check if already purchased
    const already = await Transaction.findOne({
      user: req.user._id,
      ebook: ebookId,
      type: 'purchase',
      status: 'completed',
    });
    if (already) return res.status(400).json({ message: 'Already purchased' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: ebook.title,
              description: ebook.description.substring(0, 200),
              images: [ebook.coverImage],
            },
            unit_amount: Math.round(ebook.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/ebooks/${ebookId}`,
      metadata: {
        ebookId: ebookId.toString(),
        userId: req.user._id.toString(),
      },
    });

    // Create pending transaction
    await Transaction.create({
      type: 'purchase',
      user: req.user._id,
      ebook: ebookId,
      amount: ebook.price,
      stripeSessionId: session.id,
      status: 'pending',
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/stripe/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await Transaction.findOneAndUpdate(
      { stripeSessionId: session.id },
      { status: 'completed' }
    );
    await Ebook.findByIdAndUpdate(session.metadata.ebookId, { $inc: { salesCount: 1 } });
  }
  res.json({ received: true });
});

// GET /api/stripe/verify/:sessionId  — called on success page
router.get('/verify/:sessionId', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { stripeSessionId: req.params.sessionId, user: req.user._id },
      { status: 'completed' },
      { new: true }
    ).populate('ebook');

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    await Ebook.findByIdAndUpdate(transaction.ebook._id, { $inc: { salesCount: 1 } });
    res.json({ transaction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/stripe/writer-verification  — writer pays one-time fee
router.post('/writer-verification', protect, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Fable Writer Verification Fee' },
            unit_amount: 999,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/dashboard/writer?verified=true`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/writer`,
      metadata: { userId: req.user._id.toString(), type: 'publishing_fee' },
    });

    await Transaction.create({
      type: 'publishing_fee',
      user: req.user._id,
      amount: 9.99,
      stripeSessionId: session.id,
      status: 'pending',
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
