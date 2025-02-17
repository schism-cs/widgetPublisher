import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'firebase/compat/auth';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';

function App() {
  const isAuthenticated = !!localStorage.getItem('firebaseToken');

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </header>
        <ToastContainer autoClose={2000} />
      </div>
    </Router>
  );
}

export default App;
