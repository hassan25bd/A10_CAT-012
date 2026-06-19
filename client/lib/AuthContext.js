'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import API from './api';
import { setAuth, clearAuth, getToken, getUser } from './auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const savedUser = getUser();
    if (token && savedUser) {
      setUser(savedUser);
      // Verify token is still valid
      API.get('/auth/me')
        .then((res) => setUser(res.data.user))
        .catch(() => { clearAuth(); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    setAuth(res.data.token, res.data.user);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, email, password, role) => {
    const res = await API.post('/auth/register', { name, email, password, role });
    setAuth(res.data.token, res.data.user);
    setUser(res.data.user);
    return res.data.user;
  };

  const googleLogin = async (googleData, role) => {
    const res = await API.post('/auth/google', { ...googleData, role });
    setAuth(res.data.token, res.data.user);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('fable_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
