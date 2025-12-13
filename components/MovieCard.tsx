'use client';

import { Movie } from '@/types/movie';
import { getPosterUrl } from '@/lib/api';
import Image from 'next/image';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.poster_path, 'w200');
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-gray-800"
    >
      <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
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
        <h3 className="mb-1 text-lg font-semibold line-clamp-2">{movie.title}</h3>
        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{year}</p>
        <p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
          {movie.overview || 'No description available'}
        </p>
      </div>
    </div>
  );
}

