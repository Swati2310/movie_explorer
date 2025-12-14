// Simple authentication utilities
// In production, this would use a proper auth service

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export function hashPassword(password: string): string {
  // Simple hash function - in production, use bcrypt or similar
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

export function generateToken(userId: string): string {
  // Simple token generation - in production, use JWT
  const timestamp = Date.now();
  return btoa(`${userId}:${timestamp}`).replace(/[^a-zA-Z0-9]/g, '');
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem('movie_explorer_user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setStoredUser(user: User, token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('movie_explorer_user', JSON.stringify(user));
  localStorage.setItem('movie_explorer_token', token);
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('movie_explorer_user');
  localStorage.removeItem('movie_explorer_token');
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('movie_explorer_token');
}

export function isAuthenticated(): boolean {
  return getStoredUser() !== null && getStoredToken() !== null;
}


