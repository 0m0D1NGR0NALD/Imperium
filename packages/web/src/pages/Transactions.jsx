import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
    category: 'needs',
    type: 'expense',
    accountId: ''
  });

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/transactions/${editingId}`, form);
      } else {
        await api.post('/transactions', form);
      }
      resetForm();
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setForm({
      amount: '',
      date: new Date().toISOString().slice(0, 10),
      description: '',
      category: 'needs',
      type: 'expense',
      accountId: ''
    });
    setEditingId(null);
  };

  const handleEdit = (tx) => {
    setEditingId(tx.id);
    setForm({
      amount: tx.amount,
      date: tx.date.slice(0, 10),
      description: tx.description || '',
      category: tx.category,
      type: tx.type,
      accountId: tx.accountId
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Transactions</h1>
      <form onSubmit={handleSubmit}>
        <input name="amount" type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={handleInputChange} required />
        <input name="date" type="date" value={form.date} onChange={handleInputChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleInputChange} />
        <select name="category" value={form.category} onChange={handleInputChange}>
          <option value="needs">Needs</option>
          <option value="wants">Wants</option>
          <option value="savings">Savings</option>
          <option value="income">Income</option>
          <option value="investment">Investment</option>
          <option value="other">Other</option>
        </select>
        <select name="type" value={form.type} onChange={handleInputChange}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="transfer">Transfer</option>
        </select>
        <select name="accountId" value={form.accountId} onChange={handleInputChange} required>
          <option value="">Select Account</option>
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.name}</option>
          ))}
        </select>
        <button type="submit">{editingId ? 'Update' : 'Add'} Transaction</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>
      <ul>
        {transactions.map(tx => (
          <li key={tx.id}>
            {tx.date.slice(0,10)} - {tx.description} ({tx.category}) - ${tx.amount} ({tx.type}) - Account: {tx.Account?.name}
            <button onClick={() => handleEdit(tx)}>Edit</button>
            <button onClick={() => handleDelete(tx.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;