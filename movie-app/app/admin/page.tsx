'use client';

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import type { RootState } from '@/lib/store';
import {
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchMoviesFailure,
  createMovieStart,
  createMovieSuccess,
  createMovieFailure,
  updateMovieStart,
  updateMovieSuccess,
  updateMovieFailure,
  deleteMovieStart,
  deleteMovieSuccess,
  deleteMovieFailure,
  type Movie,
  type MoviesState,
} from '@/lib/slices/moviesSlice';
import {
  fetchGenresStart,
  fetchGenresSuccess,
  fetchGenresFailure,
  type GenresState,
} from '@/lib/slices/genresSlice';

interface MovieFormState {
  title: string;
  year: string;
  description: string;
  poster: string;
  genres: string[];
  cast: string;
}

const initialFormState: MovieFormState = {
  title: '',
  year: new Date().getFullYear().toString(),
  description: '',
  poster: '',
  genres: [],
  cast: '',
};

export default function AdminDashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const moviesState = useAppSelector((state: RootState) => state.movies) as MoviesState;
  const genresState = useAppSelector((state: RootState) => state.genres) as GenresState;
  const { movies, isLoading: moviesLoading } = moviesState;
  const { genres } = genresState;

  const [formState, setFormState] = useState<MovieFormState>(initialFormState);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingMovieId, setDeletingMovieId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }

    if (!user.isAdmin) {
      router.replace('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (!user?.isAdmin) {
      return;
    }

    const loadMovies = async () => {
      dispatch(fetchMoviesStart());
      try {
        const response = await fetch('/api/movies?limit=200');
        const data = await response.json();
        if (response.ok) {
          dispatch(fetchMoviesSuccess(data));
        } else {
          dispatch(fetchMoviesFailure(data.error || 'Failed to fetch movies'));
          toast.error(data.error || 'Failed to fetch movies');
        }
      } catch (error) {
        console.error('Admin fetch movies error:', error);
        dispatch(fetchMoviesFailure('Failed to fetch movies'));
        toast.error('Failed to fetch movies');
      }
    };

    loadMovies();
  }, [dispatch, user]);

  useEffect(() => {
    if (!user?.isAdmin || genres.length) {
      return;
    }

    const loadGenres = async () => {
      dispatch(fetchGenresStart());
      try {
        const response = await fetch('/api/genres');
        const data = await response.json();
        if (response.ok) {
          dispatch(fetchGenresSuccess(data));
        } else {
          dispatch(fetchGenresFailure(data.error || 'Failed to fetch genres'));
          toast.error(data.error || 'Failed to fetch genres');
        }
      } catch (error) {
        console.error('Admin fetch genres error:', error);
        dispatch(fetchGenresFailure('Failed to fetch genres'));
        toast.error('Failed to fetch genres');
      }
    };

    loadGenres();
  }, [dispatch, user, genres.length]);

  const sortedMovies = useMemo(() => {
    return [...movies].sort((a, b) => a.title.localeCompare(b.title));
  }, [movies]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenresChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(event.target.selectedOptions).map((option) => option.value);
    setFormState((prev) => ({ ...prev, genres: values }));
  };

  const resetForm = () => {
    setFormState(initialFormState);
    setEditingMovieId(null);
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovieId(movie._id);
    setFormState({
      title: movie.title,
      year: movie.year.toString(),
      description: movie.description,
      poster: movie.poster,
      genres: movie.genres.map((genre) => genre._id),
      cast: movie.cast.join(', '),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.title.trim() || !formState.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    if (!formState.poster.trim()) {
      toast.error('Poster URL is required');
      return;
    }

    if (!formState.genres.length) {
      toast.error('Select at least one genre');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in again');
      router.push('/login');
      return;
    }

    const payload = {
      title: formState.title.trim(),
      year: Number(formState.year) || new Date().getFullYear(),
      description: formState.description.trim(),
      poster: formState.poster.trim(),
      genres: formState.genres,
      cast: formState.cast
        .split(',')
        .map((actor) => actor.trim())
        .filter(Boolean),
    };

    setIsSubmitting(true);

    if (editingMovieId) {
      dispatch(updateMovieStart());
    } else {
      dispatch(createMovieStart());
    }

    try {
      const response = await fetch(editingMovieId ? `/api/movies/${editingMovieId}` : '/api/movies', {
        method: editingMovieId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (editingMovieId) {
          dispatch(updateMovieSuccess(data));
          toast.success('Movie updated successfully');
        } else {
          dispatch(createMovieSuccess(data));
          toast.success('Movie created successfully');
        }
        resetForm();
      } else {
        const message = data.error || 'Request failed';
        if (editingMovieId) {
          dispatch(updateMovieFailure(message));
        } else {
          dispatch(createMovieFailure(message));
        }
        toast.error(message);
      }
    } catch (error) {
      console.error('Admin save movie error:', error);
      if (editingMovieId) {
        dispatch(updateMovieFailure('Failed to update movie'));
      } else {
        dispatch(createMovieFailure('Failed to create movie'));
      }
      toast.error('Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (movieId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in again');
      router.push('/login');
      return;
    }

    const movieToDelete = movies.find((movie) => movie._id === movieId);
    if (!movieToDelete) {
      return;
    }

    const confirmed = window.confirm(`Delete "${movieToDelete.title}"? This will remove all related reviews.`);
    if (!confirmed) {
      return;
    }

    setDeletingMovieId(movieId);
    dispatch(deleteMovieStart());

    try {
      const response = await fetch(`/api/movies/${movieId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        dispatch(deleteMovieSuccess(movieId));
        toast.success('Movie deleted successfully');
        if (editingMovieId === movieId) {
          resetForm();
        }
      } else {
        const data = await response.json();
        const message = data.error || 'Failed to delete movie';
        dispatch(deleteMovieFailure(message));
        toast.error(message);
      }
    } catch (error) {
      console.error('Admin delete movie error:', error);
      dispatch(deleteMovieFailure('Failed to delete movie'));
      toast.error('Failed to delete movie');
    } finally {
      setDeletingMovieId(null);
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-12 lg:px-8 space-y-10">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-slate-300/80">Create and manage the movie catalogue.</p>
            </div>
            {editingMovieId && (
              <button
                onClick={resetForm}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/40"
                type="button"
              >
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-200 mb-2" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formState.title}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                placeholder="Movie title"
                required
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-200 mb-2" htmlFor="year">
                Release year
              </label>
              <input
                id="year"
                name="year"
                type="number"
                value={formState.year}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                placeholder="2025"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-200 mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                className="h-32 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                placeholder="Plot synopsis"
                required
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-200 mb-2" htmlFor="poster">
                Poster URL
              </label>
              <input
                id="poster"
                name="poster"
                type="url"
                value={formState.poster}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                placeholder="https://..."
                required
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-200 mb-2" htmlFor="genres">
                Genres
              </label>
              <select
                id="genres"
                name="genres"
                multiple
                value={formState.genres}
                onChange={handleGenresChange}
                className="h-32 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
              >
                {genres.map((genre) => (
                  <option key={genre._id} value={genre._id}>
                    {genre.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-400">Hold Ctrl (or ⌘) to select multiple genres.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-200 mb-2" htmlFor="cast">
                Cast list
              </label>
              <input
                id="cast"
                name="cast"
                type="text"
                value={formState.cast}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                placeholder="Comma separated names"
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-1 hover:bg-blue-400 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isSubmitting ? 'Saving…' : editingMovieId ? 'Update movie' : 'Create movie'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40 hover:text-white"
              >
                Reset form
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-slate-50">Existing movies</h2>
            <span className="text-sm text-slate-300/80">{movies.length} total</span>
          </div>

          {moviesLoading && !movies.length ? (
            <div className="mt-8 flex min-h-[120px] items-center justify-center text-slate-300">Loading catalogue…</div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {sortedMovies.map((movie) => (
                <div
                  key={movie._id}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 transition hover:border-blue-400/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-50">{movie.title}</h3>
                      <p className="text-xs uppercase tracking-wide text-slate-300/60">{movie.year}</p>
                    </div>
                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-200">{movie.genres.map((genre) => genre.name).join(', ') || '—'}</span>
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm text-slate-300/80">{movie.description}</p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleEdit(movie)}
                      className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-blue-400 hover:text-blue-200"
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(movie._id)}
                      className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/30 transition hover:-translate-y-0.5 hover:bg-red-500 disabled:opacity-50"
                      type="button"
                      disabled={deletingMovieId === movie._id}
                    >
                      {deletingMovieId === movie._id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
