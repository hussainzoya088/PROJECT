import React from 'react';
import ReactDOM from 'react-dom/client'; // Should work with React 18+
import './index.css';  // Assuming you have this file for styling

function App() {
  return <h1>Hello, Expense Tracker!</h1>;
}

// React 18 root rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
