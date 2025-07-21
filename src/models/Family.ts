import mongoose, { Schema, Document } from 'mongoose';

// Interface for income sources
export interface IIncomeSource {
  id: string;
  category: string;
  source: string;
  amount: number;
}

// Interface for budget categories (essentials, commitments, savings)
export interface IBudgetCategory {
  id: string;
  name: string;
  amount: number;
}

// Interface for family info
export interface IFamilyInfo {
  name: string;
  trackingPeriod: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
}

// Interface for detailed budget data
export interface IDetailedBudget {
  familyInfo: IFamilyInfo;
  income: {
    sources: IIncomeSource[];
    totalIncome: number;
  };
  essentials: {
    categories: IBudgetCategory[];
    totalEssentials: number;
  };
  commitments: {
    categories: IBudgetCategory[];
    totalCommitments: number;
  };
  savings: {
    categories: IBudgetCategory[];
    totalSavings: number;
    availableBalance: number;
  };
}

export interface IFamily extends Document {
  _id: string;
  name: string;
  members: mongoose.Types.ObjectId[];
  createdBy?: mongoose.Types.ObjectId;
  budgetCap?: number;
  
  // Simple budget totals (for backward compatibility)
  income?: number;
  essentials?: number;
  commitments?: number;
  savings?: number;
  budgetPeriod?: 'week' | 'month' | 'year';
  
  // Detailed budget data
  detailedBudget?: IDetailedBudget;
  
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    budgetCap: {
      type: Number,
      min: 0,
    },
    // Simple budget totals (for backward compatibility)
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
    // Detailed budget data
    detailedBudget: {
      familyInfo: {
        name: { type: String },
        trackingPeriod: { 
          type: String, 
          enum: ['daily', 'weekly', 'monthly', 'yearly'] 
        },
        startDate: { type: String }
      },
      income: {
        sources: [{
          id: { type: String },
          category: { type: String },
          source: { type: String },
          amount: { type: Number }
        }],
        totalIncome: { type: Number }
      },
      essentials: {
        categories: [{
          id: { type: String },
          name: { type: String },
          amount: { type: Number }
        }],
        totalEssentials: { type: Number }
      },
      commitments: {
        categories: [{
          id: { type: String },
          name: { type: String },
          amount: { type: Number }
        }],
        totalCommitments: { type: Number }
      },
      savings: {
        categories: [{
          id: { type: String },
          name: { type: String },
          amount: { type: Number }
        }],
        totalSavings: { type: Number },
        availableBalance: { type: Number }
      }
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
