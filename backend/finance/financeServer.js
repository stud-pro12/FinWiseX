const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const financeRoutes = require('./routes/finance');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for Finance Service'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use('/finance', financeRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Finance Service running on port ${PORT}`));