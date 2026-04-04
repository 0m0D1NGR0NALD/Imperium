import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import InfoBox from '../components/InfoBox';

const RecurringTransactions = () => {
  const [recurring, setRecurring] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    amount: '',
    description: '',
    category: 'needs',
    type: 'expense',
    frequency: 'monthly',
    nextDate: new Date().toISOString().slice(0, 10),
    accountId: ''
  });

  useEffect(() => {
    fetchRecurring();
    fetchAccounts();
  }, []);

  const fetchRecurring = async () => {
    try {
      const res = await api.get('/recurring');
      setRecurring(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load recurring transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/accounts');
      setAccounts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/recurring/${editingId}`, form);
        toast.success('Recurring transaction updated');
      } else {
        await api.post('/recurring', form);
        toast.success('Recurring transaction added');
      }
      resetForm();
      fetchRecurring();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save');
    }
  };

  const resetForm = () => {
    setForm({
      amount: '',
      description: '',
      category: 'needs',
      type: 'expense',
      frequency: 'monthly',
      nextDate: new Date().toISOString().slice(0, 10),
      accountId: ''
    });
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      amount: item.amount,
      description: item.description || '',
      category: item.category,
      type: item.type,
      frequency: item.frequency,
      nextDate: item.nextDate.slice(0, 10),
      accountId: item.accountId
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this recurring transaction?')) {
      try {
        await api.delete(`/recurring/${id}`);
        toast.success('Deleted');
        fetchRecurring();
      } catch (err) {
        console.error(err);
        toast.error('Delete failed');
      }
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>Recurring Transactions</h1>
      <p>Automate regular income or expenses (salary, rent, subscriptions).</p>

      <div className="two-column">
        <div className="main">
          <form onSubmit={handleSubmit}>
            <input
              name="amount"
              type="number"
              step="0.01"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              required
            />
            <input
              name="description"
              placeholder="Description (e.g., Netflix, Salary)"
              value={form.description}
              onChange={handleChange}
              required
            />
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="needs">Needs</option>
              <option value="wants">Wants</option>
              <option value="savings">Savings</option>
              <option value="income">Income</option>
              <option value="investment">Investment</option>
              <option value="other">Other</option>
            </select>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
            </select>
            <select name="frequency" value={form.frequency} onChange={handleChange}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <input
              name="nextDate"
              type="date"
              value={form.nextDate}
              onChange={handleChange}
              required
            />
            <select name="accountId" value={form.accountId} onChange={handleChange} required>
              <option value="">Select Account</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
            <button type="submit">{editingId ? 'Update' : 'Add'} Recurring Transaction</button>
            {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
          </form>

          <ul>
            {recurring.length === 0 && <p>No recurring transactions. Add one above.</p>}
            {recurring.map(item => (
              <li key={item.id}>
                <strong>{item.description}</strong> – ${item.amount} ({item.type}, {item.frequency})<br />
                Next: {new Date(item.nextDate).toLocaleDateString()}
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar">
          <InfoBox title="Automate Your Finances">
            <p>Setting up recurring transactions mirrors the Singaporean principle of forced savings – money never seen is money never spent.</p>
            <p>Automate your rent, savings contributions, and even side‑hustle profit routing.</p>
            <a href="https://www.cpf.gov.sg" target="_blank" rel="noopener noreferrer">Learn about forced savings →</a>
          </InfoBox>
        </div>
      </div>
    </div>
  );
};

export default RecurringTransactions;