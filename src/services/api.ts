import api from "../utils/api";
import axios from "axios";
import type {
  Event,
  Teaching,
  AiInsights,
  KeyMoment,
  PrayerRequest,
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types";

const PUBLIC_API_BASE = "http://localhost:3000/api";

// Events API (Admin base: /api/admin)
export const eventsApi = {
  getAll: () => api.get<ApiResponse<Event[]>>("/events"),
  getById: (id: string) => api.get<ApiResponse<Event>>(`/events/${id}`),
  create: (event: Omit<Event, "id">) =>
    api.post<ApiResponse<Event>>("/events", event),
  update: (id: string, event: Partial<Event>) =>
    api.put<ApiResponse<Event>>(`/events/${id}`, event),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/events/${id}`),
};

// Teachings API (Admin base: /api/admin)
export const teachingsApi = {
  getAll: () => api.get<ApiResponse<Teaching[]>>("/teachings"),
  getById: (id: string) => api.get<ApiResponse<Teaching>>(`/teachings/${id}`),
  create: (teaching: Omit<Teaching, "id">) =>
    api.post<ApiResponse<Teaching>>("/teachings", teaching),
  update: (id: string, teaching: Partial<Teaching>) =>
    api.put<ApiResponse<Teaching>>(`/teachings/${id}`, teaching),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/teachings/${id}`),
  publish: (id: string) =>
    api.patch<ApiResponse<Teaching>>(`/teachings/${id}/publish`),
  unpublish: (id: string) =>
    api.patch<ApiResponse<Teaching>>(`/teachings/${id}/unpublish`),
  generateAi: (data: {
    title: string;
    description?: string;
    content?: string;
    author?: string;
    scripture?: string;
  }) =>
    api.post<ApiResponse<{ aiInsights: AiInsights; keyMoments: KeyMoment[] }>>(
      "/teachings/generate-ai",
      data
    ),
  generateAiForId: (id: string) =>
    api.post<ApiResponse<{ aiInsights: AiInsights; keyMoments: KeyMoment[] }>>(
      `/teachings/${id}/generate-ai`
    ),
};

// Prayers Moderation API
export const prayersApi = {
  getAll: () => axios.get<{ success: boolean; prayerRequests: PrayerRequest[] }>(`${PUBLIC_API_BASE}/prayers`),
};

// Games Analytics API
export const gamesApi = {
  getLeaderboard: () => axios.get<{ success: boolean; leaderboard: any[] }>(`${PUBLIC_API_BASE}/game-sessions/leaderboard`),
};

// Auth API (Admin base: /api/admin)
export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<ApiResponse<AuthResponse>>("/auth/login", credentials),
  register: (credentials: RegisterCredentials) =>
    api.post<ApiResponse<AuthResponse>>("/auth/register", credentials),
  logout: () => api.post<ApiResponse<void>>("/auth/logout"),
  verifyToken: () => api.get<ApiResponse<{ user: User }>>("/auth/verify"),
};

// File upload API
export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return axios.post<ApiResponse<{ url: string }>>(`${PUBLIC_API_BASE}/uploads/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadAudio: (file: File) => {
    const formData = new FormData();
    formData.append("audio", file);
    return axios.post<ApiResponse<{ url: string }>>(`${PUBLIC_API_BASE}/uploads/audio`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadVideo: (file: File) => {
    const formData = new FormData();
    formData.append("video", file);
    return api.post<ApiResponse<{ url: string }>>(
      "/uploads/video",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};
