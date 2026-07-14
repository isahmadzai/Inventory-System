import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import api from '@/services/api';
import type { Role, Permission, ApiResponse } from '@/types';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function RoleEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      api.get<ApiResponse<Role>>(`/admin/roles/${id}`),
      api.get<ApiResponse<Permission[]>>('/admin/permissions/all'),
    ]).then(([roleRes, permsRes]) => {
      setName(roleRes.data.data.name);
      setSelectedPerms(roleRes.data.data.permissions?.map(p => p.name) || []);
      setAllPermissions(permsRes.data.data);
    }).catch(() => { toast('Failed to load role', 'error'); navigate('/admin/roles'); })
      .finally(() => setLoading(false));
  }, [id, toast, navigate]);

  const togglePerm = (permName: string) => {
    setSelectedPerms(prev => prev.includes(permName) ? prev.filter(p => p !== permName) : [...prev, permName]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      await api.put(`/admin/roles/${id}`, { name, permissions: selectedPerms });
      toast('Role updated successfully', 'success');
      navigate('/admin/roles');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (axiosErr.response?.data?.errors) {
        const errs: Record<string, string> = {};
        Object.entries(axiosErr.response.data.errors).forEach(([k, v]) => { errs[k] = v[0]; });
        setErrors(errs);
      } else { toast('Failed to update role', 'error'); }
    } finally { setSaving(false); }
  };

  const grouped: Record<string, Permission[]> = {};
  allPermissions.forEach(p => {
    const group = p.name.split('-')[0];
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(p);
  });

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/roles')}><ArrowLeft className="w-5 h-5" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Role</h1>
          <p className="text-muted-foreground">Update role permissions.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Role Name *</Label>
              <Input value={name} onChange={e => setName(e.target.value)} />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-4 border rounded-lg p-4 max-h-96 overflow-y-auto">
                {Object.entries(grouped).map(([group, perms]) => (
                  <div key={group}>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2">{group}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {perms.map(p => (
                        <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" checked={selectedPerms.includes(p.name)} onChange={() => togglePerm(p.name)} className="rounded" />
                          {p.name}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/roles')}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update Role
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
