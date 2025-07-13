'use client';

import { useGetUsersQuery, useCreateUserMutation } from '../store/slices/usersApi';
import { useState } from 'react';

export function UsersList() {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(newUser).unwrap();
      setNewUser({ name: '', email: '', role: 'user' });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      
      {/* Create User Form */}
      <form onSubmit={handleCreateUser} className="mb-6 p-4 border rounded">
        <h3 className="text-lg font-semibold mb-2">Create New User</h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            disabled={isCreating}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isCreating ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>

      {/* Users List */}
      <div className="space-y-2">
        {users?.map((user) => (
          <div key={user.id} className="p-3 border rounded">
            <h4 className="font-semibold">{user.name}</h4>
            <p className="text-gray-600">{user.email}</p>
            <span className="text-sm bg-gray-200 px-2 py-1 rounded">{user.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 