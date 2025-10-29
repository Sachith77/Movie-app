import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Genre {
  _id: string;
  name: string;
}

interface GenresState {
  genres: Genre[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GenresState = {
  genres: [],
  isLoading: false,
  error: null,
};

const genresSlice = createSlice({
  name: 'genres',
  initialState,
  reducers: {
    fetchGenresStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchGenresSuccess: (state, action: PayloadAction<Genre[]>) => {
      state.isLoading = false;
      state.genres = action.payload;
      state.error = null;
    },
    fetchGenresFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createGenreStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createGenreSuccess: (state, action: PayloadAction<Genre>) => {
      state.isLoading = false;
      state.genres.push(action.payload);
      state.error = null;
    },
    createGenreFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateGenreStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateGenreSuccess: (state, action: PayloadAction<Genre>) => {
      state.isLoading = false;
      const index = state.genres.findIndex(g => g._id === action.payload._id);
      if (index !== -1) {
        state.genres[index] = action.payload;
      }
      state.error = null;
    },
    updateGenreFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteGenreStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteGenreSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.genres = state.genres.filter(g => g._id !== action.payload);
      state.error = null;
    },
    deleteGenreFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchGenresStart,
  fetchGenresSuccess,
  fetchGenresFailure,
  createGenreStart,
  createGenreSuccess,
  createGenreFailure,
  updateGenreStart,
  updateGenreSuccess,
  updateGenreFailure,
  deleteGenreStart,
  deleteGenreSuccess,
  deleteGenreFailure,
  clearError,
} = genresSlice.actions;

export default genresSlice.reducer;
export type { GenresState, Genre };