# 🎬 MERN Movies App

A full-stack movie management application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to browse movies, leave reviews, and provides administrators with a comprehensive dashboard to manage movies, genres, and user comments.

## ✨ Features

### User Features
- 🔐 **User Authentication**: Secure registration and login system with JWT
- 🎥 **Browse Movies**: View all movies with detailed information
- ⭐ **Rate & Review**: Leave ratings and comments on movies
- 👤 **User Profile**: Manage personal profile information
- 🔍 **Genre Filtering**: Filter movies by genre
- 📱 **Responsive Design**: Fully responsive UI built with Tailwind CSS

### Admin Features
- 📊 **Admin Dashboard**: Real-time statistics and analytics
- ➕ **Movie Management**: Create, update, and delete movies
- 🎭 **Genre Management**: Manage movie genres
- 💬 **Comment Moderation**: View and manage all user comments
- 📤 **File Upload**: Upload movie posters and images
- 🔒 **Protected Routes**: Admin-only access to management features

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Icons** - Icon library
- **React Slick** - Carousel component
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

## 📋 Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MERN-Movies-App
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Environment Setup**
   
   **Backend Environment (.env in root directory):**
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

   **Frontend Environment (.env in frontend directory):**
   ```env
   VITE_API_URL=http://localhost:3000
   ```
   
   > **Note**: For production, update `VITE_API_URL` to your deployed backend URL.

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # Linux/Mac
   sudo systemctl start mongodb
   # Or if using MongoDB service
   mongod
   ```

## 🎮 Running the Application

### Development Mode

**Run both frontend and backend concurrently:**
```bash
npm run fullstack
```

**Or run them separately:**

Backend only:
```bash
npm run backend
```

Frontend only:
```bash
npm run frontend
```

### Production Mode

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend server:**
   ```bash
   npm start
   ```

The application will be available at:
- **Frontend**: http://localhost:5173 (development)
- **Backend API**: http://localhost:3000

## 📁 Project Structure

```
MERN-Movies-App/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Custom middleware (auth, error handling)
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── index.js         # Entry point
├── frontend/
│   ├── src/
│   │   ├── assets/      # Static assets
│   │   ├── component/   # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # Redux store, slices, and API
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   └── vite.config.js
├── uploads/             # Uploaded files directory
├── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout

### Movies
- `GET /api/v1/movies` - Get all movies
- `GET /api/v1/movies/:id` - Get movie by ID
- `POST /api/v1/movies` - Create movie (Admin)
- `PUT /api/v1/movies/:id` - Update movie (Admin)
- `DELETE /api/v1/movies/:id` - Delete movie (Admin)
- `POST /api/v1/movies/:id/reviews` - Add movie review

### Genres
- `GET /api/v1/genre` - Get all genres
- `POST /api/v1/genre` - Create genre (Admin)
- `PUT /api/v1/genre/:id` - Update genre (Admin)
- `DELETE /api/v1/genre/:id` - Delete genre (Admin)

### Upload
- `POST /api/v1/upload` - Upload file (Admin)

## 👥 User Roles

### Regular User
- Browse and search movies
- View movie details
- Leave reviews and ratings
- Manage personal profile

### Admin
- All user permissions
- Full CRUD operations on movies
- Manage genres
- View and moderate comments
- Access to admin dashboard with analytics

## 🎨 Features in Detail

### Movie Management
- Add movies with name, year, genre, cast, and details
- Upload movie posters
- View comprehensive movie details
- Track number of reviews per movie

### Review System
- Users can leave ratings (1-5 stars)
- Write detailed comments
- View all reviews on movie detail page
- Reviews linked to user accounts

### Admin Dashboard
- Real-time statistics
- Primary and secondary cards with key metrics
- Video cards for featured content
- Sidebar navigation for easy access

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes on both frontend and backend
- Admin-only routes with middleware protection
- Cookie-based token storage
- Input validation and sanitization

