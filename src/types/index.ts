export interface Event {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl?: string;
  category: "service" | "fellowship" | "conference" | "outreach" | "other";
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Teaching {
  id?: string;
  title: string;
  description: string;
  content: string;
  speaker: {
    name: string;
    profilePicture?: string;
  };
  scripture?: string;
  category: "sermon" | "devotional" | "study" | "testimony" | "other";
  tags: string[];
  thumbnailUrl?: string; // Changed from imageUrl
  videoUrl?: string;
  audioUrl?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  isPublished: boolean;
  publishDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "super_admin";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
}
