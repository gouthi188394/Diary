import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);
const tokenKey = 'diary-saas-token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    localStorage.removeItem(tokenKey);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    api
      .get('/auth/me', token)
      .then((response) => setUser(response.user))
      .catch(() => {
        localStorage.removeItem(tokenKey);
        setToken(null);
        setUser(null);
      });
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        localStorage.setItem(tokenKey, response.token);
        setToken(response.token);
        setUser(response.user);
      },
      async register(payload) {
        const response = await api.post('/auth/register', payload);
        localStorage.setItem(tokenKey, response.token);
        setToken(response.token);
        setUser(response.user);
      },
      logout() {
        localStorage.removeItem(tokenKey);
        setToken(null);
        setUser(null);
      }
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
