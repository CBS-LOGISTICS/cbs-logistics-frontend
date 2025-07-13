import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, UserStatus, UserRole } from '@/models/User';
import { AgentProfile, IAgentProfileModel } from '@/models/AgentProfile';
import { authenticateUser, requireAdmin, AuthenticatedRequest } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Authenticate user
    const adminUser = await authenticateUser(req);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin permissions
    const adminCheck = await requireAdmin(req as AuthenticatedRequest);
    if (adminCheck) {
      return adminCheck;
    }

    const { id } = params;
    const body = await req.json();
    const { action, reason } = body; // action: 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Find user to approve/reject
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already in final state
    if (user.status === UserStatus.APPROVED || user.status === UserStatus.REJECTED) {
      return NextResponse.json(
        { error: `User is already ${user.status}` },
        { status: 400 }
      );
    }

    // Update user status and audit trail
    if (action === 'approve') {
      user.status = UserStatus.APPROVED;
      user.approvedBy = adminUser.userId;
      user.approvedAt = new Date();
      user.rejectedBy = undefined;
      user.rejectedAt = undefined;
      user.rejectionReason = undefined;

      // Generate referral code for approved agents
      if (user.role === UserRole.AGENT) {
        const agentProfile = await AgentProfile.findOne({ userId: user._id });
        if (agentProfile && !agentProfile.referralCode) {
          agentProfile.referralCode = await (AgentProfile as IAgentProfileModel).generateReferralCode();
          await agentProfile.save();
        }
      }
    } else {
      user.status = UserStatus.REJECTED;
      user.rejectedBy = adminUser.userId;
      user.rejectedAt = new Date();
      user.rejectionReason = reason || 'No reason provided';
      user.approvedBy = undefined;
      user.approvedAt = undefined;
    }

    await user.save();

    // Populate admin details for response
    await user.populate('approvedBy', 'firstName lastName email');
    await user.populate('rejectedBy', 'firstName lastName email');

    return NextResponse.json({
      message: `User ${action}d successfully`,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        approvedBy: user.approvedBy,
        approvedAt: user.approvedAt,
        rejectedBy: user.rejectedBy,
        rejectedAt: user.rejectedAt,
        rejectionReason: user.rejectionReason,
      },
    });

  } catch (error) {
    console.error('User approval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 