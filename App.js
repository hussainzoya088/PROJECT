import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SignUp from './components/Auth/SignUp';
import Login from './components/Auth/Login';
import Tracker from './components/Tracker/Tracker';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tracker" element={<Tracker />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
