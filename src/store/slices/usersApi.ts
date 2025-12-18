import { baseApi } from '../api';

// Define types for user data
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  mustChangePassword?: boolean;
  referralCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
}

export interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

// --- Customer Registration Types ---
export interface NextOfKin {
  fullName: string;
  relationship: string;
  phone: string;
  email?: string;
  contactAddress?: string;
}

export interface RequiredDocuments {
  idImage: string;
  passportPhoto: string;
  proofOfPayment: string;
}

export interface RegisterCustomerRequest {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  maritalStatus: 'single' | 'married' | 'other';
  occupation: string;
  nationality: string;
  stateOfOrigin: string;
  localGovernmentArea: string;
  residentialAddress: string;
  postalAddress?: string;
  nextOfKin: NextOfKin;
  requiredDocuments: RequiredDocuments;
  referralCode?: string;
  password: string;
}

export interface RegisterCustomerResponse {
  message: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    status: string;
    referredBy?: string;
  };
  requiresApproval: boolean;
  nextSteps: string[];
  referralInfo?: {
    referredBy: string;
    referralCode: string;
  } | null;
}

// --- Agent Registration Types (simplified for demo, expand as needed) ---
export interface RegisterAgentRequest {
  // Add all required agent fields here as per your AgentProfile schema
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  nationalId: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  // ...other fields as needed
}

export interface RegisterAgentResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    referralCode?: string;
  };
  requiresApproval: boolean;
  nextSteps: string[];
}

// --- Agent By Referral Code ---
export interface AgentByReferralResponse {
  agent: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    referralCode: string;
    status: string;
  };
  profile: {
    nationalId: string;
    businessAddress?: string;
    commissionRate?: number;
    paymentMethod?: string;
  };
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

// Create the users API slice
export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    createUser: builder.mutation<User, CreateUserRequest>({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        data: userData,
      }),
      invalidatesTags: ['User'],
    }),

    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        data: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        'User', 'Agents', 'Customers'
      ],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    registerCustomer: builder.mutation<RegisterCustomerResponse, RegisterCustomerRequest>({
      query: (data) => ({
        url: '/auth/register/customer',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['user'],
    }),
    registerAgent: builder.mutation<RegisterAgentResponse, RegisterAgentRequest>({
      query: (data) => ({
        url: '/auth/register/agent',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['user'],
    }),
    getAgentByReferralCode: builder.query<AgentByReferralResponse, string>({
      query: (referralCode) => ({
        url: `/agents/referral/${referralCode}`,
        method: 'GET',
      }),
      providesTags: ['user'],
    }),
    loginUser: builder.mutation<LoginResponse, LoginUserRequest>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['user'],
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['user'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useRegisterCustomerMutation,
  useRegisterAgentMutation,
  useGetAgentByReferralCodeQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
} = usersApi; 