# CBS Logistics API Setup

This document outlines the comprehensive API setup for the CBS Logistics system with role-based access control, user management, and audit trails.

## 🏗️ Architecture Overview

### User Roles & Permissions
- **Super Admin**: Full system access, can manage all users and system settings
- **Admin**: User management, approval/rejection of users, system oversight
- **Agent**: Customer referral management, commission tracking
- **Customer**: Property purchases, application submissions
- **Supplier**: (Future implementation) Procurement, warehousing, distribution

### Database Schema
- **User Model**: Comprehensive user management with audit trails
- **Property Model**: (Future) Real estate properties for purchase
- **Purchase Model**: (Future) Customer purchase applications
- **Commission Model**: (Future) Agent commission tracking

## 🚀 Quick Start

### 1. Environment Setup
Create a `.env.local` file with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/cbs-logistics

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Application Configuration
NODE_ENV=development
```

### 2. Database Setup
```bash
# Install dependencies
npm install

# Seed initial admin users
npx tsx src/lib/seed.ts
```

### 3. Start Development Server
```bash
npm run dev
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - General user registration
- `POST /api/auth/register/agent` - Agent-specific registration
- `POST /api/auth/register/customer` - Customer-specific registration
- `POST /api/auth/login` - User login

### User Management (Admin Only)
- `GET /api/users` - List users with filtering and pagination
- `POST /api/users` - Create new user
- `POST /api/users/[id]/approve` - Approve/reject user

### Agent Management
- `GET /api/agents/[id]/customers` - Get agent's referred customers
- `GET /api/agents/[id]/profile` - Get agent profile details
- `GET /api/agents/referral/[code]` - Get agent by referral code

### Customer Management
- `GET /api/customers/[id]/profile` - Get customer profile details

## 🔐 Authentication Flow

### Registration Process

#### General Registration (`/api/auth/register`)
1. User registers with role and optional referral code
2. System validates referral code (for customers)
3. Status set based on role:
   - Super Admin/Admin: Auto-approved
   - Agent/Customer: Pending approval
4. JWT token generated for auto-approved users

#### Agent Registration (`/api/auth/register/agent`)
1. Comprehensive agent data collection including:
   - Personal and business information
   - Professional credentials and experience
   - Financial and banking details
   - Commission structure and agreements
   - Required documents and certifications
2. Automatic referral code generation upon approval
3. Admin approval required before activation
4. Full audit trail of approval process

#### Customer Registration (`/api/auth/register/customer`)
1. Detailed customer data collection including:
   - Personal and employment information
   - Financial capacity and preferences
   - Property preferences and timeline
   - Family and emergency contact details
   - Required documents and agreements
2. Optional agent referral code validation
3. Admin approval required before activation
4. Property preference matching capabilities

### Login Process
1. User provides email/password
2. System validates credentials
3. Checks user approval status
4. Generates JWT token with user info
5. Updates last login timestamp

### Role-Based Access Control
- JWT tokens include user role and status
- API endpoints validate permissions
- Audit trail tracks all admin actions

## 👥 User Management Features

### Admin Capabilities
- **User Approval/Rejection**: Full audit trail with admin signature
- **User Creation**: Direct user creation with auto-approval
- **User Listing**: Advanced filtering and pagination
- **Status Management**: Activate/deactivate users

### Agent Features
- **Referral Code**: Auto-generated unique codes
- **Customer Management**: View referred customers
- **Commission Tracking**: (Future) Track earnings from referrals

### Customer Features
- **Referral Registration**: Register with agent referral codes
- **Property Applications**: (Future) Submit purchase applications
- **Purchase History**: (Future) View transaction history

## 🗄️ Database Models

### User Model Features
```typescript
interface User {
  // Basic Info
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  
  // Role & Status
  role: UserRole;
  status: UserStatus;
  
  // Referral System
  referralCode?: string;
  referredBy?: ObjectId;
  
  // Audit Trail
  approvedBy?: ObjectId;
  approvedAt?: Date;
  rejectedBy?: ObjectId;
  rejectedAt?: Date;
  rejectionReason?: string;
  deactivatedBy?: ObjectId;
  deactivatedAt?: Date;
  deactivationReason?: string;
  
  // Security
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  
  // Profile
  profileImage?: string;
  address?: Address;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
}
```

