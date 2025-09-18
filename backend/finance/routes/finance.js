const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/transaction', auth, async (req, res) => {
  try {
    const { type, amount, category } = req.body;
    const transaction = new Transaction({
      userId: req.user.id,
      type,
      amount,
      category,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add transaction' });
  }
});

router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;