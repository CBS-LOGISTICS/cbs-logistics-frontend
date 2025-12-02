import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  SUPPLIER = 'supplier',
  AGENT = 'agent',
  CUSTOMER = 'customer',
}

export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DEACTIVATED = 'deactivated',
}

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  referralCode?: string;
  referredBy?: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectedBy?: mongoose.Types.ObjectId;
  rejectedAt?: Date;
  rejectionReason?: string;
  deactivatedBy?: mongoose.Types.ObjectId;
  deactivatedAt?: Date;
  deactivationReason?: string;
  lastLoginAt?: Date;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  profileImage?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  commissionRate?: number; // Added for Agents
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    swiftCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateReferralCode(): string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: [true, 'Role is required'],
      default: UserRole.CUSTOMER,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.PENDING,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
    },
    deactivatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deactivatedAt: {
      type: Date,
    },
    deactivationReason: {
      type: String,
      maxlength: [500, 'Deactivation reason cannot exceed 500 characters'],
    },
    lastLoginAt: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    profileImage: {
      type: String,
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
      zipCode: {
        type: String,
        trim: true,
      },
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    commissionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    bankDetails: {
      accountName: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      bankName: { type: String, trim: true },
      swiftCode: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        delete ret.password;
        delete ret.emailVerificationToken;
        delete ret.emailVerificationExpires;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        return ret;
      },
    },
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ referredBy: 1 });
userSchema.index({ approvedBy: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: unknown) {
    next(error as Error);
  }
});



// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};



// Static method to get agent's customers
userSchema.statics.getAgentCustomers = function (agentId: mongoose.Types.ObjectId) {
  return this.find({ 
    referredBy: agentId, 
    role: UserRole.CUSTOMER 
  }).select('-password -emailVerificationToken -passwordResetToken');
};

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for approval info
userSchema.virtual('approvalInfo').get(function () {
  if (this.status === UserStatus.APPROVED) {
    return {
      status: this.status,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt,
    };
  } else if (this.status === UserStatus.REJECTED) {
    return {
      status: this.status,
      rejectedBy: this.rejectedBy,
      rejectedAt: this.rejectedAt,
      rejectionReason: this.rejectionReason,
    };
  } else if (this.status === UserStatus.DEACTIVATED) {
    return {
      status: this.status,
      deactivatedBy: this.deactivatedBy,
      deactivatedAt: this.deactivatedAt,
      deactivationReason: this.deactivationReason,
    };
  }
  return { status: this.status };
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema); 