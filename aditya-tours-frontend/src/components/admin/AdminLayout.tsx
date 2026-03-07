import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const items = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/calendar', label: 'Calendar' },
  { to: '/admin/settings', label: 'Settings' },
  { to: '/admin/content', label: 'Content' },
];

function AdminLayout() {
  const { auth, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold">Aditya Tours Admin</h1>
          <div className="flex items-center gap-3 text-sm">
            <span>{auth?.name}</span>
            <button type="button" className="rounded-md bg-slate-900 px-3 py-2 text-white" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white p-3">
          <nav className="grid gap-1">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="rounded-xl border border-slate-200 bg-white p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
