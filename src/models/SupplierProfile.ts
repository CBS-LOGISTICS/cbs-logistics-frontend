import mongoose, { Document, Schema } from 'mongoose';

export interface ISupplierProfile extends Document {
  user: mongoose.Types.ObjectId;
  businessName: string;
  businessType: string; // e.g., Manufacturer, Distributor
  registrationNumber: string;
  taxId?: string;
  
  // Contact & Location
  businessAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  website?: string;
  
  // Capabilities
  categories: string[]; // e.g., ["Construction", "Oil & Gas"]
  
  // Verification
  documents: {
    name: string;
    url: string;
    type: 'registration' | 'tax' | 'license' | 'other';
    verified: boolean;
  }[];
  
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  
  // Onboarding
  onboardedBy: mongoose.Types.ObjectId; // Agent who onboarded
  onboardingFeePaid: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const supplierProfileSchema = new Schema<ISupplierProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    businessType: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
    },
    taxId: String,
    businessAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    website: String,
    categories: [String],
    documents: [
      {
        name: String,
        url: String,
        type: {
          type: String,
          enum: ['registration', 'tax', 'license', 'other'],
        },
        verified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: Date,
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    onboardedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    onboardingFeePaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const SupplierProfile = mongoose.models.SupplierProfile || mongoose.model<ISupplierProfile>('SupplierProfile', supplierProfileSchema);
