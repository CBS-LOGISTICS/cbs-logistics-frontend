'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSuppliersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
        <p className="text-muted-foreground">Manage your supplier network.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Supplier List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">
            Supplier management table will be implemented here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
