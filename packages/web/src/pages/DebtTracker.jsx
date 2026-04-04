import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import InfoBox from '../components/InfoBox';

const DebtTracker = () => {
  const [debts, setDebts] = useState([]);
  const [payoffStrategy, setPayoffStrategy] = useState({ avalanche: [], snowball: [] });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    balance: '',
    interestRate: 0,
    minimumPayment: '',
    dueDate: '',
    type: 'other'
  });

  useEffect(() => {
    fetchDebts();
    fetchPayoffStrategy();
  }, []);

  const fetchDebts = async () => {
    try {
      const res = await api.get('/debts');
      setDebts(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load debts');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayoffStrategy = async () => {
    try {
      const res = await api.get('/debts/payoff-strategy');
      setPayoffStrategy(res.data);
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
        await api.put(`/debts/${editingId}`, form);
        toast.success('Debt updated');
      } else {
        await api.post('/debts', form);
        toast.success('Debt added');
      }
      resetForm();
      fetchDebts();
      fetchPayoffStrategy(); // refresh strategy after changes
    } catch (err) {
      console.error(err);
      toast.error('Failed to save debt');
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      balance: '',
      interestRate: 0,
      minimumPayment: '',
      dueDate: '',
      type: 'other'
    });
    setEditingId(null);
  };

  const handleEdit = (debt) => {
    setEditingId(debt.id);
    setForm({
      name: debt.name,
      balance: debt.balance,
      interestRate: debt.interestRate,
      minimumPayment: debt.minimumPayment || '',
      dueDate: debt.dueDate ? debt.dueDate.slice(0, 10) : '',
      type: debt.type
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this debt?')) {
      try {
        await api.delete(`/debts/${id}`);
        toast.success('Deleted');
        fetchDebts();
        fetchPayoffStrategy();
      } catch (err) {
        console.error(err);
        toast.error('Delete failed');
      }
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>Debt Tracker</h1>
      <p>Manage your liabilities and see the best payoff order.</p>

      <div className="two-column">
        <div className="main">
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Debt name (e.g., Chase Credit Card)"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="balance"
              type="number"
              step="0.01"
              placeholder="Current balance"
              value={form.balance}
              onChange={handleChange}
              required
            />
            <input
              name="interestRate"
              type="number"
              step="0.01"
              placeholder="Interest rate (%)"
              value={form.interestRate}
              onChange={handleChange}
            />
            <input
              name="minimumPayment"
              type="number"
              step="0.01"
              placeholder="Minimum monthly payment"
              value={form.minimumPayment}
              onChange={handleChange}
            />
            <input
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
            />
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="credit_card">Credit Card</option>
              <option value="student_loan">Student Loan</option>
              <option value="mortgage">Mortgage</option>
              <option value="auto">Auto Loan</option>
              <option value="other">Other</option>
            </select>
            <button type="submit">{editingId ? 'Update' : 'Add'} Debt</button>
            {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
          </form>

          <h3>Your Debts</h3>
          {debts.length === 0 && <p>No debts recorded. Great job!</p>}
          {debts.map(debt => (
            <div key={debt.id} className="card" style={{ marginBottom: '0.5rem' }}>
              <strong>{debt.name}</strong> – ${debt.balance.toFixed(2)} @ {debt.interestRate}%<br />
              Min payment: ${debt.minimumPayment?.toFixed(2) || 'N/A'} | Due: {debt.dueDate ? new Date(debt.dueDate).toLocaleDateString() : 'N/A'}
              <div>
                <button onClick={() => handleEdit(debt)}>Edit</button>
                <button onClick={() => handleDelete(debt.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar">
          <InfoBox title="Payoff Strategy">
            <p><strong>Avalanche (highest interest first)</strong> – saves the most money on interest.</p>
            <p><strong>Snowball (smallest balance first)</strong> – provides psychological wins.</p>
            <h4>Avalanche Order:</h4>
            {payoffStrategy.avalanche.length === 0 ? (
              <p>No debts to prioritize.</p>
            ) : (
              <ol>
                {payoffStrategy.avalanche.map(d => (
                  <li key={d.id}>{d.name} – ${d.balance} @ {d.interestRate}%</li>
                ))}
              </ol>
            )}
            <h4>Snowball Order:</h4>
            {payoffStrategy.snowball.length === 0 ? (
              <p>No debts to prioritize.</p>
            ) : (
              <ol>
                {payoffStrategy.snowball.map(d => (
                  <li key={d.id}>{d.name} – ${d.balance}</li>
                ))}
              </ol>
            )}
            <a href="https://www.investopedia.com/articles/personal-finance/022415/snowball-vs-avalanche-paying-debt.asp" target="_blank" rel="noopener noreferrer">Learn more →</a>
          </InfoBox>
        </div>
      </div>
    </div>
  );
};

export default DebtTracker;