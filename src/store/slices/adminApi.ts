import { IUser } from '@/models/User';
import { ICustomer } from '@/models/users/Customer';
import { baseApi } from '../api';
import { tagTypes } from '../tagTypes';

export const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCustomers: builder.query<ICustomer[], void>({
            query: () => ({
                url: 'admin/customers',
                method: 'GET',
            }),
            providesTags: [tagTypes.CUSTOMERS],
        }),
        getAgents: builder.query<IUser[], void>({
            query: () => ({
                url: 'admin/agents',
                method: 'GET',
            }),
            providesTags: [tagTypes.AGENTS],
        }),
        approveCustomer: builder.mutation<void, string>({
            query: (id) => ({
                url: `admin/customers/${id}/approve`,
                method: 'POST',
            }),
            invalidatesTags: [tagTypes.CUSTOMERS],
        }),
        suspendCustomer: builder.mutation<void, string>({
            query: (id) => ({
                url: `admin/customers/${id}/suspend`,
                method: 'POST',
            }),
            invalidatesTags: [tagTypes.CUSTOMERS],
        }),
        deleteCustomer: builder.mutation<void, string>({
            query: (id) => ({
                url: `admin/customers/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [tagTypes.CUSTOMERS],
        }),
        updateUserStatus: builder.mutation<void, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `users/${id}/status-update`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: [tagTypes.AGENTS, tagTypes.CUSTOMERS],
        }),
    }),
});

export const {
    useGetCustomersQuery,
    useGetAgentsQuery,
    useApproveCustomerMutation,
    useSuspendCustomerMutation,
    useDeleteCustomerMutation,
    useUpdateUserStatusMutation,
} = adminApi;
