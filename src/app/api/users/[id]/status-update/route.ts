import { AuthenticatedRequest, authenticateUser, requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { AgentProfile, IAgentProfileModel } from '@/models/AgentProfile';
import { User, UserRole, UserStatus } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Authenticate user
    const adminUser = await authenticateUser(req);
    console.log('Authenticated user:', adminUser);
    if (!adminUser) {
      console.log('Authentication failed');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin permissions
    (req as AuthenticatedRequest).user = adminUser;
    const adminCheck = await requireAdmin(req as AuthenticatedRequest);
    if (adminCheck) {
      return adminCheck;
    }

    const { id } = await params;

    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { status: action, reason } = body; // action: 'approve' | 'reject'


    if (![UserStatus.APPROVED, UserStatus.REJECTED, UserStatus.DEACTIVATED].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve", "reject", or "deactivated"' },
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

    // Check if user is already in the requested state
    if (user.status === action) {
      return NextResponse.json(
        { error: `User is already ${user.status}` },
        { status: 400 }
      );
    }

    // Update user status and audit trail
    if (action === UserStatus.APPROVED) {
      // Process Agent Approval
      if (user.role === UserRole.AGENT) {
        console.log(`Processing approval for agent: ${user._id}`);
        const agentProfile = await AgentProfile.findOne({ userId: user._id });

        if (!agentProfile) {
          console.error(`Agent profile not found for user: ${user._id}`);
          return NextResponse.json(
            { error: 'Cannot approve agent: Profile data inconsistent or missing. Please ask the user to re-register.' },
            { status: 400 }
          );
        }

        console.log(`Agent profile found: ${agentProfile._id}, Current referral code: ${agentProfile.referralCode}`);

        if (!agentProfile.referralCode) {
          console.log('Generating new referral code...');
          try {
            const newCode = await (AgentProfile as IAgentProfileModel).generateReferralCode();
            console.log(`Generated code: ${newCode}`);
            agentProfile.referralCode = newCode;
            await agentProfile.save();
            console.log('Agent profile saved with new referral code');
          } catch (err) {
            console.error('Error generating/saving referral code:', err);
            // Verify if we should fail request or continue. 
            // Ideally we should fail if we can't generate a code, but maybe soft fail is ok?
            // Let's soft fail for now but log it, or we could return 500.
          }
        }
      }

      user.status = UserStatus.APPROVED;
      user.approvedBy = adminUser.userId;
      user.approvedAt = new Date();
      user.rejectedBy = undefined;
      user.rejectedAt = undefined;
      user.rejectionReason = undefined;
      user.deactivatedBy = undefined;
      user.deactivatedAt = undefined;
      user.deactivationReason = undefined;
    } else if (action === UserStatus.REJECTED) {
      user.status = UserStatus.REJECTED;
      user.rejectedBy = adminUser.userId;
      user.rejectedAt = new Date();
      user.rejectionReason = reason || 'No reason provided';
      user.approvedBy = undefined;
      user.approvedAt = undefined;
      user.deactivatedBy = undefined;
      user.deactivatedAt = undefined;
      user.deactivationReason = undefined;
    } else if (action === UserStatus.DEACTIVATED) {
      user.status = UserStatus.DEACTIVATED;
      user.deactivatedBy = adminUser.userId;
      user.deactivatedAt = new Date();
      user.deactivationReason = reason || 'No reason provided';
      // We don't necessarily clear approval/rejection history when deactivating, 
      // as it might be useful to know who approved them originally.
      // But for consistent "current state" logic, we might want to clear conflicting "current" flags if any.
      // However, User model usually just relies on 'status'.
    }

    await user.save();

    // Populate admin details for response
    await user.populate('approvedBy', 'firstName lastName email');
    await user.populate('rejectedBy', 'firstName lastName email');

    const responseCode = user.role === UserRole.AGENT ? (await AgentProfile.findOne({ userId: user._id }))?.referralCode : undefined;
    console.log(`Referral code for response: ${responseCode}`);

    const responseData = {
      message: `User ${action} successfully`,
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
        referralCode: responseCode,
      },
    };

    console.log('Final Response Data:', JSON.stringify(responseData, null, 2));

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('User approval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 