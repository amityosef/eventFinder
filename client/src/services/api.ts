import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';
import {
  Venue,
  VenuesResponse,
  LeadsResponse,
  Availability,
  AvailabilityStatus,
  AuthResponse,
  CreateLeadPayload,
  UpdateLeadPayload,
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('VITE_API_URL is required');
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const refreshToken = useAuthStore.getState().refreshToken;
          if (refreshToken) {
            try {
              const response = await axios.post(`${API_URL}/auth/refresh`, null, {
                headers: { Authorization: `Bearer ${refreshToken}` },
              });

              const { accessToken, refreshToken: newRefreshToken } = response.data.data;
              useAuthStore.getState().setTokens(accessToken, newRefreshToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            } catch {
              useAuthStore.getState().logout();
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await this.client.post('/auth/login', data);
    return response.data.data;
  }

  async register(data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: string;
  }): Promise<AuthResponse> {
    const response = await this.client.post('/auth/register', data);
    return response.data.data;
  }

  async loginWithGoogleToken(credential: string): Promise<AuthResponse> {
    const response = await this.client.post('/auth/google/token', { credential });
    return response.data.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }

  async getMe() {
    const response = await this.client.get('/users/me');
    return response.data.data;
  }

  // Venues
  async getVenues(params?: Record<string, unknown>): Promise<VenuesResponse> {
    const response = await this.client.get('/venues', { params });
    return response.data.data;
  }

  async getVenue(id: string): Promise<Venue> {
    const response = await this.client.get(`/venues/${id}`);
    return response.data.data;
  }

  async createVenue(data: Record<string, unknown>): Promise<Venue> {
    const response = await this.client.post('/venues', data);
    return response.data.data;
  }

  async updateVenue(id: string, data: Record<string, unknown>): Promise<Venue> {
    const response = await this.client.put(`/venues/${id}`, data);
    return response.data.data;
  }

  async deleteVenue(id: string): Promise<void> {
    await this.client.delete(`/venues/${id}`);
  }

  // Availability
  async getAvailability(
    venueId: string,
    params?: { startDate?: string; endDate?: string }
  ): Promise<Availability[]> {
    const response = await this.client.get(`/availability/venue/${venueId}`, { params });
    return response.data.data;
  }

  async updateAvailability(
    venueId: string,
    data: { date: string; status: AvailabilityStatus; notes?: string }
  ): Promise<Availability> {
    const isAvailable = data.status === 'available';
    const response = await this.client.post('/availability', {
      venueId,
      date: data.date,
      slot: 'fullDay',
      isAvailable,
      status: data.status,
      notes: data.notes,
    });
    return response.data.data;
  }

  // Leads
  async createLead(data: CreateLeadPayload) {
    const response = await this.client.post('/leads', data);
    return response.data.data;
  }

  async getLeads(params?: Record<string, unknown>): Promise<LeadsResponse> {
    const response = await this.client.get('/leads', { params });
    return response.data.data;
  }

  async updateLead(id: string, data: UpdateLeadPayload) {
    const response = await this.client.put(`/leads/${id}`, data);
    return response.data.data;
  }

  // AI Search
  async aiSearch(query: string) {
    const response = await this.client.post('/ai/search', { query });
    return response.data.data;
  }

  // Upload
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.client.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  async uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const response = await this.client.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }
}

export const api = new ApiService();
