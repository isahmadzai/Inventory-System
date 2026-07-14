import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import api from '@/services/api';
import type { Warehouse, ApiResponse } from '@/types';
import {
  ArrowLeft, Edit, MapPin, Phone, Mail, Building2, Package,
  Calendar, Clock, User, FileText, Ruler,
} from 'lucide-react';

export default function WarehouseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ApiResponse<Warehouse>>(`/admin/warehouses/${id}`)
      .then(res => setWarehouse(res.data.data))
      .catch(() => { toast('Failed to load warehouse', 'error'); navigate('/admin/warehouses'); })
      .finally(() => setLoading(false));
  }, [id, toast, navigate]);

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!warehouse) return null;

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
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/warehouses')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{warehouse.name}</h1>
            <p className="text-muted-foreground">{warehouse.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {statusBadge(warehouse.status)}
          {warehouse.deleted_at && <Badge variant="danger">Deleted</Badge>}
          <Button onClick={() => navigate(`/admin/warehouses/${id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
        </div>
      </div>

      {warehouse.description && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{warehouse.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4" /> General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Name" value={warehouse.name} />
            <InfoRow label="Code" value={warehouse.code} className="font-mono" />
            {warehouse.capacity != null && (
              <InfoRow
                label="Capacity"
                value={`${Number(warehouse.capacity).toLocaleString()} units`}
                icon={<Ruler className="w-4 h-4 text-muted-foreground" />}
              />
            )}
            {warehouse.products_count !== undefined && (
              <InfoRow
                label="Products"
                value={`${warehouse.products_count}`}
                icon={<Package className="w-4 h-4 text-muted-foreground" />}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Address" value={warehouse.address || 'Not set'} />
            <InfoRow label="City" value={warehouse.city || 'Not set'} />
            <InfoRow label="Province" value={warehouse.province || 'Not set'} />
            <InfoRow label="Country" value={warehouse.country || 'Not set'} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Phone className="w-4 h-4" /> Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Contact Person" value={warehouse.contact_person || 'Not set'} />
            <InfoRow label="Phone" value={warehouse.contact_phone || 'Not set'} />
            <InfoRow label="Email" value={warehouse.email || 'Not set'} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" /> System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Created" value={new Date(warehouse.created_at).toLocaleString()} />
            <InfoRow label="Last Updated" value={new Date(warehouse.updated_at).toLocaleString()} />
            {warehouse.creator && (
              <InfoRow
                label="Created By"
                value={warehouse.creator.name}
                icon={<User className="w-4 h-4 text-muted-foreground" />}
              />
            )}
            {warehouse.updater && (
              <InfoRow
                label="Updated By"
                value={warehouse.updater.name}
                icon={<User className="w-4 h-4 text-muted-foreground" />}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {warehouse.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" /> Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{warehouse.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Statistics will be available once the Product module is implemented.</p>
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
