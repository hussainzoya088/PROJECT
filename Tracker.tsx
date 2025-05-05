import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseCard from '../components/ExpenseCard';
import Chart from '../components/Chart';

const Tracker = () => {
  return (
    <>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main className="container">
          <h2>Track Your Expenses</h2>
          <ExpenseForm />
          <Chart />
          <ExpenseCard />
        </main>
      </div>
    </>
  );
};

export default Tracker;
