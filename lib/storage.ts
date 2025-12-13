import { FavoriteMovie } from '@/types/movie';

const STORAGE_KEY = 'movie_explorer_favorites';

export function getFavorites(): FavoriteMovie[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
}

export function saveFavorites(favorites: FavoriteMovie[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
}

export function addFavorite(movie: FavoriteMovie): void {
  const favorites = getFavorites();
  const existingIndex = favorites.findIndex(f => f.id === movie.id);
  
  if (existingIndex >= 0) {
    favorites[existingIndex] = movie;
  } else {
    favorites.push(movie);
  }
  
  saveFavorites(favorites);
}

export function removeFavorite(movieId: number): void {
  const favorites = getFavorites();
  const filtered = favorites.filter(f => f.id !== movieId);
  saveFavorites(filtered);
}

export function isFavorite(movieId: number): boolean {
  const favorites = getFavorites();
  return favorites.some(f => f.id === movieId);
}

export function getFavorite(movieId: number): FavoriteMovie | undefined {
  const favorites = getFavorites();
  return favorites.find(f => f.id === movieId);
}

