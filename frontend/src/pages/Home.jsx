import Header from "./Movies/Header";
import MoviesContainerPage from "./Movies/MoviesContainerPage";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Header />

      <section className="mt-16 md:mt-20">
        <MoviesContainerPage />
      </section>
    </div>
  );
};

export default Home;
