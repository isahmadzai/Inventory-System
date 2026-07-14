import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DataTable from '@/components/ui/data-table';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import api from '@/services/api';
import type { Unit, PaginatedData, ApiResponse } from '@/types';
import { Plus, Search, Edit, Trash2, RotateCcw } from 'lucide-react';

export default function UnitListPage() {
  const [units, setUnits] = useState<PaginatedData<Unit> | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [restoreId, setRestoreId] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchUnits = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, per_page: 15 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get<ApiResponse<PaginatedData<Unit>>>('/admin/units', { params });
      setUnits(res.data.data);
    } catch {
      toast('Failed to load units', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, toast]);

  useEffect(() => { fetchUnits(); }, [fetchUnits]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/units/${deleteId}`);
      toast('Unit deleted successfully', 'success');
      setDeleteId(null);
      fetchUnits();
    } catch {
      toast('Failed to delete unit', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreId) return;
    try {
      await api.post(`/admin/units/${restoreId}/restore`);
      toast('Unit restored successfully', 'success');
      setRestoreId(null);
      fetchUnits();
    } catch {
      toast('Failed to restore unit', 'error');
    }
  };

  const statusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning'> = {
      active: 'success',
      inactive: 'warning',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const columns = [
    {
      key: '#', header: '#',
      render: (_: Unit, i?: number) => (
        <span className="text-muted-foreground">{((units?.current_page || 1) - 1) * 15 + (i || 0) + 1}</span>
      ),
    },
    {
      key: 'name', header: 'Name',
      render: (u: Unit) => <span className="font-medium">{u.name}</span>,
    },
    {
      key: 'short_name', header: 'Short Name',
      render: (u: Unit) => <span className="font-mono text-sm">{u.short_name}</span>,
    },
    {
      key: 'description', header: 'Description',
      render: (u: Unit) => <span className="text-muted-foreground truncate max-w-[200px] block">{u.description || '-'}</span>,
    },
    {
      key: 'status', header: 'Status',
      render: (u: Unit) => (
        <div className="flex items-center gap-2">
          {statusBadge(u.status)}
          {u.deleted_at && <Badge variant="danger" className="text-[10px]">Deleted</Badge>}
        </div>
      ),
    },
    {
      key: 'products_count', header: 'Products',
      render: (u: Unit) => <span className="text-muted-foreground">{u.products_count ?? 0}</span>,
    },
    {
      key: 'actions', header: 'Actions',
      render: (u: Unit) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/units/${u.id}/edit`); }} title="Edit">
            <Edit className="w-4 h-4" />
          </Button>
          {u.deleted_at ? (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setRestoreId(u.id); }} title="Restore">
              <RotateCcw className="w-4 h-4 text-emerald-600" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteId(u.id); }} title="Delete">
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading && !units) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Unit Management</h1>
          <p className="text-muted-foreground mt-1">Manage measurement units for products.</p>
        </div>
        <Link to="/admin/units/create">
          <Button><Plus className="w-4 h-4 mr-2" /> Add Unit</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search units..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={units?.data || []}
        currentPage={units?.current_page || 1}
        lastPage={units?.last_page || 1}
        total={units?.total || 0}
        perPage={15}
        onPageChange={setPage}
        onRowClick={(u) => navigate(`/admin/units/${u.id}/edit`)}
        keyExtractor={(u) => u.id}
        emptyMessage="No units found."
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Unit"
        description="Are you sure you want to delete this unit? This can be restored later."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <ConfirmDialog
        open={!!restoreId}
        onOpenChange={() => setRestoreId(null)}
        title="Restore Unit"
        description="Are you sure you want to restore this unit?"
        confirmLabel="Restore"
        variant="default"
        onConfirm={handleRestore}
      />
    </div>
  );
}
