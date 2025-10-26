import { Link } from "react-router-dom";

const MovieTabs = ({ userInfo, submitHandler, comment, setComment, movie }) => {
  return (
    <div className="space-y-8">
      {/* Review Form Section */}
      <section className="glass rounded-2xl p-6 border border-gray-700/50">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Write a Review
        </h2>
        
        {userInfo ? (
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label htmlFor="comment" className="block text-lg font-medium mb-3 text-gray-300">
                Share your thoughts about this movie
              </label>
              <textarea
                id="comment"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                placeholder="What did you think of this movie? Share your experience..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/50"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-gray-400 text-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Please{" "}
              <Link to="/login" className="text-teal-400 hover:text-teal-300 font-semibold underline">
                Sign In
              </Link>
              {" "}to write a review
            </div>
          </div>
        )}
      </section>

      {/* Reviews List Section */}
      <section className="glass rounded-2xl p-6 border border-gray-700/50">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Reviews ({movie?.reviews?.length || 0})
        </h2>

        {movie?.reviews?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">No reviews yet. Be the first to review this movie!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {movie?.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5 hover:border-teal-500/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong className="text-white text-lg">{review.name}</strong>
                      <p className="text-gray-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  {review.rating && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-yellow-400 font-semibold text-sm">{review.rating}/5</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-300 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MovieTabs;

