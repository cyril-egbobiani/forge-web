import api from "../utils/api";
import type {
  Event,
  Teaching,
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types";

// Events API
export const eventsApi = {
  getAll: () => api.get<ApiResponse<Event[]>>("/events"),
  getById: (id: string) => api.get<ApiResponse<Event>>(`/events/${id}`),
  create: (event: Omit<Event, "id">) =>
    api.post<ApiResponse<Event>>("/events", event),
  update: (id: string, event: Partial<Event>) =>
    api.put<ApiResponse<Event>>(`/events/${id}`, event),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/events/${id}`),
};

// Teachings API
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
};

// Auth API
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
    return api.post<ApiResponse<{ url: string }>>("/uploads/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadAudio: (file: File) => {
    const formData = new FormData();
    formData.append("audio", file);
    return api.post<ApiResponse<{ url: string }>>("/uploads/audio", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadVideo: (file: File) => {
    const formData = new FormData();
    formData.append("video", file);
    return api.post<ApiResponse<{ url: string }>>(
      "/admin/uploads/video",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};
