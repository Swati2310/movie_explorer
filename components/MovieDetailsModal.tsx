'use client';

import { Movie, FavoriteMovie } from '@/types/movie';
import { getPosterUrl } from '@/lib/api';
import { addFavorite, removeFavorite, isFavorite, getFavorite } from '@/lib/storage';
import { useAuth } from '@/components/AuthProvider';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onFavoriteChange?: () => void;
}

export default function MovieDetailsModal({ movie, onClose, onFavoriteChange }: MovieDetailsModalProps) {
  const { isAuthenticated } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [rating, setRating] = useState(3);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (movie) {
      if (isAuthenticated) {
        const favorite = getFavorite(movie.id);
        setIsFav(isFavorite(movie.id));
        if (favorite) {
          setRating(favorite.personalRating);
          setNote(favorite.note);
        } else {
          setRating(3);
          setNote('');
        }
      } else {
        setIsFav(false);
        setRating(3);
        setNote('');
      }
    }
  }, [movie, isAuthenticated]);

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
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setIsSaving(true);
    if (isFav) {
      const success = removeFavorite(movie.id);
      if (success) {
        setIsFav(false);
        setNote('');
        setRating(3);
        onFavoriteChange?.();
      }
    } else {
      const favorite: FavoriteMovie = {
        ...movie,
        personalRating: rating,
        note: note,
      };
      const success = addFavorite(favorite);
      if (success) {
        setIsFav(true);
        onFavoriteChange?.();
      }
    }
    setIsSaving(false);
  };

  const handleUpdateFavorite = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (isFav) {
      setIsSaving(true);
      const favorite: FavoriteMovie = {
        ...movie,
        personalRating: rating,
        note: note,
      };
      const success = addFavorite(favorite);
      if (success) {
        onFavoriteChange?.();
      }
      setIsSaving(false);
    }
  };

  const posterUrl = getPosterUrl(movie.poster_path, 'w500');
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn" 
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl animate-scaleIn dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/70 backdrop-blur-sm p-3 text-white transition-all hover:bg-black/90 hover:scale-110"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="relative h-96 w-full overflow-hidden rounded-t-2xl md:h-auto md:w-1/3 md:rounded-l-2xl md:rounded-tr-none">
            {movie.poster_path ? (
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                <span className="text-4xl">🎬</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div className="flex-1 p-8">
            <h2 className="mb-3 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              {movie.title}
            </h2>
            <div className="mb-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                📅 {year}
              </span>
              <span className="rounded-full bg-purple-100 px-4 py-1 text-sm font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                ⏱️ {runtime}
              </span>
              {movie.vote_average && (
                <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm font-semibold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                  ⭐ {movie.vote_average.toFixed(1)}
                </span>
              )}
            </div>

            <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">{movie.overview || 'No overview available'}</p>

            <div className="border-t-2 border-gray-200 pt-8 dark:border-gray-700">
              {!isAuthenticated && (
                <div className="mb-6 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 p-4 dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-700">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔐</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">
                        Login Required
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Please create an account or login to save your favorite movies. Your favorites will be saved to your personal account.
                      </p>
                      <Link
                        href="/login"
                        onClick={onClose}
                        className="inline-block rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                      >
                        Login / Register
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {showLoginPrompt && (
                <div className="mb-6 animate-shake rounded-xl bg-red-50 border-2 border-red-200 p-4 dark:bg-red-900/20 dark:border-red-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚠️</span>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">
                        Please login to save favorites
                      </p>
                    </div>
                    <button
                      onClick={() => setShowLoginPrompt(false)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="mb-3 block text-lg font-semibold">
                  {isFav ? '⭐ Your Rating' : '⭐ Rate this Movie'}
                </label>
                <div className="mb-4 flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-4xl transition-all duration-200 hover:scale-125 ${
                        rating >= star ? 'text-yellow-400 drop-shadow-lg' : 'text-gray-300 hover:text-yellow-200'
                      }`}
                      disabled={isSaving || !isAuthenticated}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-4 text-xl font-bold text-gray-700 dark:text-gray-300">{rating}/5</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-3 block text-lg font-semibold">📝 Note (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onBlur={handleUpdateFavorite}
                  placeholder={isAuthenticated ? "Add a personal note about this movie..." : "Login to add notes..."}
                  className="w-full rounded-xl border-2 border-gray-300 bg-white/80 p-4 text-gray-700 shadow-lg transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700/80 dark:text-white disabled:opacity-50"
                  rows={4}
                  disabled={isSaving || !isAuthenticated}
                />
              </div>

              <button
                onClick={handleToggleFavorite}
                disabled={isSaving || !isAuthenticated}
                className={`w-full rounded-xl px-6 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 ${
                  isFav
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                }`}
              >
                {!isAuthenticated 
                  ? '🔐 Login to Add Favorites' 
                  : isFav 
                    ? '🗑️ Remove from Favorites' 
                    : '⭐ Add to Favorites'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

