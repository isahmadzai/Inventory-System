import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import api from '@/services/api';
import type { Supplier, ApiResponse } from '@/types';
import {
  ArrowLeft, Edit, Phone, Mail, Building2,
  Calendar, Clock, User, FileText, MapPin,
} from 'lucide-react';

export default function SupplierDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ApiResponse<Supplier>>(`/admin/suppliers/${id}`)
      .then(res => setSupplier(res.data.data))
      .catch(() => { toast('Failed to load supplier', 'error'); navigate('/admin/suppliers'); })
      .finally(() => setLoading(false));
  }, [id, toast, navigate]);

  if (loading) return <LoadingSpinner className="py-20" />;
  if (!supplier) return null;

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
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/suppliers')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{supplier.company_name}</h1>
            {supplier.contact_person && (
              <p className="text-muted-foreground">{supplier.contact_person}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {statusBadge(supplier.status)}
          {supplier.deleted_at && <Badge variant="danger">Deleted</Badge>}
          <Button onClick={() => navigate(`/admin/suppliers/${id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4" /> General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Company Name" value={supplier.company_name} />
            <InfoRow label="Contact Person" value={supplier.contact_person || 'Not set'} />
            <InfoRow label="Status" value={supplier.status} className="capitalize" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Phone className="w-4 h-4" /> Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow
              label="Phone"
              value={supplier.phone || 'Not set'}
              icon={<Phone className="w-4 h-4 text-muted-foreground" />}
            />
            <InfoRow
              label="Email"
              value={supplier.email || 'Not set'}
              icon={<Mail className="w-4 h-4 text-muted-foreground" />}
            />
            <InfoRow
              label="Address"
              value={supplier.address || 'Not set'}
              icon={<MapPin className="w-4 h-4 text-muted-foreground" />}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" /> Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Tax Number" value={supplier.tax_number || 'Not set'} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" /> System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="Created" value={new Date(supplier.created_at).toLocaleString()} />
            <InfoRow label="Last Updated" value={new Date(supplier.updated_at).toLocaleString()} />
            {supplier.creator && (
              <InfoRow
                label="Created By"
                value={supplier.creator.name}
                icon={<User className="w-4 h-4 text-muted-foreground" />}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {supplier.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" /> Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{supplier.notes}</p>
          </CardContent>
        </Card>
      )}
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
