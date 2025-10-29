# Movie App

A full-stack Movie Explorer built with Next.js 16 (App Router) that combines a cinematic browsing experience with admin controls for managing a MongoDB-backed catalogue.

## Features
- Discover movies with search, genre filters, sorting, and animated UI transitions.
- Detailed title pages with portrait posters, synopsis, cast highlights, and live review counts.
- JWT-based authentication with protected review creation and admin-only actions.
- Admin dashboard for creating, editing, and deleting movies with instant Redux store updates.
- File upload endpoint that validates poster assets and stores them in `public/uploads`.

## Tech Stack
- Next.js 16 with Turbopack and the App Router.
- React 19 and TypeScript for the component layer.
- Tailwind CSS v4 (via the new `@tailwindcss/postcss` preset).
- Redux Toolkit for client state and async movie/review flows.
- MongoDB with Mongoose models for movies, genres, reviews, and users.
- JSON Web Tokens for authentication and role-aware authorization.

## Quick Start
1. Ensure Node.js 18.18+ and npm are available.
2. Install dependencies: `npm install`.
3. Create `movie-app/.env.local` (see Environment section below).
4. Start the dev server: `npm run dev` and open http://localhost:3000.
5. Optionally seed demo content by sending a `POST` request to `http://localhost:3000/api/seed` after the app boots.

## Environment Variables
Create `movie-app/.env.local` with the required secrets:

```bash
MONGO_URI=mongodb://localhost:27017/movie-app
JWT_SECRET=change-me
```

- `MONGO_URI` or `MONGODB_URI` (preferred name is `MONGO_URI`) should point to your MongoDB instance.
- `JWT_SECRET` is used to sign auth tokens; use a long, random string in production.

## Available Scripts
- `npm run dev`: Start the Next.js development server.
- `npm run build`: Generate the production bundle (uses `next build`).
- `npm run start`: Serve the production build.
- `npm run lint`: Run the project-wide ESLint configuration.

## API Highlights
- `POST /api/auth/register` and `POST /api/auth/login` manage user accounts and return JWTs.
- `GET /api/movies` (plus genre/search parameters) powers the catalogue; `POST` requires admin rights.
- `GET /api/movies/[id]` returns a single movie with populated genres and review count.
- `POST /api/reviews` creates reviews for authenticated users; `DELETE /api/reviews/[id]` enforces ownership or admin access.

## Database Seeding
Send a `POST` request to `/api/seed` (e.g. `curl -X POST http://localhost:3000/api/seed`) to load baseline genres and movies. The route wipes existing catalogue data before inserting fresh records, so avoid using it against production data.

## Project Structure

```
movie-app/
├─ app/                 # Next.js app router pages, API routes, and UI layout
├─ components/          # Reusable UI components (Header, MovieCard, Providers)
├─ lib/                 # Auth helpers, Redux store, Mongoose setup, seeding logic
├─ models/              # Mongoose models for Genre, Movie, Review, and User
├─ public/              # Static assets and uploaded poster files
├─ middleware.ts        # Proxy-style middleware (deprecated naming in Next 16)
├─ next.config.ts       # Next.js configuration
├─ package.json         # Scripts and dependency manifest
└─ README.md            # Project documentation (this file)
```

## Admin Access Notes
- Any registered user defaults to `isAdmin: false`. Promote an account by updating the `users` collection manually (e.g. via MongoDB Compass or a script).
- Admin users gain access to `/admin` for catalogue management and can delete any review.

## Production Build
Run `npm run build` followed by `npm run start` to verify the production bundle. Next.js 16 warns about multiple lockfiles; ensure the correct workspace root or remove conflicting lockfiles in deployment pipelines.
