import { Schema } from 'mongoose';
import { IUser, User, UserRole } from '../User';

export interface ICustomer extends IUser {
    // Add customer specific fields here if any
}

const customerSchema = new Schema<ICustomer>({
    // Customer specific schema fields
});

import mongoose from 'mongoose';
export const Customer = (mongoose.models.Customer as mongoose.Model<ICustomer>) || User.discriminator<ICustomer>('Customer', customerSchema, UserRole.CUSTOMER);
