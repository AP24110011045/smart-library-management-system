import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Field from '../components/Field';
import { getError } from '../utils/errors';

const empty = { title: '', author: '', description: '', category: '', ISBN: '', totalCopies: 1, availableCopies: 1 };

const BookForm = ({ edit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (edit) api.get(`/books/${id}`).then(({ data }) => setForm(data.book));
  }, [edit, id]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      if (edit) await api.put(`/books/${id}`, form);
      else await api.post('/books', form);
      navigate('/books');
    } catch (err) {
      setError(getError(err));
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl rounded-[2rem] bg-paper p-6 shadow-soft">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-clay">Admin</p>
      <h1 className="font-display text-4xl font-bold">{edit ? 'Edit Book' : 'Add Book'}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {['title', 'author', 'category', 'ISBN'].map((field) => <Field key={field} label={field} value={form[field] || ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required />)}
        <Field label="Total Copies" type="number" min="0" value={form.totalCopies} onChange={(e) => setForm({ ...form, totalCopies: Number(e.target.value) })} required />
        <Field label="Available Copies" type="number" min="0" value={form.availableCopies} onChange={(e) => setForm({ ...form, availableCopies: Number(e.target.value) })} required />
      </div>
      <label className="mt-4 block">
        <span className="text-sm font-bold text-ink/70">Description</span>
        <textarea className="mt-2 min-h-32 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
      </label>
      {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-red-700">{error}</p>}
      <button className="mt-6 rounded-2xl bg-ink px-6 py-3 font-bold text-cream">Save Book</button>
    </form>
  );
};

export default BookForm;
