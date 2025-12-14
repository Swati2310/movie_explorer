'use client';

import { Movie } from '@/types/movie';
import MovieCard from './MovieCard';
import { useState, useRef } from 'react';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export default function MovieCarousel({ title, movies, onMovieClick }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    setIsScrolling(true);
    const scrollAmount = scrollRef.current.offsetWidth * 0.8;
    const targetScroll = direction === 'left' 
      ? scrollRef.current.scrollLeft - scrollAmount
      : scrollRef.current.scrollLeft + scrollAmount;
    
    scrollRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
    
    setTimeout(() => setIsScrolling(false), 500);
  };

  if (movies.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={isScrolling}
            className="rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-lg transition-all hover:bg-white hover:scale-110 disabled:opacity-50 dark:bg-gray-800/90"
            aria-label="Scroll left"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={isScrolling}
            className="rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-lg transition-all hover:bg-white hover:scale-110 disabled:opacity-50 dark:bg-gray-800/90"
            aria-label="Scroll right"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-64 md:w-72">
            <MovieCard movie={movie} onClick={() => onMovieClick(movie)} />
          </div>
        ))}
      </div>
    </div>
  );
}

