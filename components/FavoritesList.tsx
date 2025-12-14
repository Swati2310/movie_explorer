'use client';

import { FavoriteMovie } from '@/types/movie';
import { getPosterUrl } from '@/lib/api';
import Image from 'next/image';
import { useState } from 'react';

interface FavoritesListProps {
  favorites: FavoriteMovie[];
  onMovieClick: (movie: FavoriteMovie) => void;
}

export default function FavoritesList({ favorites, onMovieClick }: FavoritesListProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (favorites.length === 0) {
    return (
      <div className="animate-fadeIn rounded-2xl bg-white/80 backdrop-blur-sm p-12 text-center shadow-xl dark:bg-gray-800/80">
        <div className="text-6xl mb-4">⭐</div>
        <p className="text-xl text-gray-600 dark:text-gray-400">No favorites yet.</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">Search for movies and add them to your favorites!</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Favorites
        </h2>
        <span className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1 text-lg font-bold text-white shadow-lg">
          {favorites.length}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((movie, index) => {
          const posterUrl = getPosterUrl(movie.poster_path, 'w200');
          const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
          const isHovered = hoveredId === movie.id;

          return (
            <div
              key={movie.id}
              onClick={() => onMovieClick(movie)}
              onMouseEnter={() => setHoveredId(movie.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ animationDelay: `${index * 50}ms` }}
              className="group animate-fadeIn cursor-pointer rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
            >
              <div className="relative h-64 w-full overflow-hidden rounded-t-xl">
                {movie.poster_path ? (
                  <>
                    <Image
                      src={posterUrl}
                      alt={movie.title}
                      fill
                      className={`object-cover transition-transform duration-500 ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                    <span className="text-gray-400">🎬 No Image</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-gray-900 shadow-lg">
                  ⭐ {movie.personalRating}/5
                </div>
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 line-clamp-1">
                  {movie.title}
                </h3>
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {year}
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-lg transition-all ${
                          movie.personalRating >= star
                            ? 'text-yellow-400 drop-shadow-lg'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                {movie.note && (
                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    <p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300 italic">
                      &quot;{movie.note}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

