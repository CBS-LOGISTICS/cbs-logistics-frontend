import { authenticateUser } from '@/lib/auth';
import { User } from '@/models/User';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const userPayload = await authenticateUser(req);
        if (!userPayload) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!newPassword || newPassword.length < 8) {
            return NextResponse.json(
                { error: 'New password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        // Connect to DB
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI!);
        }

        const user = await User.findById(userPayload.userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Optional: Verify current password if provided (good practice)
        // If mustChangePassword is true, they might be using a temp password, so we should verify it.
        if (currentPassword) {
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return NextResponse.json(
                    { error: 'Invalid current password' },
                    { status: 400 }
                );
            }
        }

        // Update password
        user.password = newPassword; // Will be hashed by pre-save hook
        user.mustChangePassword = false;
        await user.save();

        return NextResponse.json(
            { message: 'Password updated successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error changing password:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
