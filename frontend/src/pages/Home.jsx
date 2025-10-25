import Header from "./Movies/Header";
import MoviesContainerPage from "./Movies/MoviesContainerPage";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="mt-8">
        <MoviesContainerPage />
      </section>
    </div>
  );
};

export default Home;
