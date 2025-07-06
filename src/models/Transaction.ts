// filepath: c:\Users\BRIGHTSPEED\Documents\GitHub\kutty-bank\src\models\Transaction.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  amount: number;
  category: string;
  type: 'income' | 'expense';
  userId: mongoose.Types.ObjectId;
  familyId?: mongoose.Types.ObjectId;
  note?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        'food',
        'transport',
        'entertainment',
        'shopping',
        'bills',
        'healthcare',
        'education',
        'salary',
        'business',
        'investment',
        'other',
      ],
    },
    type: {
      type: String,
      required: true,
      enum: ['income', 'expense'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    familyId: {
      type: Schema.Types.ObjectId,
      ref: 'Family',
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ familyId: 1, createdAt: -1 });
TransactionSchema.index({ type: 1, createdAt: -1 });

export default mongoose.models.Transaction || 
  mongoose.model<ITransaction>('Transaction', TransactionSchema);