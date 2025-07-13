import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, UserRole } from '@/models/User';
import { AgentProfile } from '@/models/AgentProfile';
import { authenticateUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;

    // Check if user is the agent or an admin
    const isOwnProfile = user.userId === id;
    const isAdmin = [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role as UserRole);

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get agent and profile
    const [agent, agentProfile] = await Promise.all([
      User.findById(id).select('-password -emailVerificationToken -passwordResetToken'),
      AgentProfile.findOne({ userId: id }),
    ]);

    if (!agent || agent.role !== UserRole.AGENT) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    if (!agentProfile) {
      return NextResponse.json(
        { error: 'Agent profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      agent: {
        id: agent._id,
        email: agent.email,
        firstName: agent.firstName,
        lastName: agent.lastName,
        phone: agent.phone,
        dateOfBirth: agent.dateOfBirth,
        gender: agent.gender,
        address: agent.address,
        role: agent.role,
        status: agent.status,
        referralCode: agent.referralCode,
        approvedBy: agent.approvedBy,
        approvedAt: agent.approvedAt,
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt,
      },
      profile: agentProfile,
    });

  } catch (error) {
    console.error('Get agent profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 