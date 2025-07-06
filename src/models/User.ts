import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  role: 'admin' | 'member' | 'view-only';
  familyId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'member', 'view-only'],
      default: 'member',
    },
    familyId: {
      type: Schema.Types.ObjectId,
      ref: 'Family',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries (email already has unique index)
UserSchema.index({ familyId: 1 });

export default mongoose.models.User || 
  mongoose.model<IUser>('User', UserSchema);