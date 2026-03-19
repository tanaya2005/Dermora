import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SELLER" | "BUYER";
  profileImage?: string;
  emailVerified: boolean;
}

export interface AuthResponse {
  user: User;
  session: {
    id: string;
    expiresAt: string;
  };
}