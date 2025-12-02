'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge'; // Need to check if badge exists or create it
import { Search, Check, X, Edit2 } from 'lucide-react';

// Mock data for now, will replace with API call
interface Agent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected' | 'deactivated';
  referralCode?: string;
  commissionRate: number;
  totalSales: number;
  earnings: number;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/users?role=agent');
      const data = await res.json();
      if (data.users) {
        setAgents(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch agents', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        setAgents(agents.map(a => a._id === id ? { ...a, status: newStatus as any } : a));
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleCommissionUpdate = async (id: string, newRate: number) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commissionRate: newRate }),
      });

      if (res.ok) {
        setAgents(agents.map(a => a._id === id ? { ...a, commissionRate: newRate } : a));
      }
    } catch (error) {
      console.error('Failed to update commission', error);
    }
  };

  const filteredAgents = agents.filter(agent => 
    agent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (agent.referralCode && agent.referralCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Agent Management</h1>
        <Button>Add New Agent</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agents Directory</CardTitle>
          <div className="flex items-center space-x-2">
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
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium">Agent</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Referral Code</th>
                  <th className="p-4 font-medium">Commission %</th>
                  <th className="p-4 font-medium">Sales / Earnings</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center">Loading...</td>
                  </tr>
                ) : filteredAgents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-muted-foreground">No agents found</td>
                  </tr>
                ) : filteredAgents.map((agent) => (
                  <tr key={agent._id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium">{agent.firstName} {agent.lastName}</div>
                      <div className="text-xs text-muted-foreground">{agent.email}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant={
                        agent.status === 'approved' ? 'default' : 
                        agent.status === 'pending' ? 'secondary' : 
                        'destructive'
                      }>
                        {agent.status}
                      </Badge>
                    </td>
                    <td className="p-4 font-mono text-xs">
                      {agent.referralCode || '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span>{agent.commissionRate || 0}%</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => {
                            const newRate = prompt('Enter new commission rate:', agent.commissionRate?.toString());
                            if (newRate && !isNaN(Number(newRate))) {
                              handleCommissionUpdate(agent._id, Number(newRate));
                            }
                          }}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs">
                        <div>Sales: ${agent.totalSales?.toLocaleString() || 0}</div>
                        <div className="text-green-600 font-medium">Earned: ${agent.earnings?.toLocaleString() || 0}</div>
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {agent.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleStatusChange(agent._id, 'approved')}>
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleStatusChange(agent._id, 'rejected')}>
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm">View Details</Button>
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
