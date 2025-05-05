import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'Food', value: 400 },
  { name: 'Rent', value: 800 },
  { name: 'Bills', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Chart = () => (
  <PieChart width={300} height={300}>
    <Pie data={data} dataKey="value" outerRadius={100} label>
      {data.map((_, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
);

export default Chart;
