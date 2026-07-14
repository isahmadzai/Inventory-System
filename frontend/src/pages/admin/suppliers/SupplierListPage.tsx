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
import type { Supplier, PaginatedData, ApiResponse } from '@/types';
import { Plus, Search, Edit, Trash2, RotateCcw, Eye } from 'lucide-react';

export default function SupplierListPage() {
  const [suppliers, setSuppliers] = useState<PaginatedData<Supplier> | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [restoreId, setRestoreId] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, per_page: 15 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get<ApiResponse<PaginatedData<Supplier>>>('/admin/suppliers', { params });
      setSuppliers(res.data.data);
    } catch {
      toast('Failed to load suppliers', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, toast]);

  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/suppliers/${deleteId}`);
      toast('Supplier deleted successfully', 'success');
      setDeleteId(null);
      fetchSuppliers();
    } catch {
      toast('Failed to delete supplier', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreId) return;
    try {
      await api.post(`/admin/suppliers/${restoreId}/restore`);
      toast('Supplier restored successfully', 'success');
      setRestoreId(null);
      fetchSuppliers();
    } catch {
      toast('Failed to restore supplier', 'error');
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
      render: (_: Supplier, i?: number) => (
        <span className="text-muted-foreground">{((suppliers?.current_page || 1) - 1) * 15 + (i || 0) + 1}</span>
      ),
    },
    {
      key: 'company_name', header: 'Company',
      render: (s: Supplier) => <span className="font-medium">{s.company_name}</span>,
    },
    {
      key: 'contact_person', header: 'Contact Person',
      render: (s: Supplier) => <span className="text-muted-foreground">{s.contact_person || '-'}</span>,
    },
    {
      key: 'phone', header: 'Phone',
      render: (s: Supplier) => <span className="text-muted-foreground">{s.phone || '-'}</span>,
    },
    {
      key: 'email', header: 'Email',
      render: (s: Supplier) => <span className="text-muted-foreground">{s.email || '-'}</span>,
    },
    {
      key: 'status', header: 'Status',
      render: (s: Supplier) => (
        <div className="flex items-center gap-2">
          {statusBadge(s.status)}
          {s.deleted_at && <Badge variant="danger" className="text-[10px]">Deleted</Badge>}
        </div>
      ),
    },
    {
      key: 'actions', header: 'Actions',
      render: (s: Supplier) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/suppliers/${s.id}`); }} title="View">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/suppliers/${s.id}/edit`); }} title="Edit">
            <Edit className="w-4 h-4" />
          </Button>
          {s.deleted_at ? (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setRestoreId(s.id); }} title="Restore">
              <RotateCcw className="w-4 h-4 text-emerald-600" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteId(s.id); }} title="Delete">
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Supplier Management</h1>
          <p className="text-muted-foreground mt-1">Manage your suppliers and vendor contacts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/suppliers/create">
            <Button><Plus className="w-4 h-4 mr-2" /> Add Supplier</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && !suppliers ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <DataTable
          columns={columns}
          data={suppliers?.data || []}
          currentPage={suppliers?.current_page || 1}
          lastPage={suppliers?.last_page || 1}
          total={suppliers?.total || 0}
          perPage={15}
          onPageChange={setPage}
          onRowClick={(s) => navigate(`/admin/suppliers/${s.id}`)}
          keyExtractor={(s) => s.id}
          emptyMessage="No suppliers found."
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Supplier"
        description="Are you sure you want to delete this supplier? This can be restored later."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <ConfirmDialog
        open={!!restoreId}
        onOpenChange={() => setRestoreId(null)}
        title="Restore Supplier"
        description="Are you sure you want to restore this supplier?"
        confirmLabel="Restore"
        variant="default"
        onConfirm={handleRestore}
      />
    </div>
  );
}
