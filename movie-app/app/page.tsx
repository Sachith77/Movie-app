'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import type { RootState } from '@/lib/store';
import type { MoviesState } from '@/lib/slices/moviesSlice';
import type { GenresState } from '@/lib/slices/genresSlice';
import type { Movie, Genre } from '@/lib/types';
import { fetchMoviesStart, fetchMoviesSuccess, fetchMoviesFailure } from '@/lib/slices/moviesSlice';
import { fetchGenresStart, fetchGenresSuccess, fetchGenresFailure } from '@/lib/slices/genresSlice';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import Slider from 'react-slick';

export default function Home() {
  const dispatch = useAppDispatch();
  const moviesState = useAppSelector((state: RootState) => state.movies) as MoviesState;
  const genresState = useAppSelector((state: RootState) => state.genres) as GenresState;
  const { movies, isLoading, error } = moviesState;
  const { genres } = genresState;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    // Fetch movies
    const fetchMovies = async () => {
      dispatch(fetchMoviesStart());
      try {
        const params = new URLSearchParams();
        if (selectedGenre) params.append('genre', selectedGenre);

        const response = await fetch(`/api/movies?${params}`);
        const data = await response.json();
        if (response.ok) {
          dispatch(fetchMoviesSuccess(data));
        } else {
          dispatch(fetchMoviesFailure(data.error));
        }
      } catch (err) {
        console.error('Fetch movies error:', err);
        dispatch(fetchMoviesFailure('Failed to fetch movies'));
      }
    };

    // Fetch genres
    const fetchGenres = async () => {
      dispatch(fetchGenresStart());
      try {
        const response = await fetch('/api/genres');
        const data = await response.json();
        if (response.ok) {
          dispatch(fetchGenresSuccess(data));
        } else {
          dispatch(fetchGenresFailure(data.error));
        }
      } catch (err) {
        console.error('Fetch genres error:', err);
        dispatch(fetchGenresFailure('Failed to fetch genres'));
      }
    };

    fetchMovies();
    fetchGenres();
  }, [dispatch, selectedGenre]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredMovies = movies.filter((movie: Movie) => {
    const title = movie?.title ?? '';
    return title.toLowerCase().includes(normalizedSearch);
  });

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Discover Amazing Movies
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our vast collection of movies, read reviews, and share your thoughts with the community.
          </p>
        </section>

        {/* Search and Filter */}
        <section className="mb-8">
          <div className="glass rounded-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:w-48">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Genres</option>
                  {genres.map((genre: Genre) => (
                    <option key={genre._id} value={genre._id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Movies */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Movies</h2>
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <Slider {...sliderSettings} className="mb-8">
              {movies.slice(0, 10).map((movie: Movie) => (
                <div key={movie._id} className="px-2">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </Slider>
          )}
        </section>

        {/* All Movies Grid */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">All Movies</h2>
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMovies.map((movie: Movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
