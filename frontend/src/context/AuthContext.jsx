import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as adminApi from '../api/admin';

const AuthContext = createContext(null);
const KEY = 'avm_auth';

const readStored = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => readStored());
  const [loading, setLoading] = useState(() => !!readStored());

  const clear = useCallback(() => {
    setAdminUser(null);
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  }, []);

  // Validate the persisted state against the real PHP session on load.
  useEffect(() => {
    if (!readStored()) return;
    adminApi
      .getStats()
      .catch((err) => { if (err.response?.status === 401) clear(); })
      .finally(() => setLoading(false));
  }, [clear]);

  useEffect(() => {
    window.addEventListener('avm:unauthorized', clear);
    return () => window.removeEventListener('avm:unauthorized', clear);
  }, [clear]);

  const login = async (username, password) => {
    const user = await adminApi.login(username, password);
    setAdminUser(user);
    try { localStorage.setItem(KEY, JSON.stringify(user)); } catch { /* ignore */ }
    return user;
  };

  const logout = async () => {
    try { await adminApi.logout(); } catch { /* session may already be gone */ }
    clear();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!adminUser, adminUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
