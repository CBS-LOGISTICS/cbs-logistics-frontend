import dbConnect from '@/lib/mongodb';
import { User, UserRole, UserStatus } from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        await dbConnect();

        // Check if an admin already exists
        const existingAdmin = await User.findOne({ role: UserRole.ADMIN });
        if (existingAdmin) {
            return NextResponse.json(
                { message: 'Admin user already exists' },
                { status: 400 }
            );
        }

        // Create new admin user
        const admin = await User.create({
            email: 'admin@cbslogistics.com',
            password: 'Password123!', // Change this in production
            firstName: 'Admin',
            lastName: 'User',
            phone: '0000000000',
            role: UserRole.ADMIN,
            status: UserStatus.APPROVED,
            isEmailVerified: true,
        });

        return NextResponse.json({
            message: 'Admin user created successfully',
            user: {
                id: admin._id,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error('Error seeding admin:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
