import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const [{ data: statsData }, { data: historyData }] = await Promise.all([
          api.get('/dashboard'),
          api.get('/transactions/my-history')
        ]);
        setStats(statsData);
        setMyBooks(historyData.filter((item) => item.status === 'issued'));
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-ink p-8 text-cream shadow-soft">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-cream/60">Analytics</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Library command center</h1>
        <p className="mt-3 max-w-2xl text-cream/70">Track inventory, issued books, waiting readers, and overdue activity from one calm little cockpit.</p>
      </div>
      {loading && <p className="rounded-2xl bg-white p-4 font-bold text-ink/70">Loading dashboard...</p>}
      {error && <p className="rounded-2xl bg-red-50 p-4 font-bold text-red-700">{error}</p>}
      <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-7">
        {user?.role === 'admin' ? (
          <>
            <StatCard label="Books" value={stats?.books} />
            <StatCard label="Users" value={stats?.users} tone="bg-white" />
            <StatCard label="Issued" value={stats?.issued} />
            <StatCard label="Returned" value={stats?.returned} tone="bg-white" />
            <StatCard label="Waiting" value={stats?.waiting} />
            <StatCard label="Available" value={stats?.availableBooks} tone="bg-white" />
            <StatCard label="Overdue" value={stats?.overdue} />
          </>
        ) : (
          <>
            <StatCard label="My Issued" value={stats?.issued} />
            <StatCard label="My Returned" value={stats?.returned} tone="bg-white" />
            <StatCard label="My Due books" value={stats?.overdue} />
          </>
        )}
      </div>
      {user?.role === 'student' && (
        <section className="rounded-3xl bg-paper p-6 shadow-soft">
          <h2 className="font-display text-2xl font-bold">My Books Dashboard</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead><tr className="border-b border-ink/10"><th className="p-3">Book</th><th>Borrowed</th><th>Due Date</th><th>Status</th><th>Fine</th></tr></thead>
              <tbody>
                {myBooks.length === 0 && <tr><td className="p-3 text-ink/60" colSpan="5">No active borrowed books.</td></tr>}
                {myBooks.map((item) => <tr key={item._id} className="border-b border-ink/5"><td className="p-3 font-bold">{item.bookId?.title}</td><td>{new Date(item.issueDate).toLocaleDateString()}</td><td>{new Date(item.dueDate).toLocaleDateString()}</td><td>Not returned</td><td>Rs. {item.currentFine || 0}</td></tr>)}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl bg-paper p-6 shadow-soft"><h2 className="font-display text-2xl font-bold">Categories</h2><div className="mt-4 space-y-3">{stats?.categories?.map((item) => <div key={item._id} className="flex justify-between rounded-2xl bg-white p-3"><span>{item._id}</span><b>{item.count}</b></div>)}</div></section>
        <section className="rounded-3xl bg-paper p-6 shadow-soft"><h2 className="font-display text-2xl font-bold">Low stock</h2><div className="mt-4 space-y-3">{stats?.lowStock?.map((book) => <div key={book._id} className="flex justify-between rounded-2xl bg-white p-3"><span>{book.title}</span><b>{book.availableCopies}/{book.totalCopies}</b></div>)}</div></section>
      </div>
    </div>
  );
};

export default Dashboard;
