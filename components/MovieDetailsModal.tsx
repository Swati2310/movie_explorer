'use client';

import { Movie, FavoriteMovie } from '@/types/movie';
import { getPosterUrl } from '@/lib/api';
import { addFavorite, removeFavorite, isFavorite, getFavorite } from '@/lib/storage';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onFavoriteChange?: () => void;
}

export default function MovieDetailsModal({ movie, onClose, onFavoriteChange }: MovieDetailsModalProps) {
  const [isFav, setIsFav] = useState(false);
  const [rating, setRating] = useState(3);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (movie) {
      const favorite = getFavorite(movie.id);
      setIsFav(isFavorite(movie.id));
      if (favorite) {
        setRating(favorite.personalRating);
        setNote(favorite.note);
      } else {
        setRating(3);
        setNote('');
      }
    }
  }, [movie]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && movie) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [movie, onClose]);

  if (!movie) return null;

  const handleToggleFavorite = () => {
    setIsSaving(true);
    if (isFav) {
      removeFavorite(movie.id);
      setIsFav(false);
      setNote('');
      setRating(3);
    } else {
      const favorite: FavoriteMovie = {
        ...movie,
        personalRating: rating,
        note: note,
      };
      addFavorite(favorite);
      setIsFav(true);
    }
    setIsSaving(false);
    onFavoriteChange?.();
  };

  const handleUpdateFavorite = () => {
    if (isFav) {
      setIsSaving(true);
      const favorite: FavoriteMovie = {
        ...movie,
        personalRating: rating,
        note: note,
      };
      addFavorite(favorite);
      setIsSaving(false);
      onFavoriteChange?.();
    }
  };

  const posterUrl = getPosterUrl(movie.poster_path, 'w500');
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-70"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="relative h-96 w-full md:h-auto md:w-1/3">
            {movie.poster_path ? (
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>

          <div className="flex-1 p-6">
            <h2 className="mb-2 text-3xl font-bold">{movie.title}</h2>
            <div className="mb-4 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>{year}</span>
              <span>•</span>
              <span>{runtime}</span>
              {movie.vote_average && (
                <>
                  <span>•</span>
                  <span>⭐ {movie.vote_average.toFixed(1)}</span>
                </>
              )}
            </div>

            <p className="mb-6 text-gray-700 dark:text-gray-300">{movie.overview || 'No overview available'}</p>

            <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">
                  {isFav ? 'Your Rating' : 'Add to Favorites'}
                </label>
                <div className="mb-4 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      disabled={isSaving}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{rating}/5</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Note (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onBlur={handleUpdateFavorite}
                  placeholder="Add a personal note..."
                  className="w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  disabled={isSaving}
                />
              </div>

              <button
                onClick={handleToggleFavorite}
                disabled={isSaving}
                className={`w-full rounded px-4 py-2 font-medium transition-colors ${
                  isFav
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } disabled:opacity-50`}
              >
                {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

