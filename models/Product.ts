import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string[];
  gender: 'men' | 'women' | 'unisex';
  images: string[];
  videos?: string[];
  colors: string[];
  colorImages?: { color: string; url: string }[];
  sizes: string[];
  stock: number;
  isFeatured: boolean;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: [String], required: true },
    gender: { type: String, enum: ['men', 'women', 'unisex'], required: true, default: 'unisex' },
    images: { type: [String], required: true },
    videos: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    colorImages: { type: [{ color: String, url: String }], default: [] },
    sizes: { type: [String], default: [] },
    stock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
