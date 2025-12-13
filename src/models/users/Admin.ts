import { Schema } from 'mongoose';
import { IUser, User, UserRole } from '../User';

export interface IAdmin extends IUser {
    // Add admin specific fields here if any
}

const adminSchema = new Schema<IAdmin>({
    // Admin specific schema fields
});

import mongoose from 'mongoose';
export const Admin = (mongoose.models.Admin as mongoose.Model<IAdmin>) || User.discriminator<IAdmin>('Admin', adminSchema, UserRole.ADMIN);
