import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [stockData, setStockData] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) window.location.href = '/login';
    fetchTransactions();
    fetchStock('IBM');
    fetchPrediction();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}:3002/finance/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const fetchStock = async (symbol) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}:3003/investment/stock/${symbol}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStockData(res.data);
    } catch (err) {
      console.error('Error fetching stock:', err);
    }
  };

  const fetchPrediction = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}:3004/ai/spending-prediction`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrediction(res.data.predictedSpending || res.data.message);
    } catch (err) {
      console.error('Error fetching prediction:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}:3002/finance/transaction`,
        { type, amount: Number(amount), category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAmount('');
      setCategory('');
      fetchTransactions();
      fetchPrediction();
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const chartData = {
    labels: Object.keys(stockData['Time Series (Daily)'] || {}).slice(0, 10),
    datasets: [
      {
        label: 'Stock Price (Close)',
        data: Object.values(stockData['Time Series (Daily)'] || {})
          .slice(0, 10)
          .map((d) => d['4. close']),
        borderColor: 'blue',
        fill: false,
      },
    ],
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }} role="main" tabIndex={-1}>
      <h1>FinWiseX Dashboard</h1>
      <form onSubmit={handleSubmit} aria-label="Add Transaction Form">
        <div>
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ padding: '8px', margin: '8px 0' }}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
            style={{ padding: '8px', margin: '8px 0' }}
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            required
            style={{ padding: '8px', margin: '8px 0' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', width: '100%' }}>
          Add Transaction
        </button>
      </form>
      <h2>Transactions</h2>
      <ul>
        {transactions.map((t) => (
          <li key={t._id}>
            {t.category}: ${t.amount} ({t.type}) - {new Date(t.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <h2>Stock Data (IBM)</h2>
      <Line data={chartData} />
      <h2>Spending Prediction</h2>
      <p>{prediction ? `Next Day Prediction: ${prediction}` : 'Loading...'}</p>
    </div>
  );
};

export default Dashboard;