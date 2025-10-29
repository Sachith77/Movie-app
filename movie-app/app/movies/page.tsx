'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { fetchMoviesFailure, fetchMoviesStart, fetchMoviesSuccess } from '@/lib/slices/moviesSlice';
import { fetchGenresFailure, fetchGenresStart, fetchGenresSuccess } from '@/lib/slices/genresSlice';
import type { Genre, Movie } from '@/lib/types';
import type { RootState } from '@/lib/store';
import type { MoviesState } from '@/lib/slices/moviesSlice';
import type { GenresState } from '@/lib/slices/genresSlice';

const sortOptions = [
  { value: 'featured', label: 'Featured Picks' },
  { value: 'latest', label: 'Release Year (Newest)' },
  { value: 'oldest', label: 'Release Year (Oldest)' },
  { value: 'az', label: 'Title A → Z' },
  { value: 'za', label: 'Title Z → A' },
];

export default function MoviesPage() {
  const dispatch = useAppDispatch();
  const moviesState = useAppSelector((state: RootState) => state.movies) as MoviesState;
  const genresState = useAppSelector((state: RootState) => state.genres) as GenresState;
  const { movies, isLoading, error } = moviesState;
  const { genres } = genresState;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const fetchMovies = async () => {
      dispatch(fetchMoviesStart());
      try {
        const params = new URLSearchParams({ limit: '120' });
        if (selectedGenre) params.append('genre', selectedGenre);

        const response = await fetch(`/api/movies?${params}`);
        const data = await response.json();
        if (response.ok) {
          dispatch(fetchMoviesSuccess(data));
        } else {
          dispatch(fetchMoviesFailure(data.error));
        }
      } catch (error) {
        console.error('Fetch movies error:', error);
        dispatch(fetchMoviesFailure('Failed to fetch movies'));
      }
    };

    const fetchAllGenres = async () => {
      dispatch(fetchGenresStart());
      try {
        const response = await fetch('/api/genres');
        const data = await response.json();
        if (response.ok) {
          dispatch(fetchGenresSuccess(data));
        } else {
          dispatch(fetchGenresFailure(data.error));
        }
      } catch (error) {
        console.error('Fetch genres error:', error);
        dispatch(fetchGenresFailure('Failed to fetch genres'));
      }
    };

    fetchMovies();
    if (!genres.length) {
      fetchAllGenres();
    }
  }, [dispatch, selectedGenre, genres.length]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setVisibleCount(12);
  }, []);

  const handleGenreChange = useCallback((value: string) => {
    setSelectedGenre(value);
    setVisibleCount(12);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortOption(value);
    setVisibleCount(12);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedGenre('');
    setSortOption('featured');
    setVisibleCount(12);
  }, []);

  const filteredMovies = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = movies.filter((movie: Movie) => {
      const title = typeof movie.title === 'string' ? movie.title : '';
      const genresList = Array.isArray(movie.genres) ? movie.genres : [];

      const matchesSearch = title.toLowerCase().includes(normalizedSearch);
      const matchesGenre = selectedGenre
        ? genresList.some((genre) => genre._id === selectedGenre)
        : true;

      return matchesSearch && matchesGenre;
    });

    return filtered.sort((a: Movie, b: Movie) => {
      const titleA = typeof a.title === 'string' ? a.title : '';
      const titleB = typeof b.title === 'string' ? b.title : '';
      switch (sortOption) {
        case 'latest':
          return b.year - a.year;
        case 'oldest':
          return a.year - b.year;
        case 'az':
          return titleA.localeCompare(titleB);
        case 'za':
          return titleB.localeCompare(titleA);
        default:
          return 0;
      }
    });
  }, [movies, searchTerm, selectedGenre, sortOption]);

  const visibleMovies = filteredMovies.slice(0, visibleCount);
  const selectedGenreLabel = genres.find((genre: Genre) => genre._id === selectedGenre)?.name;

  const heroMovie = movies[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-12 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-blue-900/40 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_60%)]" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium tracking-wide text-indigo-200">
                🎬  Explore the universe of cinema
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
                Dive into curated collections, new releases, and timeless classics.
              </h1>
              <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
                Filter by genre, search for your favorites, and sort through hundreds of titles. Every movie here comes with richly detailed profiles, cast lists, and community reviews.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    handleGenreChange('');
                    handleSearchChange('');
                    handleSortChange('latest');
                  }}
                  className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-1 hover:bg-blue-400"
                  type="button"
                >
                  Show me what’s new
                </button>
                <button
                  onClick={() => handleSortChange('az')}
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:-translate-y-1 hover:border-white/40 hover:text-white"
                  type="button"
                >
                  Browse alphabetically
                </button>
              </div>
            </div>

            {heroMovie && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 p-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-blue-200">Spotlight</div>
                  <h2 className="text-2xl font-semibold text-blue-100">{heroMovie.title}</h2>
                  <p className="line-clamp-3 text-sm text-slate-300">{heroMovie.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {heroMovie.genres.slice(0, 3).map((genre: Genre) => (
                      <span
                        key={genre._id}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-400">
                    Starring {heroMovie.cast.slice(0, 3).join(', ')}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-50">Browse the catalogue</h2>
                <p className="text-sm text-slate-300">
                  {filteredMovies.length} titles {selectedGenreLabel ? `in ${selectedGenreLabel}` : ''} • {movies.length} total movies in the library
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <input
                  type="search"
                  placeholder="Search by title, keyword, or actor…"
                  value={searchTerm}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                />
                <select
                  value={selectedGenre}
                  onChange={(event) => handleGenreChange(event.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                >
                  <option value="">All genres</option>
                  {genres.map((genre: Genre) => (
                    <option key={genre._id} value={genre._id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
                <select
                  value={sortOption}
                  onChange={(event) => handleSortChange(event.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleResetFilters}
                  className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-blue-400 hover:text-blue-200"
                  type="button"
                >
                  Reset filters
                </button>
              </div>
            </div>

            {selectedGenreLabel && (
              <div className="flex items-center gap-2 text-sm text-blue-200">
                <span className="rounded-full bg-blue-500/20 px-3 py-1">{selectedGenreLabel}</span>
                <button
                  onClick={() => handleGenreChange('')}
                  className="text-xs uppercase tracking-wide text-slate-200/70 hover:text-white"
                  type="button"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="mt-10">
          {isLoading ? (
            <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-slate-200">
              Loading cinematic gems…
            </div>
          ) : error ? (
            <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-red-500/30 bg-red-500/10 text-red-200">
              {error}
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                <motion.div
                  layout
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {visibleMovies.map((movie: Movie) => (
                    <motion.div
                      layout
                      key={movie._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <MovieCard movie={movie} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {filteredMovies.length === 0 && (
                <div className="mt-12 rounded-3xl border border-dashed border-white/20 bg-white/5 p-12 text-center text-slate-300">
                  We couldn’t find a match for that search. Try adjusting your filters or exploring another genre.
                </div>
              )}

              {filteredMovies.length > visibleCount && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="rounded-full bg-blue-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-1 hover:bg-blue-400"
                    type="button"
                  >
                    Load more titles
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
