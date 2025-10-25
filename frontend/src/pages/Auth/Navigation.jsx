import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { MdOutlineLocalMovies, MdDashboard } from "react-icons/md";
import { FiUser, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/users";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-700/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <MdOutlineLocalMovies className="text-white" size={28} />
              </div>
              <span className="text-2xl font-bold gradient-text">MovieHub</span>
            </Link>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
              >
                <AiOutlineHome className="text-teal-400 group-hover:scale-110 transition-transform" size={20} />
                <span className="text-gray-300 group-hover:text-white font-medium">Home</span>
              </Link>

              <Link
                to="/movies"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
              >
                <MdOutlineLocalMovies className="text-teal-400 group-hover:scale-110 transition-transform" size={20} />
                <span className="text-gray-300 group-hover:text-white font-medium">Browse Movies</span>
              </Link>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {userInfo.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-medium hidden sm:block">{userInfo.username}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden slide-in-left">
                    <div className="p-4 bg-gradient-to-r from-teal-500/20 to-blue-500/20 border-b border-gray-700/50">
                      <p className="text-sm text-gray-400">Signed in as</p>
                      <p className="text-white font-semibold">{userInfo.username}</p>
                      {userInfo.isAdmin && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-teal-500/20 text-teal-400 rounded-full border border-teal-500/30">
                          Admin
                        </span>
                      )}
                    </div>

                    <div className="py-2">
                      {userInfo.isAdmin && (
                        <Link
                          to="/admin/movies/dashboard"
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-all duration-300 group"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <MdDashboard className="text-teal-400 group-hover:scale-110 transition-transform" size={20} />
                          <span className="text-gray-300 group-hover:text-white">Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-all duration-300 group"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiUser className="text-teal-400 group-hover:scale-110 transition-transform" size={20} />
                        <span className="text-gray-300 group-hover:text-white">Profile</span>
                      </Link>

                      <button
                        onClick={logoutHandler}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-red-500/10 transition-all duration-300 group w-full text-left"
                      >
                        <FiLogOut className="text-red-400 group-hover:scale-110 transition-transform" size={20} />
                        <span className="text-gray-300 group-hover:text-red-400">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                >
                  <AiOutlineLogin className="text-teal-400 group-hover:scale-110 transition-transform" size={20} />
                  <span className="text-gray-300 group-hover:text-white font-medium">Login</span>
                </Link>

                <Link
                  to="/register"
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 group"
                >
                  <AiOutlineUserAdd className="text-white group-hover:scale-110 transition-transform" size={20} />
                  <span className="text-white font-semibold">Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
