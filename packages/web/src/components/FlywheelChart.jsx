import React from 'react';
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

const FlywheelChart = ({ monthlyContribution, years = 30, rate = 0.07 }) => {
  const labels = Array.from({ length: years }, (_, i) => i + 1);
  const balances = labels.map(y => {
    const months = y * 12;
    return monthlyContribution * ((Math.pow(1 + rate / 12, months) - 1) / (rate / 12));
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Projected Wealth',
        data: balances,
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
      tooltip: { callbacks: { label: (ctx) => `$${ctx.raw.toFixed(2)}` } }
    },
    scales: {
      y: { ticks: { callback: (val) => `$${val.toFixed(0)}` } }
    }
  };

  return <Line data={data} options={options} />;
};

export default FlywheelChart;