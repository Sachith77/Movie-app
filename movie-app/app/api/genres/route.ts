import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Genre from '@/models/Genre';

export async function GET() {
  try {
    await dbConnect();
    const genres = await Genre.find({}).sort({ name: 1 });
    return NextResponse.json(genres);
  } catch (error) {
    console.error('Get genres error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Genre name is required' },
        { status: 400 }
      );
    }

    const genre = await Genre.create({ name });
    return NextResponse.json(genre, { status: 201 });
  } catch (error) {
    const isDuplicateKeyError =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: number }).code === 11000;

    if (isDuplicateKeyError) {
      return NextResponse.json(
        { error: 'Genre already exists' },
        { status: 400 }
      );
    }
    console.error('Create genre error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}