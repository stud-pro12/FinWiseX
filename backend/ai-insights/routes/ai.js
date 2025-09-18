const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const LinearRegression = require('ml-regression-simple-linear');

const router = express.Router();

router.get('/spending-prediction', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id, type: 'expense' });
    if (transactions.length < 2) {
      return res.json({ message: 'Insufficient data for prediction' });
    }
    const x = transactions.map(t => new Date(t.date).getTime());
    const y = transactions.map(t => t.amount);
    const regression = new LinearRegression(x, y);
    const nextTime = Date.now() + 24 * 60 * 60 * 1000; // Next day
    const prediction = regression.predict(nextTime);
    res.json({ predictedSpending: Math.max(0, prediction.toFixed(2)) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate prediction' });
  }
});

router.get('/investment-suggestion', auth, async (req, res) => {
  try {
    // Placeholder: Simple rule-based suggestion
    const transactions = await Transaction.find({ userId: req.user.id, type: 'expense' });
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const suggestion = totalSpent > 500 
      ? 'Consider low-risk ETFs like VOO for stable growth.' 
      : 'Save more before investing; try high-yield savings.';
    res.json({ suggestion });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate suggestion' });
  }
});

module.exports = router;