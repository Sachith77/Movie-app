import { Link } from "react-router-dom";
import { useGetAllMoviesQuery } from "../../redux/api/movies";

const AdminMoviesList = () => {
  const { data: movies } = useGetAllMoviesQuery();

  return (
    <div className="container mx-auto px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          All Movies ({movies?.length || 0})
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies?.map((movie) => (
          <Link
            key={movie._id}
            to={`/admin/movies/update/${movie._id}`}
            className="group block"
          >
            <div className="glass rounded-2xl overflow-hidden border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300 h-full flex flex-col">
              {/* Standardized Image Container */}
              <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
                <img
                  src={movie.image}
                  alt={movie.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x600?text=No+Image";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Year Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-teal-500/90 backdrop-blur-sm rounded-full text-xs font-bold">
                  {movie.year}
                </div>
              </div>

              {/* Movie Info */}
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold text-lg mb-2 text-white line-clamp-2 group-hover:text-teal-400 transition-colors">
                  {movie.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                  {movie.detail}
                </p>
                
                <button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform group-hover:scale-105">
                  Update Movie
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminMoviesList;

