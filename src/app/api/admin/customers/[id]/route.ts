import { AuthenticatedRequest, authenticateUser, requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Customer } from '@/models/users/Customer';
import { NextResponse } from 'next/server';

export async function DELETE(
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

        const customer = await Customer.findByIdAndDelete(id);

        if (!customer) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Customer deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting customer:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
