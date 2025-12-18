import dbConnect from '@/lib/mongodb';
import { AgentProfile, IAgentProfileModel } from '@/models/AgentProfile';
import { CustomerProfile } from '@/models/CustomerProfile';
import { User, UserRole, UserStatus } from '@/models/User';
import { Customer } from '@/models/users/Customer';
import { NextRequest, NextResponse } from 'next/server';
import { createElement } from 'react';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      // Personal Information
      title,
      firstName,
      lastName,
      dateOfBirth,
      phone,
      email,
      maritalStatus,
      occupation,
      nationality,
      stateOfOrigin,
      localGovernmentArea,
      // Address
      residentialAddress,
      postalAddress,
      // Next of Kin
      nextOfKin,
      // Required Documents
      requiredDocuments,
      // Referral
      referralCode,
      password,
    } = body;

    // Validate required fields
    const requiredFields = [
      'title', 'firstName', 'lastName', 'dateOfBirth', 'phone', 'email', 'maritalStatus', 'occupation', 'nationality', 'stateOfOrigin', 'localGovernmentArea', 'residentialAddress', 'nextOfKin', 'requiredDocuments', 'password'
    ];
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', missingFields },
        { status: 400 }
      );
    }

    // Validate requiredDocuments
    if (!requiredDocuments.idImage || !requiredDocuments.passportPhoto || !requiredDocuments.proofOfPayment) {
      return NextResponse.json(
        { error: 'All required documents (idImage, passportPhoto, proofOfPayment) must be provided' },
        { status: 400 }
      );
    }

    // Validate nextOfKin
    if (!nextOfKin.fullName || !nextOfKin.relationship || !nextOfKin.phone) {
      return NextResponse.json(
        { error: 'Next of kin fullName, relationship, and phone are required' },
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
        { error: 'Customer must be at least 18 years old' },
        { status: 400 }
      );
    }

    // Handle referral code validation
    let referredBy = null;
    let referralSource = 'direct';
    if (referralCode) {
      const referringAgent = await (AgentProfile as IAgentProfileModel).findByReferralCode(referralCode);
      if (!referringAgent) {
        return NextResponse.json(
          { error: 'Invalid referral code' },
          { status: 400 }
        );
      }
      referredBy = referringAgent.userId;
      referralSource = 'agent';
    }

    // Create customer user
    const customer = new Customer({
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      role: UserRole.CUSTOMER,
      status: UserStatus.PENDING,
      referredBy,
    });
    await customer.save();

    // Create customer profile
    const customerProfile = new CustomerProfile({
      userId: customer._id,
      title,
      fullName: `${firstName} ${lastName}`,
      dateOfBirth,
      phone,
      email,
      maritalStatus,
      occupation,
      nationality,
      stateOfOrigin,
      localGovernmentArea,
      residentialAddress,
      postalAddress,
      nextOfKin,
      requiredDocuments,
      referralSource,
      referredBy,
    });
    await customerProfile.save();

    // Send welcome email (don't fail registration if email fails)
    try {
      const { EMAIL_FROM, EMAIL_SUBJECTS } = await import('@/lib/resend');
      const { sendEmail } = await import('@/lib/email');
      const { WelcomeEmail } = await import('@/emails/WelcomeEmail');
      const { render } = await import('@react-email/render');

      let referredByAgentName = null;
      if (referredBy) {
        const referringAgentUser = await User.findById(referredBy);
        if (referringAgentUser) {
          referredByAgentName = `${referringAgentUser.firstName} ${referringAgentUser.lastName}`;
        }
      }

      const emailHtml = await render(
        createElement(WelcomeEmail, {
          fullName: `${firstName} ${lastName}`,
          email,
          referralCode: referralCode || undefined,
          referredByAgent: referredByAgentName || undefined,
        })
      );

      await sendEmail({
        from: EMAIL_FROM,
        to: email,
        subject: EMAIL_SUBJECTS.CUSTOMER_WELCOME,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue with registration even if email fails
    }

    return NextResponse.json({
      message: 'Customer registration submitted successfully',
      user: {
        id: customer._id,
        email: customer.email,
        firstName,
        lastName,
        role: customer.role,
        status: customer.status,
        referredBy: customer.referredBy,
      },
      requiresApproval: true,
      nextSteps: [
        'Your registration has been submitted for admin review',
        'You will receive an email notification once approved',
      ],

      referralInfo: referralCode ? {
        referredBy,
        referralCode,
      } : null,
    }, { status: 201 });

  } catch (error) {
    console.error('Customer registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 