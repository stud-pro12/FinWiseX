const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const investmentRoutes = require('./routes/investment');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/investment', investmentRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Investment Service running on port ${PORT}`));