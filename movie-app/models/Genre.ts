import mongoose, { Document, Schema } from 'mongoose';

export interface IGenre extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const GenreSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Genre || mongoose.model<IGenre>('Genre', GenreSchema);