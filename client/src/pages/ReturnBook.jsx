import { useEffect, useState } from 'react';
import api from '../services/api';
import { getError } from '../utils/errors';

const ReturnBook = () => {
  const [history, setHistory] = useState([]);
  const [transactionId, setTransactionId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => { api.get('/transactions/my-history').then(({ data }) => setHistory(data)); }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post('/transactions/return', { transactionId });
      setMessage(`${data.message} Fine: Rs. ${data.fine}`);
    } catch (err) {
      setMessage(getError(err));
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl rounded-[2rem] bg-paper p-6 shadow-soft">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-clay">Circulation</p><h1 className="font-display text-4xl font-bold">Return Book</h1>
      <label className="mt-6 block"><span className="text-sm font-bold text-ink/70">Active borrowed book</span><select className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} required><option value="">Choose transaction</option>{history.filter((t) => t.status === 'issued').map((t) => <option key={t._id} value={t._id}>{t.bookId?.title} - due {new Date(t.dueDate).toLocaleDateString()}</option>)}</select></label>
      {message && <p className="mt-4 rounded-2xl bg-white p-3 font-bold text-moss">{message}</p>}
      <button className="mt-6 rounded-2xl bg-ink px-6 py-3 font-bold text-cream">Return</button>
    </form>
  );
};

export default ReturnBook;
