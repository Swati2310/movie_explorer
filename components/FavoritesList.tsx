'use client';

import { FavoriteMovie } from '@/types/movie';
import { getPosterUrl } from '@/lib/api';
import Image from 'next/image';

interface FavoritesListProps {
  favorites: FavoriteMovie[];
  onMovieClick: (movie: FavoriteMovie) => void;
}

export default function FavoritesList({ favorites, onMovieClick }: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">No favorites yet. Search for movies and add them to your favorites!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Favorites ({favorites.length})</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((movie) => {
          const posterUrl = getPosterUrl(movie.poster_path, 'w200');
          const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

          return (
            <div
              key={movie.id}
              onClick={() => onMovieClick(movie)}
              className="cursor-pointer rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-gray-800"
            >
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                {movie.poster_path ? (
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="mb-1 text-lg font-semibold line-clamp-1">{movie.title}</h3>
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{year}</p>
                <div className="mb-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${movie.personalRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                    {movie.personalRating}/5
                  </span>
                </div>
                {movie.note && (
                  <p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300 italic">
                    &quot;{movie.note}&quot;
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

