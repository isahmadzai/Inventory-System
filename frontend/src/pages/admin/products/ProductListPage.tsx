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
import type { Product, Category, Unit, Warehouse, PaginatedData, ApiResponse } from '@/types';
import { Plus, Search, Edit, Trash2, RotateCcw, Eye, Download } from 'lucide-react';

export default function ProductListPage() {
  const [products, setProducts] = useState<PaginatedData<Product> | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [restoreId, setRestoreId] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, per_page: 15 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category_id = categoryFilter;
      if (unitFilter) params.unit_id = unitFilter;
      if (warehouseFilter) params.warehouse_id = warehouseFilter;
      const res = await api.get<ApiResponse<PaginatedData<Product>>>('/admin/products', { params });
      setProducts(res.data.data);
    } catch {
      toast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, categoryFilter, unitFilter, warehouseFilter, toast]);

  const fetchFilters = useCallback(async () => {
    try {
      const [catRes, unitRes, whRes] = await Promise.all([
        api.get<ApiResponse<Category[]>>('/admin/categories/all'),
        api.get<ApiResponse<Unit[]>>('/admin/units/all'),
        api.get<ApiResponse<PaginatedData<Warehouse>>>('/admin/warehouses', { params: { per_page: 100 } }),
      ]);
      setCategories(catRes.data.data);
      setUnits(unitRes.data.data);
      setWarehouses(whRes.data.data.data);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchFilters(); }, [fetchFilters]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/products/${deleteId}`);
      toast('Product deleted successfully', 'success');
      setDeleteId(null);
      fetchProducts();
    } catch {
      toast('Failed to delete product', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreId) return;
    try {
      await api.post(`/admin/products/${restoreId}/restore`);
      toast('Product restored successfully', 'success');
      setRestoreId(null);
      fetchProducts();
    } catch {
      toast('Failed to restore product', 'error');
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
      render: (_: Product, i?: number) => (
        <span className="text-muted-foreground">{((products?.current_page || 1) - 1) * 15 + (i || 0) + 1}</span>
      ),
    },
    {
      key: 'code', header: 'Code',
      render: (p: Product) => <span className="font-mono text-sm font-medium">{p.code}</span>,
    },
    {
      key: 'name', header: 'Name',
      render: (p: Product) => <span className="font-medium">{p.name}</span>,
    },
    {
      key: 'category', header: 'Category',
      render: (p: Product) => p.category ? <Badge variant="secondary">{p.category.name}</Badge> : <span className="text-muted-foreground">-</span>,
    },
    {
      key: 'unit', header: 'Unit',
      render: (p: Product) => p.unit ? <span className="text-muted-foreground">{p.unit.short_name}</span> : <span className="text-muted-foreground">-</span>,
    },
    {
      key: 'status', header: 'Status',
      render: (p: Product) => (
        <div className="flex items-center gap-2">
          {statusBadge(p.status)}
          {p.deleted_at && <Badge variant="danger" className="text-[10px]">Deleted</Badge>}
        </div>
      ),
    },
    {
      key: 'actions', header: 'Actions',
      render: (p: Product) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/${p.id}`); }} title="View">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/${p.id}/edit`); }} title="Edit">
            <Edit className="w-4 h-4" />
          </Button>
          {p.deleted_at ? (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setRestoreId(p.id); }} title="Restore">
              <RotateCcw className="w-4 h-4 text-emerald-600" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); }} title="Delete">
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
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="text-muted-foreground mt-1">Manage your products and inventory items.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Link to="/admin/products/create">
            <Button><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, code, barcode, SKU..."
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
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={unitFilter} onValueChange={(v) => { setUnitFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Units" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Units</SelectItem>
            {units.map(u => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={warehouseFilter} onValueChange={(v) => { setWarehouseFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Warehouses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            {warehouses.map(w => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading && !products ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <DataTable
          columns={columns}
          data={products?.data || []}
          currentPage={products?.current_page || 1}
          lastPage={products?.last_page || 1}
          total={products?.total || 0}
          perPage={15}
          onPageChange={setPage}
          onRowClick={(p) => navigate(`/admin/products/${p.id}`)}
          keyExtractor={(p) => p.id}
          emptyMessage="No products found."
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This can be restored later."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <ConfirmDialog
        open={!!restoreId}
        onOpenChange={() => setRestoreId(null)}
        title="Restore Product"
        description="Are you sure you want to restore this product?"
        confirmLabel="Restore"
        variant="default"
        onConfirm={handleRestore}
      />
    </div>
  );
}
