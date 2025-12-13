'use client';

import { useState, useEffect } from 'react';
import { Movie, FavoriteMovie } from '@/types/movie';
import { searchMovies, getMovieDetails } from '@/lib/api';
import { getFavorites } from '@/lib/storage';
import MovieCard from '@/components/MovieCard';
import MovieDetailsModal from '@/components/MovieDetailsModal';
import FavoritesList from '@/components/FavoritesList';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'favorites'>('search');

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Movie Explorer</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Search movies and save your favorites</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex gap-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'search'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Search
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Favorites ({favorites.length})
          </button>
        </div>

        {activeTab === 'search' && (
          <div>
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a movie..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {searchResults.length > 0 && (
              <div>
                <h2 className="mb-4 text-2xl font-bold">Search Results ({searchResults.length})</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onClick={() => handleMovieClick(movie)} />
                  ))}
                </div>
              </div>
            )}

            {!isSearching && searchQuery && searchResults.length === 0 && !error && (
              <div className="rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-400">No results found. Try searching for a different movie.</p>
              </div>
            )}

            {!searchQuery && searchResults.length === 0 && (
              <div className="rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-400">Enter a movie title to start searching.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <FavoritesList favorites={favorites} onMovieClick={handleFavoriteClick} />
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
