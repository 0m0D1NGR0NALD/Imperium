import React, { useState, useEffect } from 'react';
import api from '../services/api';

const SideHustles = () => {
  const [hustles, setHustles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', monthlyIncome: 0, profitAllocationPercent: 100 });

  useEffect(() => {
    fetchHustles();
  }, []);

  const fetchHustles = async () => {
    try {
      const res = await api.get('/side-hustles');
      setHustles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: parseFloat(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/side-hustles/${editingId}`, form);
      } else {
        await api.post('/side-hustles', form);
      }
      setForm({ name: '', monthlyIncome: 0, profitAllocationPercent: 100 });
      setEditingId(null);
      fetchHustles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (hustle) => {
    setEditingId(hustle.id);
    setForm({
      name: hustle.name,
      monthlyIncome: hustle.monthlyIncome,
      profitAllocationPercent: hustle.profitAllocationPercent
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this side hustle?')) {
      try {
        await api.delete(`/side-hustles/${id}`);
        fetchHustles();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Side Hustles</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="monthlyIncome" type="number" step="0.01" placeholder="Monthly Income" value={form.monthlyIncome} onChange={handleChange} />
        <input name="profitAllocationPercent" type="number" step="1" min="0" max="100" placeholder="% to Invest" value={form.profitAllocationPercent} onChange={handleChange} />
        <button type="submit">{editingId ? 'Update' : 'Add'} Side Hustle</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', monthlyIncome: 0, profitAllocationPercent: 100 }); }}>Cancel</button>}
      </form>
      <ul>
        {hustles.map(h => (
          <li key={h.id}>
            {h.name} - ${h.monthlyIncome}/month, {h.profitAllocationPercent}% to invest
            <button onClick={() => handleEdit(h)}>Edit</button>
            <button onClick={() => handleDelete(h.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideHustles;