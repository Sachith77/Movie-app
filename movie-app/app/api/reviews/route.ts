import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Review from '@/models/Review';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ movie: movieId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { movieId, rating, comment } = await request.json();

    if (!movieId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Movie ID, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      movie: movieId,
      user: user.userId,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this movie' },
        { status: 400 }
      );
    }

    const review = await Review.create({
      movie: movieId,
      user: user.userId,
      rating,
      comment,
    });

    await review.populate('user', 'name');

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}