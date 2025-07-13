import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  // Personal Information
  title: string;
  fullName: string;
  dateOfBirth: Date;
  phone: string;
  email: string;
  maritalStatus: 'single' | 'married' | 'other';
  occupation: string;
  nationality: string;
  stateOfOrigin: string;
  localGovernmentArea: string;
  // Address
  residentialAddress: string;
  postalAddress?: string;
  // Next of Kin
  nextOfKin: {
    fullName: string;
    relationship: string;
    phone: string;
    email?: string;
    contactAddress?: string;
  };
  // Required Documents (images)
  requiredDocuments: {
    idImage: string; // URL or file reference
    passportPhoto: string; // URL or file reference
    proofOfPayment: string; // URL or file reference
  };
  // Referral
  referralSource?: 'agent' | 'direct';
  referredBy?: mongoose.Types.ObjectId;
}

const customerProfileSchema = new Schema<ICustomerProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  title: { type: String, required: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  maritalStatus: { type: String, enum: ['single', 'married', 'other'], required: true },
  occupation: { type: String, required: true },
  nationality: { type: String, required: true },
  stateOfOrigin: { type: String, required: true },
  localGovernmentArea: { type: String, required: true },
  residentialAddress: { type: String, required: true },
  postalAddress: { type: String },
  nextOfKin: {
    fullName: { type: String, required: true },
    relationship: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    contactAddress: { type: String },
  },
  requiredDocuments: {
    idImage: { type: String, required: true },
    passportPhoto: { type: String, required: true },
    proofOfPayment: { type: String, required: true },
  },
  referralSource: { type: String, enum: ['agent', 'direct'], default: 'direct' },
  referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

customerProfileSchema.index({ userId: 1 });
customerProfileSchema.index({ referredBy: 1 });

export const CustomerProfile = mongoose.models.CustomerProfile || mongoose.model<ICustomerProfile>('CustomerProfile', customerProfileSchema); 