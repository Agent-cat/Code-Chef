import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { useNavigate } from 'react-router-dom';
import Navroutes from './routes/Navroutes';
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState(null);
  const [contests, setContests] = useState({ future: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchContests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/codechef/contests');
        setContests({
          future: response.data.future_contests,
          past: response.data.past_contests
        });
      } catch (err) {
        setError('Failed to fetch contests. Please try again later.');
        console.error('Error fetching contests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
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
      <Navroutes 
        onLogin={handleLogin} 
        contests={contests} 
        loading={loading} 
        error={error} 
        user={user}
      />
    </div>
  );
};

export default App;