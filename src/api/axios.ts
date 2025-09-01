import axios from 'axios';

// URL de base du backend (ajuste selon ton environnement)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Création d’une instance Axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // utile si tu utilises des cookies (sinon retire-le)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour inclure automatiquement le token dans chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // ou sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs globalement
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Gère les erreurs HTTP
      console.error('Erreur Axios :', error.response.data);
      if (error.response.status === 401) {
        // Déconnexion automatique si token expiré ou non autorisé
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else {
      console.error('Erreur réseau ou serveur injoignable', error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
