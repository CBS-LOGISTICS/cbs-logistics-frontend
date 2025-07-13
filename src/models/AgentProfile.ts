import mongoose, { Document, Schema } from "mongoose";

export interface IAgentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Agent Identification
  referralCode: string; // Unique 6-letter + 2-number combination
  
  // Personal Information
  nationalId: string;
  passportNumber?: string;
  taxIdentificationNumber?: string;
  businessLicense?: string;
  
  // Financial Information
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };

  references: Array<{
    name: string;
    position: string;
    company: string;
    phone: string;
    email: string;
    relationship: string;
  }>;

  // Business Contact Information
  businessAddress?: string;

  // Commission Structure
  commissionRate: number;
  paymentMethod: string;
  paymentDetails: string;

  // Documents
  profileImage?: string;
  documents: {
    idDocument?: string;
    businessLicenseDocument?: string;
  };

  // Agreements
  agreements: {
    terms: boolean;
    commissionStructure: boolean;
    dataProcessing: boolean;
    agreedAt: Date;
  };

  // Metadata
  registrationDate: Date;
  lastUpdated: Date;
  isActive: boolean;
}

const agentProfileSchema = new Schema<IAgentProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    
    // Agent Identification
    referralCode: {
      type: String,
      required: [true, "Referral code is required"],
      unique: true,
      match: [/^[A-Z]{6}[0-9]{2}$/, "Referral code must be 6 letters followed by 2 numbers"],
    },
    
    // Personal Information
    nationalId: {
      type: String,
      required: [true, "National ID is required"],
      unique: true,
    },
    passportNumber: String,
    taxIdentificationNumber: String,
    businessLicense: String,

    // Financial Information
    bankName: {
      type: String,
      required: [true, "Bank name is required"],
    },
    bankAccountNumber: {
      type: String,
      required: [true, "Bank account number is required"],
    },
    bankAccountName: {
      type: String,
      required: [true, "Bank account name is required"],
    },
    emergencyContact: {
      name: {
        type: String,
        required: [true, "Emergency contact name is required"],
      },
      relationship: {
        type: String,
        required: [true, "Emergency contact relationship is required"],
      },
      phone: {
        type: String,
        required: [true, "Emergency contact phone is required"],
      },
      email: String,
    },

    // Professional Information

    references: [
      {
        name: {
          type: String,
          required: true,
        },
        position: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        relationship: {
          type: String,
          required: true,
        },
      },
    ],

    // Business Contact Information
    businessAddress: String,

    // Commission Structure
    commissionRate: {
      type: Number,
      default: 0.05,
      min: [0, "Commission rate cannot be negative"],
      max: [1, "Commission rate cannot exceed 100%"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
    },
    paymentDetails: {
      type: String,
      required: [true, "Payment details are required"],
    },

    // Documents
    profileImage: String,
    documents: {
      idDocument: String,
      businessLicenseDocument: String,
      bankStatement: String,
      taxClearance: String,
    },

    // Agreements

    // Metadata
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
agentProfileSchema.index({ userId: 1 });
agentProfileSchema.index({ referralCode: 1 });
agentProfileSchema.index({ nationalId: 1 });
agentProfileSchema.index({ isActive: 1 });

// Update lastUpdated timestamp on save
agentProfileSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

// Static method to generate unique referral code
agentProfileSchema.statics.generateReferralCode = async function (): Promise<string> {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let referralCode: string;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate 6 random letters
    const letterPart = Array.from({ length: 6 }, () => 
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join('');
    
    // Generate 2 random numbers
    const numberPart = Array.from({ length: 2 }, () => 
      numbers.charAt(Math.floor(Math.random() * numbers.length))
    ).join('');
    
    referralCode = letterPart + numberPart;
    
    // Check if this referral code already exists
    const existingAgent = await this.findOne({ referralCode });
    if (!existingAgent) {
      isUnique = true;
    }
  }
  
  return referralCode!;
};

// Static method to find agent by referral code
agentProfileSchema.statics.findByReferralCode = function (referralCode: string) {
  return this.findOne({ 
    referralCode, 
    isActive: true 
  }).populate('userId', 'firstName lastName email status role');
};

// Static methods interface
export interface IAgentProfileModel extends mongoose.Model<IAgentProfile> {
  generateReferralCode(): Promise<string>;
  findByReferralCode(referralCode: string): Promise<IAgentProfile | null>;
}

export const AgentProfile =
  mongoose.models.AgentProfile ||
  mongoose.model<IAgentProfile, IAgentProfileModel>("AgentProfile", agentProfileSchema);
