import dbConnect from '@/lib/mongodb';
import { AgentProfile } from '@/models/AgentProfile';
import { User, UserRole, UserStatus } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { createElement } from 'react';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      // Basic Information
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      
      // Address Information
      address,
      
      // Agent-Specific Information
      nationalId,
      passportNumber,
      taxIdentificationNumber,
      businessLicense,
      bankName,
      bankAccountNumber,
      bankAccountName,
      emergencyContact,
      
      // Professional Information
      references,
      
      // Business Information
      businessAddress,
      
      // Commission Structure
      commissionRate,
      paymentMethod,
      paymentDetails,
      
      // Documents
      profileImage,
      idDocument,
      businessLicenseDocument,
    } = body;

    // Validate required fields
    const requiredFields = [
      'email', 'password', 'firstName', 'lastName', 'phone',
      'nationalId', 'dateOfBirth', 'gender', 'address',
      'bankName', 'bankAccountNumber', 'bankAccountName',
      'emergencyContact', 'agreeToTerms', 'agreeToCommissionStructure'
    ];

    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          missingFields 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Validate age (must be 18 or older)
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (age < 18 || (age === 18 && monthDiff < 0)) {
      return NextResponse.json(
        { error: 'Agent must be at least 18 years old' },
        { status: 400 }
      );
    }

    // Create agent user
    const agent = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      address,
      role: UserRole.AGENT,
      status: UserStatus.PENDING, // Agents require admin approval
    });

    await agent.save();

    // Create agent profile (without referral code initially)
    const agentProfile = new AgentProfile({
      userId: agent._id,
      nationalId,
      passportNumber,
      taxIdentificationNumber,
      businessLicense,
      bankName,
      bankAccountNumber,
      bankAccountName,
      emergencyContact,
      references: references || [],
      businessAddress,
      commissionRate: parseFloat(commissionRate) || 0.05, // Default 5%
      paymentMethod,
      paymentDetails,
      profileImage,
      documents: {
        idDocument,
        businessLicenseDocument,
      },
    });

    await agentProfile.save();

    // Send welcome email (don't fail registration if email fails)
    try {
      const { resend, EMAIL_FROM, EMAIL_SUBJECTS } = await import('@/lib/resend');
      const { AgentWelcomeEmail } = await import('@/emails/AgentWelcomeEmail');
      const { render } = await import('@react-email/render');

      const emailHtml = await render(
        createElement(AgentWelcomeEmail, {
          firstName,
          lastName,
          email,
        })
      );

      await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: EMAIL_SUBJECTS.AGENT_WELCOME,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue with registration even if email fails
    }

    return NextResponse.json({
      message: 'Agent registration submitted successfully',
      user: {
        id: agent._id,
        email: agent.email,
        firstName: agent.firstName,
        lastName: agent.lastName,
        role: agent.role,
        status: agent.status,
        referralCode: agent.referralCode,
      },
      requiresApproval: true,
      nextSteps: [
        'Your application has been submitted for admin review',
        'You will receive an email notification once approved',
        'Upon approval, you will receive your unique referral code',
        'You can then start referring customers to earn commissions',
      ],
    }, { status: 201 });

  } catch (error) {
    console.error('Agent registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 