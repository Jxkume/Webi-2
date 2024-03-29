import mongoose from 'mongoose';
import { Category } from '../../types/DBtypes';

const categorySchema = new mongoose.Schema<Category>({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const CategoryModel = mongoose.model<Category>('Category', categorySchema);
export default CategoryModel;
