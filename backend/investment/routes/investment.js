const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/stock/:symbol', auth, async (req, res) => {
  try {
    const { symbol } = req.params;
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

router.get('/crypto/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${process.env.COINGECKO_API}/coins/${id}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch crypto data' });
  }
});

module.exports = router;