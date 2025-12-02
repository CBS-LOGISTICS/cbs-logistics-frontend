import { AgentApprovalEmail } from '@/emails/AgentApprovalEmail';
import dbConnect from '@/lib/mongodb';
import { EMAIL_FROM, EMAIL_SUBJECTS, resend } from '@/lib/resend';
import { User, UserRole, UserStatus } from '@/models/User';
import { render } from '@react-email/render';
import { NextRequest, NextResponse } from 'next/server';
import { createElement } from 'react';

// Helper to generate a random referral code
function generateReferralCode(firstName: string, lastName: string): string {
    const prefix = (firstName.slice(0, 1) + lastName.slice(0, 1)).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${random}`;
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const agent = await User.findById(id);

        if (!agent) {
            return NextResponse.json(
                { error: 'Agent not found' },
                { status: 404 }
            );
        }

        if (agent.role !== UserRole.AGENT) {
            return NextResponse.json(
                { error: 'User is not an agent' },
                { status: 400 }
            );
        }

        if (agent.status === UserStatus.APPROVED) {
            return NextResponse.json(
                { error: 'Agent is already approved' },
                { status: 400 }
            );
        }

        // Generate unique referral code
        let referralCode = generateReferralCode(agent.firstName, agent.lastName);
        let isUnique = false;
        while (!isUnique) {
            const existing = await User.findOne({ referralCode });
            if (!existing) {
                isUnique = true;
            } else {
                referralCode = generateReferralCode(agent.firstName, agent.lastName);
            }
        }

        // Update agent status and referral code
        agent.status = UserStatus.APPROVED;
        agent.referralCode = referralCode;
        agent.approvedAt = new Date();
        // agent.approvedBy = adminId; // TODO: Get admin ID from session
        await agent.save();

        // Send approval email
        try {
            const emailHtml = await render(
                createElement(AgentApprovalEmail, {
                    firstName: agent.firstName,
                    referralCode: agent.referralCode,
                    loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/signin`,
                })
            );

            await resend.emails.send({
                from: EMAIL_FROM,
                to: agent.email,
                subject: EMAIL_SUBJECTS.AGENT_APPROVED,
                html: emailHtml,
            });
        } catch (emailError) {
            console.error('Failed to send approval email:', emailError);
            // Don't fail the request if email fails
        }

        return NextResponse.json({
            message: 'Agent approved successfully',
            agent: {
                id: agent._id,
                status: agent.status,
                referralCode: agent.referralCode,
            },
        });
    } catch (error) {
        console.error('Error approving agent:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
