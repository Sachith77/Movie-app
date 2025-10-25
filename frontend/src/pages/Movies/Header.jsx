import SliderUtil from "../../component/SliderUtil";
import { useGetNewMoviesQuery } from "../../redux/api/movies";
import { Link } from "react-router-dom";

const Header = () => {
  const { data, isLoading } = useGetNewMoviesQuery();

  return (
    <div className="flex flex-col mt-8 mx-4 md:mx-8 lg:flex-row justify-between items-start gap-6">
      <nav className="w-full lg:w-[12rem] bg-gray-800 rounded-lg p-4 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-teal-400">Navigation</h2>
        <Link
          to="/"
          className="transition duration-300 ease-in-out hover:bg-teal-500 hover:text-white bg-gray-700 block p-3 rounded-lg mb-3 text-lg font-medium"
        >
          🏠 Home
        </Link>
        <Link
          to="/movies"
          className="transition duration-300 ease-in-out hover:bg-teal-500 hover:text-white bg-gray-700 block p-3 rounded-lg text-lg font-medium"
        >
          🎬 Browse Movies
        </Link>
      </nav>

      <div className="w-full lg:flex-1">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            Latest Releases
          </h1>
          <p className="text-gray-400">Discover the newest movies</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
          </div>
        ) : (
          <SliderUtil data={data} />
        )}
      </div>
    </div>
  );
};

export default Header;
