const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for Auth Service'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));