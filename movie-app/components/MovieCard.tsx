'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/lib/types';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const topGenres = movie.genres.slice(0, 3);
  const castPreview = movie.cast.slice(0, 2).join(', ');
  const isRecent = movie.year >= new Date().getFullYear() - 1;

  return (
    <Link
      href={`/movies/${movie._id}`}
      className="group relative block overflow-hidden rounded-2xl bg-slate-900/40 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/30"
    >
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={movie.poster || '/placeholder-movie.svg'}
          alt={movie.title?.trim() ? `${movie.title} poster` : 'Movie poster placeholder'}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2 text-xs font-semibold text-white">
          <span className="rounded-full bg-blue-600/80 px-3 py-1 shadow-lg">{movie.year}</span>
          {isRecent && (
            <span className="rounded-full bg-emerald-500/80 px-3 py-1 shadow-lg">
              New
            </span>
          )}
        </div>
      </div>

      <div className="relative space-y-3 p-5 text-slate-100">
        <h3 className="text-xl font-semibold leading-tight transition-colors duration-300 group-hover:text-blue-300 line-clamp-2">
          {movie.title}
        </h3>

        <div className="flex flex-wrap gap-2">
          {topGenres.map((genre) => (
            <span
              key={genre._id}
              className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-slate-200"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <p className="line-clamp-2 text-sm text-slate-300/80">
          {movie.description}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-300/80">
          <span className="flex items-center gap-1">
            <span className="text-amber-400">★</span>
            {movie.reviewsCount || 0} reviews
          </span>
          {castPreview && <span className="truncate">Starring {castPreview}</span>}
        </div>
      </div>
    </Link>
  );
}