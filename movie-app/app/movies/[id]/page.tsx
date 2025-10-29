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

  const topCast = currentMovie.cast.slice(0, 3);
  const reviewCount = currentMovie.reviewsCount || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="mb-8">
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <span aria-hidden="true">&larr;</span>
            Back to catalogue
          </Link>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
            <div className="absolute -left-24 top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full bg-blue-400/20 blur-3xl md:block" />
          </div>

          <div className="relative z-10 grid gap-10 px-6 py-10 lg:grid-cols-[320px_1fr] lg:px-12 lg:py-14">
            <div className="flex justify-center lg:justify-start">
              <div className="relative aspect-[2/3] w-full max-w-[320px] overflow-hidden rounded-3xl border border-white/15 bg-slate-900/60 shadow-2xl shadow-blue-600/30">
                <Image
                  src={currentMovie.poster || '/placeholder-movie.svg'}
                  alt={currentMovie.title}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 60vw, 320px"
                  priority
                />
                <span className="absolute left-4 top-4 rounded-full bg-blue-600/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-blue-600/40">
                  {currentMovie.year}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-10">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
                    {currentMovie.title}
                  </h1>
                  <p className="text-base leading-relaxed text-slate-200/80 sm:text-lg">
                    {currentMovie.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentMovie.genres.map((genre: Genre) => (
                    <span
                      key={genre._id}
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <div className="grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-blue-500/10">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-300/70">Reviews</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{reviewCount}</p>
                    <p className="text-xs text-slate-400">Community reactions</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-300/70">Release</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{currentMovie.year}</p>
                    <p className="text-xs text-slate-400">Year of premiere</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-300/70">Top billed</p>
                    <p className="mt-2 text-base font-semibold text-white">
                      {topCast.length ? topCast.join(', ') : 'Cast TBA'}
                    </p>
                    <p className="text-xs text-slate-400">Featured performers</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
                    Full cast
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {currentMovie.cast.map((actor: string, index: number) => (
                      <span
                        key={index}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-slate-100"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl lg:p-10">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Reviews</h2>
              <p className="text-sm text-slate-400">Hear what the community is saying about this title.</p>
            </div>
            {user ? (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 hover:bg-blue-500"
              >
                {showReviewForm ? 'Cancel' : 'Write a review'}
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/40 hover:text-white"
              >
                Login to review
              </Link>
            )}
          </div>

          {showReviewForm && (
            <form
              onSubmit={handleSubmitReview}
              className="mb-10 grid gap-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-inner"
            >
              <div className="grid gap-2 sm:grid-cols-[160px_1fr] sm:items-center">
                <label className="text-sm font-medium text-slate-200">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} Star{num !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-200">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[120px] w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                  placeholder="Share your thoughts about the story, visuals, or performances..."
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
                >
                  Submit review
                </button>
              </div>
            </form>
          )}

          {reviewsLoading ? (
            <div className="flex min-h-[160px] items-center justify-center text-slate-300">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/40 text-sm text-slate-400">
              No reviews yet. Be the first to share your take!
            </div>
          ) : (
            <div className="grid gap-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-lg shadow-black/20"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white">{review.user.name}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-base ${i < review.rating ? 'text-amber-400' : 'text-slate-600'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-200">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}