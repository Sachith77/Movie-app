import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  name: string;
  email?: string;
}

interface Review {
  _id: string;
  movie: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  isLoading: false,
  error: null,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    fetchReviewsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchReviewsSuccess: (state, action: PayloadAction<Review[]>) => {
      state.isLoading = false;
      state.reviews = action.payload;
      state.error = null;
    },
    fetchReviewsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createReviewStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createReviewSuccess: (state, action: PayloadAction<Review>) => {
      state.isLoading = false;
      state.reviews.unshift(action.payload);
      state.error = null;
    },
    createReviewFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteReviewStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteReviewSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.reviews = state.reviews.filter(r => r._id !== action.payload);
      state.error = null;
    },
    deleteReviewFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchReviewsStart,
  fetchReviewsSuccess,
  fetchReviewsFailure,
  createReviewStart,
  createReviewSuccess,
  createReviewFailure,
  deleteReviewStart,
  deleteReviewSuccess,
  deleteReviewFailure,
  clearError,
} = reviewsSlice.actions;

export default reviewsSlice.reducer;
export type { ReviewsState, Review };