export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  status: 'active' | 'inactive' | 'suspended';
  avatar: string | null;
  last_login_at: string | null;
  roles: string[];
  permissions?: string[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ActivityLog {
  id: number;
  user: User;
  action: string;
  module: string;
  description: string;
  ip_address: string;
  properties: Record<string, unknown> | null;
  created_at: string;
}

export interface DashboardStats {
  stats: {
    users: number;
    roles: number;
    permissions: number;
    warehouses: number;
    active_warehouses: number;
    categories: number;
    products: number;
  };
  recent_activity: ActivityLog[];
}

export interface Warehouse {
  id: number;
  name: string;
  code: string;
  description: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  contact_person: string | null;
  contact_phone: string | null;
  email: string | null;
  capacity: number | null;
  status: 'active' | 'inactive';
  notes: string | null;
  products_count?: number;
  created_by: number | null;
  updated_by: number | null;
  creator?: User;
  updater?: User;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string | null;
  module: string | null;
  action: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  code: string;
  description: string | null;
  parent_id: number | null;
  parent?: Category;
  children?: Category[];
  products_count?: number;
  status: 'active' | 'inactive';
  created_by: number | null;
  creator?: User;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Unit {
  id: number;
  name: string;
  short_name: string;
  description: string | null;
  products_count?: number;
  status: 'active' | 'inactive';
  created_by: number | null;
  creator?: User;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Supplier {
  id: number;
  company_name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  tax_number: string | null;
  notes: string | null;
  status: 'active' | 'inactive';
  created_by: number | null;
  creator?: User;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  barcode: string | null;
  sku: string | null;
  category_id: number;
  unit_id: number;
  warehouse_id: number;
  category?: Category;
  unit?: Unit;
  warehouse?: Warehouse;
  description: string | null;
  image: string | null;
  notes: string | null;
  status: 'active' | 'inactive';
  suppliers?: Supplier[];
  products_count?: number;
  created_by: number | null;
  creator?: User;
  updater?: User;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Inventory {
  id: number;
  product_id: number;
  warehouse_id: number;
  product?: Product;
  warehouse?: Warehouse;
  current_quantity: number;
  reserved_quantity: number;
  minimum_quantity: number;
  maximum_quantity: number | null;
  reorder_level: number | null;
  created_at: string;
  updated_at: string;
}
