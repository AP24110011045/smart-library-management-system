import { BookOpen, LayoutDashboard, LogOut, PlusCircle, RotateCcw, Shield, UserCog, UserRound } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/books', label: 'Books', icon: BookOpen },
  { to: '/issue-book', label: 'Borrow', icon: PlusCircle, student: true },
  { to: '/return-book', label: 'Return', icon: RotateCcw, student: true },
  { to: '/my-history', label: 'My Books', icon: UserRound, student: true },
  { to: '/admin', label: 'Admin', icon: Shield, admin: true },
  { to: '/admin/users', label: 'Users', icon: UserCog, admin: true }
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const visibleNav = nav.filter((item) => {
    if (item.admin) return user?.role === 'admin';
    if (item.student) return user?.role !== 'admin';
    return true;
  });
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition ${isActive ? 'bg-ink text-cream' : 'text-ink/70 hover:bg-ink/5'}`;

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <aside className="fixed left-0 top-0 hidden h-full w-72 border-r border-ink/10 bg-paper/85 p-5 backdrop-blur lg:block">
        <div className="rounded-3xl bg-ink p-5 text-cream">
          <p className="text-xs uppercase tracking-[0.35em] text-cream/60">Smart</p>
          <h1 className="font-display text-3xl font-bold">Library</h1>
        </div>
        <nav className="mt-6 space-y-2">
          {visibleNav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}><Icon size={19} />{label}</NavLink>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-ink/10 bg-cream/80 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-clay">Welcome back</p>
              <h2 className="font-display text-2xl font-bold">{user?.name}</h2>
            </div>
            <button onClick={logout} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-bold shadow-sm"><LogOut size={18} /> Logout</button>
          </div>
          <nav className="mt-4 flex gap-2 overflow-auto lg:hidden">
            {visibleNav.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${isActive ? 'bg-ink text-cream' : 'bg-white text-ink/70'}`}>{label}</NavLink>
            ))}
          </nav>
        </header>
        <section className="p-4 md:p-8"><Outlet /></section>
      </main>
    </div>
  );
};

export default AppLayout;
