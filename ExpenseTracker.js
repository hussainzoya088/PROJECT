import React, { useState } from 'react';

const ExpenseTracker = () => {
  const categories = [
    { name: 'Groceries', icon: '🥕' },
    { name: 'Entertainment', icon: '🎬' },
    { name: 'Utilities', icon: '💡' },
  ];

  return (
    <div className="expense-tracker">
      <h2>Select Expense Category</h2>
      <div>
        {categories.map((category) => (
          <button key={category.name}>
            {category.icon} {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExpenseTracker;
