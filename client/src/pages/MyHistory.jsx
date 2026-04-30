import { useEffect, useState } from 'react';
import api from '../services/api';
import { getError } from '../utils/errors';

const MyHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/transactions/my-history')
      .then(({ data }) => setHistory(data))
      .catch((err) => setError(getError(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-[2rem] bg-paper p-6 shadow-soft">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-clay">Timeline</p><h1 className="font-display text-4xl font-bold">My Books & Borrow History</h1>
      {loading && <p className="mt-6 rounded-2xl bg-white p-4 font-bold text-ink/70">Loading history...</p>}
      {error && <p className="mt-6 rounded-2xl bg-red-50 p-4 font-bold text-red-700">{error}</p>}
      {!loading && !error && history.length === 0 && <p className="mt-6 rounded-2xl bg-white p-4 font-bold text-ink/70">No history available.</p>}
      <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead><tr className="border-b border-ink/10"><th className="p-3">Book</th><th>Status</th><th>Issue</th><th>Due</th><th>Returned</th><th>Fine</th></tr></thead><tbody>{history.map((item) => <tr key={item._id} className="border-b border-ink/5"><td className="p-3 font-bold">{item.bookId?.title}</td><td>{item.status === 'issued' ? 'pending' : item.status}</td><td>{new Date(item.issueDate).toLocaleDateString()}</td><td>{new Date(item.dueDate).toLocaleDateString()}</td><td>{item.returnDate ? new Date(item.returnDate).toLocaleDateString() : '-'}</td><td>Rs. {item.currentFine ?? item.fine}</td></tr>)}</tbody></table></div>
    </div>
  );
};

export default MyHistory;
