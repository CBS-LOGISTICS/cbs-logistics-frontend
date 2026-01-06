'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
  image?: string;
}

interface Transaction {
  _id: string;
  type: 'deposit' | 'payment' | 'refund';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

export default function CustomerDashboard() {
  const [balance, setBalance] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setBalance(50000);
      setProperties([
        {
          _id: '1',
          title: 'Luxury Villa Plot',
          location: 'Beverly Hills, CA',
          price: 150000,
          status: 'processing',
          date: '2023-11-25',
        },
        {
          _id: '2',
          title: 'Industrial Warehouse',
          location: 'New York, NY',
          price: 450000,
          status: 'completed',
          date: '2023-10-10',
        },
      ]);
      setTransactions([
        {
          _id: 't1',
          type: 'deposit',
          amount: 200000,
          status: 'completed',
          date: '2023-11-24',
          description: 'Bank Transfer Deposit',
        },
        {
          _id: 't2',
          type: 'payment',
          amount: 150000,
          status: 'pending',
          date: '2023-11-25',
          description: 'Payment for Luxury Villa Plot',
        },
        {
          _id: 't3',
          type: 'deposit',
          amount: 6000,
          status: 'completed',
          date: '2023-11-24',
          description: 'Bank Transfer Deposit',
        },
        {
          _id: 't4',
          type: 'payment',
          amount: 50000,
          status: 'pending',
          date: '2023-11-25',
          description: 'Payment for Luxury Villa Plot',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* Recent Properties */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium">Property</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center">Loading...</td>
                  </tr>
                ) : properties.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">No properties found</td>
                  </tr>
                ) : properties.map((property) => (
                  <tr key={property._id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium">{property.title}</td>
                    <td className="p-4 text-muted-foreground">{property.location}</td>
                    <td className="p-4">₦{property.price.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge variant={
                        property.status === 'completed' ? 'default' : 
                        property.status === 'processing' ? 'secondary' : 
                        'outline'
                      }>
                        {property.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right text-muted-foreground">
                      {new Date(property.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="space-y-4">
             {loading ? (
               <div className="text-center py-4">Loading...</div>
             ) : transactions.map((tx) => (
               <div key={tx._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                 <div className="flex items-center gap-4">
                   <div className={`p-2 rounded-full ${tx.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                     {tx.type === 'deposit' ? <ArrowRight className="h-4 w-4 rotate-45" /> : <ArrowRight className="h-4 w-4 -rotate-45" />}
                   </div>
                   <div>
                     <p className="font-medium">{tx.description}</p>
                     <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className={`font-medium ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                     {tx.type === 'deposit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                   </p>
                   <Badge variant="outline" className="text-xs scale-90 origin-right">
                     {tx.status}
                   </Badge>
                 </div>
               </div>
             ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}

