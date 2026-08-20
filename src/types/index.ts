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

export interface KeyMoment {
  timestamp: string;
  seconds: number;
  title: string;
  subtitle?: string;
  scripture?: string;
  takeaway?: string;
}

export interface ScriptureReference {
  reference: string;
  context?: string;
  greekExegesis?: string;
}

export interface AiInsights {
  coreThesis?: string;
  theologicalContext?: string;
  scriptureReferences?: ScriptureReference[];
  reflectionPrompts?: string[];
  generatedAt?: string;
}

export interface Teaching {
  id?: string;
  title: string;
  description: string;
  content: string;
  author: string;
  scripture?: string;
  category: "sermon" | "devotional" | "study" | "testimony" | "other";
  tags: string[];
  thumbnailUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  aiInsights?: AiInsights;
  keyMoments?: KeyMoment[];
  isPublished: boolean;
  publishDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrayerRequest {
  _id: string;
  title: string;
  description: string;
  category: string;
  isAnonymous: boolean;
  authorName?: string;
  status: "active" | "answered" | "archived";
  prayerCount: number;
  createdAt: string;
}

export interface GameSession {
  _id: string;
  username: string;
  gameType: string;
  score: number;
  scorePercentage: number;
  timeTaken: number;
  createdAt: string;
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
