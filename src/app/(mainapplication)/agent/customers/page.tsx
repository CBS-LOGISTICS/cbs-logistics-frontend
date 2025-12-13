'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Column, Table } from '@/components/ui/table';
import { formatDate } from '@/lib/date';
import { UserStatus } from '@/models/user-types';
import { ICustomer } from '@/models/users/Customer';
import { useGetAgentCustomersQuery } from '@/store/slices/agentApi';

export default function AgentCustomersPage() {
  const { data: customers, isLoading } = useGetAgentCustomersQuery();

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
      className: 'text-right',
      render: (_, record) => formatDate(record.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Customers</h1>
        <p className="text-muted-foreground">View customers who signed up using your referral code.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Referred Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            columns={columns}
            dataSource={customers || []}
            loading={isLoading}
            emptyText="No customers found. Share your referral code to get started!"
          />
        </CardContent>
      </Card>
    </div>
  );
}
