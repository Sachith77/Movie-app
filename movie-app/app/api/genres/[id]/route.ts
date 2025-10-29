import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Genre from '@/models/Genre';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await dbConnect();
    const { name } = await request.json();
    const { id } = await params;

    if (!name) {
      return NextResponse.json(
        { error: 'Genre name is required' },
        { status: 400 }
      );
    }

    const genre = await Genre.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!genre) {
      return NextResponse.json(
        { error: 'Genre not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(genre);
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
    console.error('Update genre error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    await dbConnect();
    const { id } = await params;

    const genre = await Genre.findByIdAndDelete(id);

    if (!genre) {
      return NextResponse.json(
        { error: 'Genre not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Genre deleted successfully' });
  } catch (error) {
    console.error('Delete genre error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}