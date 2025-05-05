// BudgetProgress.js
const totalBudget = 1000;
const currentSpending = 650;
const progress = (currentSpending / totalBudget) * 100;

return (
  <div>
    <h3>Budget Progress</h3>
    <div className="progress-bar">
      <div className="progress" style={{ width: `${progress}%` }} />
    </div>
  </div>
);
