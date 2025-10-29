import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Review from '@/models/Review';

export async function GET() {
  try {
    await dbConnect();

    const reviews = await Review.find({})
      .populate('user', 'name email')
      .populate('movie', 'title')
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Get admin reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}