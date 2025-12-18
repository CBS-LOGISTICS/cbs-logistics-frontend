import { AuthenticatedRequest, authenticateUser, requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { AgentProfile } from '@/models/AgentProfile';
import { CustomerProfile } from '@/models/CustomerProfile';
import { User, UserRole } from '@/models/User';
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

        const targetUser = await User.findById(id);

        if (!targetUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Prevent deleting yourself
        if (targetUser._id.toString() === user.userId) {
            return NextResponse.json(
                { error: 'Cannot delete your own account' },
                { status: 400 }
            );
        }

        // Delete associated profile based on role
        if (targetUser.role === UserRole.AGENT) {
            await AgentProfile.deleteOne({ userId: targetUser._id });
        } else if (targetUser.role === UserRole.CUSTOMER) {
            await CustomerProfile.deleteOne({ userId: targetUser._id });
        }

        // Delete the user
        await User.findByIdAndDelete(id);

        return NextResponse.json({
            message: 'User deleted successfully',
            id: id
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
