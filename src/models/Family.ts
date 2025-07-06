import mongoose, { Schema, Document } from 'mongoose';

export interface IFamily extends Document {
  _id: string;
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

// Virtual for id
FamilySchema.virtual('id').get(function(this: IFamily) {
  return this._id.toString();
});

// Ensure virtual fields are serialised
FamilySchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.Family || 
  mongoose.model<IFamily>('Family', FamilySchema);