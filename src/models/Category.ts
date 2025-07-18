import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  _id: string;
  name: string;
  mainCategory: 'income' | 'essentials' | 'commitments' | 'savings';
  userId?: mongoose.Types.ObjectId;
  familyId?: mongoose.Types.ObjectId;
  isDefault: boolean;
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mainCategory: {
      type: String,
      required: true,
      enum: ['income', 'essentials', 'commitments', 'savings'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: function() {
        return !this.isDefault;
      },
    },
    familyId: {
      type: Schema.Types.ObjectId,
      ref: 'Family',
      required: false,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
CategorySchema.index({ userId: 1, mainCategory: 1 });
CategorySchema.index({ familyId: 1, mainCategory: 1 });

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
