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
import type { User, PaginatedData, ApiResponse } from '@/types';
import { Plus, Search, Edit, Trash2, RotateCcw, Eye } from 'lucide-react';

export default function UserListPage() {
  const [users, setUsers] = useState<PaginatedData<User> | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [restoreId, setRestoreId] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, per_page: 15 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (roleFilter) params.role = roleFilter;
      const res = await api.get<ApiResponse<PaginatedData<User>>>('/admin/users', { params });
      setUsers(res.data.data);
    } catch {
      toast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, roleFilter, toast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/users/${deleteId}`);
      toast('User deleted successfully', 'success');
      setDeleteId(null);
      fetchUsers();
    } catch {
      toast('Failed to delete user', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreId) return;
    try {
      await api.post(`/admin/users/${restoreId}/restore`);
      toast('User restored successfully', 'success');
      setRestoreId(null);
      fetchUsers();
    } catch {
      toast('Failed to restore user', 'error');
    }
  };

  const statusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'secondary'> = {
      active: 'success',
      inactive: 'warning',
      suspended: 'danger',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const columns = [
    { key: '#', header: '#', render: (_: User, i?: number) => <span className="text-muted-foreground">{((users?.current_page || 1) - 1) * 15 + (i || 0) + 1}</span> },
    { key: 'name', header: 'Name', render: (u: User) => <span className="font-medium">{u.name}</span> },
    { key: 'email', header: 'Email' },
    { key: 'username', header: 'Username' },
    { key: 'status', header: 'Status', render: (u: User) => statusBadge(u.status) },
    { key: 'roles', header: 'Role', render: (u: User) => u.roles?.map(r => <Badge key={r} variant="outline" className="mr-1">{r}</Badge>) },
    {
      key: 'actions', header: 'Actions', render: (u: User) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/users/${u.id}`); }} title="View">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/users/${u.id}/edit`); }} title="Edit">
            <Edit className="w-4 h-4" />
          </Button>
          {u.deleted_at ? (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setRestoreId(u.id); }} title="Restore">
              <RotateCcw className="w-4 h-4 text-emerald-600" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteId(u.id); }} title="Delete">
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading && !users) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage system users and their roles.</p>
        </div>
        <Link to="/admin/users/create">
          <Button><Plus className="w-4 h-4 mr-2" /> Add User</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
            <SelectItem value="inventory">Inventory</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={users?.data || []}
        currentPage={users?.current_page || 1}
        lastPage={users?.last_page || 1}
        total={users?.total || 0}
        perPage={15}
        onPageChange={setPage}
        onRowClick={(u) => navigate(`/admin/users/${u.id}/edit`)}
        keyExtractor={(u) => u.id}
        emptyMessage="No users found."
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete User"
        description="Are you sure you want to delete this user? This can be restored later."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <ConfirmDialog
        open={!!restoreId}
        onOpenChange={() => setRestoreId(null)}
        title="Restore User"
        description="Are you sure you want to restore this user?"
        confirmLabel="Restore"
        variant="default"
        onConfirm={handleRestore}
      />
    </div>
  );
}
