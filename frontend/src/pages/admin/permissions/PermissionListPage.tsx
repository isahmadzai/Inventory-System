import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';
import api from '@/services/api';
import type { Permission, ApiResponse } from '@/types';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function PermissionListPage() {
  const [grouped, setGrouped] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [permName, setPermName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchPermissions = async () => {
    try {
      const res = await api.get<ApiResponse<Record<string, Permission[]>>>('/admin/permissions/grouped');
      setGrouped(res.data.data);
    } catch { toast('Failed to load permissions', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPermissions(); }, []);

  const openCreate = () => { setEditingId(null); setPermName(''); setErrors({}); setDialogOpen(true); };
  const openEdit = (p: Permission) => { setEditingId(p.id); setPermName(p.name); setErrors({}); setDialogOpen(true); };

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.put(`/admin/permissions/${editingId}`, { name: permName });
        toast('Permission updated', 'success');
      } else {
        await api.post('/admin/permissions', { name: permName });
        toast('Permission created', 'success');
      }
      setDialogOpen(false);
      fetchPermissions();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (axiosErr.response?.data?.errors) {
        const errs: Record<string, string> = {};
        Object.entries(axiosErr.response.data.errors).forEach(([k, v]) => { errs[k] = v[0]; });
        setErrors(errs);
      } else { toast('Failed to save permission', 'error'); }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/permissions/${deleteId}`);
      toast('Permission deleted', 'success');
      setDeleteId(null);
      fetchPermissions();
    } catch { toast('Failed to delete permission', 'error'); }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Permission Management</h1>
          <p className="text-muted-foreground mt-1">View and manage system permissions.</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Add Permission</Button>
      </div>

      {Object.entries(grouped).map(([group, perms]) => (
        <Card key={group}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Badge variant="outline" className="capitalize">{group}</Badge>
              <span className="text-sm font-normal text-muted-foreground">({perms.length} permissions)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {perms.map(p => (
                <div key={p.id} className="flex items-center gap-1 group">
                  <Badge variant="secondary">{p.name}</Badge>
                  <button onClick={() => openEdit(p)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Edit className="w-3 h-3 text-muted-foreground hover:text-foreground" /></button>
                  <button onClick={() => setDeleteId(p.id)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3 text-muted-foreground hover:text-red-600" /></button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? 'Edit' : 'Create'} Permission</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Permission Name</Label>
              <Input value={permName} onChange={e => { setPermName(e.target.value); setErrors({}); }} placeholder="e.g., manage-users" />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Permission" description="Are you sure you want to delete this permission?" confirmLabel="Delete" onConfirm={handleDelete} />
    </div>
  );
}
