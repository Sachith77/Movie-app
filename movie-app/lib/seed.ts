import dbConnect from './mongoose';
import Genre from '../models/Genre';
import Movie from '../models/Movie';

const genresData = [
  'Action',
  'Drama',
  'Comedy',
  'Thriller',
  'Horror',
  'Sci-Fi',
  'Romance',
  'Adventure',
  'Animation',
  'Fantasy',
];

const moviesData = [
  {
    title: 'The Shawshank Redemption',
    year: 1994,
    description:
      'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&auto=format&fit=crop',
    genres: ['Drama'],
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
  },
  {
    title: 'The Dark Knight',
    year: 2008,
    description:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must face his greatest psychological and physical tests.',
    poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&auto=format&fit=crop',
    genres: ['Action', 'Thriller'],
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
  },
  {
    title: 'Inception',
    year: 2010,
    description:
      'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop',
    genres: ['Sci-Fi', 'Thriller'],
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'],
  },
  {
    title: 'Pulp Fiction',
    year: 1994,
    description:
      'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop',
    genres: ['Drama', 'Thriller'],
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
  },
  {
    title: 'Forrest Gump',
    year: 1994,
    description:
      'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
    poster: 'https://images.unsplash.com/photo-1574267432644-f88c50d5f6f7?w=800&auto=format&fit=crop',
    genres: ['Drama', 'Romance'],
    cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
  },
  {
    title: 'The Matrix',
    year: 1999,
    description:
      'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.',
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&auto=format&fit=crop',
    genres: ['Action', 'Sci-Fi'],
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
  },
  {
    title: 'Interstellar',
    year: 2014,
    description:
      'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    poster: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&auto=format&fit=crop',
    genres: ['Sci-Fi', 'Adventure'],
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
  },
  {
    title: 'Gladiator',
    year: 2000,
    description:
      'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.',
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop',
    genres: ['Action', 'Adventure'],
    cast: ['Russell Crowe', 'Joaquin Phoenix', 'Connie Nielsen'],
  },
  {
    title: 'The Lion King',
    year: 1994,
    description:
      'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
    poster: 'https://images.unsplash.com/photo-1549068106-b024baf5062d?w=800&auto=format&fit=crop',
    genres: ['Animation', 'Adventure'],
    cast: ['Matthew Broderick', 'Jeremy Irons', 'James Earl Jones'],
  },
  {
    title: 'Avengers: Endgame',
    year: 2019,
    description:
      'After the devastating events, the Avengers assemble once more to reverse Thanos\' actions and restore balance.',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop',
    genres: ['Action', 'Adventure'],
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'],
  },
  {
    title: 'Titanic',
    year: 1997,
    description:
      'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
    poster: 'https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?w=800&auto=format&fit=crop',
    genres: ['Romance', 'Drama'],
    cast: ['Leonardo DiCaprio', 'Kate Winslet', 'Billy Zane'],
  },
  {
    title: 'The Godfather',
    year: 1972,
    description:
      'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop',
    genres: ['Drama'],
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
  },
];

export async function seedDatabase() {
  try {
    await dbConnect();

    await Genre.deleteMany({});
    const insertedGenres = await Genre.insertMany(genresData.map((name) => ({ name })));
    console.log('Genres seeded:', insertedGenres.length);

    const genreMap = new Map(insertedGenres.map((genre) => [genre.name, genre._id]));

    await Movie.deleteMany({});
    const moviesWithGenreIds = moviesData.map((movie) => ({
      ...movie,
      genres: movie.genres
        .map((genreName) => genreMap.get(genreName))
        .filter((genreId): genreId is typeof insertedGenres[number]['_id'] => Boolean(genreId)),
    }));

    const movies = await Movie.insertMany(moviesWithGenreIds);
    console.log('Movies seeded:', movies.length);

    console.log('Database seeding completed');
  } catch (error) {
    console.error('Database seeding failed:', error);
  }
}