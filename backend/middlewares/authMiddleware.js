import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

// Check if the user is authenticated or not
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  console.log('=== AUTHENTICATION CHECK ===');
  console.log('Token present:', !!token);
  console.log('Cookies:', Object.keys(req.cookies));

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      console.log('User authenticated:', req.user?.username, 'Admin:', req.user?.isAdmin);
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    console.error('No token found in cookies');
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Check if the user is admin or not
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    console.log('Admin authorization successful');
    next();
  } else {
    console.error('Admin authorization failed. User:', req.user?.username, 'isAdmin:', req.user?.isAdmin);
    res.status(401).send("Not authorized as an admin");
  }
};

export { authenticate, authorizeAdmin };
