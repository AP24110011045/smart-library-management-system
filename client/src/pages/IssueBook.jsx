import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Field from '../components/Field';
import { getError } from '../utils/errors';

const IssueBook = () => {
  const [params] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ bookId: params.get('bookId') || '', userId: '', days: 14 });
  const [message, setMessage] = useState('');

  useEffect(() => { api.get('/books').then(({ data }) => setBooks(data)); }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post('/transactions/issue', form);
      setMessage(data.message);
    } catch (err) {
      setMessage(getError(err));
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl rounded-[2rem] bg-paper p-6 shadow-soft">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-clay">Borrow</p><h1 className="font-display text-4xl font-bold">Issue Book</h1>
      <div className="mt-6 space-y-4">
        <label className="block"><span className="text-sm font-bold text-ink/70">Book</span><select className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3" value={form.bookId} onChange={(e) => setForm({ ...form, bookId: e.target.value })} required><option value="">Choose a book</option>{books.map((book) => <option key={book._id} value={book._id}>{book.title} ({book.availableCopies} available)</option>)}</select></label>
        <Field label="Student User ID (admin only, optional)" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} />
        <Field label="Days Until Due" type="number" min="1" value={form.days} onChange={(e) => setForm({ ...form, days: Number(e.target.value) })} />
      </div>
      {message && <p className="mt-4 rounded-2xl bg-white p-3 font-bold text-moss">{message}</p>}
      <button className="mt-6 rounded-2xl bg-ink px-6 py-3 font-bold text-cream">Issue</button>
    </form>
  );
};

export default IssueBook;
