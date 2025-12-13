import { authenticateUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { User, UserRole } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/users/[id] - Update user (Admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Authenticate user
    const user = await authenticateUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin permissions
    // Check permissions: Admin can update anyone, User can only update themselves
    const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
    const { id } = await params;

    if (!isAdmin && user.userId !== id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own profile' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      status,
      commissionRate,
      role,
      firstName,
      lastName,
      phone,
      address,
      bankDetails
    } = body;

    // Find user
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Admin-only fields
    if (isAdmin) {
      if (status) targetUser.status = status;
      if (commissionRate !== undefined) targetUser.commissionRate = commissionRate;
      if (role) targetUser.role = role;

      // If status is changing, track who changed it
      if (status && status !== targetUser.status) {
        if (status === 'approved') {
          targetUser.approvedBy = user.userId;
          targetUser.approvedAt = new Date();
        } else if (status === 'rejected') {
          targetUser.rejectedBy = user.userId;
          targetUser.rejectedAt = new Date();
        } else if (status === 'deactivated') {
          targetUser.deactivatedBy = user.userId;
          targetUser.deactivatedAt = new Date();
        }
      }
    }

    // Fields anyone can update (for themselves or by admin)
    if (firstName) targetUser.firstName = firstName;
    if (lastName) targetUser.lastName = lastName;
    if (phone) targetUser.phone = phone;
    if (address) targetUser.address = { ...targetUser.address, ...address };
    if (bankDetails) targetUser.bankDetails = { ...targetUser.bankDetails, ...bankDetails };

    await targetUser.save();

    return NextResponse.json({
      message: 'User updated successfully',
      user: targetUser,
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/users/[id] - Get single user details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const user = await authenticateUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const targetUser = await User.findById(id).select('-password');

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: targetUser });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
