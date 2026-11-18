import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card p-5 ${className}`}>{children}</div>;
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-base font-semibold text-navy-900">{title}</h3>
        {subtitle && <p className="text-sm text-navy-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900">{title}</h1>
        {subtitle && <p className="text-sm text-navy-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function StatCard({
  label, value, icon, trend, color = 'primary',
}: {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: string;
  color?: 'primary' | 'green' | 'amber' | 'red' | 'navy';
}) {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    navy: 'bg-navy-50 text-navy-600',
  };
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-navy-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-navy-900 mt-1">{value}</p>
          {trend && <p className="text-xs text-navy-400 mt-1">{trend}</p>}
        </div>
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function Badge({ children, color = 'slate' }: { children: ReactNode; color?: 'slate' | 'green' | 'amber' | 'red' | 'blue' | 'primary' }) {
  const colorMap: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    primary: 'bg-primary-100 text-primary-700',
  };
  return <span className={`badge ${colorMap[color]}`}>{children}</span>;
}

export function EmptyState({ title, message, icon }: { title: string; message?: string; icon?: ReactNode }) {
  return (
    <div className="text-center py-12 px-4">
      {icon && <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">{icon}</div>}
      <h3 className="text-sm font-semibold text-navy-700">{title}</h3>
      {message && <p className="text-sm text-navy-400 mt-1">{message}</p>}
    </div>
  );
}
