import { FavoriteMovie } from '@/types/movie';
import { getStoredUser, isAuthenticated } from './auth';

const STORAGE_KEY_PREFIX = 'movie_explorer_favorites_';

function getStorageKey(): string | null {
  const user = getStoredUser();
  if (!user) {
    return null; // No storage key for guests
  }
  return `${STORAGE_KEY_PREFIX}${user.id}`;
}

export function getFavorites(): FavoriteMovie[] {
  if (typeof window === 'undefined') return [];
  
  // Only return favorites if user is authenticated
  if (!isAuthenticated()) {
    return [];
  }
  
  const storageKey = getStorageKey();
  if (!storageKey) return [];
  
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
}

export function saveFavorites(favorites: FavoriteMovie[]): boolean {
  if (typeof window === 'undefined') return false;
  
  // Only save if user is authenticated
  if (!isAuthenticated()) {
    return false;
  }
  
  const storageKey = getStorageKey();
  if (!storageKey) return false;
  
  try {
    localStorage.setItem(storageKey, JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
    return false;
  }
}

export function addFavorite(movie: FavoriteMovie): boolean {
  // Check authentication before adding
  if (!isAuthenticated()) {
    return false;
  }
  
  const favorites = getFavorites();
  const existingIndex = favorites.findIndex(f => f.id === movie.id);
  
  if (existingIndex >= 0) {
    favorites[existingIndex] = movie;
  } else {
    favorites.push(movie);
  }
  
  return saveFavorites(favorites);
}

export function removeFavorite(movieId: number): boolean {
  // Check authentication before removing
  if (!isAuthenticated()) {
    return false;
  }
  
  const favorites = getFavorites();
  const filtered = favorites.filter(f => f.id !== movieId);
  return saveFavorites(filtered);
}

export function isFavorite(movieId: number): boolean {
  // Only check if authenticated
  if (!isAuthenticated()) {
    return false;
  }
  
  const favorites = getFavorites();
  return favorites.some(f => f.id === movieId);
}

export function getFavorite(movieId: number): FavoriteMovie | undefined {
  // Only get if authenticated
  if (!isAuthenticated()) {
    return undefined;
  }
  
  const favorites = getFavorites();
  return favorites.find(f => f.id === movieId);
}
