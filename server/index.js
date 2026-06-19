require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const ebookRoutes = require('./routes/ebooks');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const stripeRoutes = require('./routes/stripe');
const seedRoutes = require('./routes/seed');

const app = express();

// Stripe webhook needs raw body — mount before json middleware
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Fable API is running' }));

// Health check without DB
app.get('/api/health', (req, res) => {
  const uri = process.env.MONGODB_URI || '';
  res.json({
    status: 'ok',
    uri_length: uri.length,
    uri_prefix: uri.substring(0, 30),
    node_env: process.env.NODE_ENV,
    mongoose_state: mongoose.connection.readyState,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/ebooks', ebookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/seed', seedRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Serverless-friendly MongoDB connection — reuse across warm invocations
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI environment variable is not set');
  await mongoose.connect(uri);
  isConnected = true;
}

// Wrap app to ensure DB is connected before handling any request
const handler = async (req, res) => {
  // Health check bypasses DB
  if (req.url === '/api/health' || req.url === '/') {
    return app(req, res);
  }
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connect error:', err.message);
    return res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
  return app(req, res);
};

// Local dev: start server normally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      console.log('MongoDB connected');
      app.listen(PORT, () => console.log(`Fable server running on port ${PORT}`));
    })
    .catch((err) => console.error('MongoDB connection error:', err));
}

module.exports = handler;
