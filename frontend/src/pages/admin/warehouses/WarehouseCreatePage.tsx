import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import api from '@/services/api';
import { ArrowLeft, Loader2, MapPin, Phone, Building2, FileText } from 'lucide-react';

export default function WarehouseCreatePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '', code: '', description: '',
    address: '', city: '', province: '', country: '',
    contact_person: '', contact_phone: '', email: '',
    capacity: '', status: 'active', notes: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const payload = { ...form, capacity: form.capacity ? parseFloat(form.capacity) : null };
      await api.post('/admin/warehouses', payload);
      toast('Warehouse created successfully', 'success');
      navigate('/admin/warehouses');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (axiosErr.response?.data?.errors) {
        const errs: Record<string, string> = {};
        Object.entries(axiosErr.response.data.errors).forEach(([k, v]) => { errs[k] = v[0]; });
        setErrors(errs);
      } else {
        toast('Failed to create warehouse', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/warehouses')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Warehouse</h1>
          <p className="text-muted-foreground">Add a new warehouse to the system.</p>
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
                <Label>Warehouse Name *</Label>
                <Input value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g., Main Warehouse" />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label>Warehouse Code *</Label>
                <Input value={form.code} onChange={e => handleChange('code', e.target.value)} placeholder="e.g., WH-001" />
                {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Brief description of the warehouse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input type="number" step="0.01" min="0" value={form.capacity} onChange={e => handleChange('capacity', e.target.value)} placeholder="e.g., 10000" />
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={form.address} onChange={e => handleChange('address', e.target.value)} placeholder="Street address" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={form.city} onChange={e => handleChange('city', e.target.value)} placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label>Province</Label>
                <Input value={form.province} onChange={e => handleChange('province', e.target.value)} placeholder="Province/State" />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input value={form.country} onChange={e => handleChange('country', e.target.value)} placeholder="Country" />
              </div>
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
                <Label>Contact Person</Label>
                <Input value={form.contact_person} onChange={e => handleChange('contact_person', e.target.value)} placeholder="Full name" />
              </div>
              <div className="space-y-2">
                <Label>Contact Phone</Label>
                <Input value={form.contact_phone} onChange={e => handleChange('contact_phone', e.target.value)} placeholder="+1-555-0100" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="warehouse@example.com" />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4" /> Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Notes</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={form.notes}
                onChange={e => handleChange('notes', e.target.value)}
                placeholder="Additional notes or remarks..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/warehouses')}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Warehouse
          </Button>
        </div>
      </form>
    </div>
  );
}
