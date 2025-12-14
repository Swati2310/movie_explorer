'use client';

import { useState, useEffect } from 'react';
import { Movie, FavoriteMovie } from '@/types/movie';
import { searchMovies, getMovieDetails, getMoviesByCategory } from '@/lib/api';
import { getFavorites } from '@/lib/storage';
import { useAuth } from '@/components/AuthProvider';
import MovieCard from '@/components/MovieCard';
import MovieDetailsModal from '@/components/MovieDetailsModal';
import FavoritesList from '@/components/FavoritesList';
import HeroSection from '@/components/HeroSection';
import MovieCarousel from '@/components/MovieCarousel';
import Link from 'next/link';

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'search' | 'favorites'>('dashboard');
  
  // Dashboard state
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

  useEffect(() => {
    setFavorites(getFavorites());
  }, [user]); // Refresh favorites when user changes

  // Load dashboard data
  useEffect(() => {
    const loadDashboard = async () => {
      if (activeTab !== 'dashboard') return;
      
      setIsLoadingDashboard(true);
      try {
        const [popular, topRated, nowPlaying, upcoming] = await Promise.all([
          getMoviesByCategory('popular'),
          getMoviesByCategory('top_rated'),
          getMoviesByCategory('now_playing'),
          getMoviesByCategory('upcoming'),
        ]);

        setPopularMovies(popular.results || []);
        setTopRatedMovies(topRated.results || []);
        setNowPlayingMovies(nowPlaying.results || []);
        setUpcomingMovies(upcoming.results || []);
        
        // Set featured movies (top 5 from popular)
        setFeaturedMovies((popular.results || []).slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError('Failed to load movies. Please try again.');
      } finally {
        setIsLoadingDashboard(false);
      }
    };

    loadDashboard();
  }, [activeTab]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const data = await searchMovies(searchQuery);
      setSearchResults(data.results || []);
      if (data.results?.length === 0) {
        setError('No movies found. Try a different search term.');
      }
    } catch (err) {
      setError('Failed to search movies. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMovieClick = async (movie: Movie) => {
    try {
      const details = await getMovieDetails(movie.id);
      setSelectedMovie(details);
    } catch (err) {
      setError('Failed to load movie details. Please try again.');
    }
  };

  const handleFavoriteClick = async (movie: FavoriteMovie) => {
    try {
      const details = await getMovieDetails(movie.id);
      setSelectedMovie(details);
    } catch (err) {
      setError('Failed to load movie details. Please try again.');
    }
  };

  const handleFavoriteChange = () => {
    setFavorites(getFavorites());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <header className="bg-white/80 backdrop-blur-md shadow-lg dark:bg-gray-800/80 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎬</div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                  Movie Explorer
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {isAuthenticated ? `Welcome back, ${user?.name}!` : 'Discover and save your favorite movies'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!isAuthenticated && (
          <div className="mb-6 animate-fadeIn rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Create an account to save your favorites!
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your movie preferences will be saved to your personal account.
                  </p>
                </div>
              </div>
              <Link
                href="/login"
                className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl whitespace-nowrap"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        )}
        
        <div className="mb-8 flex gap-2 rounded-xl bg-white/60 backdrop-blur-sm p-1 shadow-lg dark:bg-gray-800/60">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 rounded-lg px-6 py-3 font-semibold transition-all duration-300 ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            🎬 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 rounded-lg px-6 py-3 font-semibold transition-all duration-300 ${
              activeTab === 'search'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            🔍 Search
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 rounded-lg px-6 py-3 font-semibold transition-all duration-300 ${
              activeTab === 'favorites'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            ⭐ Favorites {favorites.length > 0 && `(${favorites.length})`}
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="animate-fadeIn">
            {isLoadingDashboard ? (
              <div className="flex h-96 items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <>
                <HeroSection 
                  featuredMovies={featuredMovies} 
                  onMovieClick={handleMovieClick}
                />
                
                <div className="space-y-8">
                  <MovieCarousel
                    title="🔥 Popular Now"
                    movies={popularMovies}
                    onMovieClick={handleMovieClick}
                  />
                  
                  <MovieCarousel
                    title="⭐ Top Rated"
                    movies={topRatedMovies}
                    onMovieClick={handleMovieClick}
                  />
                  
                  <MovieCarousel
                    title="🎬 Now Playing"
                    movies={nowPlayingMovies}
                    onMovieClick={handleMovieClick}
                  />
                  
                  <MovieCarousel
                    title="📅 Coming Soon"
                    movies={upcomingMovies}
                    onMovieClick={handleMovieClick}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="animate-fadeIn">
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a movie... (e.g., Inception, The Matrix)"
                    className="w-full rounded-xl border-2 border-gray-200 bg-white/80 px-12 py-4 text-lg shadow-lg transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800/80 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSearching ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Searching...
                    </span>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mb-6 animate-shake rounded-xl bg-red-50 p-4 text-red-800 shadow-lg dark:bg-red-900/20 dark:text-red-400">
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {isSearching && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse rounded-xl bg-white shadow-lg dark:bg-gray-800">
                    <div className="h-80 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-5">
                      <div className="mb-2 h-6 rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="animate-fadeIn">
                <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                  Search Results <span className="text-blue-600 dark:text-blue-400">({searchResults.length})</span>
                </h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((movie, index) => (
                    <div key={movie.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fadeIn">
                      <MovieCard movie={movie} onClick={() => handleMovieClick(movie)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isSearching && searchQuery && searchResults.length === 0 && !error && (
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-12 text-center shadow-xl dark:bg-gray-800/80">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl text-gray-600 dark:text-gray-400">No results found. Try searching for a different movie.</p>
              </div>
            )}

            {!searchQuery && searchResults.length === 0 && !isSearching && (
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-12 text-center shadow-xl dark:bg-gray-800/80">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-xl text-gray-600 dark:text-gray-400">Enter a movie title to start searching.</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">Try searching for popular movies like "Inception", "The Matrix", or "Avatar"</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="animate-fadeIn">
            {!isAuthenticated ? (
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-12 text-center shadow-xl dark:bg-gray-800/80">
                <div className="text-6xl mb-4">🔐</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Login Required
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Please create an account or login to view and manage your favorite movies.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                  Your favorites will be saved to your personal account and accessible from any device.
                </p>
                <Link
                  href="/login"
                  className="inline-block rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  Login / Register Now
                </Link>
              </div>
            ) : (
              <FavoritesList favorites={favorites} onMovieClick={handleFavoriteClick} />
            )}
          </div>
        )}

        {selectedMovie && (
          <MovieDetailsModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            onFavoriteChange={handleFavoriteChange}
          />
        )}
      </main>
    </div>
  );
}
