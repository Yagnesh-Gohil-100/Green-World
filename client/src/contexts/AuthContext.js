import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUserType = localStorage.getItem('userType');
    
    if (token && savedUserType) {
      // Set auth header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user details
      fetchUserDetails(token, savedUserType);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserDetails = async (token, type) => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/me');
      setCurrentUser(response.data.data);
      setUserType(type);
    } catch (error) {
      console.error('Error fetching user details:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData, type) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', type);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setCurrentUser(userData);
    setUserType(type);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    setUserType(null);
  };

  const value = {
    currentUser,
    userType,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};