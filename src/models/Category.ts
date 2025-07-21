import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  _id: string;
  name: string;
  mainCategory: 'income' | 'essential' | 'commitment' | 'saving';
  userId?: mongoose.Types.ObjectId;
  familyId?: mongoose.Types.ObjectId;
  isDefault: boolean;
  icon?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
      enum: ['income', 'essential', 'commitment', 'saving'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return !this.isDefault;
      },
    },
    familyId: {
      type: Schema.Types.ObjectId,
      ref: 'Family',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CategorySchema.index({ userId: 1, mainCategory: 1 });
CategorySchema.index({ familyId: 1, mainCategory: 1 });

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
