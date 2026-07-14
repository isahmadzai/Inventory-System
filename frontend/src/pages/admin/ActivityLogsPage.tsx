import { useEffect, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import api from '@/services/api';
import type { ActivityLog, PaginatedData, ApiResponse } from '@/types';
import { RefreshCw } from 'lucide-react';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<PaginatedData<ActivityLog> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<PaginatedData<ActivityLog>>>('/admin/activity-logs', {
        params: { page, per_page: 20 },
      });
      setLogs(res.data.data);
    } catch {
      toast('Failed to load activity logs', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const actionBadge = (action: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'secondary' | 'outline'> = {
      create: 'success',
      update: 'secondary',
      delete: 'danger',
      restore: 'outline',
      login: 'outline',
      logout: 'secondary',
    };
    return <Badge variant={variants[action] || 'secondary'} className="capitalize">{action}</Badge>;
  };

  const columns = [
    {
      key: '#', header: '#',
      render: (_: ActivityLog, i?: number) => (
        <span className="text-muted-foreground">{((logs?.current_page || 1) - 1) * 20 + (i || 0) + 1}</span>
      ),
    },
    {
      key: 'user', header: 'User',
      render: (l: ActivityLog) => (
        <span className="font-medium">{l.user?.name || 'System'}</span>
      ),
    },
    { key: 'action', header: 'Action', render: (l: ActivityLog) => actionBadge(l.action) },
    {
      key: 'module', header: 'Module',
      render: (l: ActivityLog) => (
        <Badge variant="outline" className="capitalize">{l.module}</Badge>
      ),
    },
    {
      key: 'description', header: 'Description',
      render: (l: ActivityLog) => (
        <span className="text-muted-foreground text-sm">{l.description || '-'}</span>
      ),
    },
    {
      key: 'ip_address', header: 'IP Address',
      render: (l: ActivityLog) => (
        <span className="text-muted-foreground text-xs font-mono">{l.ip_address || '-'}</span>
      ),
    },
    {
      key: 'created_at', header: 'Timestamp',
      render: (l: ActivityLog) => (
        <span className="text-muted-foreground text-xs">{new Date(l.created_at).toLocaleString()}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Activity Logs</h1>
          <p className="text-muted-foreground mt-1">Track all system activities and user actions.</p>
        </div>
        <Button variant="outline" onClick={fetchLogs} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {loading && !logs ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <DataTable
          columns={columns}
          data={logs?.data || []}
          currentPage={logs?.current_page || 1}
          lastPage={logs?.last_page || 1}
          total={logs?.total || 0}
          perPage={20}
          onPageChange={setPage}
          keyExtractor={(l) => l.id}
          emptyMessage="No activity logs found."
        />
      )}
    </div>
  );
}
