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
import type { Warehouse, PaginatedData, ApiResponse } from '@/types';
import { Plus, Search, Edit, Trash2, RotateCcw, Eye, Download } from 'lucide-react';

export default function WarehouseListPage() {
  const [warehouses, setWarehouses] = useState<PaginatedData<Warehouse> | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [restoreId, setRestoreId] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, per_page: 15 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (countryFilter) params.country = countryFilter;
      if (cityFilter) params.city = cityFilter;
      const res = await api.get<ApiResponse<PaginatedData<Warehouse>>>('/admin/warehouses', { params });
      setWarehouses(res.data.data);
    } catch {
      toast('Failed to load warehouses', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, countryFilter, cityFilter, toast]);

  const fetchFilters = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<{ countries: string[]; cities: string[] }>>('/admin/warehouses/filters');
      setCountries(res.data.data.countries);
      setCities(res.data.data.cities);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => { fetchWarehouses(); }, [fetchWarehouses]);
  useEffect(() => { fetchFilters(); }, [fetchFilters]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/warehouses/${deleteId}`);
      toast('Warehouse deleted successfully', 'success');
      setDeleteId(null);
      fetchWarehouses();
    } catch {
      toast('Failed to delete warehouse', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreId) return;
    try {
      await api.post(`/admin/warehouses/${restoreId}/restore`);
      toast('Warehouse restored successfully', 'success');
      setRestoreId(null);
      fetchWarehouses();
    } catch {
      toast('Failed to restore warehouse', 'error');
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
      render: (_: Warehouse, i?: number) => (
        <span className="text-muted-foreground">{((warehouses?.current_page || 1) - 1) * 15 + (i || 0) + 1}</span>
      ),
    },
    {
      key: 'code', header: 'Code',
      render: (w: Warehouse) => <span className="font-mono text-sm font-medium">{w.code}</span>,
    },
    {
      key: 'name', header: 'Name',
      render: (w: Warehouse) => <span className="font-medium">{w.name}</span>,
    },
    {
      key: 'location', header: 'Location',
      render: (w: Warehouse) => {
        const parts = [w.city, w.country].filter(Boolean);
        return <span className="text-muted-foreground">{parts.join(', ') || '-'}</span>;
      },
    },
    {
      key: 'contact_person', header: 'Contact',
      render: (w: Warehouse) => <span className="text-muted-foreground">{w.contact_person || '-'}</span>,
    },
    {
      key: 'status', header: 'Status',
      render: (w: Warehouse) => (
        <div className="flex items-center gap-2">
          {statusBadge(w.status)}
          {w.deleted_at && <Badge variant="danger" className="text-[10px]">Deleted</Badge>}
        </div>
      ),
    },
    {
      key: 'actions', header: 'Actions',
      render: (w: Warehouse) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/warehouses/${w.id}`); }} title="View">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/warehouses/${w.id}/edit`); }} title="Edit">
            <Edit className="w-4 h-4" />
          </Button>
          {w.deleted_at ? (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setRestoreId(w.id); }} title="Restore">
              <RotateCcw className="w-4 h-4 text-emerald-600" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteId(w.id); }} title="Delete">
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
          <h1 className="text-2xl font-bold">Warehouse Management</h1>
          <p className="text-muted-foreground mt-1">Manage your warehouses and storage facilities.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Link to="/admin/warehouses/create">
            <Button><Plus className="w-4 h-4 mr-2" /> Add Warehouse</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search warehouses..."
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
        <Select value={countryFilter} onValueChange={(v) => { setCountryFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={cityFilter} onValueChange={(v) => { setCityFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading && !warehouses ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <DataTable
          columns={columns}
          data={warehouses?.data || []}
          currentPage={warehouses?.current_page || 1}
          lastPage={warehouses?.last_page || 1}
          total={warehouses?.total || 0}
          perPage={15}
          onPageChange={setPage}
          onRowClick={(w) => navigate(`/admin/warehouses/${w.id}`)}
          keyExtractor={(w) => w.id}
          emptyMessage="No warehouses found."
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Warehouse"
        description="Are you sure you want to delete this warehouse? This can be restored later."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <ConfirmDialog
        open={!!restoreId}
        onOpenChange={() => setRestoreId(null)}
        title="Restore Warehouse"
        description="Are you sure you want to restore this warehouse?"
        confirmLabel="Restore"
        variant="default"
        onConfirm={handleRestore}
      />
    </div>
  );
}
