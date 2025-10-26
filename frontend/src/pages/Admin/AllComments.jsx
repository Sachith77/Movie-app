import {
  useDeleteCommentMutation,
  useGetAllMoviesQuery,
} from "../../redux/api/movies";
import { toast } from "react-toastify";

const AllComments = () => {
  const { data: movie, refetch } = useGetAllMoviesQuery();
  const [deleteComment] = useDeleteCommentMutation();

  const handleDeleteComment = async (movieId, reviewId) => {
    try {
      await deleteComment({ movieId, reviewId });
      toast.success("Comment Deleted");
      refetch();
    } catch (error) {
      console.error("Error deleting comment: ", error);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="container mx-auto px-8 py-6">
      <h1 className="text-3xl font-bold text-white mb-8">All Comments</h1>
      <div className="space-y-8">
        {movie?.filter(m => m?.reviews?.length > 0).map((m) => (
          <section key={m._id} className="space-y-4">
            <div className="glass rounded-xl p-4 border border-gray-700/50 flex items-center gap-4">
              <div className="relative w-16 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{m.name}</h2>
                <p className="text-gray-400 text-sm">{m.year}</p>
                <p className="text-teal-400 text-sm">{m.reviews.length} Reviews</p>
              </div>
            </div>
            {m?.reviews.map((review) => (
              <div key={review._id} className="glass rounded-xl p-5 border border-gray-700/50 ml-8">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong className="text-white">{review.name}</strong>
                      <p className="text-gray-500 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{review.comment}</p>
                <button className="bg-red-500/20 text-red-400 font-semibold py-2 px-4 rounded-lg" onClick={() => handleDeleteComment(m._id, review._id)}>
                  Delete Comment
                </button>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
};

export default AllComments;
