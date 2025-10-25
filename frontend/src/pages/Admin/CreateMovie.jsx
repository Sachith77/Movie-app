import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateMovieMutation,
  useUploadImageMutation,
} from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import { toast } from "react-toastify";

const CreateMovie = () => {
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    year: new Date().getFullYear(),
    detail: "",
    cast: "",
    genre: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [createMovie, { isLoading: isCreatingMovie }] = useCreateMovieMutation();
  const [uploadImage, { isLoading: isUploadingImage }] = useUploadImageMutation();
  const { data: genres, isLoading: isLoadingGenres } = useFetchGenresQuery();

  useEffect(() => {
    if (genres && genres.length > 0) {
      setMovieData((prevData) => ({
        ...prevData,
        genre: genres[0]?._id || "",
      }));
    }
  }, [genres]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, or WebP)");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!movieData.name.trim()) {
      errors.push("Movie name is required");
    }

    if (!movieData.year || movieData.year < 1800 || movieData.year > new Date().getFullYear() + 5) {
      errors.push("Please enter a valid year");
    }

    if (!movieData.detail.trim()) {
      errors.push("Movie detail is required");
    }

    if (!movieData.cast.trim()) {
      errors.push("At least one cast member is required");
    }

    if (!movieData.genre) {
      errors.push("Please select a genre");
    }

    if (!selectedImage) {
      errors.push("Please select an image");
    }

    return errors;
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    
    console.log('=== CREATE MOVIE ATTEMPT ===');
    console.log('Movie Data:', movieData);
    console.log('Selected Image:', selectedImage?.name);

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    try {
      // Step 1: Upload image
      console.log('Uploading image...');
      const formData = new FormData();
      formData.append("image", selectedImage);

      const uploadImageResponse = await uploadImage(formData).unwrap();
      console.log('Image upload response:', uploadImageResponse);

      if (!uploadImageResponse || !uploadImageResponse.image) {
        throw new Error('Image upload failed - no image URL returned');
      }

      const uploadedImagePath = uploadImageResponse.image;
      console.log('Image uploaded successfully:', uploadedImagePath);

      // Step 2: Prepare movie data
      const castArray = movieData.cast
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      const moviePayload = {
        name: movieData.name.trim(),
        year: Number(movieData.year),
        detail: movieData.detail.trim(),
        cast: castArray,
        genre: movieData.genre,
        image: uploadedImagePath,
      };

      console.log('Creating movie with payload:', moviePayload);

      // Step 3: Create movie
      const createResponse = await createMovie(moviePayload).unwrap();
      console.log('Movie created successfully:', createResponse);

      toast.success("Movie created successfully!");
      
      // Reset form
      setMovieData({
        name: "",
        year: new Date().getFullYear(),
        detail: "",
        cast: "",
        genre: genres?.[0]?._id || "",
      });
      setSelectedImage(null);
      setImagePreview(null);

      // Navigate to movies list
      setTimeout(() => {
        navigate("/admin/movies-list");
      }, 1000);

    } catch (error) {
      console.error('=== CREATE MOVIE ERROR ===');
      console.error('Error:', error);
      
      const errorMessage = error?.data?.error || error?.data?.message || error?.message || 'Failed to create movie';
      const errorDetails = error?.data?.details;
      
      if (errorDetails && Array.isArray(errorDetails)) {
        errorDetails.forEach(detail => toast.error(detail));
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="container flex justify-center items-center mt-4">
      <form onSubmit={handleCreateMovie} className="w-full max-w-2xl">
        <p className="text-green-200 text-2xl mb-4">Create Movie</p>
        
        <div className="mb-4">
          <label className="block text-white mb-2">
            Movie Name: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={movieData.name}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded text-black"
            placeholder="Enter movie name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">
            Year: <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="year"
            value={movieData.year}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded text-black"
            min="1800"
            max={new Date().getFullYear() + 5}
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">
            Detail: <span className="text-red-500">*</span>
          </label>
          <textarea
            name="detail"
            value={movieData.detail}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded text-black"
            rows="4"
            placeholder="Enter movie description"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">
            Cast (comma-separated): <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cast"
            value={movieData.cast}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded text-black"
            placeholder="e.g., Actor 1, Actor 2, Actor 3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">
            Genre: <span className="text-red-500">*</span>
          </label>
          <select
            name="genre"
            value={movieData.genre}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded text-black"
            disabled={isLoadingGenres}
          >
            {isLoadingGenres ? (
              <option>Loading genres...</option>
            ) : (
              genres?.map((genre) => (
                <option key={genre._id} value={genre._id}>
                  {genre.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">
            Movie Image: <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border px-3 py-2 w-full rounded text-white bg-gray-800"
          />
          {imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-w-xs max-h-48 object-cover rounded"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isCreatingMovie || isUploadingImage}
        >
          {isCreatingMovie || isUploadingImage ? "Creating..." : "Create Movie"}
        </button>
      </form>
    </div>
  );
};

export default CreateMovie;
