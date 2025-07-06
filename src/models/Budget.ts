import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  _id: string;
  label: string;
  value: 'week' | 'month' | 'year' | 'custom';
  description?: string;
  targetAmount?: number;
  userId: string;
  familyId?: string;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>({
  label: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    enum: ['week', 'month', 'year', 'custom'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  targetAmount: {
    type: Number,
    default: 0
  },
  userId: {
    type: String,
    required: true
  },
  familyId: {
    type: String
  },
  isCustom: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
BudgetSchema.index({ userId: 1, createdAt: -1 });
BudgetSchema.index({ familyId: 1, createdAt: -1 });

// Virtual for id
BudgetSchema.virtual('id').get(function(this: IBudget) {
  return this._id.toString();
});

// Ensure virtual fields are serialised
BudgetSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);
