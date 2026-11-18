import { useState } from 'react';
import { NavLink, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Factory, LogOut, Menu, X, ChevronRight, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { NavIcon } from '@/components/NavIcon';
import { navItemsForRole, NAV_GROUPS, ROLE_LABELS } from '@/lib/permissions';
import type { NavItem } from '@/lib/permissions';

export default function AppLayout() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  if (!profile) return null;

  const items = navItemsForRole(profile.role);
  const groups = Object.keys(NAV_GROUPS) as NavItem['group'][];
  const current = items.find((i) => location.pathname === i.path || location.pathname.startsWith(i.path + '/'));

  const breadcrumbs = current
    ? [{ label: NAV_GROUPS[current.group] }, { label: current.label }]
    : [{ label: 'Dashboard' }];

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-navy-800/50 flex-shrink-0">
        <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
          <Factory className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-bold leading-tight">Anjan Foods</p>
          <p className="text-navy-400 text-[10px] leading-tight">ERP System</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {groups.map((group) => {
          const groupItems = items.filter((i) => i.group === group);
          if (groupItems.length === 0) return null;
          return (
            <div key={group}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-navy-500">
                {NAV_GROUPS[group]}
              </p>
              <div className="space-y-0.5">
                {groupItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'text-navy-200 hover:bg-navy-800/60 hover:text-white'
                      }`
                    }
                  >
                    <NavIcon name={item.icon} className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-navy-800/50 flex-shrink-0">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {profile.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white font-medium truncate">{profile.full_name}</p>
            <p className="text-xs text-navy-400 truncate">{ROLE_LABELS[profile.role]}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-navy-900 flex-col fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-navy-900 z-50 lg:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-3 text-navy-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-navy-600 hover:text-navy-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            <nav className="flex items-center gap-1.5 text-sm">
              {breadcrumbs.map((bc, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-navy-300" />}
                  <span className={i === breadcrumbs.length - 1 ? 'text-navy-900 font-medium' : 'text-navy-400'}>
                    {bc.label}
                  </span>
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg text-navy-500 hover:bg-slate-100 hover:text-navy-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                  {profile.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-navy-900 leading-tight">{profile.full_name}</p>
                  <p className="text-xs text-navy-400 leading-tight">{ROLE_LABELS[profile.role]}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-navy-400" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-20 py-1.5">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-navy-900">{profile.full_name}</p>
                      <p className="text-xs text-navy-400">{profile.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