## 🌐 Deployment Guide

### Prerequisites
- GitHub account with your code pushed
- MongoDB Atlas account (for cloud database)
- Render account (for backend)
- Vercel account (for frontend)

### Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string (it looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)
5. Replace `<password>` with your actual password
6. Add `/moviedb` at the end: `mongodb+srv://username:password@cluster.mongodb.net/moviedb`
7. In "Network Access", add `0.0.0.0/0` to allow connections from anywhere

### Step 2: Deploy Backend on Render

1. **Go to [Render](https://render.com) and sign in**

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**

4. **Configure the service:**
   - **Name**: `movie-app-backend` (or any name you prefer)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or use `.` if it doesn't work)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/index.js`

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   PORT=3000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/moviedb
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   NODE_ENV=production
   ```
   
   > **Important**: Generate a strong JWT_SECRET (you can use: `openssl rand -base64 32`)

6. **Click "Create Web Service"**

7. **Wait for deployment** (5-10 minutes)

8. **Copy your backend URL** (it will be something like: `https://movie-app-backend.onrender.com`)

### Step 3: Deploy Frontend on Vercel

1. **Update your local frontend `.env` file** with the Render backend URL:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

2. **Create a production environment file** in `frontend/.env.production`:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

3. **Go to [Vercel](https://vercel.com) and sign in**

4. **Click "Add New..." → "Project"**

5. **Import your GitHub repository**

6. **Configure the project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

7. **Add Environment Variable**:
   - Go to "Environment Variables" section
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`
   - Make sure it's available for Production, Preview, and Development

8. **Click "Deploy"**

9. **Wait for deployment** (2-5 minutes)

10. **Your app is live!** Vercel will give you a URL like: `https://your-app.vercel.app`

### Step 4: Update Backend CORS (Important!)

After deploying frontend, you need to update your backend to allow CORS from your Vercel domain.

1. **In your backend `index.js`**, add CORS configuration:
   ```javascript
   import cors from "cors";
   
   // Add after creating the app
   app.use(cors({
     origin: ["https://your-app.vercel.app", "http://localhost:5173"],
     credentials: true
   }));
   ```

2. **Install CORS** (if not already):
   ```bash
   npm install cors
   ```

3. **Add CORS to your backend `package.json` dependencies** and push to GitHub

4. **Render will automatically redeploy** when you push changes

### Environment Variables Summary

**Backend (Render):**
```env
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/moviedb
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=production
```

**Frontend (Vercel):**
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### Important Notes

⚠️ **Render Free Tier**: 
- Your backend will spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid tier for production apps

⚠️ **Cookie Issues**:
- If authentication doesn't work, check CORS settings
- Ensure `credentials: true` is set in CORS
- Frontend must send requests with `credentials: 'include'`

⚠️ **Build Errors**:
- Make sure all dependencies are in `package.json`
- Check build logs for specific errors
- Verify Node version compatibility

### Troubleshooting

**Backend won't start?**
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set

**Frontend can't connect to backend?**
- Verify `VITE_API_URL` is correct
- Check browser console for CORS errors
- Ensure backend is running (visit backend URL directly)

**Authentication issues?**
- Check CORS configuration
- Verify JWT_SECRET is set on backend
- Clear browser cookies and try again

### Testing Your Deployment

1. **Test backend**: Visit `https://your-backend-url.onrender.com/api/v1/movies`
2. **Test frontend**: Visit `https://your-app.vercel.app`
3. **Test registration**: Create a new user account
4. **Test login**: Login with the created account
5. **Test movies**: Browse and interact with movies

### Updating Your Deployment

**Backend updates:**
- Push changes to GitHub
- Render will automatically redeploy

**Frontend updates:**
- Push changes to GitHub  
- Vercel will automatically redeploy

🎉 **Congratulations! Your MERN Movies App is now live!**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author (Made with ❤️)

Sachith
