import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';

import { useNavigate } from 'react-router-dom';
import Navroutes from './routes/Navroutes';
import StudentStats from './Pages/StudentStats';
import { Routes, Route } from 'react-router-dom';
import ContestAttendance from './Pages/ContestAttendance';

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="App">
      <Navbar user={user} onLogout={handleLogout} />
      
      <Navroutes onLogin={handleLogin} />
    </div>
  );
};

export default App;