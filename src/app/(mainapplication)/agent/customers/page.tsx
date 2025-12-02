'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';

export default function AgentCustomersPage() {
  // Mock data - in real app, fetch from /api/agent/customers
  const customers = [
    {
      id: '1',
      name: 'Alice Wonder',
      email: 'alice@example.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      joinedAt: '2023-11-15',
      totalPurchases: 2,
      totalValue: 450000,
    },
    {
      id: '2',
      name: 'Bob Builder',
      email: 'bob@example.com',
      phone: '+1 (555) 987-6543',
      status: 'pending',
      joinedAt: '2023-11-20',
      totalPurchases: 0,
      totalValue: 0,
    },
    {
      id: '3',
      name: 'Charlie Chocolate',
      email: 'charlie@example.com',
      phone: '+1 (555) 456-7890',
      status: 'active',
      joinedAt: '2023-10-05',
      totalPurchases: 1,
      totalValue: 150000,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Customers</h1>
        <p className="text-muted-foreground">Manage your referred client base.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Purchases</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">Joined {new Date(customer.joinedAt).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="h-3 w-3" /> {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Phone className="h-3 w-3" /> {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{customer.totalPurchases} Orders</div>
                      <div className="text-xs text-muted-foreground">${customer.totalValue.toLocaleString()}</div>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="outline" size="sm">View Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
