import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  userId?: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    color: string;
    size: string;
    image: string;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  receiverName: string;
  receiverEmail: string;
  address: string;
  phone1: string;
  phone2: string;
  status: 'ORDERED' | 'PACKING' | 'HAND_OVER_TO_COURIER' | 'DELIVERED';
  paymentMethod: 'COD';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      default: null,
      index: true,
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        color: { type: String, required: true },
        size: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    receiverName: { type: String, required: true },
    receiverEmail: { type: String, required: true },
    address: { type: String, required: true },
    phone1: { type: String, required: true },
    phone2: { type: String, required: true },
    status: {
      type: String,
      enum: ['ORDERED', 'PACKING', 'HAND_OVER_TO_COURIER', 'DELIVERED'],
      default: 'ORDERED',
    },
    paymentMethod: {
      type: String,
      enum: ['COD'],
      default: 'COD',
    },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
