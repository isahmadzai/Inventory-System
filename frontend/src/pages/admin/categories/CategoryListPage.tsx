import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import LoadingSpinner from '@/components/ui/loading-spinner';
import EmptyState from '@/components/ui/empty-state';
import { useToast } from '@/components/ui/toast';
import api from '@/services/api';
import type { Category, ApiResponse } from '@/types';
import { Plus, Search, Edit, Trash2, FolderTree, ChevronRight, ChevronDown, Package } from 'lucide-react';

export default function CategoryListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { per_page: 100 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get<ApiResponse<Category[]>>('/admin/categories', { params });
      setCategories(res.data.data);
    } catch {
      toast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, toast]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/categories/${deleteId}`);
      toast('Category deleted successfully', 'success');
      setDeleteId(null);
      fetchCategories();
    } catch {
      toast('Failed to delete category', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const statusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning'> = {
      active: 'success',
      inactive: 'warning',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const renderCategory = (category: Category, depth: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.has(category.id);

    return (
      <div key={category.id}>
        <Card className={depth > 0 ? 'ml-6 mt-2' : 'mt-2 first:mt-0'}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpand(category.id)}
                    className="mt-1 p-0.5 hover:bg-gray-100 rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                ) : (
                  <div className="w-5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-xs font-mono text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded">
                      {category.code}
                    </span>
                    {statusBadge(category.status)}
                    {category.deleted_at && <Badge variant="danger" className="text-[10px]">Deleted</Badge>}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    {category.parent && (
                      <span className="flex items-center gap-1">
                        <FolderTree className="w-3 h-3" />
                        {category.parent.name}
                      </span>
                    )}
                    {hasChildren && (
                      <span>{category.children!.length} subcategor{category.children!.length === 1 ? 'y' : 'ies'}</span>
                    )}
                    {category.products_count !== undefined && (
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {category.products_count} products
                      </span>
                    )}
                  </div>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mt-1 truncate">{category.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); navigate(`/admin/categories/${category.id}/edit`); }}
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); setDeleteId(category.id); }}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {hasChildren && isExpanded && (
          <div>
            {category.children!.map(child => renderCategory(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Category Management</h1>
          <p className="text-muted-foreground mt-1">Organize products into hierarchical categories.</p>
        </div>
        <Link to="/admin/categories/create">
          <Button><Plus className="w-4 h-4 mr-2" /> Add Category</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          icon={<FolderTree className="w-6 h-6 text-muted-foreground" />}
          title="No categories found"
          description="Get started by creating your first category."
          action={
            <Link to="/admin/categories/create">
              <Button><Plus className="w-4 h-4 mr-2" /> Add Category</Button>
            </Link>
          }
        />
      ) : (
        <div>
          {categories.map(category => renderCategory(category))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Category"
        description="Are you sure you want to delete this category? This can be restored later."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
