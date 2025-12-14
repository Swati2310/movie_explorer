'use client';

import { Movie } from '@/types/movie';
import { getPosterUrl } from '@/lib/api';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  featuredMovies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export default function HeroSection({ featuredMovies, onMovieClick }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || featuredMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredMovies.length, isAutoPlaying]);

  if (featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex];
  const backdropUrl = currentMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${currentMovie.backdrop_path}`
    : currentMovie.poster_path
    ? `https://image.tmdb.org/t/p/w1280${currentMovie.poster_path}`
    : '';

  return (
    <div
      className="relative h-[70vh] min-h-[500px] w-full overflow-hidden rounded-2xl mb-12"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Backdrop Image */}
      {backdropUrl ? (
        <div className="absolute inset-0">
          <Image
            src={backdropUrl}
            alt={currentMovie.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-8 md:p-12">
        <div className="max-w-2xl">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl drop-shadow-2xl">
            {currentMovie.title}
          </h1>
          <div className="mb-4 flex flex-wrap gap-4 text-white">
            {currentMovie.release_date && (
              <span className="text-lg">
                {new Date(currentMovie.release_date).getFullYear()}
              </span>
            )}
            {currentMovie.vote_average && (
              <span className="flex items-center gap-1 text-lg">
                <span className="text-yellow-400">⭐</span>
                {currentMovie.vote_average.toFixed(1)}
              </span>
            )}
            {currentMovie.runtime && (
              <span className="text-lg">{currentMovie.runtime} min</span>
            )}
          </div>
          <p className="mb-6 line-clamp-3 text-lg text-white drop-shadow-lg md:text-xl">
            {currentMovie.overview}
          </p>
          <button
            onClick={() => onMovieClick(currentMovie)}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:scale-105 hover:shadow-blue-500/50"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {featuredMovies.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {featuredMovies.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm p-3 text-white transition-all hover:bg-white/30 hover:scale-110"
            aria-label="Previous movie"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredMovies.length)}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm p-3 text-white transition-all hover:bg-white/30 hover:scale-110"
            aria-label="Next movie"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

