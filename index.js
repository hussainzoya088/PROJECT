import React from 'react';
import ReactDOM from 'react-dom/client';

// Simple App component
function App() {
  return <h1>Hello, Expense Tracker!</h1>;
}

// Render App into root div in public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
