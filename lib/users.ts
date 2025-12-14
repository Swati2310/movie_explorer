// User storage utilities
// In production, this would use a database

import { User } from './auth';

const USERS_STORAGE_KEY = 'movie_explorer_users';

export interface UserData extends User {
  passwordHash: string;
}

export function getUsers(): UserData[] {
  if (typeof window === 'undefined') return [];
  try {
    const usersStr = localStorage.getItem(USERS_STORAGE_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  } catch {
    return [];
  }
}

export function saveUsers(users: UserData[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function findUserByEmail(email: string): UserData | undefined {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(email: string, name: string, passwordHash: string): User {
  const users = getUsers();
  const newUser: UserData = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: email.toLowerCase(),
    name,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  saveUsers(users);
  
  const { passwordHash: _, ...user } = newUser;
  return user;
}

export function validateUser(email: string, passwordHash: string): User | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  
  if (user.passwordHash === passwordHash) {
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}

