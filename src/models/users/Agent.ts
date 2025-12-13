import mongoose, { Schema } from 'mongoose';
import { IUser, User, UserRole } from '../User';

export interface IAgent extends IUser {
    commissionRate: number;
    referralCode: string;
    bankDetails?: {
        accountName: string;
        accountNumber: string;
        bankName: string;
        swiftCode: string;
    };
    generateReferralCode(): string;
}

const agentSchema = new Schema<IAgent>({
    commissionRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    referralCode: {
        type: String,
        unique: true,
        sparse: true,
    },
    bankDetails: {
        accountName: { type: String, trim: true },
        accountNumber: { type: String, trim: true },
        bankName: { type: String, trim: true },
        swiftCode: { type: String, trim: true },
    },
});

// Indexes
// agentSchema.index({ referralCode: 1 }); // Removed duplicate (defined in schema)

// Static method to get agent's customers
agentSchema.statics.getAgentCustomers = function (agentId: mongoose.Types.ObjectId) {
    return User.find({
        referredBy: agentId,
        role: UserRole.CUSTOMER
    }).select('-password -emailVerificationToken -passwordResetToken');
};

// Method to generate referral code
agentSchema.methods.generateReferralCode = function (): string {
    // This is a placeholder. Actual generation logic might be in the service or controller.
    // But if we want it on the model:
    const prefix = (this.firstName?.slice(0, 1) + this.lastName?.slice(0, 1)).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${random}`;
};

export const Agent = (mongoose.models.Agent as mongoose.Model<IAgent>) || User.discriminator<IAgent>('Agent', agentSchema, UserRole.AGENT);
