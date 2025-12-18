import { AuthenticatedRequest, authenticateUser, requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Agent } from '@/models/users/Agent';
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
        // Use lean() to get plain JavaScript objects that we can modify
        const agents = await Agent.find({}).sort({ createdAt: -1 }).lean();

        // Fetch profiles for all agents to get referral codes
        const agentIds = agents.map(agent => agent._id);
        const profiles = await import('@/models/AgentProfile').then(m =>
            m.AgentProfile.find({ userId: { $in: agentIds } }).lean()
        );

        // Map profiles to agents
        const agentsWithDetails = agents.map(agent => {
            const profile = profiles.find(p => p.userId.toString() === agent._id.toString());
            return {
                ...agent,
                referralCode: profile?.referralCode || undefined
            };
        });

        return NextResponse.json(agentsWithDetails);
    } catch (error) {
        console.error('Error fetching agents:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
