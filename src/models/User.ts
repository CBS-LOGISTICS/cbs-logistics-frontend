import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';
import { IUser, UserRole, UserStatus } from './user-types';

export { UserRole, UserStatus };
export type { IUser };

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
    mustChangePassword: {
      type: Boolean,
      default: false,
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
  },
  {
    timestamps: true,
    discriminatorKey: 'role', // Use 'role' as the discriminator key
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
// userSchema.index({ email: 1 }); // Removed duplicate (defined in schema)
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