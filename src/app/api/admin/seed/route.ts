import { AdminWelcomeEmail } from '@/emails/AdminWelcomeEmail';
import { authenticateUser } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { User, UserRole, UserStatus } from '@/models/User';
import { Admin } from '@/models/users/Admin';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { createElement } from 'react';

export async function POST(req: NextRequest) {
    try {
        // 1. Dual Protection Check
        let isAuthorized = false;

        // Check 1: Admin/SuperAdmin Token
        const user = await authenticateUser(req);
        if (user && (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN)) {
            isAuthorized = true;
        }

        // Check 2: Secret Key
        const adminSecretKey = req.headers.get('x-admin-secret-key');
        if (adminSecretKey && adminSecretKey === process.env.ADMIN_SEED_SECRET) {
            isAuthorized = true;
        }

        if (!isAuthorized) {
            return NextResponse.json(
                { error: 'Unauthorized: Missing valid token or secret key' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { email, firstName, lastName, phone } = body;


        // Connect to DB
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI!);
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Generate Temp Password
        const tempPassword = crypto.randomBytes(8).toString('hex');

        // Create Admin User
        const newAdmin = await Admin.create({
            email,
            password: tempPassword, // Will be hashed by pre-save hook
            firstName,
            lastName,
            phone,
            role: UserRole.ADMIN,
            status: UserStatus.APPROVED,
            mustChangePassword: true,
            approvedAt: new Date(),
        });

        console.log("Temp password", tempPassword)

        // Send Welcome Email
        try {
            const { render } = await import('@react-email/render');

            const emailHtml = await render(createElement(AdminWelcomeEmail, {
                fullName: `${firstName} ${lastName}`,
                email,
                tempPassword,
                loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin`,
            }));

            await sendEmail({
                from: 'CBS Logistics <onboarding@resend.dev>', // Update with your verified domain
                to: email,
                subject: 'Welcome to CBS Logistics Admin Team',
                html: emailHtml,
            });
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            // Continue execution, don't fail the request just because email failed (though ideally we should handle this better)
        }

        return NextResponse.json(
            {
                message: 'Admin created successfully',
                admin: {
                    id: newAdmin._id,
                    email: newAdmin.email,
                    role: newAdmin.role,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error seeding admin:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
