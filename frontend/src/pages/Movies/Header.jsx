import SliderUtil from "../../component/SliderUtil";
import { useGetNewMoviesQuery } from "../../redux/api/movies";

const Header = () => {
  const { data, isLoading } = useGetNewMoviesQuery();

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-blue-500/10 to-purple-500/10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Content */}
        <div className="text-center mb-16 fade-in">
          <h1 className="text-5xl md:text-7xl font-black mb-6 gradient-text leading-tight">
            Welcome to MovieHub
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
            Discover and explore thousands of movies. Your ultimate destination for entertainment.
          </p>
        </div>

        {/* Latest Releases Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                🎬 Latest Releases
              </h2>
              <p className="text-gray-400">Fresh movies just added to our collection</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="fade-in">
              <SliderUtil data={data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
