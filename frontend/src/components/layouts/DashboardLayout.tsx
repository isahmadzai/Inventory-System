import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import NotificationDropdown from '@/components/layout/NotificationDropdown';
import {
  LayoutDashboard,
  Users,
  Warehouse,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Search,
  Shield,
  KeyRound,
  UserCircle,
  ClipboardList,
  FolderOpen,
  Ruler,
  Truck,
  ChevronDown,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const roleNavItems: Record<string, NavItem[]> = {
  admin: [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'User Management', href: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { label: 'Role Management', href: '/admin/roles', icon: <Shield className="w-5 h-5" /> },
    { label: 'Permission Management', href: '/admin/permissions', icon: <KeyRound className="w-5 h-5" /> },
    { label: 'Warehouse Management', href: '/admin/warehouses', icon: <Warehouse className="w-5 h-5" /> },
    { label: 'Product Management', href: '/admin/products', icon: <Package className="w-5 h-5" /> },
    { label: 'Category Management', href: '/admin/categories', icon: <FolderOpen className="w-5 h-5" /> },
    { label: 'Unit Management', href: '/admin/units', icon: <Ruler className="w-5 h-5" /> },
    { label: 'Supplier Management', href: '/admin/suppliers', icon: <Truck className="w-5 h-5" /> },
    { label: 'Activity Logs', href: '/admin/activity-logs', icon: <ClipboardList className="w-5 h-5" /> },
    { label: 'Profile', href: '/admin/profile', icon: <UserCircle className="w-5 h-5" /> },
    { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ],
  warehouse: [
    { label: 'Dashboard', href: '/warehouse', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Warehouse List', href: '/admin/warehouses', icon: <Warehouse className="w-5 h-5" /> },
    { label: 'Create Warehouse', href: '/admin/warehouses/create', icon: <Package className="w-5 h-5" /> },
  ],
  inventory: [
    { label: 'Dashboard', href: '/inventory', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Inventory', href: '/inventory/manage', icon: <Package className="w-5 h-5" /> },
    { label: 'Reports', href: '/inventory/reports', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Settings', href: '/inventory/settings', icon: <Settings className="w-5 h-5" /> },
  ],
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const primaryRole = user?.roles?.[0] || 'admin';
  const navItems = roleNavItems[primaryRole] || roleNavItems.admin;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shrink-0">
          <Package className="w-5 h-5 text-white" />
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-sm text-foreground leading-tight">Inventory</h1>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        )}
      </div>

      <Separator />

      <div className="px-3 py-4">
        <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {sidebarOpen ? 'Navigation' : ''}
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isExact = item.href === '/admin' || item.href === '/warehouse' || item.href === '/inventory';
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={isExact}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  } ${!sidebarOpen ? 'justify-center' : ''}`
                }
              >
                {item.icon}
                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto px-3 pb-4">
        <Separator className="mb-4" />
        <div className={`flex items-center gap-3 px-3 ${sidebarOpen ? '' : 'justify-center'}`}>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {user?.name ? getInitials(user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{primaryRole}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-border transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-[68px]'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-border z-50">
            <div className="flex items-center justify-end p-2">
              <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-white border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
                <span>Home</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground font-medium capitalize">{primaryRole} Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-border">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-muted-foreground"
                />
              </div>

              <NotificationDropdown />

              <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{primaryRole}</p>
                </div>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <Outlet />
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
