import { Link } from "react-router-dom";

const MovieTabs = ({ userInfo, submitHandler, comment, setComment, movie, isLoading }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Write a Review</h2>
        {userInfo ? (
          <form onSubmit={submitHandler}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white mb-4"
              placeholder="Your review..."
              rows="4"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !comment.trim()}
              className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg"
            >
              {isLoading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <p className="text-gray-400">
            Please <Link to="/login" className="text-teal-400 underline">sign in</Link> to review
          </p>
        )}
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Reviews ({movie?.reviews?.length || 0})</h2>
        {!movie?.reviews || movie.reviews.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {movie.reviews.map((review) => (
              <div key={review._id} className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <strong className="text-white">{review.name}</strong>
                  {review.rating && <span className="text-yellow-400">⭐ {review.rating}/5</span>}
                </div>
                <p className="text-gray-300">{review.comment}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieTabs;
