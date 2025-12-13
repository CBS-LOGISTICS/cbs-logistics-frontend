import { Schema } from 'mongoose';
import { IUser, User, UserRole } from '../User';

export interface ISupplier extends IUser {
    // Add supplier specific fields here if any
    bankDetails?: {
        accountName: string;
        accountNumber: string;
        bankName: string;
        swiftCode: string;
    };
}

const supplierSchema = new Schema<ISupplier>({
    bankDetails: {
        accountName: { type: String, trim: true },
        accountNumber: { type: String, trim: true },
        bankName: { type: String, trim: true },
        swiftCode: { type: String, trim: true },
    },
});

import mongoose from 'mongoose';
export const Supplier = (mongoose.models.Supplier as mongoose.Model<ISupplier>) || User.discriminator<ISupplier>('Supplier', supplierSchema, UserRole.SUPPLIER);
