'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, DollarSign, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  joinedAt: string;
}

interface AgentStats {
  referralCode: string;
  totalEarnings: number;
  activeCustomers: number;
  pendingCommission: number;
}

export default function AgentDashboard() {
  const [stats, setStats] = useState<AgentStats>({
    referralCode: 'LOADING...',
    totalEarnings: 0,
    activeCustomers: 0,
    pendingCommission: 0,
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    // In real implementation, this would fetch from /api/agent/dashboard
    setTimeout(() => {
      setStats({
        referralCode: 'JD123456',
        totalEarnings: 12500,
        activeCustomers: 12,
        pendingCommission: 450,
      });
      setCustomers([
        {
          _id: '1',
          firstName: 'Alice',
          lastName: 'Wonder',
          email: 'alice@example.com',
          status: 'active',
          joinedAt: '2023-11-15',
        },
        {
          _id: '2',
          firstName: 'Bob',
          lastName: 'Builder',
          email: 'bob@example.com',
          status: 'pending',
          joinedAt: '2023-11-20',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(stats.referralCode);
    // Could add a toast notification here
    alert('Referral code copied!');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your performance overview.</p>
        </div>
        <Card className="w-full md:w-auto bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Your Referral Code</p>
              <p className="text-2xl font-mono font-bold tracking-wider">{stats.referralCode}</p>
            </div>
            <Button variant="outline" size="icon" onClick={copyReferralCode}>
              <Copy className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCustomers}</div>
            <p className="text-xs text-muted-foreground">+2 new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Commission</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.pendingCommission.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Will be released upon delivery</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Referred Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Joined Date</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center">Loading...</td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted-foreground">No customers yet</td>
                  </tr>
                ) : customers.map((customer) => (
                  <tr key={customer._id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                      <div className="text-xs text-muted-foreground">{customer.email}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {new Date(customer.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm">View History</Button>
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
