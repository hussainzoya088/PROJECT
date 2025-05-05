import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => (
  <>
    <Navbar />
    <div className="container">
      <h1>Welcome to Personal Expense Tracker</h1>
      <p>Track your expenses, visualize your spending, and manage your profile.</p>
      <Link to="/tracker">
        <button>Go to Tracker</button>
      </Link>
    </div>
  </>
);

export default Home;
