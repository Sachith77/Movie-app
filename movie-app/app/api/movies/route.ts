import { NextRequest, NextResponse } from 'next/server';
import { Types, type FilterQuery } from 'mongoose';
import dbConnect from '@/lib/mongoose';
import Movie, { type IMovie } from '@/models/Movie';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const query: FilterQuery<IMovie> = {};
    if (genre) {
      if (!Types.ObjectId.isValid(genre)) {
        return NextResponse.json(
          { error: 'Invalid genre identifier' },
          { status: 400 }
        );
      }

      query.genres = new Types.ObjectId(genre);
    }

    const movies = await Movie.find(query)
      .populate('genres', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments(query);

    return NextResponse.json({
      movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get movies error:', error);
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
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, year, description, poster, genres, cast } = await request.json();

    if (!title || !year || !description || !poster || !genres || genres.length === 0) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const movie = await Movie.create({
      title,
      year,
      description,
      poster,
      genres,
      cast: cast || [],
    });

    await movie.populate('genres', 'name');

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error('Create movie error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}