import mongoose, { Schema, Document } from 'mongoose';

export interface IFamily extends Document {
  name: string;
  members: mongoose.Types.ObjectId[];
  budgetCap?: number;
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
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    budgetCap: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
FamilySchema.index({ name: 1 });

export default mongoose.models.Family || 
  mongoose.model<IFamily>('Family', FamilySchema);