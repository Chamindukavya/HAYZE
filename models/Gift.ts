import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGift extends Document {
  senderName: string;
  recipientName: string;
  message?: string;
  status: 'pending' | 'claimed' | 'ordered';
  claimedItem?: mongoose.Types.ObjectId;
  claimedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GiftSchema: Schema = new Schema(
  {
    senderName: { type: String, required: true },
    recipientName: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ['pending', 'claimed', 'ordered'], default: 'pending' },
    claimedItem: { type: Schema.Types.ObjectId, ref: 'Product' },
    claimedAt: { type: Date },
  },
  { timestamps: true }
);

const Gift: Model<IGift> = mongoose.models.Gift || mongoose.model<IGift>('Gift', GiftSchema);
export default Gift;
