import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { User, UserRole } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  status: string;
  mustChangePassword?: boolean;
}

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}

// Extract token from request headers
export function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Also check for the token in cookies
  const cookieToken = req.cookies.get('authToken')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

// Authentication middleware
export async function authenticateUser(req: NextRequest): Promise<JWTPayload | null> {
  try {
    const token = extractToken(req);
    if (!token) {
      console.log('No token found in request');
      return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
      console.log('Invalid token');
      return null;
    }

    // Verify user still exists and is active
    const user = await User.findById(payload.userId).select('status role mustChangePassword');
    if (!user || user.status !== 'approved') {
      console.log('User not found or not approved');
      return null;
    }

    return payload;
  } catch {
    console.log('Authentication failed');
    return null;
  }
}

// Role-based access control middleware
export function requireRole(allowedRoles: UserRole[]) {
  return async (req: AuthenticatedRequest): Promise<NextResponse | null> => {
    if (!req.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return null;
  };
}

// Admin-only middleware
export const requireAdmin = requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);

// Super admin-only middleware
export const requireSuperAdmin = requireRole([UserRole.SUPER_ADMIN]);

// Agent-only middleware
export const requireAgent = requireRole([UserRole.AGENT]);

// Customer-only middleware
export const requireCustomer = requireRole([UserRole.CUSTOMER]);

// Helper function to check if user can approve/reject
export function canApproveReject(userRole: UserRole): boolean {
  return [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(userRole);
}

// Helper function to check if user can manage agents
export function canManageAgents(userRole: UserRole): boolean {
  return [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(userRole);
}

// Helper function to check if user can manage customers
export function canManageCustomers(userRole: UserRole): boolean {
  return [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.AGENT].includes(userRole);
} 