import { useAuth } from '@/context/AuthContext';
import { ROLE_LABELS } from '@/lib/permissions';
import { StatCard, Card, CardHeader, PageHeader, Badge } from '@/components/ui';
import {
  ShoppingCart, PackageCheck, IndianRupee, Factory, TrendingUp,
  Wallet, AlertCircle, Boxes, ClipboardCheck, FileText,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const SALES_TREND = [
  { month: 'May', sales: 142000, production: 150000 },
  { month: 'Jun', sales: 168000, production: 165000 },
  { month: 'Jul', sales: 185000, production: 180000 },
  { month: 'Aug', sales: 172000, production: 190000 },
  { month: 'Sep', sales: 210000, production: 205000 },
  { month: 'Oct', sales: 198000, production: 195000 },
];

const PRODUCT_SALES = [
  { name: 'Murukku 200g', value: 38, color: '#2563eb' },
  { name: 'Mixture 200g', value: 27, color: '#16a34a' },
  { name: 'Banana Chips 200g', value: 22, color: '#ea580c' },
  { name: 'Sweets 250g', value: 13, color: '#9333ea' },
];

const RECEIVABLES_AGEING = [
  { bucket: '0-30 days', amount: 42000 },
  { bucket: '31-60 days', amount: 18500 },
  { bucket: '61-90 days', amount: 7500 },
  { bucket: '90+ days', amount: 3200 },
];

export default function DashboardPage() {
  const { profile } = useAuth();
  if (!profile) return null;

  return (
    <div>
      <PageHeader
        title={`Welcome, ${profile.full_name.split(' ')[0]}`}
        subtitle={`${ROLE_LABELS[profile.role]} dashboard — overview of current business activity.`}
      />

      {profile.role === 'admin' && <AdminDashboard />}
      {profile.role === 'salesman' && <SalesmanDashboard />}
      {profile.role === 'production_supervisor' && <ProductionDashboard />}
      {profile.role === 'owner' && <OwnerDashboard />}
      {profile.role === 'accountant' && <AccountantDashboard />}
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Sales (Month)" value="₹1.98 L" icon={<IndianRupee className="w-5 h-5" />} trend="↑ 5.7% vs last month" color="primary" />
        <StatCard label="Pending Orders" value="7" icon={<ClipboardCheck className="w-5 h-5" />} trend="Awaiting verification" color="amber" />
        <StatCard label="Finished Goods Stock" value="238 pkts" icon={<PackageCheck className="w-5 h-5" />} trend="Murukku 200g" color="green" />
        <StatCard label="Outstanding Receivables" value="₹71,200" icon={<Wallet className="w-5 h-5" />} trend="Across 3 customers" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Sales & Production Trend" subtitle="Last 6 months" />
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={SALES_TREND}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
              <Legend />
              <Area type="monotone" dataKey="sales" name="Sales" stroke="#2563eb" fill="url(#salesGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="production" name="Production" stroke="#16a34a" fill="url(#prodGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader title="Product-wise Sales" subtitle="Share of revenue" />
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={PRODUCT_SALES} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {PRODUCT_SALES.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent Activity" subtitle="Latest orders and dispatches" />
        <div className="space-y-2">
          {[
            { action: 'Sales order created', entity: 'Retailer A — 150 Murukku', status: 'Pending Verification', color: 'amber' as const, time: '2h ago' },
            { action: 'Dispatch confirmed', entity: 'Distributor B — 88 Mixture', status: 'Dispatched', color: 'green' as const, time: '5h ago' },
            { action: 'Production completed', entity: 'Murukku batch — 188 pkts', status: 'Completed', color: 'green' as const, time: '1d ago' },
            { action: 'Payment recorded', entity: 'Retailer A — ₹4,000', status: 'Partial', color: 'blue' as const, time: '1d ago' },
          ].map((a, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500" />
                <div>
                  <p className="text-sm font-medium text-navy-900">{a.action}</p>
                  <p className="text-xs text-navy-400">{a.entity}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge color={a.color}>{a.status}</Badge>
                <span className="text-xs text-navy-400">{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SalesmanDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Orders (Month)" value="12" icon={<ShoppingCart className="w-5 h-5" />} trend="3 pending verification" color="primary" />
        <StatCard label="My Sales Value" value="₹1.42 L" icon={<IndianRupee className="w-5 h-5" />} trend="↑ 12% vs last month" color="green" />
        <StatCard label="Available Stock" value="238 pkts" icon={<PackageCheck className="w-5 h-5" />} trend="Murukku 200g" color="navy" />
        <StatCard label="Active Customers" value="8" icon={<TrendingUp className="w-5 h-5" />} trend="Retailers + Distributors" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="My Monthly Sales" subtitle="Last 6 months" />
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={SALES_TREND}>
              <defs>
                <linearGradient id="mySalesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
              <Area type="monotone" dataKey="sales" name="My Sales" stroke="#2563eb" fill="url(#mySalesGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader title="My Recent Orders" />
          <div className="space-y-2">
            {[
              { id: 'SO-1042', customer: 'Retailer A', value: '₹7,875', status: 'Pending', color: 'amber' as const },
              { id: 'SO-1041', customer: 'Distributor B', value: '₹6,300', status: 'Approved', color: 'green' as const },
              { id: 'SO-1040', customer: 'Retailer C', value: '₹2,450', status: 'Dispatched', color: 'blue' as const },
              { id: 'SO-1039', customer: 'Retailer A', value: '₹5,250', status: 'Paid', color: 'green' as const },
            ].map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50">
                <div>
                  <p className="text-sm font-medium text-navy-900">{o.id}</p>
                  <p className="text-xs text-navy-400">{o.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-navy-900">{o.value}</p>
                  <Badge color={o.color}>{o.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ProductionDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Production (Month)" value="1,950 pkts" icon={<Factory className="w-5 h-5" />} trend="Murukku + Mixture" color="primary" />
        <StatCard label="Flour Stock" value="120 kg" icon={<Boxes className="w-5 h-5" />} trend="Above reorder level" color="green" />
        <StatCard label="Cooking Oil Stock" value="19.5 L" icon={<Boxes className="w-5 h-5" />} trend="Above reorder level" color="green" />
        <StatCard label="Variance Alerts" value="1" icon={<AlertCircle className="w-5 h-5" />} trend="Oil consumption >3%" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Production Trend" subtitle="Monthly output (packets)" />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={SALES_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip />
              <Bar dataKey="production" name="Output" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader title="Recent Production Runs" />
          <div className="space-y-2">
            {[
              { id: 'PRD-008', product: 'Murukku 200g', output: '188 pkts', variance: '+0.5%', status: 'Completed', color: 'green' as const },
              { id: 'PRD-007', product: 'Mixture 200g', output: '205 pkts', variance: '+2.1%', status: 'Completed', color: 'green' as const },
              { id: 'PRD-006', product: 'Banana Chips', output: '180 pkts', variance: '-1.2%', status: 'Completed', color: 'green' as const },
              { id: 'PRD-005', product: 'Murukku 200g', output: '0 pkts', variance: '—', status: 'In Progress', color: 'amber' as const },
            ].map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50">
                <div>
                  <p className="text-sm font-medium text-navy-900">{r.id} — {r.product}</p>
                  <p className="text-xs text-navy-400">Output: {r.output} · Variance: {r.variance}</p>
                </div>
                <Badge color={r.color}>{r.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function OwnerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Monthly Revenue" value="₹1.98 L" icon={<IndianRupee className="w-5 h-5" />} trend="↑ 5.7% MoM" color="green" />
        <StatCard label="Monthly Purchases" value="₹62,400" icon={<ShoppingCart className="w-5 h-5" />} trend="Raw materials" color="amber" />
        <StatCard label="Gross Profit (Est.)" value="₹84,600" icon={<TrendingUp className="w-5 h-5" />} trend="42.7% margin" color="primary" />
        <StatCard label="Outstanding Receivables" value="₹71,200" icon={<Wallet className="w-5 h-5" />} trend="3 customers" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue & Production Trend" subtitle="Last 6 months" />
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={SALES_TREND}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
              <Legend />
              <Area type="monotone" dataKey="sales" name="Revenue" stroke="#2563eb" fill="url(#revGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="production" name="Production" stroke="#16a34a" fill="none" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader title="Receivables Ageing" />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={RECEIVABLES_AGEING} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="bucket" tick={{ fontSize: 11, fill: '#64748b' }} width={75} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
              <Bar dataKey="amount" fill="#2563eb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Product Sales Mix" />
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={PRODUCT_SALES} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85}>
                {PRODUCT_SALES.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader title="Business Summary" />
          <div className="space-y-3">
            {[
              { label: 'Finished goods stock value', value: '₹11,900' },
              { label: 'Raw material stock value', value: '₹8,450' },
              { label: 'Total collections (month)', value: '₹1.67 L' },
              { label: 'Production wastage', value: '1.06%' },
              { label: 'Pending dispatch orders', value: '2' },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-navy-600">{s.label}</span>
                <span className="text-sm font-semibold text-navy-900">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AccountantDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="GST Sales (Month)" value="₹1.98 L" icon={<FileText className="w-5 h-5" />} trend="Taxable + GST" color="primary" />
        <StatCard label="GST Purchases" value="₹62,400" icon={<ShoppingCart className="w-5 h-5" />} trend="Input tax credit" color="amber" />
        <StatCard label="Outstanding Receivables" value="₹71,200" icon={<Wallet className="w-5 h-5" />} trend="Across 3 customers" color="red" />
        <StatCard label="Collections (Month)" value="₹1.67 L" icon={<IndianRupee className="w-5 h-5" />} trend="11 payments recorded" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Sales & Purchase Register" subtitle="Monthly comparison" />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={SALES_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
              <Legend />
              <Bar dataKey="sales" name="Sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="production" name="Purchases" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader title="Receivables Ageing" />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={RECEIVABLES_AGEING} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="bucket" tick={{ fontSize: 11, fill: '#64748b' }} width={75} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
              <Bar dataKey="amount" fill="#ea580c" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <CardHeader title="Quick Reports" subtitle="Export financial and compliance reports" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {['Sales Register', 'Purchase Register', 'GST Sales Report', 'GST Purchase Report', 'Stock Ledger', 'Production Register', 'Costing Report', 'Audit Trail'].map((r) => (
            <div key={r} className="p-3 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50/40 cursor-pointer transition-all">
              <FileText className="w-5 h-5 text-primary-600 mb-2" />
              <p className="text-sm font-medium text-navy-800">{r}</p>
              <p className="text-xs text-navy-400 mt-0.5">PDF · Excel · CSV</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
