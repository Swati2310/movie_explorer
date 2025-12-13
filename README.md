# Movie Explorer

A modern web application for searching movies, viewing details, and managing favorites with personal ratings and notes. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Search Movies**: Search for movies by title using the TMDB API
- **View Details**: Click on any movie to see detailed information including poster, overview, release date, and runtime
- **Favorites Management**: Add movies to your favorites list
- **Personal Ratings**: Rate your favorite movies from 1-5 stars
- **Personal Notes**: Add optional notes to your favorite movies
- **Persistence**: Favorites are saved to LocalStorage and persist across page refreshes
- **Error Handling**: Graceful handling of API errors, network issues, and empty states

## Setup & Run Instructions

### Prerequisites

- Node.js 18+ (20.9.0+ recommended)
- npm, yarn, pnpm, or bun
- TMDB API key (free at https://www.themoviedb.org/settings/api)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movie_explorer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

4. Add your TMDB API key to `.env.local`:
```
TMDB_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Hosted App

[Deploy to Vercel](https://vercel.com) for a public link. The app is configured for easy deployment on Vercel.

## Technical Decisions & Tradeoffs

### API Proxy
- **Decision**: Created a Next.js API route (`/api/movies`) to proxy requests to TMDB
- **Rationale**: Keeps the API key server-side, preventing exposure in the browser. This is a security best practice and prevents API key abuse.
- **Tradeoff**: Adds a server-side dependency, but Next.js handles this seamlessly with API routes.

### State Management
- **Decision**: Used React's built-in `useState` and `useEffect` hooks
- **Rationale**: For a prototype of this scope, React's built-in state management is sufficient. No need for Redux, Zustand, or other state libraries.
- **Tradeoff**: If the app grows significantly, we might need more sophisticated state management, but for now, simplicity wins.

### Persistence Choice
- **Decision**: Implemented LocalStorage for favorites persistence
- **Rationale**: 
  - Meets the baseline requirement
  - No backend infrastructure needed
  - Fast and simple for client-side data
  - Works offline
- **Tradeoff**: 
  - Data is device/browser-specific (not synced across devices)
  - Limited storage capacity (~5-10MB)
  - No server-side backup
- **Future Enhancement**: Could add server-side persistence using a lightweight database (e.g., SQLite, PostgreSQL) with API routes for sync across devices.

### Component Structure
- **Decision**: Created separate components for `MovieCard`, `MovieDetailsModal`, and `FavoritesList`
- **Rationale**: Separation of concerns, reusability, and easier testing/maintenance
- **Tradeoff**: Slightly more files, but better organization and maintainability

### Error Handling
- **Decision**: Implemented try-catch blocks and user-friendly error messages
- **Rationale**: Better user experience when things go wrong (network issues, API errors, etc.)
- **Tradeoff**: Added complexity, but essential for production-ready apps

### UI Framework
- **Decision**: Used Tailwind CSS for styling
- **Rationale**: 
  - Fast development with utility classes
  - Consistent design system
  - Dark mode support built-in
  - No need for separate CSS files
- **Tradeoff**: Larger bundle size, but Next.js optimizes this well

## Known Limitations & Future Improvements

### Current Limitations

1. **No Server-Side Persistence**: Favorites are only stored in LocalStorage, so they don't sync across devices
2. **No User Authentication**: All users share the same LocalStorage (though in practice, each browser/device has its own)
3. **Limited Search Features**: Only title search is supported; no filtering by genre, year, etc.
4. **No Pagination**: Search results show all results from the first page only
5. **No Movie Recommendations**: No "similar movies" or recommendation features
6. **Basic Error Handling**: While errors are handled, there's no retry mechanism or detailed error logging

### What I'd Improve with More Time

1. **Server-Side Persistence**: 
   - Add API routes for favorites CRUD operations
   - Use a lightweight database (PostgreSQL or SQLite)
   - Implement user authentication (NextAuth.js)
   - Enable favorites sync across devices

2. **Enhanced Search**:
   - Add pagination for search results
   - Filter by genre, year, rating
   - Sort options (by date, popularity, rating)
   - Search history

3. **Better UX**:
   - Loading skeletons instead of "Searching..." text
   - Infinite scroll for search results
   - Keyboard shortcuts (ESC to close modal)
   - Toast notifications for favorite actions
   - Optimistic UI updates

4. **Performance**:
   - Image optimization with Next.js Image component (already implemented)
   - Debounce search input
   - Cache API responses
   - Service worker for offline support

5. **Testing**:
   - Unit tests for utility functions
   - Integration tests for API routes
   - E2E tests for critical user flows

6. **Accessibility**:
   - ARIA labels
   - Keyboard navigation improvements
   - Screen reader support
   - Focus management

7. **Additional Features**:
   - Movie watchlist (separate from favorites)
   - Export favorites to CSV/JSON
   - Share favorites list
   - Movie recommendations based on favorites

## Project Structure

```
movie_explorer/
├── app/
│   ├── api/
│   │   └── movies/
│   │       └── route.ts          # TMDB API proxy
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main page with search & favorites
│   └── globals.css               # Global styles
├── components/
│   ├── MovieCard.tsx            # Movie card component
│   ├── MovieDetailsModal.tsx    # Movie details modal
│   └── FavoritesList.tsx        # Favorites list component
├── lib/
│   ├── api.ts                   # API client functions
│   └── storage.ts               # LocalStorage utilities
├── types/
│   └── movie.ts                 # TypeScript type definitions
└── public/                      # Static assets
```

## License

This project is a take-home assignment and is for demonstration purposes.
