import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetSpecificMovieQuery,
  useAddMovieReviewMutation,
} from "../../redux/api/movies";
import MovieTabs from "./MovieTabs";

const MovieDetails = () => {
  const { id: movieId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { data: movie, refetch } = useGetSpecificMovieQuery(movieId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingMovieReview }] =
    useAddMovieReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        id: movieId,
        rating: rating || 5, // Default to 5 if not set
        comment,
      }).unwrap();

      refetch();
      
      // Reset form
      setComment("");
      setRating(0);

      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error.data || error.message);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center text-teal-400 hover:text-teal-300 font-semibold transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Go Back
          </Link>
        </div>

        {/* Movie Hero Section */}
        <div className="container mx-auto px-4 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700/50">
                  <img
                    src={movie?.image}
                    alt={movie?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x600?text=No+Image";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Year Badge */}
                  <div className="absolute top-4 right-4 px-4 py-2 bg-teal-500/90 backdrop-blur-sm rounded-full text-sm font-bold">
                    {movie?.year}
                  </div>
                  
                  {/* Reviews Badge */}
                  {movie?.numReviews > 0 && (
                    <div className="absolute top-4 left-4 px-4 py-2 bg-yellow-500/90 backdrop-blur-sm rounded-full text-sm font-bold flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {movie?.numReviews} Reviews
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Movie Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-4xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                  {movie?.name}
                </h1>
                <div className="flex items-center gap-4 text-gray-400">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {movie?.year}
                  </span>
                  {movie?.numReviews > 0 && (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {movie?.numReviews} {movie?.numReviews === 1 ? 'Review' : 'Reviews'}
                    </span>
                  )}
                </div>
              </div>

              {/* Synopsis */}
              <div className="glass rounded-2xl p-6 border border-gray-700/50">
                <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Synopsis
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {movie?.detail}
                </p>
              </div>

              {/* Cast */}
              <div className="glass rounded-2xl p-6 border border-gray-700/50">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cast
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {movie?.cast?.map((actor, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30 hover:border-teal-500/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold">
                        {actor.charAt(0)}
                      </div>
                      <span className="text-gray-200 font-medium">{actor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="pb-12">
            <MovieTabs
              loadingMovieReview={loadingMovieReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              movie={movie}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
