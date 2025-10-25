import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <div key={movie._id} className="relative group m-2 md:m-4">
      <Link to={`/movies/${movie._id}`}>
        <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl">
          <img
            src={movie.image}
            alt={movie.name}
            className="w-full h-[300px] md:h-[350px] lg:h-[400px] object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x600?text=No+Image";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-bold text-lg md:text-xl mb-1 truncate">
              {movie.name}
            </h3>
            <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {movie.year} • ⭐ {movie.numReviews > 0 ? `${movie.numReviews} reviews` : "No reviews yet"}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
