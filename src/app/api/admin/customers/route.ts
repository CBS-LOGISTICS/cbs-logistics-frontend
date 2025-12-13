import { AuthenticatedRequest, authenticateUser, requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Customer } from '@/models/users/Customer';
import { NextResponse } from 'next/server';

export async function GET(req: AuthenticatedRequest) {
    try {
        const user = await authenticateUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        req.user = user;

        const roleCheck = await requireAdmin(req);
        if (roleCheck) {
            return roleCheck;
        }

        await dbConnect();
        const customers = await Customer.find({})
            .populate('referredBy', 'firstName lastName email referralCode')
            .sort({ createdAt: -1 });
        return NextResponse.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
