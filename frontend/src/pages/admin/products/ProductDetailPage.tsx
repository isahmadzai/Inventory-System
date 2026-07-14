import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import api from '@/services/api';
import type { Product, ApiResponse } from '@/types';
import {
  ArrowLeft, Edit, Package, Link2, FileText, Calendar, Clock, User, Warehouse,
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ApiResponse<Product>>(`/admin/products/${id}`)
      .then(res => setProduct(res.data.data))
      .catch(() => { toast('Failed to load product', 'error'); navigate('/admin/products'); })
      .finally(() => setLoading(false));
  }, [id, toast, navigate]);

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!product) return null;

  const statusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning'> = {
      active: 'success',
      inactive: 'warning',
    };
    return <Badge variant={variants[status] || 'secondary'} className="capitalize">{status}</Badge>;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {statusBadge(product.status)}
          {product.deleted_at && <Badge variant="danger">Deleted</Badge>}
          <Button onClick={() => navigate(`/admin/products/${id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="w-4 h-4" /> General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Name" value={product.name} />
            <InfoRow label="Code" value={product.code} className="font-mono" />
            <InfoRow label="Barcode" value={product.barcode || 'Not set'} className="font-mono" />
            <InfoRow label="SKU" value={product.sku || 'Not set'} className="font-mono" />
            <InfoRow label="Status" value={product.status} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Link2 className="w-4 h-4" /> Relationships
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow
              label="Category"
              value={product.category ? `${product.category.name} (${product.category.code})` : 'Not set'}
            />
            <InfoRow
              label="Unit"
              value={product.unit ? `${product.unit.name} (${product.unit.short_name})` : 'Not set'}
            />
            <InfoRow
              label="Warehouse"
              value={product.warehouse ? `${product.warehouse.name} (${product.warehouse.code})` : 'Not set'}
            />
            <div className="flex items-start gap-3">
              <span className="w-4 h-4 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Suppliers</p>
                {product.suppliers && product.suppliers.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.suppliers.map(s => (
                      <Badge key={s.id} variant="secondary" className="text-xs">{s.company_name}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-medium">None</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" /> Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Description" value={product.description || 'Not set'} />
            <InfoRow label="Notes" value={product.notes || 'Not set'} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" /> System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Created" value={new Date(product.created_at).toLocaleString()} />
            <InfoRow label="Last Updated" value={new Date(product.updated_at).toLocaleString()} />
            {product.creator && (
              <InfoRow
                label="Created By"
                value={product.creator.name}
                icon={<User className="w-4 h-4 text-muted-foreground" />}
              />
            )}
            {product.updater && (
              <InfoRow
                label="Updated By"
                value={product.updater.name}
                icon={<User className="w-4 h-4 text-muted-foreground" />}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Warehouse className="w-4 h-4" /> Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Stock information will be available once the Stock Movement module is implemented.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value, className, icon }: { label: string; value: string; className?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      {icon || <span className="w-4 h-4" />}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-sm font-medium ${className || ''}`}>{value}</p>
      </div>
    </div>
  );
}
