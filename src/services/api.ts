
import axios, { AxiosInstance, AxiosResponse } from 'axios';
export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  status: 'pending' | 'replied' | 'resolved' | 'spam';
  priority: 'low' | 'medium' | 'high';
}
interface ContactMessagesResponse {
  success: boolean;
  data: ContactMessage[];
}

export interface AdminReview {
  id: string;
  user: string;
  attraction: {
    id: string,
    name: string,
  };
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}
interface AutoApproveReviews {
  succes: boolean;
  autoApproveReviews: boolean;
}

export interface Accommodation {
  id: string;
  name: string;
  description: string;
  location: string;
  type: string;
  price: number;
  image: string;
  rating: number;
  amenities: string[];
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  location: string;
  category: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  duration: string;
  coordinates: { lat: number; lng: number };
  openingHours: string;
  price: string;
  highlights: string[];
  tips: string[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  createdAt?: string;
  lastLogin?: string;
  isActive?: boolean;
  role?: 'superAdmin' | 'admin' | 'user';
}
// Configuration de base pour axios
export const BASE_URL = (import.meta as unknown as { env: { VITE_API_BASE_URL?: string } }).env.VITE_API_BASE_URL ?? ''

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour les requêtes (ajouter des tokens, etc.)
    this.api.interceptors.request.use(
      (config) => {
        // Ajouter le token d'authentification si disponible
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur pour les réponses (gestion des erreurs)
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // Méthodes génériques
  async get<T>(url: string): Promise<T> {
    const response = await this.api.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url);
    return response.data;
  }

  // Méthodes spécifiques pour votre application

  // Attractions
  async getAttractions() {
    return this.get<Attraction[]>('/attractions');
  }

  async createAttraction(attraction: any) {
    return this.post('/attractions', {
      name: attraction.name,
      description: attraction.description,
      longDescription: attraction.longDescription,
      location: attraction.location,
      category: attraction.category,
      duration: attraction.duration,
      coordinates: attraction.coordinates,
      openingHours: attraction.openingHours,
      price: attraction.price,
      highlights: attraction.highlights,
      tips: attraction.tips,
      image: attraction.image,       // l’URL envoyée depuis frontend pour l'image principale
      gallery: attraction.gallery,   // tableau d’URLs pour la gallery
    });
  }

  async updateAttraction(id: string, attraction: any) {
    return this.put(`/attractions/${id}`, { data: attraction });
  }

  async deleteAttraction(id: string) {
    return this.delete(`/attractions/${id}`);
  }

  // Hébergements
  async getAccommodations() {
    return this.get<Accommodation[]>('/accommodations');
  }

  async createAccommodation(accommodation: any) {
    return this.post('/accommodations', accommodation);
  }

  async updateAccommodation(id: string, accommodation: any) {
    return this.put(`/accommodations/${id}`, { data: accommodation });
  }

  async deleteAccommodation(id: string) {
    return this.delete(`/accommodations/${id}`);
  }

  // teamMembers
  async getTemMembers() {
    return this.get<any[]>('/teamMembers');
  }

  async createTemMember(temMember: any) {
    return this.post('/teamMembers', temMember);
  }

  async updateTemMember(id: string, temMember: any) {
    return this.put(`/teamMembers/${id}`, { data: temMember });
  }

  async deleteTemMember(id: string) {
    return this.delete(`/teamMembers/${id}`);
  }

  // Expériences
  async getExperiences() {
    return this.get<any[]>('/experiences');
  }
  async createExperience(experience: any) {
    return this.post('/experiences', experience);
  }

  async updateExperience(id: string, experience: any) {
    return this.put(`/experiences/${id}`, { data: experience });
  }

  async deleteExperience(id: string) {
    return this.delete(`/experiences/${id}`);
  }

  // Avis
  async getReviews() {
    return this.get<AdminReview[]>('/reviews');
  }
  async getAutoApprove() {
    return this.get<AutoApproveReviews>('/reviews/auto-approve');
  }
  async updateAutoApprove(autoApproveReviews: boolean) {
    return this.post<AutoApproveReviews>('/reviews/auto-approve', { enabled: !autoApproveReviews });
  }

  async createReview(review: any) {
    return this.post('/reviews', review);
  }

  async updateReview(id: string, review: string) {
    return this.patch(`/reviews/${id}/status`, { status: review });
  }

  async deleteReview(id: string) {
    return this.delete(`/reviews/${id}`);
  }

  // Utilisateur
  async getUsers() {
    return this.get<AdminUser[]>('/users');
  }

  async updateUserRole(id: string, role: 'superAdmin' | 'admin' | 'user') {
    return this.patch(`/users/${id}/role`, { role });
  }

  async deleteUser(id: string) {
    return this.delete(`/users/${id}`)
  }

  // Réservations
  async getBookings() {
    return this.get<any[]>('/bookings');
  }
  async updateBookingStatus(id: string, status: 'confirmed' | 'cancelled') {
    return this.patch(`/bookings/${id}/status`, { status });
  }
  async deleteBooking(id: string) {
    return this.delete(`/bookings/${id}`);
  }
  async createBooking(booking: any) {
    return this.post('/bookings', booking);
  }

  // contacts
  async getContacts() {
    return this.get<ContactMessagesResponse>('/contacts/messages');
  }

  async createContact(contact: any) {
    return this.post('/contacts/messages', contact);
  }

  async updateContact(id: string, contact: any) {
    return this.put(`/contacts/${id}`, { data: contact });
  }

  async deleteContact(id: string) {
    return this.delete(`/contacts/${id}`);
  }
  // Upload de fichiers
  async uploadFile(file: File, endpoint: string = '/images/upload') {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

// Export d'une instance unique du service
export const apiService = new ApiService();
export default apiService;
