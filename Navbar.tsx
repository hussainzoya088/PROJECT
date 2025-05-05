import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav style={{ background: '#333', color: '#fff', padding: '1rem' }}>
    <Link to="/" style={{ color: '#fff', marginRight: '20px' }}>Home</Link>
    <Link to="/tracker" style={{ color: '#fff', marginRight: '20px' }}>Tracker</Link>
    <Link to="/profile" style={{ color: '#fff' }}>Profile</Link>
  </nav>
);

export default Navbar;
