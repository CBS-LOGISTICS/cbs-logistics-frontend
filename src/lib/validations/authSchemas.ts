import * as z from 'zod';

// Sign In Schema
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export type SignInFormData = z.infer<typeof signInSchema>;

// Customer Registration Schema
export const customerRegistrationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Please enter a valid email address'),
  maritalStatus: z.enum(['single', 'married', 'other']),
  occupation: z.string().min(1, 'Occupation is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  stateOfOrigin: z.string().min(1, 'State of origin is required'),
  localGovernmentArea: z.string().min(1, 'Local government area is required'),
  residentialAddress: z.string().min(1, 'Residential address is required'),
  postalAddress: z.string().optional(),
  nextOfKin: z.object({
    fullName: z.string().min(1, 'Next of kin full name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    phone: z.string().min(1, 'Next of kin phone is required'),
    email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
    contactAddress: z.string().optional(),
  }),
  requiredDocuments: z.object({
    idImage: z.string().min(1, 'ID image is required'),
    passportPhoto: z.string().min(1, 'Passport photo is required'),
    proofOfPayment: z.string().min(1, 'Proof of payment is required'),
  }),
  referralCode: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type CustomerRegistrationFormData = z.infer<typeof customerRegistrationSchema>;

// Agent Registration Schema
export const agentRegistrationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  address: z.string().min(1, 'Residential address is required'),
  nationalId: z.string().min(1, 'National ID is required'),
  passportNumber: z.string().optional(),
  taxIdentificationNumber: z.string().optional(),
  businessLicense: z.string().optional(),
  bankName: z.string().min(1, 'Bank name is required'),
  bankAccountNumber: z.string().min(1, 'Bank account number is required'),
  bankAccountName: z.string().min(1, 'Account holder name is required'),
  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    phone: z.string().min(1, 'Emergency contact phone is required'),
    email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  }),
  businessAddress: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  agreeToCommissionStructure: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the commission structure',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type AgentRegistrationFormData = z.infer<typeof agentRegistrationSchema>;
