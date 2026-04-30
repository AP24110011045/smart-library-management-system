import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('libraryUser') || 'null'));
  const [loading, setLoading] = useState(false);

  const saveSession = ({ user: nextUser, token }) => {
    localStorage.setItem('libraryToken', token);
    localStorage.setItem('libraryUser', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    saveSession(data);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    saveSession(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('libraryToken');
    localStorage.removeItem('libraryUser');
    setUser(null);
  };

  const refreshMe = async () => {
    if (!localStorage.getItem('libraryToken')) return;
    setLoading(true);
    try {
      const { data } = await api.get('/auth/me');
      localStorage.setItem('libraryUser', JSON.stringify(data));
      setUser(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMe().catch(logout);
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, logout, refreshMe }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
