import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const BudgetVsActual = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetRes, transactionsRes] = await Promise.all([
          api.get('/budget'),
          api.get('/transactions')
        ]);
        const budget = budgetRes.data;
        const transactions = transactionsRes.data;
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyTx = transactions.filter(t => new Date(t.date) >= firstDay);
        const needsTotal = monthlyTx.filter(t => t.category === 'needs' && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const wantsTotal = monthlyTx.filter(t => t.category === 'wants' && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const savingsTotal = monthlyTx.filter(t => t.category === 'savings' && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        setData({ budget, actual: { needs: needsTotal, wants: wantsTotal, savings: savingsTotal } });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading budget report...</div>;
  if (!data) return null;

  const COLORS = ['#D4AF37', '#2C7A7A', '#0A1929'];
  const budgetData = [
    { name: 'Needs', value: data.budget.needsPercent },
    { name: 'Wants', value: data.budget.wantsPercent },
    { name: 'Savings', value: data.budget.savingsPercent }
  ];
  const actualData = [
    { name: 'Needs', value: data.actual.needs },
    { name: 'Wants', value: data.actual.wants },
    { name: 'Savings', value: data.actual.savings }
  ];

  return (
    <div className="card">
      <h3>Budget vs Actual (This Month)</h3>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <h4>Target Allocation</h4>
          <PieChart width={200} height={200}>
            <Pie data={budgetData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {budgetData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div>
          <h4>Actual Spending</h4>
          <PieChart width={200} height={200}>
            <Pie data={actualData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {actualData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default BudgetVsActual;