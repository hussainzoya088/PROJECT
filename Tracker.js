import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Tracker = () => {
  const [expense, setExpense] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Expenses over Time',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  });

  // Add expense and update chart
  const handleAddExpense = () => {
    const newExpense = parseFloat(expense);
    setExpenses([...expenses, newExpense]);

    // Update chart data dynamically
    setChartData({
      ...chartData,
      labels: [...chartData.labels, `Day ${chartData.labels.length + 1}`],
      datasets: [
        {
          ...chartData.datasets[0],
          data: [...chartData.datasets[0].data, newExpense],
        },
      ],
    });

    setExpense(0);
  };

  return (
    <div>
      <h2>Expense Tracker</h2>
      <input
        type="number"
        value={expense}
        onChange={(e) => setExpense(e.target.value)}
        placeholder="Enter expense amount"
      />
      <button onClick={handleAddExpense}>Add Expense</button>

      <div style={{ width: '60%', marginTop: '20px' }}>
        <Line data={chartData} />
      </div>

      <h3>All Expenses:</h3>
      <ul>
        {expenses.map((exp, index) => (
          <li key={index}>Expense {index + 1}: ₹{exp}</li>
        ))}
      </ul>
    </div>
  );
};

export default Tracker;
