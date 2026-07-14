import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import type { User, ApiResponse } from '@/types';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { User as UserIcon, Mail, Phone, Shield, Loader2, Key } from 'lucide-react';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passSaving, setPassSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passErrors, setPassErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [passForm, setPassForm] = useState({ current_password: '', password: '', password_confirmation: '' });

  useEffect(() => {
    api.get<ApiResponse<User>>('/profile').then(res => {
      setProfile(res.data.data);
      setForm({ name: res.data.data.name, email: res.data.data.email, phone: res.data.data.phone || '' });
    }).finally(() => setLoading(false));
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const res = await api.put<ApiResponse<User>>('/profile', form);
      setProfile(res.data.data);
      toast('Profile updated successfully', 'success');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (axiosErr.response?.data?.errors) {
        const errs: Record<string, string> = {};
        Object.entries(axiosErr.response.data.errors).forEach(([k, v]) => { errs[k] = v[0]; });
        setErrors(errs);
      } else { toast('Failed to update profile', 'error'); }
    } finally { setSaving(false); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSaving(true);
    setPassErrors({});
    try {
      await api.put('/profile/password', passForm);
      toast('Password changed successfully', 'success');
      setPassForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (axiosErr.response?.data?.errors) {
        const errs: Record<string, string> = {};
        Object.entries(axiosErr.response.data.errors).forEach(([k, v]) => { errs[k] = v[0]; });
        setPassErrors(errs);
      } else { toast('Failed to change password', 'error'); }
    } finally { setPassSaving(false); }
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  const initials = profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{profile?.name}</h2>
              <p className="text-muted-foreground">{profile?.email}</p>
              <div className="flex gap-1 mt-1">
                {profile?.roles?.map(r => <Badge key={r} variant="outline" className="capitalize">{r}</Badge>)}
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <h3 className="font-semibold">Profile Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative"><UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-10" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-10" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <div className="relative"><Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-10" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="relative"><Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-10" value={profile?.roles?.join(', ') || ''} disabled /></div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Key className="w-4 h-4" /> Change Password</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" value={passForm.current_password} onChange={e => setPassForm(p => ({ ...p, current_password: e.target.value }))} />
                {passErrors.current_password && <p className="text-xs text-red-500">{passErrors.current_password}</p>}
              </div>
              <div></div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={passForm.password} onChange={e => setPassForm(p => ({ ...p, password: e.target.value }))} />
                {passErrors.password && <p className="text-xs text-red-500">{passErrors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" value={passForm.password_confirmation} onChange={e => setPassForm(p => ({ ...p, password_confirmation: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={passSaving}>
                {passSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Change Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
