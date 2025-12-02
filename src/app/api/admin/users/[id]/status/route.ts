import dbConnect from '@/lib/mongodb';
import { User, UserStatus } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const { status, reason } = await req.json();

        if (!Object.values(UserStatus).includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const updateData: any = { status };

        if (status === UserStatus.DEACTIVATED) {
            updateData.deactivatedAt = new Date();
            updateData.deactivationReason = reason;
            // You might want to get the admin ID from the session here
            // updateData.deactivatedBy = adminId;
        } else if (status === UserStatus.APPROVED) {
            updateData.approvedAt = new Date();
            // updateData.approvedBy = adminId;
        }

        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: `User status updated to ${status}`,
            user,
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
