import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  loggedInUser: string | null;
  token: string | null;
  role: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Decode the payload of a JWT without verifying signature (client-side only). */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (user && storedToken) {
      setLoggedInUser(user);
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const response = await axios.post(`${apiBaseUrl}/auth/login`, {
        email: email,
        password: password
      });

      const receivedToken = response.data;

      // Decode JWT to extract the role claim
      const payload = decodeJwtPayload(receivedToken);
      const userRole = (payload?.role as string) ?? 'STUDENT';

      localStorage.setItem('loggedInUser', email);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('role', userRole);
      setLoggedInUser(email);
      setToken(receivedToken);
      setRole(userRole);
    } catch (error: unknown) {
      console.error('Login failed', error);
      // Extract the real error message from the backend response body
      const axiosErr = error as { response?: { data?: { message?: string } }; message?: string };
      const backendMsg = axiosErr?.response?.data?.message;
      throw new Error(backendMsg || axiosErr?.message || 'Login failed. Ensure backend auth-service is running.');
    }
  };

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setLoggedInUser(null);
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ loggedInUser, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
