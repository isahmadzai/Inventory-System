import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import api from '@/services/api';
import type { Category, ApiResponse } from '@/types';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function CategoryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '', code: '', parent_id: '', description: '', status: 'active',
  });

  useEffect(() => {
    Promise.all([
      api.get<ApiResponse<Category>>(`/admin/categories/${id}`),
      api.get<ApiResponse<Category[]>>('/admin/categories/all'),
    ]).then(([catRes, parentsRes]) => {
      const c = catRes.data.data;
      setForm({
        name: c.name,
        code: c.code,
        parent_id: c.parent_id?.toString() || '',
        description: c.description || '',
        status: c.status,
      });
      setParentCategories(parentsRes.data.data);
    }).catch(() => { toast('Failed to load category', 'error'); navigate('/admin/categories'); })
      .finally(() => setLoading(false));
  }, [id, toast, navigate]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const payload = { ...form, parent_id: form.parent_id ? Number(form.parent_id) : null };
      await api.put(`/admin/categories/${id}`, payload);
      toast('Category updated successfully', 'success');
      navigate('/admin/categories');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (axiosErr.response?.data?.errors) {
        const errs: Record<string, string> = {};
        Object.entries(axiosErr.response.data.errors).forEach(([k, v]) => { errs[k] = v[0]; });
        setErrors(errs);
      } else {
        toast('Failed to update category', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/categories')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Category</h1>
          <p className="text-muted-foreground">Update category information.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category Name *</Label>
                <Input value={form.name} onChange={e => handleChange('name', e.target.value)} />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label>Category Code *</Label>
                <Input value={form.code} onChange={e => handleChange('code', e.target.value)} />
                {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
              </div>
              <div className="space-y-2">
                <Label>Parent Category</Label>
                <Select value={form.parent_id} onValueChange={v => handleChange('parent_id', v === 'none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="None (Top Level)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top Level)</SelectItem>
                    {parentCategories
                      .filter(c => c.id !== Number(id))
                      .map(c => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.parent_id && <p className="text-xs text-red-500">{errors.parent_id}</p>}
              </div>
              <div className="space-y-2">
                <Label>Status *</Label>
                <Select value={form.status} onValueChange={v => handleChange('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/categories')}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Category
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
