import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';

interface User {
  _id?: string;
  id: string;
  fullName: string;
  email: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // utilisateur connecté
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur au démarrage si token existe
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await apiService.get<User>('/auth/me');
          setUser(data);
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
      const data = await apiService.post<{ token: string; user: User }>("/auth/login", { email, password });
      console.log(data)
      if (!data) return false;
      setUser(data.user);
      localStorage.setItem('token', data.token);

      // Redirection selon le rôle
      if (data?.user.isAdmin || data?.user.isSuperAdmin) {
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
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);
