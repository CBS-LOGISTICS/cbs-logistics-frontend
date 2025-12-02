'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp } from 'lucide-react';

export default function AgentEarningsPage() {
  // Mock data - in real app, fetch from /api/agent/earnings
  const transactions = [
    {
      id: 'tx1',
      date: '2023-11-25',
      amount: 7500,
      type: 'commission',
      status: 'completed',
      source: 'Sale: Luxury Villa Plot',
      customer: 'Alice Wonder',
    },
    {
      id: 'tx2',
      date: '2023-11-20',
      amount: 2500,
      type: 'commission',
      status: 'pending',
      source: 'Sale: Downtown Apartment',
      customer: 'Bob Builder',
    },
    {
      id: 'tx3',
      date: '2023-10-15',
      amount: 5000,
      type: 'payout',
      status: 'completed',
      source: 'Withdrawal to Bank Account',
      customer: '-',
    },
  ];

  const totalEarnings = 12500;
  const pendingPayout = 2500;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Earnings & Payouts</h1>
        <p className="text-muted-foreground">Track your commissions and financial history.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime commission earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingPayout.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available for withdrawal soon</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{tx.source}</div>
                      <div className="text-xs text-muted-foreground capitalize">{tx.type}</div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {tx.customer}
                    </td>
                    <td className={`p-4 font-medium ${tx.type === 'payout' ? 'text-red-600' : 'text-green-600'}`}>
                      {tx.type === 'payout' ? '-' : '+'}${tx.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <Badge variant={tx.status === 'completed' ? 'default' : 'outline'}>
                        {tx.status}
                      </Badge>
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
