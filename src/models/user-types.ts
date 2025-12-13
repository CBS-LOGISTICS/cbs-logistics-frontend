import { Document, Types } from 'mongoose';

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
    // referralCode moved to Agent discriminator
    referredBy?: Types.ObjectId | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        referralCode?: string;
    };
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    rejectedBy?: Types.ObjectId;
    rejectedAt?: Date;
    rejectionReason?: string;
    deactivatedBy?: Types.ObjectId;
    deactivatedAt?: Date;
    deactivationReason?: string;
    lastLoginAt?: Date;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    mustChangePassword?: boolean;
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
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
