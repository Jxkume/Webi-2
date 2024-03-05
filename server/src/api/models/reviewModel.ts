import mongoose from 'mongoose';
import { Review } from '../../types/DBtypes';

const reviewSchema = new mongoose.Schema<Review>({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    header: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    publicationDate: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
});

export default mongoose.model<Review>('Review', reviewSchema);
