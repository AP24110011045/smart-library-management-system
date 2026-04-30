import { useEffect, useState } from 'react';
import api from '../services/api';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';
import { getError } from '../utils/errors';

const BooksList = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadBooks = async () => {
    setLoading(true);
    setMessage('');
    try {
      const { data } = await api.get('/books', { params: { search } });
      setBooks(data);
    } catch (err) {
      setMessage(getError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBooks(); }, []);
  useEffect(() => {
    if (!search.trim()) return setSuggestions([]);
    const id = setTimeout(() => api.get('/books/autocomplete', { params: { q: search } }).then(({ data }) => setSuggestions(data)), 250);
    return () => clearTimeout(id);
  }, [search]);

  const deleteBook = async (id) => {
    if (!confirm('Delete this book? You can undo from Admin Panel.')) return;
    try {
      const { data } = await api.delete(`/books/${id}`);
      setMessage(data.message);
      loadBooks();
    } catch (err) {
      setMessage(getError(err));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><p className="text-sm font-bold uppercase tracking-[0.25em] text-clay">Catalogue</p><h1 className="font-display text-4xl font-bold">Books List</h1></div>
        <form onSubmit={(e) => { e.preventDefault(); loadBooks(); }} className="relative flex gap-2">
          <input className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 md:w-80" placeholder="Search or autocomplete title..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="rounded-2xl bg-ink px-5 py-3 font-bold text-cream">{loading ? 'Searching...' : 'Search'}</button>
          {suggestions.length > 0 && <div className="absolute top-14 z-10 w-full rounded-2xl bg-white p-2 shadow-soft">{suggestions.map((book) => <button key={book._id} type="button" onClick={() => { setSearch(book.title); setSuggestions([]); }} className="block w-full rounded-xl px-3 py-2 text-left hover:bg-cream">{book.title}</button>)}</div>}
        </form>
      </div>
      {message && <p className="rounded-2xl bg-white p-3 font-bold text-moss">{message}</p>}
      {loading && <p className="rounded-2xl bg-white p-4 font-bold text-ink/70">Loading books...</p>}
      {!loading && books.length === 0 && <p className="rounded-2xl bg-white p-4 font-bold text-ink/70">No books found.</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{books.map((book) => <BookCard key={book._id} book={book} canManage={user?.role === 'admin'} onDelete={deleteBook} />)}</div>
    </div>
  );
};

export default BooksList;
