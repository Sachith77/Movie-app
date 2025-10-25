import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Movie from "./models/Movie.js";
import Genre from "./models/Genre.js";
import User from "./models/User.js";

dotenv.config();

// Sample genres
const genres = [
  { name: "Action" },
  { name: "Drama" },
  { name: "Comedy" },
  { name: "Thriller" },
  { name: "Horror" },
  { name: "Sci-Fi" },
  { name: "Romance" },
  { name: "Adventure" },
  { name: "Animation" },
  { name: "Fantasy" },
];

// Sample movies
const movies = [
  {
    name: "The Shawshank Redemption",
    year: 1994,
    detail:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400",
    reviews: [],
    numReviews: 0,
  },
  {
    name: "The Dark Knight",
    year: 2008,
    detail:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400",
    reviews: [],
    numReviews: 0,
  },
  {
    name: "Inception",
    year: 2010,
    detail:
      "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400",
    reviews: [],
    numReviews: 0,
  },
  {
    name: "Pulp Fiction",
    year: 1994,
    detail:
      "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400",
    reviews: [],
    numReviews: 0,
  },
  {
    name: "Forrest Gump",
    year: 1994,
    detail:
      "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.",
    cast: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
    image: "https://images.unsplash.com/photo-1574267432644-f88c50d5f6f7?w=400",
    reviews: [],
    numReviews: 0,
  },
  {
    name: "The Matrix",
    year: 1999,
    detail:
      "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400",
    reviews: [],
    numReviews: 0,
  },
  {
    name: "Interstellar",
    year: 2014,
    detail:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400",
    reviews: [],
    numReviews: 0,
  },
  {
    name: "Gladiator",
    year: 2000,
    detail:
      "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.",
    cast: ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen"],
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400",
    reviews: [],
    numReviews: 0,
  },
  {
    name: "The Lion King",
    year: 1994,
    detail:
      "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.",
    cast: ["Matthew Broderick", "Jeremy Irons", "James Earl Jones"],
    image: "https://images.unsplash.com/photo-1549068106-b024baf5062d?w=400",
    reviews: [],
    numReviews: 0,
  },
  {
    name: "Avengers: Endgame",
    year: 2019,
    detail:
      "After the devastating events, the Avengers assemble once more to reverse Thanos' actions and restore balance.",
    cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
    reviews: [],
    numReviews: 0,
  },
  {
    name: "Titanic",
    year: 1997,
    detail:
      "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
    cast: ["Leonardo DiCaprio", "Kate Winslet", "Billy Zane"],
    image: "https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?w=400",
    reviews: [],
    numReviews: 0,
  },
  {
    name: "The Godfather",
    year: 1972,
    detail:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    cast: ["Marlon Brando", "Al Pacino", "James Caan"],
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400",
    reviews: [],
    numReviews: 0,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Movie.deleteMany({});
    await Genre.deleteMany({});
    console.log("✅ Cleared existing data");

    // Insert genres
    const insertedGenres = await Genre.insertMany(genres);
    console.log(`✅ Inserted ${insertedGenres.length} genres`);

    // Assign random genres to movies
    const moviesWithGenres = movies.map((movie, index) => ({
      ...movie,
      genre: insertedGenres[index % insertedGenres.length]._id,
    }));

    // Insert movies
    const insertedMovies = await Movie.insertMany(moviesWithGenres);
    console.log(`✅ Inserted ${insertedMovies.length} movies`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Genres: ${insertedGenres.length}`);
    console.log(`   - Movies: ${insertedMovies.length}`);
    console.log("\n💡 Next steps:");
    console.log("   1. Start your backend server");
    console.log("   2. Register a user and make them admin");
    console.log("   3. Login and start using the app!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
