# Redux Toolkit Setup with axiosBaseQuery

This project has been configured with Redux Toolkit and RTK Query using a custom axiosBaseQuery for API calls.

## Setup Overview

### Dependencies Installed
- `@reduxjs/toolkit` - Redux Toolkit for state management
- `react-redux` - React bindings for Redux
- `axios` - HTTP client for API requests

### File Structure
```
src/
├── store/
│   ├── index.ts          # Main store configuration
│   ├── api.ts            # RTK Query API with axiosBaseQuery
│   ├── hooks.ts          # Typed Redux hooks
│   └── slices/
│       └── usersApi.ts   # Example API slice
├── components/
│   └── UsersList.tsx     # Example component using RTK Query
└── app/
    ├── providers.tsx     # Redux Provider wrapper
    ├── layout.tsx        # App layout with Redux Provider
    └── page.tsx          # Main page with example component
```

## Key Features

### 1. Custom axiosBaseQuery
- Configured with axios interceptors for authentication
- Automatic token handling from localStorage
- Error handling for 401/403 responses
- Configurable base URL via environment variables

### 2. RTK Query Setup
- Centralized API configuration
- Automatic caching and invalidation
- Optimistic updates support
- TypeScript support throughout

### 3. Authentication Integration
- Automatic token injection in requests
- Token removal on 401 responses
- Configurable redirect handling

## Usage Examples

### Creating API Slices
```typescript
// src/store/slices/exampleApi.ts
import { api } from '../api';

export const exampleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getData: builder.query<DataType[], void>({
      query: () => ({
        url: '/api/data',
        method: 'GET',
      }),
      providesTags: ['Data'],
    }),
    
    createData: builder.mutation<DataType, CreateDataRequest>({
      query: (data) => ({
        url: '/api/data',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Data'],
    }),
  }),
});

export const { useGetDataQuery, useCreateDataMutation } = exampleApi;
```

### Using in Components
```typescript
import { useGetDataQuery, useCreateDataMutation } from '../store/slices/exampleApi';

function MyComponent() {
  const { data, isLoading, error } = useGetDataQuery();
  const [createData, { isLoading: isCreating }] = useCreateDataMutation();

  const handleSubmit = async (formData) => {
    try {
      await createData(formData).unwrap();
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  // Component JSX
}
```

### Using Typed Hooks
```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';

function MyComponent() {
  const dispatch = useAppDispatch();
  const someData = useAppSelector((state) => state.api.queries);
}
```

## Environment Configuration

Set the following environment variable for the API base URL:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

## Authentication

The setup includes automatic token handling:
- Tokens are stored in localStorage as 'authToken'
- Automatically included in Authorization header
- Removed on 401 responses

## Error Handling

The axiosBaseQuery provides consistent error handling:
- Network errors
- HTTP status errors
- Authentication errors (401/403)
- Custom error messages

## Best Practices

1. **Use TypeScript**: All API slices should have proper TypeScript interfaces
2. **Tag Management**: Use providesTags and invalidatesTags for cache management
3. **Error Handling**: Always handle errors in components using try/catch
4. **Loading States**: Use isLoading states for better UX
5. **Optimistic Updates**: Use RTK Query's optimistic update features when appropriate

## Next Steps

1. Create additional API slices for your specific endpoints
2. Add more sophisticated error handling
3. Implement loading skeletons
4. Add retry logic for failed requests
5. Set up proper authentication flow 