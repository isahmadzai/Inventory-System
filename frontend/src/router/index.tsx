import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import LoginPage from '@/pages/LoginPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserListPage from '@/pages/admin/users/UserListPage';
import UserCreatePage from '@/pages/admin/users/UserCreatePage';
import UserEditPage from '@/pages/admin/users/UserEditPage';
import UserDetailPage from '@/pages/admin/users/UserDetailPage';
import RoleListPage from '@/pages/admin/roles/RoleListPage';
import RoleCreatePage from '@/pages/admin/roles/RoleCreatePage';
import RoleEditPage from '@/pages/admin/roles/RoleEditPage';
import PermissionListPage from '@/pages/admin/permissions/PermissionListPage';
import ActivityLogsPage from '@/pages/admin/ActivityLogsPage';
import ProfilePage from '@/pages/admin/ProfilePage';
import WarehouseListPage from '@/pages/admin/warehouses/WarehouseListPage';
import WarehouseCreatePage from '@/pages/admin/warehouses/WarehouseCreatePage';
import WarehouseEditPage from '@/pages/admin/warehouses/WarehouseEditPage';
import WarehouseDetailPage from '@/pages/admin/warehouses/WarehouseDetailPage';
import CategoryListPage from '@/pages/admin/categories/CategoryListPage';
import CategoryCreatePage from '@/pages/admin/categories/CategoryCreatePage';
import CategoryEditPage from '@/pages/admin/categories/CategoryEditPage';
import UnitListPage from '@/pages/admin/units/UnitListPage';
import UnitCreatePage from '@/pages/admin/units/UnitCreatePage';
import UnitEditPage from '@/pages/admin/units/UnitEditPage';
import SupplierListPage from '@/pages/admin/suppliers/SupplierListPage';
import SupplierCreatePage from '@/pages/admin/suppliers/SupplierCreatePage';
import SupplierEditPage from '@/pages/admin/suppliers/SupplierEditPage';
import SupplierDetailPage from '@/pages/admin/suppliers/SupplierDetailPage';
import ProductListPage from '@/pages/admin/products/ProductListPage';
import ProductCreatePage from '@/pages/admin/products/ProductCreatePage';
import ProductEditPage from '@/pages/admin/products/ProductEditPage';
import ProductDetailPage from '@/pages/admin/products/ProductDetailPage';
import WarehouseDashboard from '@/pages/warehouse/WarehouseDashboard';
import InventoryDashboard from '@/pages/inventory/InventoryDashboard';
import NotFoundPage from '@/pages/NotFoundPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserListPage />} />
            <Route path="users/create" element={<UserCreatePage />} />
            <Route path="users/:id" element={<UserDetailPage />} />
            <Route path="users/:id/edit" element={<UserEditPage />} />
            <Route path="roles" element={<RoleListPage />} />
            <Route path="roles/create" element={<RoleCreatePage />} />
            <Route path="roles/:id/edit" element={<RoleEditPage />} />
            <Route path="permissions" element={<PermissionListPage />} />
            <Route path="activity-logs" element={<ActivityLogsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="warehouses" element={<WarehouseListPage />} />
            <Route path="warehouses/create" element={<WarehouseCreatePage />} />
            <Route path="warehouses/:id" element={<WarehouseDetailPage />} />
            <Route path="warehouses/:id/edit" element={<WarehouseEditPage />} />
            <Route path="categories" element={<CategoryListPage />} />
            <Route path="categories/create" element={<CategoryCreatePage />} />
            <Route path="categories/:id/edit" element={<CategoryEditPage />} />
            <Route path="units" element={<UnitListPage />} />
            <Route path="units/create" element={<UnitCreatePage />} />
            <Route path="units/:id/edit" element={<UnitEditPage />} />
            <Route path="suppliers" element={<SupplierListPage />} />
            <Route path="suppliers/create" element={<SupplierCreatePage />} />
            <Route path="suppliers/:id" element={<SupplierDetailPage />} />
            <Route path="suppliers/:id/edit" element={<SupplierEditPage />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/create" element={<ProductCreatePage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="products/:id/edit" element={<ProductEditPage />} />
          </Route>

          {/* Warehouse Routes */}
          <Route path="/warehouse" element={
            <ProtectedRoute allowedRoles={['warehouse', 'admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<WarehouseDashboard />} />
          </Route>

          {/* Inventory Routes */}
          <Route path="/inventory" element={
            <ProtectedRoute allowedRoles={['inventory', 'admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<InventoryDashboard />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
