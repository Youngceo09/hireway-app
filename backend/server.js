const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// 2. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🚀 SUCCESS: Connected to Database'))
  .catch(err => console.log('❌ DB Error:', err.message));

// 3. Routes - MAKE SURE THESE ARE EXACTLY LIKE THIS
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));

// 4. Test Route
app.get('/', (req, res) => res.send('HireWay API is running...'));

// 5. Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`📡 Server listening on port ${PORT}`);
});