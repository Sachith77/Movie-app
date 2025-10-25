import { Link } from "react-router-dom";
import { AiFillStar } from "react-icons/ai";

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movies/${movie._id}`} className="block h-full">
      <div className="group relative h-full card-hover overflow-hidden rounded-2xl glass border border-gray-700/50">
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.image}
            alt={movie.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x600?text=No+Image";
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
          
          {/* Year Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 glass rounded-full text-xs font-bold text-teal-400 border border-teal-500/30">
            {movie.year}
          </div>

          {/* Rating Badge */}
          {movie.numReviews > 0 && (
            <div className="absolute top-4 left-4 flex items-center space-x-1 px-3 py-1 glass rounded-full text-xs font-bold text-yellow-400 border border-yellow-500/30">
              <AiFillStar size={14} />
              <span>{movie.numReviews}</span>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-teal-400 transition-colors duration-300">
            {movie.name}
          </h3>
          
          <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-gray-400 text-sm">
              {movie.numReviews > 0 ? `${movie.numReviews} reviews` : "No reviews yet"}
            </p>
            <span className="text-teal-400 text-sm font-semibold">
              View Details →
            </span>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-teal-500/0 group-hover:border-teal-500/50 rounded-2xl transition-all duration-300 pointer-events-none"></div>
      </div>
    </Link>
  );
};

export default MovieCard;
