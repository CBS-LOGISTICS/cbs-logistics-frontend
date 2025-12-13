import { ICustomer } from '@/models/users/Customer';
import { baseApi } from '../api';
import { tagTypes } from '../tagTypes';

export const agentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAgentCustomers: builder.query<ICustomer[], void>({
            query: () => ({
                url: 'agent/customers',
                method: 'GET',
            }),
            providesTags: [tagTypes.CUSTOMERS],
        }),
    }),
});

export const {
    useGetAgentCustomersQuery,
} = agentApi;
