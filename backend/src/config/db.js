const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in env');
    process.exit(1);
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // short timeout so failures surface quickly during development
    serverSelectionTimeoutMS: 5000,
    // prefer IPv4 which can help in some Windows/DNS environments
    family: 4,
  };

  try {
    await mongoose.connect(uri, options);
    console.log('MongoDB connected');
    return;
  } catch (err) {
    console.error('MongoDB connection error', err);

    // Helpful troubleshooting message for Atlas +srv DNS failures
    console.error('\nIf you are using MongoDB Atlas with `mongodb+srv://` the error above can indicate your environment cannot resolve DNS SRV records.' +
      '\nOptions to fix:\n  - Ensure you have internet/DNS access from this machine.\n  - Replace the `mongodb+srv://` URI with the standard connection string (non-SRV) from Atlas.\n  - Run a local MongoDB for development and set MONGO_URI to `mongodb://127.0.0.1:27017/<db>` in your `.env`.\n');

    // In non-production environment try a convenient local fallback to help local dev
    if (process.env.NODE_ENV !== 'production') {
      const fallback = process.env.MONGO_FALLBACK_URI || 'mongodb://127.0.0.1:27017/pet_adoption';
      console.log(`Attempting fallback to local MongoDB: ${fallback}`);
      try {
        await mongoose.connect(fallback, options);
        console.log('Connected to local MongoDB fallback');
        return;
      } catch (e2) {
        console.error('Local fallback failed', e2);
      }
    }

    process.exit(1);
  }
}

module.exports = { connectDB };
