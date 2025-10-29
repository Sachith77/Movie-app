export interface Genre {
  _id: string;
  name: string;
}

export interface Movie {
  _id: string;
  title: string;
  year: number;
  description: string;
  poster: string;
  genres: Genre[];
  cast: string[];
  reviewsCount?: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Review {
  _id: string;
  movie: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
}