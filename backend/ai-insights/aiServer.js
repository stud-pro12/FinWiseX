const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const aiRoutes = require('./routes/ai');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for AI Insights Service'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use('/ai', aiRoutes);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`AI Insights Service running on port ${PORT}`));