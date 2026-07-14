import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import api from '@/services/api';
import type { DashboardStats, ApiResponse } from '@/types';
import { Warehouse, Package, TrendingUp, AlertTriangle } from 'lucide-react';

export default function WarehouseDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ApiResponse<DashboardStats>>('/admin/dashboard')
      .then(res => setData(res.data.data))
      .catch(() => toast('Failed to load dashboard data', 'error'))
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) return <LoadingSpinner className="py-20" />;

  const stats = data?.stats;
  const cards = [
    { title: 'Warehouses', value: stats?.warehouses ?? 0, icon: Warehouse, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Active Warehouses', value: stats?.active_warehouses ?? 0, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Products', value: stats?.products ?? 0, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Categories', value: stats?.categories ?? 0, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Warehouse Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name}. Manage your warehouse operations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Warehouse Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Detailed warehouse analytics will be available once the Product and Inventory modules are implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
