'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Column, Table } from '@/components/ui/table';
import { IUser } from '@/models/User';
import { UserStatus } from '@/models/user-types';
import { useDeleteUserMutation, useGetAgentsQuery, useUpdateUserStatusMutation } from '@/store/slices/adminApi';
import { Check, Edit2, Search, Trash, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: agents, isLoading } = useGetAgentsQuery();
  const [deleteAgent, setDeleteAgent] = useState<string | null>(null);
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserStatusMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this agent? This action cannot be undone.')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('Agent deleted successfully');
      } catch (error) {
        console.error('Failed to delete agent', error);
        toast.error('Failed to delete agent');
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateUser({ id, data: { status: newStatus } }).unwrap();
      toast.success(`Agent status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('Failed to update agent status');
    }
  };

  const handleCommissionUpdate = async (id: string, currentRate: number) => {
    const newRate = prompt('Enter new commission rate:', currentRate?.toString());
    if (newRate && !isNaN(Number(newRate))) {
      try {
        await updateUser({ id, data: { commissionRate: Number(newRate) } }).unwrap();
        toast.success('Commission rate updated');
      } catch (error) {
        console.error('Failed to update commission', error);
        toast.error('Failed to update commission rate');
      }
    }
  };

  const filteredAgents = agents?.filter(agent =>
    agent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    // @ts-ignore - referralCode might not be on IUser type but is in data
    (agent.referralCode && agent.referralCode.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const columns: Column<IUser>[] = [
    {
      title: 'Agent',
      key: 'agent',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.firstName} {record.lastName}</div>
          <div className="text-xs text-muted-foreground">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => (
        <Badge variant={
          status === UserStatus.APPROVED ? 'default' :
            status === UserStatus.PENDING ? 'secondary' :
              'destructive'
        }>
          {status}
        </Badge>
      ),
    },
    {
      title: 'Referral Code',
      key: 'referralCode',
      render: (_, record) => (
        <span className="font-mono text-xs">
          {/* @ts-ignore */}
          {record.referralCode || '-'}
        </span>
      ),
    },
    {
      title: 'Commission %',
      key: 'commissionRate',
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          {/* @ts-ignore */}
          <span>{record.commissionRate || 0}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleCommissionUpdate(record._id as string, (record as any).commissionRate || 0)}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (_, record) => (
        <div className="flex justify-end space-x-2">
          {record.status === UserStatus.PENDING && (
            <>
              <Button loading={isUpdatingUser} size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleStatusChange(record._id as string, UserStatus.APPROVED)}>
                <Check className="h-4 w-4 mr-1" /> Approve
              </Button>
              <Button loading={isUpdatingUser} size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleStatusChange(record._id as string, UserStatus.REJECTED)}>
                <X className="h-4 w-4 mr-1" /> Reject
              </Button>
            </>
          )}
          {
            record.status === UserStatus.APPROVED && (
              <Button loading={isUpdatingUser} size="sm" variant="outline" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                onClick={() => handleStatusChange(record._id as string, UserStatus.DEACTIVATED)}>
                <X className="h-4 w-4 mr-1" /> Deactivate
              </Button>
            )
          }
          {
            (record.status === UserStatus.REJECTED || record.status === UserStatus.DEACTIVATED) && (
              <Button loading={isUpdatingUser} size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleStatusChange(record._id as string, UserStatus.APPROVED)}>
                <Check className="h-4 w-4 mr-1" /> Approve
              </Button>
            )
          }
          <Button loading={isDeletingUser} size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setDeleteAgent(record._id as string)}>
            <Trash className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Dialog open={deleteAgent !== null} onOpenChange={(open) => !open && setDeleteAgent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this agent? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAgent(null)} disabled={isDeletingUser}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteAgent ?? "")} loading={isDeletingUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Agent Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agents Directory</CardTitle>
            <div className="flex items-center justify-end space-x-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table
              columns={columns}
              dataSource={filteredAgents}
              loading={isLoading}
              emptyText="No agents found"
            />
          </CardContent>
        </Card>

      </div>
    </>
  );
}
