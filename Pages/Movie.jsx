import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";

const Movie = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const moviescall = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/movies");
      setMovies(res.data.movie);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    moviescall();
  }, []);

  const filtered = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genreFilter ? movie.genre === genreFilter : true;
    return matchesSearch && matchesGenre;
  });

  const uniqueGenres = [...new Set(movies.map((movie) => movie.genre))];

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
    setUserRating(0);
    setShowModal(true);
  };

  // ⭐ Updated: Local-only rating
  const handleRate = (rate) => {
    setUserRating(rate);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Filters */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-2/3 px-4 py-2 border rounded-lg shadow-sm"
        />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm"
        >
          <option value="">All Genres</option>
          {uniqueGenres.map((genre, idx) => (
            <option key={idx} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filtered.map((movie) => (
          <div
            key={movie._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-300"
            onClick={() => handleCardClick(movie)}
          >
            <img
              src={movie.poster}
              alt={movie.title}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x450?text=Image+Not+Available";
              }}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-base font-semibold mb-1">{movie.title}</h2>
              <p className="text-sm text-gray-600">
                <strong>Year:</strong> {movie.year}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Rating:</strong> {movie.rating}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-[95%] md:w-[400px] p-4 shadow-2xl relative border border-blue-300">
            <button
              className="absolute top-2 right-4 text-2xl font-bold text-gray-600 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <img
              src={selectedMovie.poster}
              alt={selectedMovie.title}
              className="w-full h-52 object-cover rounded-md mb-3"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
              }}
            />
            <h2 className="text-lg font-bold mb-2 text-blue-900">{selectedMovie.title}</h2>
            <p className="text-sm text-gray-800 mb-1"><strong>Genre:</strong> {selectedMovie.genre}</p>
            <p className="text-sm text-gray-800 mb-1"><strong>Director:</strong> {selectedMovie.director}</p>
            <p className="text-sm text-gray-800 mb-1"><strong>Year:</strong> {selectedMovie.year}</p>
            <p className="text-sm text-gray-800 mb-1"><strong>Rating:</strong> {selectedMovie.rating}</p>
            <p className="text-sm text-gray-800 mb-3"><strong>Plot:</strong> {selectedMovie.plot}</p>

            {/* Star Rating (local only) */}
            <div className="flex flex-col items-start mt-3">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">Your Rating:</p>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`text-xl cursor-pointer transition ${
                      userRating >= star ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => handleRate(star)}
                  />
                ))}
              </div>
              {userRating > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  You rated this {userRating} star{userRating > 1 ? "s" : ""}.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movie;
