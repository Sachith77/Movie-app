import { useState } from "react";
import {
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
} from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import SliderUtil from "../../component/SliderUtil";

const MoviesContainerPage = () => {
  const { data, isLoading: loadingNew } = useGetNewMoviesQuery();
  const { data: topMovies, isLoading: loadingTop } = useGetTopMoviesQuery();
  const { data: genres, isLoading: loadingGenres } = useFetchGenresQuery();
  const { data: randomMovies, isLoading: loadingRandom } = useGetRandomMoviesQuery();

  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId === selectedGenre ? null : genreId);
  };

  const filteredMovies = data?.filter(
    (movie) => selectedGenre === null || movie.genre === selectedGenre
  );

  const LoadingSpinner = ({ color = "teal" }) => (
    <div className="flex justify-center items-center h-96">
      <div className="relative">
        <div className={`w-20 h-20 border-4 border-${color}-500/30 border-t-${color}-500 rounded-full animate-spin`}></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Genre Filter Section */}
      <div className="glass rounded-2xl p-6 border border-gray-700/50 fade-in">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <span className="mr-3">🎭</span>
          Browse by Genre
        </h2>
        {loadingGenres ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-gray-400">Loading genres...</div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            <button
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedGenre === null
                  ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-500/50 scale-105"
                  : "glass text-gray-300 hover:text-white hover:border-teal-500/50"
              }`}
              onClick={() => setSelectedGenre(null)}
            >
              All Genres
            </button>
            {genres?.map((g) => (
              <button
                key={g._id}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedGenre === g._id
                    ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-500/50 scale-105"
                    : "glass text-gray-300 hover:text-white hover:border-teal-500/50"
                }`}
                onClick={() => handleGenreClick(g._id)}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Picked For You Section */}
      <section className="space-y-6 fade-in">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-2 h-12 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
          <div>
            <h2 className="text-4xl font-black text-white mb-2">
              Picked For You
            </h2>
            <p className="text-gray-400 text-lg">Personalized movie recommendations just for you</p>
          </div>
        </div>
        {loadingRandom ? <LoadingSpinner color="purple" /> : <SliderUtil data={randomMovies} />}
      </section>

      {/* Top Rated Section */}
      <section className="space-y-6 fade-in">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-2 h-12 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
          <div>
            <h2 className="text-4xl font-black text-white mb-2 flex items-center">
              ⭐ Top Rated Movies
            </h2>
            <p className="text-gray-400 text-lg">Highest rated by our community of movie lovers</p>
          </div>
        </div>
        {loadingTop ? <LoadingSpinner color="yellow" /> : <SliderUtil data={topMovies} />}
      </section>

      {/* Filtered Movies Section */}
      <section className="space-y-6 fade-in">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-2 h-12 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
          <div>
            <h2 className="text-4xl font-black text-white mb-2">
              {selectedGenre 
                ? `${genres?.find(g => g._id === selectedGenre)?.name} Movies` 
                : "All Movies"}
            </h2>
            <p className="text-gray-400 text-lg">
              {selectedGenre 
                ? "Explore movies in this genre" 
                : "Browse our complete collection"}
            </p>
          </div>
        </div>
        {loadingNew ? <LoadingSpinner color="green" /> : <SliderUtil data={filteredMovies} />}
      </section>
    </div>
  );
};

export default MoviesContainerPage;
