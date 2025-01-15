import { Schema, model, Document } from 'mongoose';

// Category interface that extends Document (from Mongoose) to type Mongoose documents
interface CategoryInterface extends Document {
    name: string;
}

const categorySchema = new Schema<CategoryInterface>({
    name: {
        type: String,
        required: true,
        unique: true,
    }
});

const Category = model<CategoryInterface>('Category', categorySchema);

export default Category;
