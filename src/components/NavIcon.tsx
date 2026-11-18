import {
  LayoutDashboard, Package, Users, Truck, ShoppingCart, ClipboardCheck,
  FileText, Send, ShoppingBag, Boxes, PackageCheck, BookOpen, ListTree,
  Factory, TrendingDown, Calculator, CreditCard, Wallet, BarChart3,
  ScrollText, UserCog, Settings, type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard, Package, Users, Truck, ShoppingCart, ClipboardCheck,
  FileText, Send, ShoppingBag, Boxes, PackageCheck, BookOpen, ListTree,
  Factory, TrendingDown, Calculator, CreditCard, Wallet, BarChart3,
  ScrollText, UserCog, Settings,
};

export function NavIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Package;
  return <Icon className={className} />;
}
