import { NavLink, Outlet } from 'react-router';
import { useAuth } from '../lib/auth';

const NAV = [
  { to: '/events', label: 'Events' },
  { to: '/clubs', label: 'Clubs' },
  { to: '/categories', label: 'Categories' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/settings', label: 'App settings' },
];

export function Layout() {
  const { session, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <aside className="border-b border-slate-200 bg-white md:min-h-screen md:w-56 md:border-r md:border-b-0">
        <div className="px-4 py-4 text-lg font-bold">
          CUbuddy <span className="text-indigo-600">Admin</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:pb-0">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden px-4 py-6 text-xs text-slate-500 md:block">
          <div className="truncate">{session?.user.email}</div>
          <button onClick={signOut} className="mt-2 text-indigo-600 hover:underline">
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <Outlet />
        <button onClick={signOut} className="mt-8 text-xs text-indigo-600 hover:underline md:hidden">
          Sign out ({session?.user.email})
        </button>
      </main>
    </div>
  );
}
