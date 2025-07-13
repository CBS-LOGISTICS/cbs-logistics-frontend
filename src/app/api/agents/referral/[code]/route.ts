import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { AgentProfile, IAgentProfileModel } from '@/models/AgentProfile';

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    await dbConnect();

    const { code } = params;

    // Validate referral code format
    const referralCodeRegex = /^[A-Z]{6}[0-9]{2}$/;
    if (!referralCodeRegex.test(code)) {
      return NextResponse.json(
        { error: 'Invalid referral code format' },
        { status: 400 }
      );
    }

    // Find agent by referral code
    const agentProfile = await (AgentProfile as IAgentProfileModel).findByReferralCode(code);

    if (!agentProfile) {
      return NextResponse.json(
        { error: 'Agent not found or inactive' },
        { status: 404 }
      );
    }

    // Check if the agent's user account is approved
    const user = agentProfile.userId as unknown as { _id: string; firstName: string; lastName: string; email: string; status: string };
    if (user.status !== 'approved') {
      return NextResponse.json(
        { error: 'Agent account not approved' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      agent: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        referralCode: agentProfile.referralCode,
        status: user.status,
      },
      profile: {
        nationalId: agentProfile.nationalId,
        businessAddress: agentProfile.businessAddress,
        commissionRate: agentProfile.commissionRate,
        paymentMethod: agentProfile.paymentMethod,
      },
    });

  } catch (error) {
    console.error('Get agent by referral code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 