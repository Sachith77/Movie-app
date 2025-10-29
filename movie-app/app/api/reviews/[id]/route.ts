import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Review from '@/models/Review';
import { getUserFromRequest } from '@/lib/auth';

interface Params {
  params: {
    id: string;
  };
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await dbConnect();

    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const review = await Review.findById(params.id);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== user.userId && !user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await Review.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}