import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(JSON.parse(localStorage.getItem('user') || null));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    }
    return response;
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const signup = async (userData) => {
    const response = await authService.signup(userData);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    }
    return response;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);