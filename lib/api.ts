import { Movie, MovieSearchResult } from '@/types/movie';

export async function searchMovies(query: string): Promise<MovieSearchResult> {
  if (!query.trim()) {
    return { results: [], total_results: 0, total_pages: 0 };
  }

  const response = await fetch(`/api/movies?query=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    throw new Error('Failed to search movies');
  }

  return response.json();
}

export async function getMovieDetails(movieId: number): Promise<Movie> {
  const response = await fetch(`/api/movies?id=${movieId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch movie details');
  }

  return response.json();
}

export async function getMoviesByCategory(
  category: 'popular' | 'top_rated' | 'now_playing' | 'upcoming',
  page: number = 1
): Promise<MovieSearchResult> {
  const response = await fetch(`/api/movies?category=${category}&page=${page}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${category} movies`);
  }

  return response.json();
}

export function getPosterUrl(posterPath: string | null, size: 'w200' | 'w500' = 'w500'): string {
  if (!posterPath) {
    return '';
  }
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}

