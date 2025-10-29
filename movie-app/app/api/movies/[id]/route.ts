import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Movie from '@/models/Movie';
import Review from '@/models/Review';
import { getUserFromRequest } from '@/lib/auth';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await dbConnect();

    const { id } = await context.params;

    const movie = await Movie.findById(id).populate('genres', 'name');

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    // Get reviews count
    const reviewsCount = await Review.countDocuments({ movie: id });

    return NextResponse.json({
      ...movie.toObject(),
      reviewsCount,
    });
  } catch (error) {
    console.error('Get movie error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await dbConnect();

    const user = getUserFromRequest(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, year, description, poster, genres, cast } = await request.json();

    const { id } = await context.params;

    const movie = await Movie.findByIdAndUpdate(
      id,
      { title, year, description, poster, genres, cast },
      { new: true, runValidators: true }
    ).populate('genres', 'name');

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Update movie error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await dbConnect();

    const user = getUserFromRequest(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    // Delete associated reviews
    await Review.deleteMany({ movie: id });

    return NextResponse.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Delete movie error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}