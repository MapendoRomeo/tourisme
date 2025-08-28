import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from "@/api/axios";

interface User {
  id: string;
  email: string;
  fullName: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ...données de test supprimées...

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (err) {
          console.error('Token invalide');
          localStorage.removeItem('token'); // très important
          setUser(null); // remettre l'état utilisateur à null
        }
      } else {
        setUser(null); // Aucun token trouvé => aucun utilisateur
      }
      setLoading(false);
    };
    fetchUser();
  }, []);
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      if (!res.data) return false;
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);

      // Redirection selon le rôle
      if (!res.data?.isAdmin) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
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
