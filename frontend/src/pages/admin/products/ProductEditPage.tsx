import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import api from '@/services/api';
import type { Product, Category, Unit, Warehouse, Supplier, PaginatedData, ApiResponse } from '@/types';
import { ArrowLeft, Loader2, Package, Link2, FileText, ToggleLeft } from 'lucide-react';

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState({
    name: '', code: '', barcode: '', sku: '',
    category_id: '', unit_id: '', warehouse_id: '',
    description: '', notes: '', status: 'active',
  });
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [productRes, catRes, unitRes, whRes, supRes] = await Promise.all([
        api.get<ApiResponse<Product>>(`/admin/products/${id}`),
        api.get<ApiResponse<Category[]>>('/admin/categories/all'),
        api.get<ApiResponse<Unit[]>>('/admin/units/all'),
        api.get<ApiResponse<PaginatedData<Warehouse>>>('/admin/warehouses', { params: { per_page: 100 } }),
        api.get<ApiResponse<PaginatedData<Supplier>>>('/admin/suppliers', { params: { per_page: 100 } }),
      ]);
      const p = productRes.data.data;
      setForm({
        name: p.name, code: p.code, barcode: p.barcode || '', sku: p.sku || '',
        category_id: String(p.category_id), unit_id: String(p.unit_id), warehouse_id: String(p.warehouse_id),
        description: p.description || '', notes: p.notes || '', status: p.status,
      });
      setSelectedSuppliers(p.suppliers?.map(s => s.id) || []);
      setCategories(catRes.data.data);
      setUnits(unitRes.data.data);
      setWarehouses(whRes.data.data.data);
      setSuppliers(supRes.data.data.data);
    } catch {
      toast('Failed to load product', 'error');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  }, [id, toast, navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSupplierToggle = (supplierId: number) => {
    setSelectedSuppliers(prev =>
      prev.includes(supplierId) ? prev.filter(s => s !== supplierId) : [...prev, supplierId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const payload = {
        name: form.name,
        code: form.code,
        barcode: form.barcode || null,
        sku: form.sku || null,
        category_id: Number(form.category_id),
        unit_id: Number(form.unit_id),
        warehouse_id: Number(form.warehouse_id),
        description: form.description || null,
        notes: form.notes || null,
        status: form.status,
        suppliers: selectedSuppliers,
      };
      await api.put(`/admin/products/${id}`, payload);
      toast('Product updated successfully', 'success');
      navigate('/admin/products');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (axiosErr.response?.data?.errors) {
        const errs: Record<string, string> = {};
        Object.entries(axiosErr.response.data.errors).forEach(([k, v]) => { errs[k] = v[0]; });
        setErrors(errs);
      } else {
        toast('Failed to update product', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">Update product information.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4" /> General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input value={form.name} onChange={e => handleChange('name', e.target.value)} />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label>Product Code *</Label>
                <Input value={form.code} onChange={e => handleChange('code', e.target.value)} />
                {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Barcode</Label>
                <Input value={form.barcode} onChange={e => handleChange('barcode', e.target.value)} />
                {errors.barcode && <p className="text-xs text-red-500">{errors.barcode}</p>}
              </div>
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input value={form.sku} onChange={e => handleChange('sku', e.target.value)} />
                {errors.sku && <p className="text-xs text-red-500">{errors.sku}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Link2 className="w-4 h-4" /> Relationships
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category_id} onValueChange={v => handleChange('category_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.category_id && <p className="text-xs text-red-500">{errors.category_id}</p>}
              </div>
              <div className="space-y-2">
                <Label>Unit *</Label>
                <Select value={form.unit_id} onValueChange={v => handleChange('unit_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                  <SelectContent>
                    {units.map(u => <SelectItem key={u.id} value={String(u.id)}>{u.name} ({u.short_name})</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.unit_id && <p className="text-xs text-red-500">{errors.unit_id}</p>}
              </div>
              <div className="space-y-2">
                <Label>Warehouse *</Label>
                <Select value={form.warehouse_id} onValueChange={v => handleChange('warehouse_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                  <SelectContent>
                    {warehouses.map(w => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.warehouse_id && <p className="text-xs text-red-500">{errors.warehouse_id}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Suppliers</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {suppliers.length === 0 && <p className="text-sm text-muted-foreground">No suppliers available.</p>}
                {suppliers.map(s => (
                  <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSuppliers.includes(s.id)}
                      onChange={() => handleSupplierToggle(s.id)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{s.company_name}</span>
                  </label>
                ))}
              </div>
              {errors.suppliers && <p className="text-xs text-red-500">{errors.suppliers}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4" /> Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={form.notes}
                onChange={e => handleChange('notes', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ToggleLeft className="w-4 h-4" /> Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select value={form.status} onValueChange={v => handleChange('status', v)}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update Product
          </Button>
        </div>
      </form>
    </div>
  );
}
