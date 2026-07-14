import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/data-table';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import api from '@/services/api';
import type { Role, PaginatedData, ApiResponse } from '@/types';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function RoleListPage() {
  const [roles, setRoles] = useState<PaginatedData<Role> | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<PaginatedData<Role>>>('/admin/roles', { params: { per_page: 15 } });
      setRoles(res.data.data);
    } catch { toast('Failed to load roles', 'error'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/roles/${deleteId}`);
      toast('Role deleted successfully', 'success');
      setDeleteId(null);
      fetchRoles();
    } catch {
      toast('Cannot delete protected system role', 'error');
    } finally { setDeleteLoading(false); }
  };

  const columns = [
    { key: '#', header: '#', render: (_: Role, i?: number) => <span className="text-muted-foreground">{((roles?.current_page || 1) - 1) * 15 + (i || 0) + 1}</span> },
    { key: 'name', header: 'Role Name', render: (r: Role) => <span className="font-medium">{r.name}</span> },
    { key: 'permissions', header: 'Permissions', render: (r: Role) => (
      <div className="flex flex-wrap gap-1">{r.permissions?.slice(0, 5).map(p => <Badge key={p.id} variant="secondary" className="text-xs">{p.name}</Badge>)}{r.permissions && r.permissions.length > 5 && <Badge variant="secondary">+{r.permissions.length - 5}</Badge>}</div>
    )},
    { key: 'actions', header: 'Actions', render: (r: Role) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/roles/${r.id}/edit`); }}><Edit className="w-4 h-4" /></Button>
        {!['admin', 'warehouse', 'inventory'].includes(r.name) && (
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteId(r.id); }}><Trash2 className="w-4 h-4 text-red-600" /></Button>
        )}
      </div>
    )},
  ];

  if (loading && !roles) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Role Management</h1>
          <p className="text-muted-foreground mt-1">Manage system roles and their permissions.</p>
        </div>
        <Link to="/admin/roles/create">
          <Button><Plus className="w-4 h-4 mr-2" /> Add Role</Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={roles?.data || []}
        currentPage={roles?.current_page || 1}
        lastPage={roles?.last_page || 1}
        total={roles?.total || 0}
        perPage={15}
        onPageChange={() => {}}
        keyExtractor={(r) => r.id}
        emptyMessage="No roles found."
      />

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete Role" description="Are you sure you want to delete this role?" confirmLabel="Delete" onConfirm={handleDelete} loading={deleteLoading} />
    </div>
  );
}
