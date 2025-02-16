// components/charts/BudgetChart.js
'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function BudgetChart({ data }) {
  return (
    <div className="h-96">
      <BarChart width={800} height={400} data={data}>
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="budget" fill="#3b82f6" />
        <Bar dataKey="actual" fill="#10b981" />
      </BarChart>
    </div>
  );
}