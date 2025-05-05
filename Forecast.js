// Forecast.js
const predictedSpending = [
    { month: 'June', prediction: 800 },
    { month: 'July', prediction: 850 }
  ];
  
  return (
    <div>
      <h3>Predicted Spending</h3>
      <ul>
        {predictedSpending.map((data) => (
          <li key={data.month}>{data.month}: ₹{data.prediction}</li>
        ))}
      </ul>
    </div>
  );
  