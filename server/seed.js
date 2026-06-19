require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Ebook = require('./models/Ebook');
const Transaction = require('./models/Transaction');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Ebook.deleteMany({});
  await Transaction.deleteMany({});

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@fable.com',
    password: 'Admin@123',
    role: 'admin',
  });

  // Create writers
  const writers = await User.create([
    { name: 'Elena Hartwood', email: 'elena@fable.com', password: 'Writer@123', role: 'writer', isVerifiedWriter: true },
    { name: 'Marcus Chen', email: 'marcus@fable.com', password: 'Writer@123', role: 'writer', isVerifiedWriter: true },
    { name: 'Sophia Rivers', email: 'sophia@fable.com', password: 'Writer@123', role: 'writer', isVerifiedWriter: true },
  ]);

  // Create readers
  const readers = await User.create([
    { name: 'John Reader', email: 'john@example.com', password: 'Reader@123', role: 'user' },
    { name: 'Jane Doe', email: 'jane@example.com', password: 'Reader@123', role: 'user' },
  ]);

  // Create ebooks
  const ebooks = await Ebook.create([
    {
      title: 'The Midnight Garden',
      description: 'A magical realism tale about a garden that blooms only at midnight, where impossible things become real and broken hearts find solace.',
      content: 'Chapter 1: The First Night\n\nIt was on the eve of my thirtieth birthday that I first discovered the garden...\n\nThe iron gate creaked as I pushed it open, the sound cutting through the stillness of the summer night. Moonlight spilled across stone pathways and silver flowers I had never seen before — flowers that pulsed with soft light, like tiny lanterns buried in the earth.\n\nI had lived in this house for six months. I had never once noticed this gate existed.\n\n"You came," said a voice behind me.\n\nI turned...',
      price: 9.99,
      genre: 'Fantasy',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
      writer: writers[0]._id,
      status: 'published',
      salesCount: 34,
    },
    {
      title: 'Code of Silence',
      description: 'A gripping thriller about a whistleblower who uncovers a government conspiracy that reaches the highest levels of power.',
      content: 'Chapter 1\n\nThe USB drive felt heavier than it should have. Thirty-two gigabytes of data — enough to bring down a administration, maybe even start a war. Sarah pressed it into her palm until the corner drew blood...',
      price: 12.99,
      genre: 'Thriller',
      coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=80',
      writer: writers[1]._id,
      status: 'published',
      salesCount: 28,
    },
    {
      title: 'Stars Between Us',
      description: 'A heartfelt romance set across three continents as two strangers discover that fate has woven their lives together in ways neither could have imagined.',
      content: 'Prologue\n\nSome meetings are accidents. Some are destiny. Ours was both.\n\nChapter 1: Paris, June\n\nThe rain came without warning, as Parisian rain always does...',
      price: 7.99,
      genre: 'Romance',
      coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80',
      writer: writers[2]._id,
      status: 'published',
      salesCount: 52,
    },
    {
      title: 'The Last Algorithm',
      description: 'In 2089, the last human programmer must work alongside an AI to prevent digital Armageddon before the Great Shutdown wipes all human-authored code.',
      content: 'Year 2089. Humanity invented machines to think. Machines invented machines to think better. Now only one programmer remains who still writes code the old way — by hand.\n\nHis name was Aldric Voss, and he was dying...',
      price: 14.99,
      genre: 'Sci-Fi',
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
      writer: writers[0]._id,
      status: 'published',
      salesCount: 19,
    },
    {
      title: 'Echoes of Istanbul',
      description: 'A rich historical novel following three generations of a family through the glory and tumult of the Ottoman Empire and modern Turkey.',
      content: 'Part One: 1908\n\nThe muezzin had just finished the dawn call to prayer when Leyla Hanim received the letter that would change everything...',
      price: 11.99,
      genre: 'History',
      coverImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80',
      writer: writers[1]._id,
      status: 'published',
      salesCount: 15,
    },
    {
      title: 'Whispers in the Dark',
      description: 'A psychological horror masterpiece that blurs the line between the supernatural and the human mind, set in an isolated mountain lodge.',
      content: 'The lodge had no mirrors. I noticed this on the first day but said nothing. By the third day, I understood why...',
      price: 8.99,
      genre: 'Horror',
      coverImage: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80',
      writer: writers[2]._id,
      status: 'published',
      salesCount: 41,
    },
  ]);

  // Create transactions (simulate purchases)
  await Transaction.create([
    { type: 'purchase', user: readers[0]._id, ebook: ebooks[0]._id, amount: 9.99, status: 'completed' },
    { type: 'purchase', user: readers[0]._id, ebook: ebooks[2]._id, amount: 7.99, status: 'completed' },
    { type: 'purchase', user: readers[1]._id, ebook: ebooks[1]._id, amount: 12.99, status: 'completed' },
    { type: 'purchase', user: readers[1]._id, ebook: ebooks[5]._id, amount: 8.99, status: 'completed' },
    { type: 'publishing_fee', user: writers[0]._id, amount: 9.99, status: 'completed' },
    { type: 'publishing_fee', user: writers[1]._id, amount: 9.99, status: 'completed' },
    { type: 'publishing_fee', user: writers[2]._id, amount: 9.99, status: 'completed' },
  ]);

  console.log('✅ Seed complete!');
  console.log('📧 Admin:   admin@fable.com / Admin@123');
  console.log('✍️  Writer:  elena@fable.com / Writer@123');
  console.log('📚 Reader:  john@example.com / Reader@123');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
