import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getError } from '../utils/errors';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/books/${id}`)
      .then(({ data }) => {
        setBook(data.book);
        setRecommendations(data.recommendations || []);
      })
      .catch((err) => setMessage(getError(err)));
  }, [id]);

  if (message) return <p className="rounded-2xl bg-white p-4 font-bold text-red-700">{message}</p>;
  if (!book) return <p className="rounded-2xl bg-white p-4 font-bold">Loading book details...</p>;

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] bg-paper p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-clay">{book.category}</p>
        <h1 className="mt-2 font-display text-4xl font-bold">{book.title}</h1>
        <p className="mt-2 text-lg text-ink/70">by {book.author}</p>
        <p className="mt-5 max-w-3xl leading-7 text-ink/75">{book.description}</p>
        <dl className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-4"><dt className="text-sm font-bold text-ink/60">ISBN</dt><dd className="mt-1 font-bold">{book.ISBN}</dd></div>
          <div className="rounded-2xl bg-white p-4"><dt className="text-sm font-bold text-ink/60">Available</dt><dd className="mt-1 font-bold">{book.availableCopies} of {book.totalCopies}</dd></div>
          <div className="rounded-2xl bg-white p-4"><dt className="text-sm font-bold text-ink/60">Waiting</dt><dd className="mt-1 font-bold">{book.waitingList?.length || 0} readers</dd></div>
        </dl>
        <p className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-bold ${book.availableCopies > 0 ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}>
          {book.availableCopies > 0 ? 'Available now' : 'Unavailable - borrow request joins waiting queue'}
        </p>
        {user?.role !== 'admin' && <Link to={`/issue-book?bookId=${book._id}`} className="mt-6 inline-flex rounded-2xl bg-ink px-6 py-3 font-bold text-cream">Borrow Book</Link>}
      </section>

      {recommendations.length > 0 && (
        <section className="rounded-[2rem] bg-paper p-6 shadow-soft">
          <h2 className="font-display text-2xl font-bold">Recommended Books</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {recommendations.map((item) => (
              <Link key={item._id} to={`/books/${item._id}`} className="rounded-2xl bg-white p-4 font-bold hover:bg-cream">
                {item.title}<span className="block text-sm font-normal text-ink/60">{item.author}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BookDetails;
