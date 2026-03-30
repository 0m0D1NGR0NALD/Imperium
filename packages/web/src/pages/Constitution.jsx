import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Constitution = () => {
  const [constitution, setConstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConstitution();
  }, []);

  const fetchConstitution = async () => {
    try {
      const res = await api.get('/constitution');
      setConstitution(res.data);
    } catch (err) {
      setError('Failed to fetch constitution');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConstitution({ ...constitution, [name]: parseFloat(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put('/constitution', constitution);
      alert('Constitution updated');
    } catch (err) {
      setError('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!constitution) return <div>No constitution found</div>;

  return (
    <div>
      <h1>Family Constitution</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Savings Rate (%):
          <input type="number" name="savingsRate" value={constitution.savingsRate} onChange={handleChange} step="1" />
        </label>
        <label>
          Emergency Fund (months of expenses):
          <input type="number" name="emergencyFundMonths" value={constitution.emergencyFundMonths} onChange={handleChange} step="0.5" />
        </label>
        <label>
          Windfall Rule:
          <select name="windfallRule" value={constitution.windfallRule} onChange={handleChange}>
            <option value="invest">Invest all</option>
            <option value="split">Split (invest/spend)</option>
          </select>
        </label>
        <label>
          Spending Approval Threshold ($):
          <input type="number" name="spendingApprovalThreshold" value={constitution.spendingApprovalThreshold} onChange={handleChange} step="100" />
        </label>
        <button type="submit" disabled={saving}>Save</button>
      </form>
    </div>
  );
};

export default Constitution;