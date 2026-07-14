import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import api from '@/services/api';
import type { DashboardStats } from '@/types';
import { Users, Shield, KeyRound, Warehouse, FolderTree, Package } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setData(res.data.data))
      .catch(() => toast('Failed to load dashboard data', 'error'))
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) return <LoadingSpinner className="py-20" />;

  const stats = data?.stats;
  const statCards = [
    { title: 'Total Users', value: stats?.users ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Roles', value: stats?.roles ?? 0, icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Permissions', value: stats?.permissions ?? 0, icon: KeyRound, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Warehouses', value: stats?.warehouses ?? 0, icon: Warehouse, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Categories', value: stats?.categories ?? 0, icon: FolderTree, color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Products', value: stats?.products ?? 0, icon: Package, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name}. Here&apos;s an overview of your system.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
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
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.recent_activity && data.recent_activity.length > 0 ? (
            <div className="space-y-3">
              {data.recent_activity.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{log.description}</p>
                    <p className="text-xs text-muted-foreground">by {log.user?.name || 'System'}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
