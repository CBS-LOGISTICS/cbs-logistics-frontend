import { AuthenticatedRequest, authenticateUser, requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { UserStatus } from '@/models/user-types';
import { Customer } from '@/models/users/Customer';
import { NextResponse } from 'next/server';

export async function POST(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
        const { id } = await params;

        const customer = await Customer.findById(id);

        if (!customer) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            );
        }

        customer.status = UserStatus.APPROVED;
        customer.approvedAt = new Date();
        // customer.approvedBy = adminId; // TODO: Get admin ID from session
        await customer.save();

        return NextResponse.json({
            message: 'Customer approved successfully',
            customer,
        });
    } catch (error) {
        console.error('Error approving customer:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