### Audit Trail Features
- **Admin Actions**: All admin actions are tracked with timestamps
- **Approval History**: Complete approval/rejection history
- **User Changes**: Track who made changes and when
- **Status Transitions**: Full history of status changes

## 🔧 Development Features

### TypeScript Support
- Full type safety across all API endpoints
- Proper error handling with typed responses
- Interface definitions for all data structures

### Error Handling
- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for debugging

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization

## 🚧 Future Implementations

### Property Management
- Property listing and details
- Property categories (land, houses)
- Property status management
- Image upload and management

### Purchase System
- Customer purchase applications
- Admin approval workflow
- Payment integration (manual initially)
- Purchase history tracking

### Commission System
- Agent commission calculation
- Commission payout tracking
- Performance analytics
- Referral bonus system

### Supplier Features
- Supplier registration and approval
- Procurement management
- Warehousing services
- Distribution network

## 📊 API Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": "error_status",
  "details": { ... }
}
```

## 🔍 Testing

### API Testing
```bash
# Test general registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "customer"
  }'

# Test agent registration
curl -X POST http://localhost:3000/api/auth/register/agent \
  -H "Content-Type: application/json" \
  -d '{
    "email": "agent@example.com",
    "password": "password123",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1234567891",
    "dateOfBirth": "1990-01-01",
    "gender": "female",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "zipCode": "10001"
    },
    "nationalId": "123456789",
    "bankName": "Chase Bank",
    "bankAccountNumber": "1234567890",
    "bankAccountName": "Jane Smith",
    "emergencyContact": {
      "name": "John Smith",
      "relationship": "Spouse",
      "phone": "+1234567892"
    },
    "agreeToTerms": true,
    "agreeToCommissionStructure": true
  }'

# Test customer registration with referral
curl -X POST http://localhost:3000/api/auth/register/customer \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123",
    "firstName": "Bob",
    "lastName": "Johnson",
    "phone": "+1234567893",
    "dateOfBirth": "1985-05-15",
    "gender": "male",
    "address": {
      "street": "456 Oak Ave",
      "city": "Los Angeles",
      "state": "CA",
      "country": "USA",
      "zipCode": "90210"
    },
    "nationalId": "987654321",
    "occupation": "Software Engineer",
    "employer": "Tech Corp",
    "annualIncome": "120000",
    "sourceOfIncome": "Employment",
    "employmentStatus": "employed",
    "bankName": "Wells Fargo",
    "bankAccountNumber": "0987654321",
    "bankAccountName": "Bob Johnson",
    "emergencyContact": {
      "name": "Alice Johnson",
      "relationship": "Spouse",
      "phone": "+1234567894"
    },
    "maritalStatus": "married",
    "propertyType": "house",
    "preferredLocation": "Los Angeles",
    "budgetRange": {
      "min": 500000,
      "max": 1000000,
      "currency": "USD"
    },
    "timeline": "6_months",
    "financingMethod": "mortgage",
    "howDidYouHear": "Agent referral",
    "referralCode": "AGENT123ABC",
    "agreeToTerms": true,
    "agreeToDataProcessing": true
  }'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Test getting agent profile (requires authentication)
curl -X GET http://localhost:3000/api/agents/AGENT_ID/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test getting customer profile (requires authentication)
curl -X GET http://localhost:3000/api/customers/CUSTOMER_ID/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test getting agent by referral code (public endpoint)
curl -X GET http://localhost:3000/api/agents/referral/ABCDEF12
```

## 🚀 Deployment

### Production Checklist
- [ ] Set secure JWT secret
- [ ] Configure production MongoDB
- [ ] Set up environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Set up monitoring and logging
- [ ] Database backup strategy
- [ ] Rate limiting implementation

### Environment Variables
```env
# Production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cbs-logistics
JWT_SECRET=your-production-jwt-secret
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com/api
NODE_ENV=production
```

## 📝 Contributing

### Code Standards
- Use TypeScript for all new code
- Follow ESLint configuration
- Write comprehensive error handling
- Add proper JSDoc comments
- Include unit tests for new features

### Git Workflow
1. Create feature branch
2. Implement changes
3. Add tests
4. Update documentation
5. Submit pull request

## 🆘 Support

For technical support or questions:
- Check the API documentation
- Review error logs
- Test with provided examples
- Contact development team

---

**Note**: This API is designed for senior-level implementation with enterprise-grade features including comprehensive audit trails, role-based access control, and scalable architecture. 