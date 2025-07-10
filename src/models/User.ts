import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  role: 'admin' | 'member' | 'view-only';
  familyId?: mongoose.Types.ObjectId;
  families: mongoose.Types.ObjectId[];
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
      default: 'admin',
    },
    familyId: {
      type: Schema.Types.ObjectId,
      ref: 'Family',
    },
    families: [{
      type: Schema.Types.ObjectId,
      ref: 'Family',
    }],
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ familyId: 1 });

UserSchema.virtual('id').get(function(this: IUser) {
  return this._id.toString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.User || 
  mongoose.model<IUser>('User', UserSchema);
