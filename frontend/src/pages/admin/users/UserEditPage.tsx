import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import api from '@/services/api';
import type { User, Role, ApiResponse } from '@/types';
import { ArrowLeft, Loader2, Key } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetOpen, setResetOpen] = useState(false);
  const [resetPass, setResetPass] = useState('');
  const [resetPassConf, setResetPassConf] = useState('');
  const [form, setForm] = useState({
    name: '', username: '', email: '', phone: '', password: '', password_confirmation: '',
    role: '', status: 'active',
  });

  useEffect(() => {
    Promise.all([
      api.get<ApiResponse<User>>(`/admin/users/${id}`),
      api.get<ApiResponse<Role[]>>('/admin/roles/all'),
    ]).then(([userRes, rolesRes]) => {
      const u = userRes.data.data;
      setForm({
        name: u.name, username: u.username, email: u.email, phone: u.phone || '',
        password: '', password_confirmation: '', role: u.roles?.[0] || '', status: u.status,
      });
      setRoles(rolesRes.data.data);
    }).catch(() => { toast('Failed to load user', 'error'); navigate('/admin/users'); })
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
      await api.put(`/admin/users/${id}`, form);
      toast('User updated successfully', 'success');
      navigate('/admin/users');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (axiosErr.response?.data?.errors) {
        const errs: Record<string, string> = {};
        Object.entries(axiosErr.response.data.errors).forEach(([k, v]) => { errs[k] = v[0]; });
        setErrors(errs);
      } else {
        toast('Failed to update user', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      await api.put(`/admin/users/${id}/reset-password`, { password: resetPass, password_confirmation: resetPassConf });
      toast('Password reset successfully', 'success');
      setResetOpen(false);
      setResetPass('');
      setResetPassConf('');
    } catch {
      toast('Failed to reset password', 'error');
    }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/users')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit User</h1>
            <p className="text-muted-foreground">Update user information.</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setResetOpen(true)}>
          <Key className="w-4 h-4 mr-2" /> Reset Password
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value={form.name} onChange={e => handleChange('name', e.target.value)} />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label>Username *</Label>
                <Input value={form.username} onChange={e => handleChange('username', e.target.value)} />
                {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>New Password (leave blank to keep)</Label>
                <Input type="password" value={form.password} onChange={e => handleChange('password', e.target.value)} />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" value={form.password_confirmation} onChange={e => handleChange('password_confirmation', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Role *</Label>
                <Select value={form.role} onValueChange={v => handleChange('role', v)}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    {roles.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
              </div>
              <div className="space-y-2">
                <Label>Status *</Label>
                <Select value={form.status} onValueChange={v => handleChange('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/users')}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update User
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reset Password</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" value={resetPass} onChange={e => setResetPass(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input type="password" value={resetPassConf} onChange={e => setResetPassConf(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetOpen(false)}>Cancel</Button>
            <Button onClick={handleResetPassword} disabled={!resetPass || resetPass !== resetPassConf}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
