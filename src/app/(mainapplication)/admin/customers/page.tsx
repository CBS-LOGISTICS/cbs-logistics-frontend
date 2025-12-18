'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Column, Table } from '@/components/ui/table';
import { formatDate } from '@/lib/date';
import { UserStatus } from '@/models/user-types';
import { ICustomer } from '@/models/users/Customer';
import { useApproveCustomerMutation, useDeleteUserMutation, useGetCustomersQuery, useSuspendCustomerMutation, useUpdateUserStatusMutation } from '@/store/slices/adminApi';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminCustomersPage() {
  const { data: customers, isLoading } = useGetCustomersQuery();
  const [approveCustomer] = useApproveCustomerMutation();
  const [suspendCustomer] = useSuspendCustomerMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteCustomer, setDeleteCustomer] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    try {
      await approveCustomer(id).unwrap();
      toast.success('Customer approved successfully');
    } catch (error) {
      toast.error('Failed to approve customer');
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      await suspendCustomer(id).unwrap();
      toast.success('Customer suspended successfully');
    } catch (error) {
      toast.error('Failed to suspend customer');
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await updateUserStatus({ id, data: { status: UserStatus.DEACTIVATED } }).unwrap();
      toast.success('Customer deactivated successfully');
    } catch (error) {
      toast.error('Failed to deactivate customer');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      toast.success('Customer deleted successfully');
      setDeleteCustomer(null);
    } catch (error) {
      toast.error('Failed to delete customer');
    }
  };

  const columns: Column<ICustomer>[] = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => (
        <span className="font-medium">
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Referred By',
      key: 'referredBy',
      render: (_, record) => {
        if (record.referredBy && typeof record.referredBy !== 'string' && 'firstName' in record.referredBy) {
          return (
            <div className="flex flex-col">
              <span className="font-medium">
                {record.referredBy.firstName} {record.referredBy.lastName}
              </span>
              <span className="text-xs text-muted-foreground">
                {record.referredBy.referralCode}
              </span>
            </div>
          );
        }
        return <span className="text-muted-foreground">-</span>;
      },
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status === UserStatus.APPROVED
            ? 'bg-green-100 text-green-800'
            : status === UserStatus.PENDING
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
            }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: 'Joined',
      key: 'createdAt',
      render: (_, record) => formatDate(record.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (_, record) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleApprove(record._id as string)}>
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSuspend(record._id as string)}>
              Suspend
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeactivate(record._id as string)}>
              Deactivate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteCustomer(record._id as string)} className="text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <Dialog open={deleteCustomer !== null} onOpenChange={(open) => !open && setDeleteCustomer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCustomer(null)} disabled={isDeletingUser}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteCustomer ?? "")} loading={isDeletingUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">View and manage registered customers.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              columns={columns}
              dataSource={customers || []}
              loading={isLoading}
              emptyText="No customers found."
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
