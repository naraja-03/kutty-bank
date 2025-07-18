import mongoose, { Schema, Document } from 'mongoose';

export interface IFamily extends Document {
  _id: string;
  name: string;
  members: mongoose.Types.ObjectId[];
  budgetCap?: number;
  // Budget planning fields
  income?: number;
  essentials?: number;
  commitments?: number;
  savings?: number;
  budgetPeriod?: 'week' | 'month' | 'year';
  lastUpdated?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FamilySchema = new Schema<IFamily>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    budgetCap: {
      type: Number,
      min: 0,
    },
    // Budget planning fields
    income: {
      type: Number,
      min: 0,
      default: 0,
    },
    essentials: {
      type: Number,
      min: 0,
      default: 0,
    },
    commitments: {
      type: Number,
      min: 0,
      default: 0,
    },
    savings: {
      type: Number,
      min: 0,
      default: 0,
    },
    budgetPeriod: {
      type: String,
      enum: ['week', 'month', 'year'],
      default: 'month',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
FamilySchema.index({ name: 1 });

// Virtual for id
FamilySchema.virtual('id').get(function (this: IFamily) {
  return this._id.toString();
});

// Ensure virtual fields are serialised
FamilySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete (ret as unknown as Record<string, unknown>)._id;
    delete (ret as unknown as Record<string, unknown>).__v;
    return ret;
  },
});

export default mongoose.models.Family || mongoose.model<IFamily>('Family', FamilySchema);
