'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import type { RootState } from '@/lib/store';
import type { Genre } from '@/lib/types';
import { fetchMovieStart, fetchMovieSuccess, fetchMovieFailure, type MoviesState } from '@/lib/slices/moviesSlice';
import { fetchReviewsStart, fetchReviewsSuccess, fetchReviewsFailure, createReviewStart, createReviewSuccess, createReviewFailure, type ReviewsState } from '@/lib/slices/reviewsSlice';
import Header from '@/components/Header';
import toast from 'react-hot-toast';

export default function MovieDetails() {
  const params = useParams();
  const movieId = params.id as string;
  const dispatch = useAppDispatch();
  const moviesState = useAppSelector((state: RootState) => state.movies) as MoviesState;
  const reviewsState = useAppSelector((state: RootState) => state.reviews) as ReviewsState;
  const { currentMovie, isLoading: movieLoading } = moviesState;
  const { reviews, isLoading: reviewsLoading } = reviewsState;
  const { user } = useAppSelector((state) => state.auth);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    // Fetch movie details
    const fetchMovie = async () => {
      dispatch(fetchMovieStart());
      try {
        const response = await fetch(`/api/movies/${movieId}`);
        const data = await response.json();
        if (response.ok) {
          dispatch(fetchMovieSuccess(data));
        } else {
          dispatch(fetchMovieFailure(data.error));
        }
      } catch (err) {
        console.error('Fetch movie error:', err);
        dispatch(fetchMovieFailure('Failed to fetch movie'));
      }
    };

    // Fetch reviews
    const fetchReviews = async () => {
      dispatch(fetchReviewsStart());
      try {
        const response = await fetch(`/api/reviews?movieId=${movieId}`);
        const data = await response.json();
        if (response.ok) {
          dispatch(fetchReviewsSuccess(data));
        } else {
          dispatch(fetchReviewsFailure(data.error));
        }
      } catch (err) {
        console.error('Fetch reviews error:', err);
        dispatch(fetchReviewsFailure('Failed to fetch reviews'));
      }
    };

    if (movieId) {
      fetchMovie();
      fetchReviews();
    }
  }, [movieId, dispatch]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    dispatch(createReviewStart());

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId, rating, comment }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(createReviewSuccess(data));
        if (currentMovie) {
          dispatch(fetchMovieSuccess({
            ...currentMovie,
            reviewsCount: (currentMovie.reviewsCount || 0) + 1,
          }));
        }
        setComment('');
        setRating(5);
        setShowReviewForm(false);
        toast.success('Review submitted successfully!');
      } else {
        dispatch(createReviewFailure(data.error));
      }
    } catch (err) {
      console.error('Create review error:', err);
      dispatch(createReviewFailure('Failed to submit review'));
    }
  };

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!currentMovie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-xl">Movie not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="glass rounded-lg overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="relative h-96 md:h-full">
                <Image
                  src={currentMovie.poster || '/placeholder-movie.jpg'}
                  alt={currentMovie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
            <div className="md:w-2/3 p-8">
              <h1 className="text-4xl font-bold mb-4">{currentMovie.title}</h1>
              <p className="text-xl text-gray-600 mb-4">{currentMovie.year}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {currentMovie.genres.map((genre: Genre) => (
                  <span
                    key={genre._id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <h2 className="text-2xl font-semibold mb-4">Synopsis</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">{currentMovie.description}</p>

              <h2 className="text-2xl font-semibold mb-4">Cast</h2>
              <div className="flex flex-wrap gap-2">
                {currentMovie.cast.map((actor: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {actor}
                  </span>
                ))}
              </div>

              <div className="mt-6 text-lg">
                <span className="font-semibold">{currentMovie.reviewsCount || 0}</span> reviews
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="glass rounded-lg p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            {user ? (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showReviewForm ? 'Cancel' : 'Write Review'}
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
              >
                Login to review
              </Link>
            )}
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} Star{num !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Write your review..."
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Review
              </button>
            </form>
          )}

          {reviewsLoading ? (
            <div className="text-center">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center text-gray-500">No reviews yet. Be the first to review!</div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{review.user.name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}