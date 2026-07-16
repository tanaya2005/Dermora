import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || (typeof window !== "undefined" ? window.location.origin : ""),
});

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: "ADMIN" | "SELLER" | "BUYER" | "DERMATOLOGIST";
  profileImage?: string;
  emailVerified: boolean;
  skinProfile?: {
    skinType?: string;
    skinConcerns?: string[];
    budget?: string;
    preferredCategories?: string[];
    assessmentCompleted: boolean;
    completedAt?: string;
  };
}

export interface AuthResponse {
  user: User;
  session: {
    id: string;
    expiresAt: string;
  };
}