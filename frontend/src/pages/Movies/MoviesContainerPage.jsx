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

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-8">
      {/* Genre Sidebar */}
      <aside className="w-full lg:w-64 bg-gray-800 rounded-lg p-4 shadow-lg lg:sticky lg:top-4 h-fit">
        <h2 className="text-2xl font-bold mb-4 text-teal-400">Genres</h2>
        {loadingGenres ? (
          <div className="text-center py-4">
            <div className="animate-pulse">Loading...</div>
          </div>
        ) : (
          <div className="flex flex-wrap lg:flex-col gap-2">
            <button
              className={`transition duration-300 ease-in-out hover:bg-teal-500 hover:text-white block p-3 rounded-lg text-left font-medium ${
                selectedGenre === null ? "bg-teal-500 text-white" : "bg-gray-700"
              }`}
              onClick={() => setSelectedGenre(null)}
            >
              All Genres
            </button>
            {genres?.map((g) => (
              <button
                key={g._id}
                className={`transition duration-300 ease-in-out hover:bg-teal-500 hover:text-white block p-3 rounded-lg text-left font-medium ${
                  selectedGenre === g._id ? "bg-teal-500 text-white" : "bg-gray-700"
                }`}
                onClick={() => handleGenreClick(g._id)}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <section className="flex-1 space-y-12">
        {/* Random Movies Section */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Picked For You
            </h1>
            <p className="text-gray-400">Personalized movie recommendations</p>
          </div>
          {loadingRandom ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
            </div>
          ) : (
            <SliderUtil data={randomMovies} />
          )}
        </div>

        {/* Top Movies Section */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              ⭐ Top Rated Movies
            </h1>
            <p className="text-gray-400">Highest rated by our community</p>
          </div>
          {loadingTop ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
            </div>
          ) : (
            <SliderUtil data={topMovies} />
          )}
        </div>

        {/* Filtered Movies Section */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              {selectedGenre ? `${genres?.find(g => g._id === selectedGenre)?.name} Movies` : "All Movies"}
            </h1>
            <p className="text-gray-400">
              {selectedGenre ? "Movies in this genre" : "Browse our complete collection"}
            </p>
          </div>
          {loadingNew ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
            </div>
          ) : (
            <SliderUtil data={filteredMovies} />
          )}
        </div>
      </section>
    </div>
  );
};

export default MoviesContainerPage;
