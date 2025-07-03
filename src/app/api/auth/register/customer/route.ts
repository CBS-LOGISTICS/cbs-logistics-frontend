import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, UserRole, UserStatus } from '@/models/User';
import { CustomerProfile } from '@/models/CustomerProfile';
import { AgentProfile, IAgentProfileModel } from '@/models/AgentProfile';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      // Personal Information
      title,
      fullName,
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
      'title', 'fullName', 'dateOfBirth', 'phone', 'email', 'maritalStatus', 'occupation', 'nationality', 'stateOfOrigin', 'localGovernmentArea', 'residentialAddress', 'nextOfKin', 'requiredDocuments', 'password'
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
    const customer = new User({
      email,
      password,
      firstName: fullName.split(' ')[0],
      lastName: fullName.split(' ').slice(1).join(' ') || fullName.split(' ')[0],
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
      fullName,
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

    return NextResponse.json({
      message: 'Customer registration submitted successfully',
      user: {
        id: customer._id,
        email: customer.email,
        fullName,
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