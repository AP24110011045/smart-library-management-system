import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getError } from '../utils/errors';

const AdminPanel = () => {
  const [transactions, setTransactions] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [noUndoAvailable, setNoUndoAvailable] = useState(false);
  useEffect(() => {
    Promise.all([api.get('/transactions'), api.get('/admin/overdue')])
      .then(([transactionsResponse, overdueResponse]) => {
        setTransactions(transactionsResponse.data);
        setOverdue(overdueResponse.data);
      })
      .catch((err) => setMessage(getError(err)))
      .finally(() => setLoading(false));
  }, []);

  const undo = async () => {
    try {
      const { data } = await api.post('/books/admin/undo');
      setMessage(data.message);
      setNoUndoAvailable(false);
    } catch (err) {
      setMessage(getError(err));
      setNoUndoAvailable(err?.response?.status === 404);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] bg-paper p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-clay">Admin</p><h1 className="font-display text-4xl font-bold">Admin Panel</h1>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/add-book" className="rounded-2xl bg-ink px-5 py-3 font-bold text-cream">Add Book</Link>
          <Link to="/admin/users" className="rounded-2xl border border-ink/15 bg-white px-5 py-3 font-bold">Manage Users</Link>
          <button
            onClick={undo}
            disabled={noUndoAvailable}
            className={`rounded-2xl border border-ink/15 bg-white px-5 py-3 font-bold ${noUndoAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Undo Last Edit/Delete
          </button>
        </div>
        <p className="mt-3 text-sm text-ink/60">Undo works only for book edit or delete actions</p>
        {message && <p className="mt-4 rounded-2xl bg-white p-3 font-bold text-moss">{message}</p>}
      </div>
      {loading && <p className="rounded-2xl bg-white p-4 font-bold text-ink/70">Loading admin records...</p>}
      <div className="rounded-[2rem] bg-paper p-6 shadow-soft"><h2 className="font-display text-2xl font-bold">Overdue Books</h2><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="border-b border-ink/10"><th className="p-3">User</th><th>Book</th><th>Due Date</th><th>Current Fine</th></tr></thead><tbody>{overdue.length === 0 && <tr><td className="p-3 text-ink/60" colSpan="4">No overdue books right now.</td></tr>}{overdue.map((t) => <tr key={t._id} className="border-b border-ink/5"><td className="p-3">{t.userId?.name}</td><td className="font-bold">{t.bookId?.title}</td><td>{new Date(t.dueDate).toLocaleDateString()}</td><td>Rs. {t.currentFine}</td></tr>)}</tbody></table></div></div>
      <div className="rounded-[2rem] bg-paper p-6 shadow-soft"><h2 className="font-display text-2xl font-bold">All Transactions</h2><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[820px] text-left"><thead><tr className="border-b border-ink/10"><th className="p-3">User</th><th>Book</th><th>Status</th><th>Due</th><th>Fine</th></tr></thead><tbody>{transactions.length === 0 && <tr><td className="p-3 text-ink/60" colSpan="5">No borrow records available.</td></tr>}{transactions.map((t) => <tr key={t._id} className="border-b border-ink/5"><td className="p-3">{t.userId?.name}</td><td className="font-bold">{t.bookId?.title}</td><td>{t.status}</td><td>{new Date(t.dueDate).toLocaleDateString()}</td><td>Rs. {t.fine}</td></tr>)}</tbody></table></div></div>
    </div>
  );
};

export default AdminPanel;
