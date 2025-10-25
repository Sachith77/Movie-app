import Movie from "../models/Movie.js";

const createMovie = async (req, res) => {
  try {
    const { name, image, year, genre, detail, cast } = req.body;
    
    console.log('=== CREATE MOVIE REQUEST ===');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    
    // Comprehensive validation
    const errors = [];
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.push('Movie name is required');
    }
    
    if (!image || typeof image !== 'string' || image.trim() === '') {
      errors.push('Movie image is required');
    }
    
    if (!year || !Number.isInteger(Number(year)) || Number(year) < 1800 || Number(year) > new Date().getFullYear() + 5) {
      errors.push('Valid movie year is required');
    }
    
    if (!genre || typeof genre !== 'string' || genre.trim() === '') {
      errors.push('Movie genre is required');
    }
    
    if (!detail || typeof detail !== 'string' || detail.trim() === '') {
      errors.push('Movie detail is required');
    }
    
    if (!Array.isArray(cast) || cast.length === 0) {
      errors.push('Cast must be a non-empty array');
    } else {
      const validCast = cast.every(c => typeof c === 'string' && c.trim() !== '');
      if (!validCast) {
        errors.push('All cast members must be non-empty strings');
      }
    }
    
    if (errors.length > 0) {
      console.log('Validation Errors:', errors);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors 
      });
    }
    
    // Clean the data
    const cleanedCast = cast.map(c => c.trim()).filter(c => c);
    
    const movieData = {
      name: name.trim(),
      image: image.trim(),
      year: Number(year),
      genre: genre.trim(),
      detail: detail.trim(),
      cast: cleanedCast
    };
    
    console.log('Creating movie with data:', JSON.stringify(movieData, null, 2));
    
    const newMovie = new Movie(movieData);
    const savedMovie = await newMovie.save();
    
    console.log('Movie created successfully:', savedMovie._id);
    
    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      movie: savedMovie
    });
  } catch (error) {
    console.error('=== CREATE MOVIE ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create movie', 
      message: error.message 
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
    
    console.log('=== UPDATE MOVIE REQUEST ===');
    console.log('Movie ID:', id);
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    
    // Check if movie exists
    const existingMovie = await Movie.findById(id);
    if (!existingMovie) {
      console.log('Movie not found:', id);
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    // Comprehensive validation
    const errors = [];
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.push('Movie name is required');
    }
    
    if (!year || !Number.isInteger(Number(year)) || Number(year) < 1800 || Number(year) > new Date().getFullYear() + 5) {
      errors.push('Valid movie year is required');
    }
    
    if (!detail || typeof detail !== 'string' || detail.trim() === '') {
      errors.push('Movie detail is required');
    }
    
    if (!genre || typeof genre !== 'string' || genre.trim() === '') {
      errors.push('Movie genre is required');
    }
    
    if (!Array.isArray(cast) || cast.length === 0) {
      errors.push('Cast must be a non-empty array');
    } else {
      const validCast = cast.every(c => typeof c === 'string' && c.trim() !== '');
      if (!validCast) {
        errors.push('All cast members must be non-empty strings');
      }
    }
    
    if (errors.length > 0) {
      console.log('Validation Errors:', errors);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors 
      });
    }
    
    // Clean the data
    const cleanedCast = cast.map(c => c.trim()).filter(c => c);
    
    const updateData = {
      name: name.trim(),
      year: Number(year),
      genre: genre.trim(),
      detail: detail.trim(),
      cast: cleanedCast
    };
    
    // Always update image if provided (even if same URL)
    if (image && typeof image === 'string' && image.trim() !== '') {
      updateData.image = image.trim();
      console.log('Image will be updated to:', updateData.image);
    } else {
      console.log('No image provided, keeping existing image');
    }
    
    console.log('Updating movie with data:', JSON.stringify(updateData, null, 2));
    console.log('Existing movie image:', existingMovie.image);
    
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log('Movie updated successfully. New image:', updatedMovie.image);

    res.json({
      success: true,
      message: 'Movie updated successfully',
      movie: updatedMovie
    });
  } catch (error) {
    console.error('=== UPDATE MOVIE ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid movie ID format' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to update movie', 
      message: error.message 
    });
  }
};

const movieReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      const alreadyReviewed = movie.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Movie already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
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
