const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. MIDDLEWARE
app.use(express.json());
app.use(cors({ origin: "*" }));

// 2. DEBUGGING: Check if variables are loading (Will print in terminal)
console.log("-----------------------------------------");
console.log("Checking Environment Variables...");
if (!process.env.MONGO_URI) {
    console.log("❌ ERROR: MONGO_URI is missing from .env file!");
} else {
    console.log("✅ MONGO_URI found in .env");
}
console.log("-----------------------------------------");

// 3. MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🚀 SUCCESS: Connected to HireWay Cloud Database');
  })
  .catch(err => {
    console.log('❌ DATABASE CONNECTION ERROR:');
    console.log(err.message);
    console.log("-----------------------------------------");
    console.log("QUICK FIX TIPS:");
    console.log("1. Check if your password in .env has brackets < >. Remove them!");
    console.log("2. Check MongoDB Atlas -> Network Access. It must be 0.0.0.0/0 (Active).");
    console.log("3. Ensure your password doesn't have special characters like @ or #.");
  });

// 4. IMPORT ROUTES
const authRoutes = require('./routes/auth');
// Note: We will add Job and Application routes in Phase 4

// 5. USE ROUTES
app.use('/api/auth', authRoutes);app.use('/api/jobs', require('./routes/jobs'));

// 6. BASIC TEST ROUTE
app.get('/', (req, res) => {
    res.send('HireWay Backend API is running...');
});

// 7. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`📡 Server listening on port ${PORT}`);
});
// ... existing imports
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications')); 