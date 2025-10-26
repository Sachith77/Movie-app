import mongoose from "mongoose";
import Movie from "../models/Movie.js";

const normalizeCast = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .filter((member) => typeof member === "string")
      .map((member) => member.trim())
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((member) => member.trim())
      .filter(Boolean);
  }
  return [];
};

const parseYear = (year) => {
  const numericYear = Number(year);
  return Number.isInteger(numericYear) ? numericYear : NaN;
};

const createMovie = async (req, res) => {
  try {
    const { name, image, year, genre, detail, cast } = req.body;

    const errors = [];

    if (!name || typeof name !== "string" || !name.trim()) {
      errors.push("Movie name is required");
    }

    if (!image || typeof image !== "string" || !image.trim()) {
      errors.push("Movie image is required");
    }

    const normalizedYear = parseYear(year);
    if (!normalizedYear || normalizedYear < 1800 || normalizedYear > new Date().getFullYear() + 5) {
      errors.push("Valid movie year is required");
    }

    const genreId = typeof genre === "string" ? genre.trim() : genre?._id;
    if (!genreId || !mongoose.Types.ObjectId.isValid(genreId)) {
      errors.push("Valid genre id is required");
    }

    if (!detail || typeof detail !== "string" || !detail.trim()) {
      errors.push("Movie detail is required");
    }

    const cleanedCast = normalizeCast(cast);
    if (cleanedCast.length === 0) {
      errors.push("Cast must include at least one member");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    const existingMovie = await Movie.findOne({ name: name.trim() });
    if (existingMovie) {
      return res.status(409).json({
        error: "Movie with this name already exists",
      });
    }

    const movieToCreate = {
      name: name.trim(),
      image: image.trim(),
      year: normalizedYear,
      genre: genreId,
      detail: detail.trim(),
      cast: cleanedCast,
    };

    const savedMovie = await Movie.create(movieToCreate);

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      movie: savedMovie,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((validationError) => validationError.message);
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid reference id supplied",
      });
    }

    res.status(500).json({
      error: "Failed to create movie",
      message: error.message,
    });
  }
};

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSpecificMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const specificMovie = await Movie.findById(id);
    if (!specificMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(specificMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, year, genre, detail, cast } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid movie id" });
    }

    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const updates = {};
    const errors = [];

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        errors.push("Movie name is required");
      } else {
        updates.name = name.trim();
      }
    }

    if (detail !== undefined) {
      if (typeof detail !== "string" || !detail.trim()) {
        errors.push("Movie detail is required");
      } else {
        updates.detail = detail.trim();
      }
    }

    if (year !== undefined) {
      const normalizedYear = parseYear(year);
      if (!normalizedYear || normalizedYear < 1800 || normalizedYear > new Date().getFullYear() + 5) {
        errors.push("Valid movie year is required");
      } else {
        updates.year = normalizedYear;
      }
    }

    if (genre !== undefined) {
      const genreId = typeof genre === "string" ? genre.trim() : genre?._id;
      if (!genreId || !mongoose.Types.ObjectId.isValid(genreId)) {
        errors.push("Valid genre id is required");
      } else {
        updates.genre = genreId;
      }
    }

    if (cast !== undefined) {
      const cleanedCast = normalizeCast(cast);
      if (cleanedCast.length === 0) {
        errors.push("Cast must include at least one member");
      } else {
        updates.cast = cleanedCast;
      }
    }

    if (image !== undefined) {
      if (typeof image !== "string" || !image.trim()) {
        errors.push("Image must be a non-empty string when provided");
      } else {
        updates.image = image.trim();
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "No valid fields supplied for update",
      });
    }

    Object.assign(movie, updates);
    const updatedMovie = await movie.save();

    res.json({
      success: true,
      message: "Movie updated successfully",
      movie: updatedMovie,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((validationError) => validationError.message);
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid reference id supplied",
      });
    }

    res.status(500).json({
      error: "Failed to update movie",
      message: error.message,
    });
  }
};

const movieReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      // Remove the duplicate review check - allow multiple reviews
      // const alreadyReviewed = movie.reviews.find(
      //   (r) => r.user.toString() === req.user._id.toString()
      // );

      // if (alreadyReviewed) {
      //   res.status(400);
      //   throw new Error("Movie already reviewed");
      // }

      const review = {
        name: req.user.username,
        rating: Number(rating) || 5, // Default to 5 if rating not provided
        comment,
        user: req.user._id,
      };

      movie.reviews.push(review);
      movie.numReviews = movie.reviews.length;
      movie.rating =
        movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
        movie.reviews.length;

      await movie.save();
      res.status(201).json({ message: "Review Added" });
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteMovie = await Movie.findByIdAndDelete(id);

    if (!deleteMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ message: "Movie Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { movieId, reviewId } = req.body;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const reviewIndex = movie.reviews.findIndex(
      (r) => r._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    movie.reviews.splice(reviewIndex, 1);
    movie.numReviews = movie.reviews.length;
    movie.rating =
      movie.reviews.length > 0
        ? movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
          movie.reviews.length
        : 0;

    await movie.save();
    res.json({ message: "Comment Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getNewMovies = async (req, res) => {
  try {
    const newMovies = await Movie.find().sort({ createdAt: -1 }).limit(10);
    res.json(newMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTopMovies = async (req, res) => {
  try {
    const topRatedMovies = await Movie.find()
      .sort({ numReviews: -1 })
      .limit(10);
    res.json(topRatedMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRandomMovies = async (req, res) => {
  try {
    const randomMovies = await Movie.aggregate([{ $sample: { size: 10 } }]);
    res.json(randomMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createMovie,
  getAllMovies,
  getSpecificMovie,
  updateMovie,
  movieReview,
  deleteMovie,
  deleteComment,
  getNewMovies,
  getTopMovies,
  getRandomMovies,
};
