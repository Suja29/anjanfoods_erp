import type { UserRole } from '@/types';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: UserRole[];
  group: 'main' | 'sales' | 'inventory' | 'production' | 'finance' | 'admin';
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard', roles: ['admin', 'salesman', 'production_supervisor', 'owner', 'accountant'], group: 'main' },
  { label: 'Products', path: '/products', icon: 'Package', roles: ['admin', 'accountant'], group: 'main' },
  { label: 'Customers', path: '/customers', icon: 'Users', roles: ['admin', 'salesman', 'accountant'], group: 'main' },
  { label: 'Suppliers', path: '/suppliers', icon: 'Truck', roles: ['admin', 'accountant'], group: 'main' },
  { label: 'Sales Orders', path: '/sales-orders', icon: 'ShoppingCart', roles: ['admin', 'salesman', 'accountant'], group: 'sales' },
  { label: 'Order Verification', path: '/order-verification', icon: 'ClipboardCheck', roles: ['admin', 'accountant'], group: 'sales' },
  { label: 'GST Invoices', path: '/invoices', icon: 'FileText', roles: ['admin', 'accountant'], group: 'sales' },
  { label: 'Dispatch', path: '/dispatch', icon: 'Send', roles: ['admin', 'accountant'], group: 'sales' },
  { label: 'Purchases', path: '/purchases', icon: 'ShoppingBag', roles: ['admin', 'accountant'], group: 'inventory' },
  { label: 'Raw Material Inventory', path: '/inventory/raw-materials', icon: 'Boxes', roles: ['admin', 'production_supervisor', 'accountant'], group: 'inventory' },
  { label: 'Packaging Inventory', path: '/inventory/packaging', icon: 'Package', roles: ['admin', 'production_supervisor', 'accountant'], group: 'inventory' },
  { label: 'Finished Goods', path: '/inventory/finished-goods', icon: 'PackageCheck', roles: ['admin', 'salesman', 'production_supervisor', 'owner', 'accountant'], group: 'inventory' },
  { label: 'Stock Ledger', path: '/stock-ledger', icon: 'BookOpen', roles: ['admin', 'production_supervisor', 'accountant'], group: 'inventory' },
  { label: 'BOM / Recipes', path: '/bom', icon: 'ListTree', roles: ['admin', 'production_supervisor', 'accountant'], group: 'production' },
  { label: 'Production', path: '/production', icon: 'Factory', roles: ['admin', 'production_supervisor', 'accountant'], group: 'production' },
  { label: 'Production Variance', path: '/production-variance', icon: 'TrendingDown', roles: ['admin', 'production_supervisor', 'accountant'], group: 'production' },
  { label: 'Product Costing', path: '/costing', icon: 'Calculator', roles: ['admin', 'owner', 'accountant'], group: 'production' },
  { label: 'Payments', path: '/payments', icon: 'CreditCard', roles: ['admin', 'accountant'], group: 'finance' },
  { label: 'Receivables', path: '/receivables', icon: 'Wallet', roles: ['admin', 'owner', 'accountant'], group: 'finance' },
  { label: 'Reports', path: '/reports', icon: 'BarChart3', roles: ['admin', 'owner', 'accountant'], group: 'finance' },
  { label: 'Audit Logs', path: '/audit-logs', icon: 'ScrollText', roles: ['admin', 'accountant'], group: 'admin' },
  { label: 'User Management', path: '/users', icon: 'UserCog', roles: ['admin'], group: 'admin' },
  { label: 'Company Settings', path: '/settings', icon: 'Settings', roles: ['admin'], group: 'admin' },
];

export function navItemsForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export function canAccess(role: UserRole, path: string): boolean {
  const items = navItemsForRole(role);
  return items.some((item) => path === item.path || path.startsWith(item.path + '/'));
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  salesman: 'Sales Executive',
  production_supervisor: 'Production Supervisor',
  owner: 'Owner',
  accountant: 'Accountant / Auditor',
};

export const NAV_GROUPS: Record<NavItem['group'], string> = {
  main: 'Master Data',
  sales: 'Sales & Dispatch',
  inventory: 'Inventory',
  production: 'Production',
  finance: 'Finance & Reports',
  admin: 'Administration',
};
