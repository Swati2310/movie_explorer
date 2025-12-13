export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  runtime?: number;
  vote_average?: number;
}

export interface MovieSearchResult {
  results: Movie[];
  total_results: number;
  total_pages: number;
}

export interface FavoriteMovie extends Movie {
  personalRating: number;
  note: string;
}

