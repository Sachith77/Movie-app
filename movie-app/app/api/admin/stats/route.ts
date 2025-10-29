import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Movie from '@/models/Movie';
import Review from '@/models/Review';

export async function GET() {
  try {
    await dbConnect();

    const [userCount, movieCount, reviewCount, topMovies] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Review.countDocuments(),
      Review.aggregate([
        {
          $group: {
            _id: '$movie',
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'movies',
            localField: '_id',
            foreignField: '_id',
            as: 'movie',
          },
        },
        {
          $unwind: '$movie',
        },
        {
          $project: {
            title: '$movie.title',
            count: 1,
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ]),
    ]);

    return NextResponse.json({
      totalUsers: userCount,
      totalMovies: movieCount,
      totalReviews: reviewCount,
      topMovies,
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}