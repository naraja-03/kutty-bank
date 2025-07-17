import mongoose, { Schema, Document } from 'mongoose';

export interface IThread extends Document {
  _id: string;
  label: string;
  value: 'week' | 'month' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
  description?: string;
  targetAmount?: number;
  userId: string;
  familyId?: string;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ThreadSchema = new Schema<IThread>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      enum: ['week', 'month', 'year', 'custom'],
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },
    targetAmount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: String,
      required: true,
    },
    familyId: {
      type: String,
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
ThreadSchema.index({ userId: 1, createdAt: -1 });
ThreadSchema.index({ familyId: 1, createdAt: -1 });

// Virtual for id
ThreadSchema.virtual('id').get(function (this: IThread) {
  return this._id.toString();
});

// Ensure virtual fields are serialised
ThreadSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete (ret as unknown as Record<string, unknown>)._id;
    delete (ret as unknown as Record<string, unknown>).__v;
    return ret;
  },
});

export default mongoose.models.Thread || mongoose.model<IThread>('Thread', ThreadSchema);
