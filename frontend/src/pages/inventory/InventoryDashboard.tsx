import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Package, TrendingDown, BarChart3, ClipboardList } from 'lucide-react';

export default function InventoryDashboard() {
  const { user } = useAuth();

  const stats = [
    { title: 'Total Items', value: '248', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Low Stock', value: '15', icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Categories', value: '18', icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Pending Orders', value: '7', icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inventory Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name}. Track and manage your inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
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
          <CardTitle>Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No inventory data available yet.</p>
        </CardContent>
      </Card>
    </div>
  );
}
