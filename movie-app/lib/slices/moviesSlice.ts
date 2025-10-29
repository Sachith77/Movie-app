import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Genre {
  _id: string;
  name: string;
}

interface Movie {
  _id: string;
  title: string;
  year: number;
  description: string;
  poster: string;
  genres: Genre[];
  cast: string[];
  reviewsCount?: number;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface MoviesState {
  movies: Movie[];
  currentMovie: Movie | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;
}

const initialState: MoviesState = {
  movies: [],
  currentMovie: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    fetchMoviesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
  fetchMoviesSuccess: (state, action: PayloadAction<{ movies: Movie[]; pagination: PaginationMeta }>) => {
      state.isLoading = false;
      state.movies = action.payload.movies;
      state.pagination = action.payload.pagination;
      state.error = null;
    },
    fetchMoviesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchMovieStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMovieSuccess: (state, action: PayloadAction<Movie>) => {
      state.isLoading = false;
      state.currentMovie = action.payload;
      state.error = null;
    },
    fetchMovieFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createMovieStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createMovieSuccess: (state, action: PayloadAction<Movie>) => {
      state.isLoading = false;
      state.movies.unshift(action.payload);
      state.error = null;
    },
    createMovieFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateMovieStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateMovieSuccess: (state, action: PayloadAction<Movie>) => {
      state.isLoading = false;
      const index = state.movies.findIndex(m => m._id === action.payload._id);
      if (index !== -1) {
        state.movies[index] = action.payload;
      }
      if (state.currentMovie?._id === action.payload._id) {
        state.currentMovie = action.payload;
      }
      state.error = null;
    },
    updateMovieFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteMovieStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteMovieSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.movies = state.movies.filter(m => m._id !== action.payload);
      state.error = null;
    },
    deleteMovieFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchMoviesFailure,
  fetchMovieStart,
  fetchMovieSuccess,
  fetchMovieFailure,
  createMovieStart,
  createMovieSuccess,
  createMovieFailure,
  updateMovieStart,
  updateMovieSuccess,
  updateMovieFailure,
  deleteMovieStart,
  deleteMovieSuccess,
  deleteMovieFailure,
  clearError,
} = moviesSlice.actions;

export default moviesSlice.reducer;
export type { MoviesState, Movie, PaginationMeta };