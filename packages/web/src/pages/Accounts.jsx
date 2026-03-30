import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'bank', balance: 0, isEmergencyFund: false });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/accounts');
      setAccounts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/accounts/${editingId}`, form);
      } else {
        await api.post('/accounts', form);
      }
      setForm({ name: '', type: 'bank', balance: 0, isEmergencyFund: false });
      setEditingId(null);
      fetchAccounts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (account) => {
    setEditingId(account.id);
    setForm({
      name: account.name,
      type: account.type,
      balance: account.balance,
      isEmergencyFund: account.isEmergencyFund
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this account?')) {
      try {
        await api.delete(`/accounts/${id}`);
        fetchAccounts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Accounts</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleInputChange} required />
        <select name="type" value={form.type} onChange={handleInputChange}>
          <option value="bank">Bank</option>
          <option value="brokerage">Brokerage</option>
          <option value="pension">Pension</option>
          <option value="cash">Cash</option>
          <option value="other">Other</option>
        </select>
        <input name="balance" type="number" step="0.01" placeholder="Balance" value={form.balance} onChange={handleInputChange} />
        <label>
          <input name="isEmergencyFund" type="checkbox" checked={form.isEmergencyFund} onChange={handleInputChange} />
          Emergency Fund Account
        </label>
        <button type="submit">{editingId ? 'Update' : 'Add'} Account</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', type: 'bank', balance: 0, isEmergencyFund: false }); }}>Cancel</button>}
      </form>
      <ul>
        {accounts.map(acc => (
          <li key={acc.id}>
            {acc.name} ({acc.type}) - ${acc.balance} {acc.isEmergencyFund && ' (Emergency Fund)'}
            <button onClick={() => handleEdit(acc)}>Edit</button>
            <button onClick={() => handleDelete(acc.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Accounts;