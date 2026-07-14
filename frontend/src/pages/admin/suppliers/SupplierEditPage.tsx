import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import api from '@/services/api';
import type { Supplier, ApiResponse } from '@/types';
import { ArrowLeft, Loader2, Building2, Phone, FileText } from 'lucide-react';

export default function SupplierEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    company_name: '', contact_person: '', status: 'active',
    phone: '', email: '', address: '',
    tax_number: '', notes: '',
  });

  useEffect(() => {
    api.get<ApiResponse<Supplier>>(`/admin/suppliers/${id}`)
      .then(res => {
        const s = res.data.data;
        setForm({
          company_name: s.company_name,
          contact_person: s.contact_person || '',
          status: s.status,
          phone: s.phone || '',
          email: s.email || '',
          address: s.address || '',
          tax_number: s.tax_number || '',
          notes: s.notes || '',
        });
      })
      .catch(() => { toast('Failed to load supplier', 'error'); navigate('/admin/suppliers'); })
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
      await api.put(`/admin/suppliers/${id}`, form);
      toast('Supplier updated successfully', 'success');
      navigate('/admin/suppliers');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (axiosErr.response?.data?.errors) {
        const errs: Record<string, string> = {};
        Object.entries(axiosErr.response.data.errors).forEach(([k, v]) => { errs[k] = v[0]; });
        setErrors(errs);
      } else {
        toast('Failed to update supplier', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/suppliers')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Supplier</h1>
          <p className="text-muted-foreground">Update supplier information.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-4 h-4" /> General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input value={form.company_name} onChange={e => handleChange('company_name', e.target.value)} />
                {errors.company_name && <p className="text-xs text-red-500">{errors.company_name}</p>}
              </div>
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input value={form.contact_person} onChange={e => handleChange('contact_person', e.target.value)} />
                {errors.contact_person && <p className="text-xs text-red-500">{errors.contact_person}</p>}
              </div>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="w-4 h-4" /> Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={form.address}
                onChange={e => handleChange('address', e.target.value)}
              />
              {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4" /> Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tax Number</Label>
              <Input value={form.tax_number} onChange={e => handleChange('tax_number', e.target.value)} />
              {errors.tax_number && <p className="text-xs text-red-500">{errors.tax_number}</p>}
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

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/suppliers')}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update Supplier
          </Button>
        </div>
      </form>
    </div>
  );
}
