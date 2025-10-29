import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  year: number;
  description: string;
  poster: string;
  genres: mongoose.Types.ObjectId[];
  cast: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  genres: [{
    type: Schema.Types.ObjectId,
    ref: 'Genre',
    required: true,
  }],
  cast: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);